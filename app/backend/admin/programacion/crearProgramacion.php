<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../../conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);

$sql = "INSERT INTO programacion_actividad 
        (fecha, hora_inicio, duracion, lugar, id_actividad, id_grupo)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param(
    "ssisii",
    $data['fecha'],
    $data['hora_inicio'],
    $data['duracion'],
    $data['lugar'],
    $data['id_actividad'],
    $data['id_grupo']
);

try {
    $stmt->execute();
    echo json_encode(['success' => true]);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conexion->close();
?>