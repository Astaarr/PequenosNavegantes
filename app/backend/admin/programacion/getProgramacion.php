<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include '../../conecta.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$fecha = $conexion->real_escape_string($_GET['fecha']);

$sql = "SELECT p.*, a.nombre AS nombre_actividad, g.nombre AS nombre_grupo 
        FROM programacion_actividad p
        JOIN actividad a ON p.id_actividad = a.id_actividad
        JOIN grupo g ON p.id_grupo = g.id_grupo
        WHERE p.fecha = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $fecha);
$stmt->execute();
$result = $stmt->get_result();

$actividades = [];
while ($row = $result->fetch_assoc()) {
    $actividades[] = $row;
}

echo json_encode($actividades);
$stmt->close();
$conexion->close();
?>