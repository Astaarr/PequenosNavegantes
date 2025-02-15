<?php
session_start();

// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Incluir conexión
include '../conecta.php';

// Verificar conexión
if (!$conexion) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

// Comprobar si la sesión está activa
if (!isset($_SESSION)) {
    echo json_encode(["success" => false, "message" => "No hay sesión activa."]);
    exit;
}

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_grupo'])) {
    echo json_encode(["success" => false, "message" => "ID de grupo no proporcionado."]);
    exit;
}

$id_grupo = $data['id_grupo'];

// Consulta para eliminar el grupo
$sql = "DELETE FROM grupo WHERE id_grupo = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_grupo);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar el grupo."]);
}

$stmt->close();
$conexion->close();
?>