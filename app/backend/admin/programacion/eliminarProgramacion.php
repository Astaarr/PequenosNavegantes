<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../../conecta.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if($id) {
    $sql = "DELETE FROM programacion_actividad WHERE id_programacion = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conexion->error]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'ID no recibido']);
}
?>