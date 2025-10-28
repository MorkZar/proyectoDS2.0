<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
$origin = "http://localhost:4200"; // Angular dev

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/conectionBD.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Dotenv\Dotenv;
use Twilio\Rest\Client;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__ . '/../../env', 'token.env');
$dotenv->load();


$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['correo'], $data['password'])) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$correo = trim($data['correo']);
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT user_id, email, phone, password, rol FROM users WHERE email = :correo");
    $stmt->bindParam(':correo', $correo);
    $stmt->execute();

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($password, $usuario['password'])) {

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
    $telefono = '+52' . $telefono;
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

} else {
 echo json_encode(["error" => "Correo o contraseña incorrectos"]);
}

} catch (Exception $e) {
echo json_encode(["error" => $e->getMessage()]);
}
?>
