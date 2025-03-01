<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conecta.php';

$data = json_decode(file_get_contents("php://input"), true);

$sql = "INSERT INTO asistencia (id_hijo, id_programacion, asistio) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE asistio = VALUES(asistio)";

$stmt = $conexion->prepare($sql);

foreach ($data['asistencias'] as $asistencia) {
    $stmt->bind_param("iii", 
        $asistencia['id_hijo'],
        $asistencia['id_programacion'],
        $asistencia['asistio']
    );
    $stmt->execute();
}

echo json_encode(['success' => true]);
$stmt->close();
$conexion->close();
?>