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
$password = $data['password'] ?? '';

$sql = "SELECT id_admin, password FROM admin WHERE email = ?";
$stmt = $conexion ->prepare($sql);
$stmt -> bind_param("s", $email);
$stmt -> execute();
$result = $stmt -> get_result();


if($row = $result -> fetch_assoc()){
    if(password_verify($password, $row['password'])){
        $_SESSION['id_admin'] = $row['id_admin'];
        echo json_encode(["success" => true, "message" => "Sesión iniciada"]);
        header("Location: ../../indexAdmin.html");
        exit;
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
}else{
    echo json_encode(["success"=> false, "message"=> "Usuario no encontrado"]);
}
?>