<?php
session_start();

// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Incluir conexión
include '../conecta.php';

// Obtener los datos enviados en el cuerpo de la petición
$datos = json_decode(file_get_contents("php://input"), true);

if (isset($datos['id_actividad'])) {
    $id_actividad = $datos['id_actividad'];

    $sql = "DELETE FROM actividad WHERE id_actividad = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id_actividad);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Actividad eliminada."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar actividad."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Datos inválidos."]);
}

$conexion->close();
?>
