<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/../../vendor/autoload.php';

function verifyToken() {

    // 1. Obtener headers
    $headers = getallheaders();

    // 2. Detectar todas las variantes posibles de Authorization en Apache
    $authHeader =
        $headers['Authorization']
        ?? $headers['authorization']
        ?? $headers['HTTP_AUTHORIZATION']
        ?? null;

    // 3. Si no vino Authorization en headers, revisar servidor
    if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }

    // 4. Si aun no hay token → usuario no autenticado
    if (!$authHeader) {
        http_response_code(401);
        header("Content-Type: application/json");
        die(json_encode(["error" => "Token no proporcionado"]));
    }

    // 5. Remover "Bearer "
    $token = str_replace("Bearer ", "", $authHeader);

    try {
        $secret = "reservaTec123";
        $decoded = JWT::decode($token, new Key($secret, 'HS256'));

        return (array)$decoded->data;

    } catch (Exception $e) {
        http_response_code(401);
        header("Content-Type: application/json");
        die(json_encode(["error" => "Token inválido: " . $e->getMessage()]));
    }
}


