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

$sql = "SELECT id_actividad, nombre FROM actividad";
$stmt = $conexion->prepare($sql);
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