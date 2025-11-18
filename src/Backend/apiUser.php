<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");


require_once __DIR__ . '/conectionBD.php';
require_once __DIR__ . '/verifyToken.php';
require_once __DIR__ . '/../../vendor/autoload.php';

// Manejo OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$user = verifyToken(); 
$user_id = $user['id'];
error_log("ID desde token: " . $user_id);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            $stmt = $pdo->prepare("SELECT user_name, email, phone FROM users WHERE user_id = :id");
            $stmt->bindParam(':id', $user_id);
            $stmt->execute();
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE users SET user_name = :user_name, email = :email, phone = :phone WHERE user_id = :id");
            $stmt->bindParam(':user_name', $data['user_name']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':id', $user_id);
            $stmt->execute();
            echo json_encode(["message" => "Perfil actualizado exitosamente"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}


