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

// Probamos login con token si existe cookie
if (!isset($_SESSION['id_padre']) && isset($_COOKIE['token_login'])){
    $token = $_COOKIE['token_login'];

    $sql = "SELECT id_padre FROM padre WHERE token_login = ?";
    $stmt = $conexion ->prepare($sql);
    $stmt -> bind_param("s", $token);
    $stmt -> execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()){
        $_SESSION['id_padre'] = $row['id_padre'];
        echo json_encode(["success" => true, "message" => "Sesión iniciada con cookie"]);
        exit;
    }
}


// Si no se inicio sesion con cookie, que lo haga con email y contraseña

$data = json_decode(file_get_contents('php://input'), true);

// Verificar que los datos se recibieron correctamente
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$recordar = isset($data['recordar']) ? $data['recordar'] : false;

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email y contraseña son obligatorios"]);
    exit;
}

$sql = "SELECT id_padre, password FROM padre WHERE email = ?";
$stmt = $conexion -> prepare($sql);
$stmt -> bind_param("s", $email);
$stmt -> execute();
$result = $stmt -> get_result();

if($row = $result ->fetch_assoc()){
    if(password_verify($password, $row['password'])){
        $_SESSION['id_padre'] = $row['id_padre'];

        if($recordar){
            $token = bin2hex(random_bytes(32));
            // Dom = dominio
            // Sexto parámetro = True(https) False(http)
            // Septimo parámetro = True(secure) False(httpOnly)
            setcookie("token_login", $token, time() + (86400 * 30), "/", "", false, true);
            
            // Guardar token en la base de datos
            $sql = "UPDATE padre SET token_login = ? WHERE id_padre = ?";
            $stmt = $conexion -> prepare($sql);
            $stmt -> bind_param("si", $token, $row['id_padre']);
            $stmt -> execute();
        }
        echo json_encode(["success" => true, "message" => "Inicio de sesión correcto"]);
        exit;
    }else{
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
        exit;
    }
}
echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);

// IMPLEMENTAR LA LOGICA DE RECORDAR CONTRASENA CON SESSION Y TOKEN
