<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Leer el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['fecha'])) {
    echo json_encode(["success" => false, "message" => "Fecha no proporcionada"]);
    exit;
}

$_SESSION['fecha_seleccionada'] = $data['fecha'];

echo json_encode(["success" => true, "message" => "Fecha guardada en sesión"]);
?>
