<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/../vendor/autoload.php';

function verifyToken() {
    $headers = apache_request_headers();

    if (!isset($headers['Authorization'])) {
        echo json_encode(["error" => "Token no proporcionado"]);
        http_response_code(401);
        exit();
    }

    $authHeader = $headers['Authorization'];

    // Formato: "Bearer 123abc123..."
    $token = str_replace("Bearer ", "", $authHeader);

    try {
        $secret = "reservaTec123"; 

        // Decodificar el token
        $decoded = JWT::decode($token, new Key($secret, 'HS256'));

        // Convertir el decoded en array
        return (array)$decoded->data;

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Token inválido: " . $e->getMessage()]);
        exit();
    }
}
