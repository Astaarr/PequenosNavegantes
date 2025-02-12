<?php
session_start();
// Habilitar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Permitir cookies en la petición

include '../conecta.php';

// Si ya hay una sesión activa, devolver el nombre del usuario
if (isset($_SESSION['id_padre'])) {
    $id_padre = $_SESSION['id_padre'];

    $sql = "SELECT nombre FROM padre WHERE id_padre = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id_padre);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "message" => "Sesión iniciada", "nombre_padre" => $row['nombre']]);
        exit;
    }
}

// Verificar si existe la cookie con el token
if (isset($_COOKIE['token_login'])) {
    $token = $_COOKIE['token_login'];

    // Buscar el token en la base de datos
    $sql = "SELECT id_padre, nombre, token_login FROM padre";
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if (password_verify($token, $row['token_login'])) { // Verifica el hash del token
            $_SESSION['id_padre'] = $row['id_padre'];

            echo json_encode(["success" => true, "message" => "Sesión iniciada con cookie", "nombre_padre" => $row['nombre']]);
            exit;
        }
    }
}

// Si no hay sesión activa ni token válido
echo json_encode(["success" => false, "message" => "No hay sesión activa"]);
