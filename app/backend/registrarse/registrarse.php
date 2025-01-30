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
$nombre = $data['nombre'] ?? '';
$apellido = $data['apellido'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';


// Verifica que la contraseña no esté vacía
if (empty($password)) {
    echo json_encode(["success" => false, "message" => "La contraseña no puede estar vacía."]);
    exit;
}

// Encriptar la contraseña
$hashedPassword = password_hash($password,PASSWORD_DEFAULT);


echo json_encode([
    "success" => true,
    "message" => "Usuario registrado correctamente",
    "data" => [
        "nombre" => $nombre,
        "apellidos" => $apellido,
        "email" => $email,
        "password" => $password, $hashedPassword
    ]
    ]);