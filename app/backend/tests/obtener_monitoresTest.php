<?php

use PHPUnit\Framework\TestCase;

class ObtenerMonitoresTest extends TestCase {
    protected $conexion;

    // Configuración inicial para establecer la conexión a la base de datos
    protected function setUp(): void
    {
        $this->conexion = new mysqli('host', 'usuario', 'contraseña', 'base_de_datos');
        $this->assertFalse($this->conexion->connect_error, "Debe conectar correctamente a la base de datos");
    }

    // Prueba para obtener monitores exitosamente
    public function testObtenerMonitoresExitoso()
    {
        // Inserta datos de prueba en la base de datos
        $sql = "INSERT INTO solicitud_monitor (id_solicitud, nombre, apellidos, email, telefono, curriculum) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("isssss", $id_solicitud, $nombre, $apellidos, $email, $telefono, $curriculum);
        
        // Datos de prueba
        $id_solicitud = 1;
        $nombre = 'Nombre de Prueba';
        $apellidos = 'Apellidos de Prueba';
        $email = 'correo@prueba.com';
        $telefono = '123456789';
        $curriculum = 'Curriculum de Prueba';
        
        $stmt->execute();
        
        // Llama al método obtenerMonitores y captura la salida
        $output = $this->obtenerMonitores();
        
        // Compara la salida esperada con la salida real
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => true, "monitores" => [
                [
                    "id_solicitud" => $id_solicitud,
                    "nombre" => $nombre,
                    "apellidos" => $apellidos,
                    "email" => $email,
                    "telefono" => $telefono,
                    "curriculum" => $curriculum
                ]
            ]]),
            $output
        );
    }

    // Método privado para simular el comportamiento del script de obtener monitores
    private function obtenerMonitores()
    {
        ob_start();
        
        // Incluye el script real de obtener monitores
        require_once '../monitor/obtener_monitores.php'; 
        
        // Captura y retorna la salida del script
        $output = ob_get_clean();
        return $output;
    }

    // Cierra la conexión a la base de datos
    protected function tearDown(): void
    {
        $this->conexion->close();
    }
}
?>
