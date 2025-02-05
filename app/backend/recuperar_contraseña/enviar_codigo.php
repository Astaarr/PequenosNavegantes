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

$email = $data['email'] ?? '';

// Comprobar correo introducido existe en la base de datos
$sql = "SELECT id_padre FROM padre WHERE email = ?";
$stmt = $conexion ->prepare($sql);
$stmt -> bind_param("s", $email);
$stmt -> execute();
$result = $stmt->get_result();

if($row = $result ->fetch_assoc()){
    // Generar código y token de restablecimiento
    $codigo_restablecer = bin2hex(random_bytes(4));
    $token_restablecer = bin2hex(random_bytes(40));

    $sql = "UPDATE padre SET codigo_restablecer = ?, token_restablecer = ? WHERE email = ?";
    $stmt = $conexion -> prepare($sql);
    $stmt -> bind_param("sss", $codigo_restablecer, $token_restablecer, $email);
    $stmt -> execute();
    $result = $stmt->get_result();


    // PHPMailer
    require 'PHPMailer/PHPMailer.php';
    require 'PHPMailer/SMTP.php';
    require 'PHPMailer/Exception.php';

// PONER EN LA BASE DE DATOS CODIGO_RESTABLECER Y TOKEN_RESTABLECER

}
?>