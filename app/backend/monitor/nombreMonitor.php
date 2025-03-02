<?php
session_start();

// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Incluir conexión
include '../conecta.php';

// Verificar conexión
if (!$conexion) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]);
    exit;
}
// Verificar si la sesión del monitor está activa
if (!isset($_SESSION['id_monitor'])) {
    echo json_encode(["success" => false, "message" => "No hay sesión activa."]);
    exit;
}

$id_monitor = $_SESSION['id_monitor'];

// Consulta SQL para obtener solo el nombre del monitor
$sql = "SELECT nombre FROM monitor WHERE id_monitor = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_monitor);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row) {
    echo json_encode([
        "success" => true,
        "id_monitor" => $id_monitor,
        "nombre" => $row['nombre'] ?? "Nombre no encontrado"
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Nombre no encontrado"]);
}

// Cerrar conexión y statement
$stmt->close();
$conexion->close();

?>

