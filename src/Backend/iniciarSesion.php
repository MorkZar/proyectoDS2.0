<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
//$origin = "http://localhost:4200"; // Angular dev
$origin = "http://localhost:4201";

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/conectionBD.php';
//require_once __DIR__ . '/../../vendor/autoload.php';
//Container
require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Dotenv\Dotenv;
use Twilio\Rest\Client;

// Cargar variables de entorno
//$dotenv = Dotenv::createImmutable(__DIR__ . '/../../env', 'token.env');
//Container
$dotenv = Dotenv::createImmutable(__DIR__ . '/env', 'token.env');
$dotenv->load();


$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['correo'], $data['password'], $data['recaptcha'])) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$correo = trim($data['correo']);
$password = $data['password'];
$recaptcha = $data['recaptcha'];

// ----------------------------
// VALIDAR CAPTCHA CON GOOGLE
// ----------------------------
$secret = $_ENV['RECAPTCHA_SECRET'];
$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

$response = file_get_contents($verifyUrl . "?secret=" . $secret . "&response=" . $recaptcha . "&remoteip=" . $_SERVER['REMOTE_ADDR']);
$result = json_decode($response, true);

if (!$result["success"]) {
    echo json_encode(["error" => "Captcha inválido"]);
    exit;
}


// ----------------------------
// VERIFICAR CREDENCIALES
// ----------------------------

try {
    $stmt = $pdo->prepare("SELECT user_id, email, phone, password, rol FROM users WHERE email = :correo");
    $stmt->bindParam(':correo', $correo);
    $stmt->execute();
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario || !password_verify($password, $usuario['password'])) {
        echo json_encode(["error" => "Correo o contraseña incorrectos"]);
        exit;
    }

     $secret_key = $_ENV['JWT_SECRET'];
    $now        = time();

    // ----------------------------
    // USUARIO NORMAL → JWT DIRECTO
    // ----------------------------
    if ($usuario['rol'] !== 'admin') {

       $secret_key = $_ENV['JWT_SECRET'];
    $now = time();
    $exp = $now + 3600; // 1 hora

    $payload = [
        'iat' => $now,
        'exp' => $exp,
        'data' => [
            'id' => $usuario['user_id'],
            'correo' => $usuario['email'],
            'rol' => $usuario['rol']
        ]
    ];

         //Refresh Token 7dias
    $refreshExp = $now + (7 * 24 * 60 * 60);
    $refreshPayload = [
        'iat' => $now,
        'exp' => $refreshExp,
        'data' => [
            'id' => $usuario['user_id'] 
        ]
    ];

    $jwt = JWT::encode($payload, $secret_key, 'HS256');
    $refreshToken = JWT::encode($refreshPayload, $secret_key, 'HS256');

       // Guardar tokens en cookies seguras
    setcookie("access_token", $jwt, [
        'expires' => $now + 3600,
        'path' => '/',
        'secure' => false,  // true si usas HTTPS
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    setcookie("refresh_token", $refreshToken, [
        'expires' => $now + (7 * 24 * 3600),
        'path' => '/',
        'secure' => false,  
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

        echo json_encode([
            "success"       => "Login correcto",
            "step"          => "done",
            "token"         => $jwt,
            "refresh_token" => $refreshToken
        ]);
        exit;
    }

// ----------------------------
    // ADMIN → FLUJO 2FA CON OTP
    // ----------------------------

// Verificar si ya existe un OTP activo para este usuario
$stmt = $pdo->prepare("SELECT sms_id FROM sms WHERE user_id = ? ORDER BY sms_id DESC LIMIT 1");
$stmt->execute([$usuario['user_id']]);
$existe = $stmt->fetch(PDO::FETCH_ASSOC);

// Si ya existe, bórralo
if ($existe) {
    $del = $pdo->prepare("DELETE FROM sms WHERE sms_id = ?");
    $del->execute([$existe['sms_id']]);
}



        // Generar código de 6 dígitos
        $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expira = (new DateTime('+5 minutes'))->format('Y-m-d H:i:s');

         // Insertar OTP en la tabla sms
    $stmt = $pdo->prepare("INSERT INTO sms (user_id, code_otp) VALUES (?, ?)");
    $stmt->execute([$usuario['user_id'], $codigo]);

 // Enviar SMS con Twilio
 $sid = $_ENV['TWILIO_SID'];
 $token = $_ENV['TWILIO_AUTH_TOKEN'];
 $from = $_ENV['TWILIO_PHONE'];
 $client = new Client($sid, $token);

 // Preparar el número con formato internacional (+52)
$telefono = $usuario['phone'];

// Si el número no empieza con '+', lo convertimos a formato E.164
if (strpos($telefono, '+') !== 0) {
    // Elimina espacios, guiones o paréntesis
    $telefono = preg_replace('/\D/', '', $telefono);
    // Asegura que tenga el prefijo +52
    $telefono = '+' . $telefono;
}

// Enviar mensaje con Twilio
$mensaje = "Tu código de verificación es: $codigo";
$client->messages->create($telefono, [
    'from' => $from,
    'body' => $mensaje
]);

 // No enviar token aún
 echo json_encode([
     "success" => "Código enviado",
     "step" => "verify",
     "user_id" => $usuario['user_id']
 ]);

} catch (Exception $e) {
echo json_encode(["error" => $e->getMessage()]);
}
?>
