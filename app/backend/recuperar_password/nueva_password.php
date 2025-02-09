<?php
session_start();

require '../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Configurar la respuesta como JSON
header("Content-Type: application/json");

// Habilitar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

// Obtener JSON de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Error: No se recibió ningún JSON"]);
    exit;
}

// Verificar que los datos están en el JSON
$nuevaPassword = isset($data['nuevaPassword']) ? trim($data['nuevaPassword']) : '';
$token = isset($data['token']) ? trim($data['token']) : '';

if (!$nuevaPassword || strlen($nuevaPassword) < 6) {
    echo json_encode(["success" => false, "message" => "Error: La contraseña debe tener al menos 6 caracteres"]);
    exit;
}

if (!$token) {
    echo json_encode(["success" => false, "message" => "Error: Token inválido"]);
    exit;
}

// Buscar en la base de datos si el token es válido
$sql = "SELECT email FROM padre WHERE token_restablecer = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    echo json_encode(["success" => false, "message" => "Error: Token inválido o expirado"]);
    exit;
}

$email = $row['email'];

// Hashear la nueva contraseña antes de guardarla
$hashedPassword = password_hash($nuevaPassword, PASSWORD_BCRYPT);

// Actualizar la contraseña en la base de datos y eliminar el token
$sql = "UPDATE padre SET password = ?, token_restablecer = NULL, codigo_restablecer = NULL WHERE email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $hashedPassword, $email);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Contraseña cambiada correctamente"]);
?>
