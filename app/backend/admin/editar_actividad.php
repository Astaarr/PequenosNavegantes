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

$id_actividad = $data['id_actividad'] ?? null;
$nombre = $data['nombre'];
$descripcion = $data['descripcion'];

if ($id_actividad) {
    // Editar actividad existente
    $sql = "UPDATE actividad SET nombre = ?, descripcion = ? WHERE id_actividad = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssi", $nombre, $descripcion, $id_actividad);
} else {
    // Agregar nueva actividad
    $sql = "INSERT INTO actividad (nombre, descripcion) VALUES (?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ss", $nombre, $descripcion);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar la actividad."]);
}

$stmt->close();
$conexion->close();
?>