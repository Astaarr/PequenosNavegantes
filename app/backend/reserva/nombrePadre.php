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

// Verificar si el usuario está autenticado
if (!isset($_SESSION['id_padre'])) {
    die(json_encode(["success" => false, "message" => "Usuario no autenticado"]));
}

$id_padre = $_SESSION['id_padre'];

// Consulta SQL para obtener todos los datos necesarios
$sql = "SELECT nombre, dni, telefono, telefono_adicional FROM padre WHERE id_padre = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_padre);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row) {
    echo json_encode([
        "success" => true,
        "nombre" => $row['nombre'] ?? "Nombre no encontrado",
        "dni" => $row['dni'] ?? "",
        "telefono" => $row['telefono'] ?? "",
        "telefono_adicional" => $row['telefono_adicional'] ?? ""
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Datos no encontrados"]);
}
