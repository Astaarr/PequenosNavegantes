<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['hora_inicio'], $datos['hora_fin'], $datos['lugar'], $datos['descripcion'], $datos['id_grupo'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
    exit;
}

$id_actividad = isset($datos['id_actividad']) ? intval($datos['id_actividad']) : null;
$hora_inicio = $datos['hora_inicio'];
$hora_fin = $datos['hora_fin'];
$lugar = $datos['lugar'];
$descripcion = $datos['descripcion'];
$id_grupo = intval($datos['id_grupo']);

if ($id_actividad) {
    // Actualizar actividad existente
    $sql = "UPDATE actividad SET hora_inicio = ?, hora_fin = ?, lugar = ?, descripcion = ?, id_grupo = ? WHERE id_actividad = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssssii", $hora_inicio, $hora_fin, $lugar, $descripcion, $id_grupo, $id_actividad);
} else {
    // Insertar nueva actividad
    $sql = "INSERT INTO actividad (hora_inicio, hora_fin, lugar, descripcion, id_grupo) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssssi", $hora_inicio, $hora_fin, $lugar, $descripcion, $id_grupo);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Actividad guardada correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar la actividad."]);
}

$stmt->close();
$conexion->close();
?>
