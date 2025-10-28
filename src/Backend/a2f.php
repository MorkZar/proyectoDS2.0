<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/conectionBD.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../env', 'token.env');
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

// Verificación de datos
if (!isset($data['user_id'], $data['code'])) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$user_id = intval($data['user_id']);
$code = trim($data['code']);

try {
    // 1️⃣ Verificar que el usuario exista
    $stmt = $pdo->prepare("SELECT email, rol FROM users WHERE user_id = :id");
    $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        echo json_encode(["error" => "Usuario no encontrado"]);
        exit;
    }

    // 2️⃣ Buscar el código en la tabla sms
    $stmt = $pdo->prepare("SELECT sms_id, code_otp FROM sms WHERE user_id = :id ORDER BY sms_id DESC LIMIT 1");
    $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $sms = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sms) {
        echo json_encode(["error" => "No se encontró ningún código para este usuario"]);
        exit;
    }

    // 3️⃣ Comparar el código ingresado
    if ($code !== $sms['code_otp']) {
        echo json_encode(["error" => "Código incorrecto"]);
        exit;
    }

    // 4️⃣ Eliminar el código una vez verificado (opcional, pero recomendable)
    $delete = $pdo->prepare("DELETE FROM sms WHERE sms_id = :sms_id");
    $delete->bindParam(':sms_id', $sms['sms_id'], PDO::PARAM_INT);
    $delete->execute();

    // 5️⃣ Generar el token JWT
    $secret_key = $_ENV['JWT_SECRET'];
    $now = time();
    $exp = $now + 3600; // 1 hora

    $payload = [
        'iat' => $now,
        'exp' => $exp,
        'data' => [
            'id' => $user_id,
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
            'id' => $user_id
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


    // 6️⃣ Devolver respuesta con el token
    echo json_encode([
        "success" => "Autenticación 2FA correcta",
        "token" => $jwt,
        "refresh_token" => $refreshToken
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

