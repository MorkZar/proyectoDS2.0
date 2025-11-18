<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

// 1. Recibir JSON desde Angular
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['credential'])) {
    echo json_encode(["ok" => false, "error" => "No token received"]);
    exit;
}

$token = $data['credential'];

// 2. Verificar token con cURL
$ch = curl_init("https://oauth2.googleapis.com/tokeninfo?id_token=" . $token);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$info = json_decode($response, true);

// Validación fallida
if (!isset($info["email"])) {
    echo json_encode(["ok" => false, "error" => "Invalid token"]);
    exit;
}

// 3. Datos del usuario
$email = $info["email"];
$name = $info["name"] ?? "";
$picture = $info["picture"] ?? "";

// 4. Respuesta correcta
echo json_encode([
    "ok" => true,
    "email" => $email,
    "name" => $name,
    "picture" => $picture
]);
?>
