<?php
header("Content-Type: application/json");
//header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Origin: http://localhost:4200"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/conectionBD.php';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!is_array($data) || !isset($data['nombre'], $data['correo'], $data['telefono'], $data['password'])) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$nombre = trim($data['nombre']);
$correo = trim($data['correo']);
$telefono = $data['telefono'];
$password = $data['password'];

if (empty($nombre) || empty($correo) || empty($telefono) || empty($password)) {
    echo json_encode(["error" => "Todos los campos son obligatorios"]);
    exit;
}

if (!is_numeric($telefono)) {
    echo json_encode(["error" => "El teléfono debe ser numérico"]);
    exit;
}


try {
    // 1️⃣ Verificar si el correo ya existe
    $stmtCheck = $pdo->prepare("SELECT user_id FROM users WHERE email = :correo");
    $stmtCheck->bindParam(':correo', $correo);
    $stmtCheck->execute();

    if ($stmtCheck->rowCount() > 0) {
        // El correo ya existe
        echo json_encode(["error" => "El correo ya está registrado"]);
        exit;
    }

    // 2️⃣ Hashear contraseña
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // 3️⃣ Insertar usuario
    $stmtInsert = $pdo->prepare("INSERT INTO users (user_name, email, phone, password) VALUES (:nombre, :correo, :telefono, :password)");
    $stmtInsert->bindParam(':nombre', $nombre);
    $stmtInsert->bindParam(':correo', $correo);
    $stmtInsert->bindParam(':telefono', $telefono);
    $stmtInsert->bindParam(':password', $hashedPassword);

    $stmtInsert->execute();

    echo json_encode(["success" => "Usuario creado correctamente"]);

} catch (PDOException $e) {
    error_log($e->getMessage(), 3, __DIR__ . '/../../logs/error.log');
    echo json_encode(["error" => "Error en el servidor. Intente más tarde."]);
}
?>



