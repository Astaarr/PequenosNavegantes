<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../conecta.php';

$data = json_decode(file_get_contents("php://input"), true);

$sql = "INSERT INTO asistencia (id_hijo, id_programacion, asistio) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE asistio = VALUES(asistio)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("iii", 
    $data['id_hijo'],
    $data['id_programacion'],
    $data['asistio']
);

if($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>