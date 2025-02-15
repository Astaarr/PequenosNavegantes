<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../conecta.php';

if (!$conexion) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

$data = json_decode(file_get_contents("php://input"), true);
$tipo = $data['tipo'] ?? null; // 'monitores' o 'ninos'
$idGrupo = $data['id_grupo'] ?? null;

if ($tipo === 'monitores') {
    // Obtener monitores
    $sql = "SELECT id_monitor, nombre, apellidos FROM monitor";
    $resultado = $conexion->query($sql);

    if ($resultado) {
        $monitores = [];
        while ($fila = $resultado->fetch_assoc()) {
            $monitores[] = $fila;
        }
        echo json_encode(["success" => true, "monitores" => $monitores]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al obtener monitores."]);
    }
} elseif ($tipo === 'ninos') {
    // Obtener niños
    $sql = "SELECT id_hijo, nombre, apellidos FROM hijo WHERE id_grupo = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idGrupo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado) {
        $ninos = [];
        while ($fila = $resultado->fetch_assoc()) {
            $ninos[] = $fila;
        }
        echo json_encode(["success" => true, "ninos" => $ninos]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al obtener niños."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Tipo de consulta no válido."]);
}

if (isset($stmt)) {
    $stmt->close();
}
$conexion->close();
?>