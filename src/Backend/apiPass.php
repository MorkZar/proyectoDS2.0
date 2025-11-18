<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

require_once __DIR__ . '/conectionBD.php';
require_once __DIR__ . '/verifyToken.php';
require_once __DIR__ . '/../../vendor/autoload.php';


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$user = verifyToken();
$user_id = $user['id'];

$data = json_decode(file_get_contents("php://input"), true);
$actual = $data['password_actual'];
$nueva = $data['nueva_password'];

try {
    $stmt = $pdo->prepare("SELECT password FROM users WHERE user_id = :id");
    $stmt->execute([':id' => $user_id]);
    $userDb = $stmt->fetch(PDO::FETCH_ASSOC);

    // Validar contraseña actual
    if (!password_verify($actual, $userDb['password'])) {
    http_response_code(401);
    echo json_encode(["error" => "La contraseña actual es incorrecta"]);
    exit;
}

    // Nuevo hash
    $nuevoHash = password_hash($nueva, PASSWORD_DEFAULT);

    $update = $pdo->prepare("UPDATE users SET password = :pass WHERE user_id = :id");
    $update->execute([':pass' => $nuevoHash, ':id' => $user_id]);

    echo json_encode(["message" => "Contraseña actualizada"]);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
