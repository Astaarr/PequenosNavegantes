<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['id_actividad'])) {
    echo json_encode(["success" => false, "message" => "ID de actividad no proporcionado."]);
    exit;
}

$id_actividad = intval($datos['id_actividad']);

$sql = "SELECT id_programacion, id_actividad, id_grupo, hora_inicio, hora_fin, lugar, descripcion 
        FROM actividad WHERE id_actividad = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_actividad);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $actividad = $resultado->fetch_assoc();
    echo json_encode(["success" => true, "actividad" => $actividad]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontró la actividad."]);
}

$stmt->close();
$conexion->close();
?>
