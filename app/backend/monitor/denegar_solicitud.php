<?php
session_start();

// Habilitar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

// Verificar si la solicitud es válida
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_solicitud'])) {
    die(json_encode(["success" => false, "message" => "ID de solicitud no proporcionado"]));
}

$id_solicitud = $data['id_solicitud'];

// Eliminar la solicitud de la base de datos
$sql = "DELETE FROM solicitud_monitor WHERE id_solicitud = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_solicitud);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Solicitud eliminada correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar la solicitud"]);
}

$stmt->close();
$conexion->close();
?>
