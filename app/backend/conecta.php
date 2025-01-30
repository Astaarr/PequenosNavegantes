<?php
// Datos de conexión a la base de datos
$host = "localhost";
$usuario = "root";
$password = "";
$dbname = "pequenosnavegantes";

// Conexión al servidor de MySQL
$conexion  = new mysqli($host, $usuario, $password);
if ($conexion->connect_error) {
    die("Error al conectar con la base de datos: " . $conexion->connect_error);
}

// Consulta para verificar si la base de datos existe
$sql = "SHOW DATABASES LIKE '$dbname'";
$query = $conexion->query($sql); // Ejecuta la consulta

if ($query->num_rows <= 0){
    $sql = "CREATE DATABASE $dbname";
    if (!$conexion->query($sql)) {
        die("Error al crear la base de datos: " . $conexion->error);
    }
}

// Selecciona la base de datos
if (!$conexion->select_db($dbname)) {
    die("Error al seleccionar la base de datos: " . $conexion->error);
}

?>