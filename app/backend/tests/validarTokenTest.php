<?php

use PHPUnit\Framework\TestCase;

class SesionTest extends TestCase {
    protected $conexion;

    // Configuración inicial para establecer la conexión a la base de datos
    protected function setUp(): void
    {
        $this->conexion = new mysqli('host', 'usuario', 'contraseña', 'base_de_datos');
        $this->assertFalse($this->conexion->connect_error, "Debe conectar correctamente a la base de datos");
    }

    // Prueba para una sesión activa
    public function testSesionActiva()
    {
        // Simula una sesión activa
        $_SESSION['id_padre'] = 1;
        
        // Datos de prueba
        $nombre = 'Prueba';
        
        // Inserta un nombre de prueba en la base de datos
        $sql = "UPDATE padre SET nombre = ? WHERE id_padre = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("si", $nombre, $_SESSION['id_padre']);
        $stmt->execute();
        
        // Llama al método comprobarSesion y captura la salida
        $output = $this->comprobarSesion();
        
        // Compara la salida esperada con la salida real
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => true, "message" => "Sesión iniciada", "nombre_padre" => $nombre]),
            $output
        );
    }

    // Prueba para una sesión iniciada con cookie
    public function testSesionConCookie()
    {
        // Simula una cookie con token
        $_COOKIE['token_login'] = 'dummy_token';
        
        // Datos de prueba
        $id_padre = 1;
        $nombre = 'Prueba';
        $token = password_hash('dummy_token', PASSWORD_DEFAULT);
        
        // Inserta un token de prueba en la base de datos
        $sql = "UPDATE padre SET token_login = ? WHERE id_padre = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("si", $token, $id_padre);
        $stmt->execute();
        
        // Llama al método comprobarSesion y captura la salida
        $output = $this->comprobarSesion();
        
        // Compara la salida esperada con la salida real
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => true, "message" => "Sesión iniciada con cookie", "nombre_padre" => $nombre]),
            $output
        );
    }

    // Prueba para cuando no hay sesión activa ni token válido
    public function testNoSesionActiva()
    {
        // Llama al método comprobarSesion y captura la salida
        $output = $this->comprobarSesion();
        
        // Compara la salida esperada con la salida real
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => false, "message" => "No hay sesión activa"]),
            $output
        );
    }

    // Método privado para simular el comportamiento del script de comprobación de sesión
    private function comprobarSesion()
    {
        ob_start();
        
        // Incluye el script real de comprobación de sesión
        require_once '../login/validarToken.php';
        
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
