<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../../conecta.php';


if (!$conexion) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]));
}

$data = json_decode(file_get_contents("php://input"), true);
$tipo = $data['tipo'] ?? null; 
$idGrupo = $data['id_grupo'] ?? null;

try {
    if ($tipo === 'monitores') {
        // Obtener todos los monitores
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

    } elseif ($tipo === 'monitores_libres') {
        // Obtener monitores que no tienen grupo asignado
        $sql = "SELECT id_monitor, nombre, apellidos FROM monitor 
                WHERE id_monitor NOT IN (SELECT id_monitor FROM grupo WHERE id_monitor IS NOT NULL)";
        $resultado = $conexion->query($sql);

        if ($resultado) {
            $monitores = [];
            while ($fila = $resultado->fetch_assoc()) {
                $monitores[] = $fila;
            }
            echo json_encode(["success" => true, "monitores" => $monitores]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al obtener monitores disponibles."]);
        }

    } elseif ($tipo === 'ninos') {
        if ($idGrupo) {
            // Obtener niños asociados a un grupo
            $sql = "SELECT id_hijo, nombre, apellidos FROM hijo WHERE id_grupo = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("i", $idGrupo);
            $stmt->execute();
            $resultado = $stmt->get_result();
        } else {
            // Obtener niños sin grupo
            $sql = "SELECT id_hijo, nombre, apellidos FROM hijo WHERE id_grupo IS NULL";
            $resultado = $conexion->query($sql);
        }

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

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Se produjo un error: " . $e->getMessage()]);
}
?>