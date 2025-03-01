<?php
include '../conecta.php';

$id_programacion = $_GET['id_programacion'];

$sql = "SELECT h.*, COALESCE(a.asistio, 0) AS asistio
        FROM hijo h
        LEFT JOIN asistencia a ON h.id_hijo = a.id_hijo AND a.id_programacion = ?
        WHERE h.id_grupo = (SELECT id_grupo FROM programacion_actividad WHERE id_programacion = ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $id_programacion, $id_programacion);
$stmt->execute();
$result = $stmt->get_result();

$hijos = [];
while ($row = $result->fetch_assoc()) {
    $hijos[] = $row;
}

echo json_encode($hijos);
$stmt->close();
$conexion->close();
?>
