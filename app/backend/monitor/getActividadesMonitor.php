<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conecta.php';

$id_monitor = $_GET['id_monitor'];
$fecha = $conexion->real_escape_string($_GET['fecha']);

$sql = "SELECT p.*, a.nombre AS nombre_actividad, g.nombre AS nombre_grupo 
        FROM programacion_actividad p
        JOIN actividad a ON p.id_actividad = a.id_actividad
        JOIN grupo g ON p.id_grupo = g.id_grupo
        WHERE p.fecha = ? AND g.id_monitor = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("si", $fecha, $id_monitor);
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