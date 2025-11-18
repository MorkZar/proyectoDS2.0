<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: PUT,GET,OPTIONS");
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../conectionBD.php';
require_once '../verifyToken.php'; // <-- valida JWT

// Responder al preflight de Angular (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$user = verifyToken(); // <-- devuelve el user_id desde JWT
$user_id = $user['id'];

$data = json_decode(file_get_contents("php://input"), true);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            $stmt = $pdo->prepare("SELECT user_name, email, phone FROM users WHERE user_id = :id");
            $stmt->bindParam(':id', $user_id);
            $stmt->execute();

            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;
    case 'PUT':
       try {
            $data = json_decode(file_get_contents("php://input"), true);

            $user_name = $data['user_name'] ?? null;
            $email = $data['email'] ?? null;
            $phone = $data['phone'] ?? null;

            $stmt = $pdo->prepare("
                UPDATE users 
                SET user_name = :user_name, email = :email, phone = :phone
                WHERE user_id = :id
            ");

            $stmt->bindParam(':user_name', $user_name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':id', $user_id);

            $stmt->execute();

            echo json_encode(["message" => "Perfil actualizado exitosamente"]);
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;
        default:
        http_response_code(405);
    }

