<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


require_once __DIR__ . '/conectionBD.php';
require_once __DIR__ . '/../../vendor/autoload.php';

try {
    $stmt = $pdo->query("SELECT user_id, user_name, email, phone ,password, rol, status FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>