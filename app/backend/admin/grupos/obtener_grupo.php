<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../../conecta.php';

if (!$conexion) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

$data = json_decode(file_get_contents("php://input"), true);
$idGrupo = $data['id_grupo'];

$sql = "SELECT * FROM grupo WHERE id_grupo = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $idGrupo);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $grupo = $resultado->fetch_assoc();
    echo json_encode(["success" => true, "grupo" => $grupo]);
} else {
    echo json_encode(["success" => false, "message" => "Grupo no encontrado."]);
}

$stmt->close();
$conexion->close();
?>