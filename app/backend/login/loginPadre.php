<?php
// Habilitar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *"); // Permite peticiones desde cualquier dominio
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permite POST y la pre-flight request (OPTIONS)
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Permite enviar datos JSON y tokens

include '../conecta.php';

$data = json_decode(file_get_contents('php://input'), true);

// Verificar que los datos se recibieron correctamente
$email = $data['nombre'] ?? '';
$password = $data['password'] ?? '';
$recordar = $data['recordar'] ?? '';

// IMPLEMENTAR LA LOGICA DE RECORDAR CONTRASENA CON SESSION Y TOKEN
