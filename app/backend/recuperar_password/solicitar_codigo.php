<?php
session_start();

require '../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Configurar la respuesta como JSON
header("Content-Type: application/json");

// Habilitar errores para depuración
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
$token = isset($data['token']) ? trim($data['token']) : '';
$codigo = isset($data['codigo']) ? trim($data['codigo']) : '';

if (!$codigo) {
    echo json_encode(["success" => false, "message" => "Error: Código inválido"]);
    exit;
}

if (!$token) {
    echo json_encode(["success" => false, "message" => "Error: Token inválido"]);
    exit;
}

// Buscar en la base de datos si el token y el código coinciden
$sql = "SELECT email FROM padre WHERE token_restablecer = ? AND codigo_restablecer = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $token, $codigo);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    echo json_encode(["success" => false, "message" => "Error: Código incorrecto o ya utilizado"]);
    exit;
}

echo json_encode(["success" => true, "message" => "Código correcto"]);
?>
