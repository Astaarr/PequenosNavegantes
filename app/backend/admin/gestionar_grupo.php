<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

if (!$conexion) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

$data = json_decode(file_get_contents("php://input"), true);
$accion = $data['accion'] ?? null; // 'guardar_grupo', 'eliminar_monitor', 'eliminar_nino'

if ($accion === 'guardar_grupo') {
    // Guardar o editar grupo
    $idGrupo = $data['id_grupo'] ?? null;
    $nombre = $data['nombre'];
    $idMonitor = $data['id_monitor'];

    if ($idGrupo) {
        // Editar grupo existente
        $sql = "UPDATE grupo SET nombre = ?, id_monitor = ? WHERE id_grupo = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("sii", $nombre, $idMonitor, $idGrupo);
    } else {
        // Agregar nuevo grupo
        $sql = "INSERT INTO grupo (nombre, id_monitor) VALUES (?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("si", $nombre, $idMonitor);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar el grupo."]);
    }

    $stmt->close();
} elseif ($accion === 'eliminar_monitor') {
    // Eliminar monitor del grupo
    $idMonitor = $data['id'];

    $sql = "UPDATE grupo SET id_monitor = NULL WHERE id_monitor = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idMonitor);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar monitor del grupo."]);
    }

    $stmt->close();
} elseif ($accion === 'eliminar_nino') {
    // Eliminar niño del grupo
    $idNino = $data['id'];

    $sql = "UPDATE hijo SET id_grupo = NULL WHERE id_hijo = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idNino);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar niño del grupo."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Acción no válida."]);
}

$conexion->close();
?>