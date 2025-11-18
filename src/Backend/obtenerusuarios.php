<?php

use Google\Service\WorkspaceEvents\PasswordOAuthFlow;
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Headers: Content-Type, Authorization');



require_once __DIR__ . '/conectionBD.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../env', 'token.env');
$dotenv->load();

// Responder al preflight de Angular (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// -----------------------------
// Función para generar contraseña
// -----------------------------
function generarPasswordTemporal($longitud = 12) {
    $bytes = random_bytes($longitud);
    return substr(str_replace(['/', '+', '='], '', base64_encode($bytes)), 0, $longitud);
}

// -----------------------------
// Función para enviar el email
// -----------------------------
function enviarEmailCredenciales($email, $tempPassword) {
    $mail = new PHPMailer(true);

    try {
        //Server settings


        $mail->isSMTP();
        $mail->CharSet = 'utf-8';
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'gamorq13579@gmail.com';
        $mail->Password = $_ENV['EMAIL_SECRET'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;


        //Recipients
        $mail->setFrom('gamorq13579@gmail.com', 'Splash');
        $mail->addAddress($email);

        //Content
        $mail->isHTML(true);
        $mail->Subject = 'Tu cuenta fue creada';
        $mail->Body = "
            <p>Hola,</p>
            <p>Tu cuenta fue creada exitosamente. Inicia sesión con la siguiente información y <strong>cambia tu contraseña de inmediato</strong>:</p>
            <p><strong>Correo:$email</strong> <br>
               <strong>Contraseña temporal:</strong> $tempPassword</p>
        ";
        $mail->AltBody = "Hola,\n\nTu cuenta fue creada exitosamente. Inicia sesión con la siguiente información y cambia tu contraseña de inmediato:\n\nCorreo: $email\nContraseña temporal: $tempPassword";

        $mail->send();
    } catch (Exception $e) {
        error_log("Error enviando email: " . $mail->ErrorInfo);
    }
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT user_id, user_name, email, phone ,password, rol, status FROM users");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($users);
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;
    case 'PUT':
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['user_id'];
            $rol = $data['rol'];
            $status = $data['status'];

            $stmt = $pdo->prepare("UPDATE users SET rol = :rol, status = :status WHERE user_id = :id");
            $stmt->bindParam(':rol', $rol);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            echo json_encode(["message" => "User updated successfully"]);
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;
    case 'POST':
        try {
        $data = json_decode(file_get_contents("php://input"), true);
            $user_name = $data['user_name'];
            $email = $data['email']; 
            $phone = $data['phone'];
            $rol = $data['rol'];
            $status = $data['status'];

             // 1️⃣ Verificar si el correo ya existe
        $stmtCheck = $pdo->prepare("SELECT user_id FROM users WHERE email = :correo");
        $stmtCheck->bindParam(':correo', $email);
        $stmtCheck->execute();

        if ($stmtCheck->rowCount() > 0) {
            echo json_encode(["error" => "El correo ya está registrado"]);
            exit;
        }

            // Generar contraseña temporal
            $tempPassword = generarPasswordTemporal(12);
            $passwordHash = password_hash($tempPassword, PASSWORD_DEFAULT);


            $stmt = $pdo->prepare("INSERT INTO users (user_name, email, phone, password, rol, status) VALUES (:user_name, :email, :phone, :password, :rol, :status)");
            $stmt->bindParam(':user_name', $user_name); 
            $stmt->bindParam(':email', $email); 
            $stmt->bindParam(':phone', $phone);
            $stmt->bindValue(':password', $passwordHash);
            $stmt->bindParam(':rol', $rol); 
            $stmt->bindParam(':status', $status);
            $stmt->execute();

             // Enviar correo
            enviarEmailCredenciales($email, $tempPassword);

            echo json_encode(["message" => "User created successfully"]);
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);

        }
        break;
    default:
        http_response_code(405);
}
?>