<?php
session_start();

// Habilitar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *"); // Permite peticiones desde cualquier dominio
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permite POST y la pre-flight request (OPTIONS)
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Permite enviar datos JSON y tokens

include '../conecta.php';

$data = json_decode(file_get_contents('php://input'), true);

$codigo_restablecer = $data['codigo_restablecer'] ?? '';

$sql = "SELECT id_padre FROM padre WHERE codigo_restablecer = ?";
$stmt -> prepare($sql);
$stmt -> bind_param("s", $codigo_restablecer);
$stmt -> execute();
$result = $stmt -> get_result();

if($){

}



?>