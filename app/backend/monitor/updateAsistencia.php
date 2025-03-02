<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conecta.php';

// Verificar si hay sesión activa
if (!isset($_SESSION['id_monitor'])) {
    echo json_encode(["success" => false, "message" => "No hay sesión activa"]);
    exit;
}

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['asistencia']) || !is_array($data['asistencia'])) {
    echo json_encode(["success" => false, "message" => "Datos de asistencia inválidos"]);
    exit;
}

// Obtener la programación activa
$sqlIdProgramacion = "SELECT id_programacion FROM programacion_actividad ORDER BY fecha DESC LIMIT 1";
$result = $conexion->query($sqlIdProgramacion);
$id_programacion = $result->fetch_assoc()['id_programacion'] ?? null;

if (!$id_programacion) {
    echo json_encode(["success" => false, "message" => "No se encontró una programación activa"]);
    exit;
}

// Preparar la consulta para insertar o actualizar asistencia
$stmt = $conexion->prepare("INSERT INTO asistencia (id_hijo, id_programacion, asistio) 
                            VALUES (?, ?, ?) 
                            ON DUPLICATE KEY UPDATE asistio = VALUES(asistio)");

foreach ($data['asistencia'] as $registro) {
    $stmt->bind_param("iii", $registro['id_hijo'], $id_programacion, $registro['asistio']);
    $stmt->execute();
}

$stmt->close();
$conexion->close();

echo json_encode(["success" => true, "message" => "Asistencia actualizada correctamente"]);
?>
