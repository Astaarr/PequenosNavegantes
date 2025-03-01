<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conecta.php';

$id_programacion = $conexion->real_escape_string($_GET['id_programacion']);

$sql = "SELECT h.*, a.asistio 
        FROM hijo h
        LEFT JOIN asistencia a ON h.id_hijo = a.id_hijo AND a.id_programacion = ?
        WHERE h.id_grupo = (SELECT id_grupo FROM programacion_actividad WHERE id_programacion = ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $id_programacion, $id_programacion);
$stmt->execute();
$result = $stmt->get_result();

$ninos = [];
while ($row = $result->fetch_assoc()) {
    $ninos[] = $row;
}

echo json_encode($ninos);
$stmt->close();
$conexion->close();
?>