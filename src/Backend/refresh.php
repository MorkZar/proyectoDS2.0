<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

// Cargar secret
$dotenv = Dotenv::createImmutable(__DIR__ . '/../../env', 'token.env');
$dotenv->load();
$secret_key = $_ENV['JWT_SECRET'];

// Leer refresh token desde cookie
if (!isset($_COOKIE['refresh_token'])) {
    echo json_encode(["error" => "No hay refresh token"]);
    exit;
}

$refreshToken = $_COOKIE['refresh_token'];

try {
    // Validar refresh token
    $decoded = JWT::decode($refreshToken, new Key($secret_key, 'HS256'));
    
    $now = time();
    $exp = $now + 3600; // nuevo access token (1 hora)

    $newPayload = [
        'iat' => $now,
        'exp' => $exp,
        'data' => [
            'id' => $decoded->data->id
        ]
    ];

    $newAccessToken = JWT::encode($newPayload, $secret_key, 'HS256');

    // Guardar nuevo access token en cookie
    setcookie("access_token", $newAccessToken, [
        'expires' => $exp,
        'path' => '/',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    echo json_encode([
        "success" => true,
        "token" => $newAccessToken
    ]);
} catch (Exception $e) {
    echo json_encode(["error" => "Refresh token inválido o expirado"]);
}

