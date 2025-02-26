<?php

use PHPUnit\Framework\TestCase;

class LoginAdminTest extends TestCase {
    protected $conexion;

    // Configuración inicial para establecer la conexión a la base de datos
    protected function setUp(): void
    {
        $this->conexion = new mysqli('host', 'usuario', 'contraseña', 'base_de_datos');
        $this->assertFalse($this->conexion->connect_error, "Debe conectar correctamente a la base de datos");
    }

    // Prueba para un inicio de sesión exitoso
    public function testLoginExitoso()
    {
        // Simula una sesión vacía
        $_SESSION = [];

        // Datos de prueba para un inicio de sesión exitoso
        $data = ['email' => 'test@example.com', 'password' => 'testpassword'];

        // Llama al método login y captura la salida
        $output = $this->login($data);

        // Compara la salida esperada con la salida real
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => true, "message" => "Sesión iniciada"]),
            $output
        );
    }

    // Prueba para un inicio de sesión con contraseña incorrecta
    public function testLoginContrasenaIncorrecta()
    {
        // Simula una sesión vacía
        $_SESSION = [];

        // Datos de prueba con una contraseña incorrecta
        $data = ['email' => 'test@example.com', 'password' => 'wrongpassword'];

        // Llama al método login y captura la salida
        $output = $this->login($data);

        // Compara la salida esperada con la salida real
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => false, "message" => "Contraseña incorrecta"]),
            $output
        );
    }

    // Prueba para un inicio de sesión con un usuario no encontrado
    public function testUsuarioNoEncontrado()
    {
        // Simula una sesión vacía
        $_SESSION = [];

        // Datos de prueba con un correo que no existe en la base de datos
        $data = ['email' => 'nonexistent@example.com', 'password' => 'password'];

        // Llama al método login y captura la salida
        $output = $this->login($data);

        // Compara la salida esperada con la salida real
        $this->assertJsonStringEqualsJsonString(
            json_encode(["success" => false, "message" => "Usuario no encontrado"]),
            $output
        );
    }

    // Método privado para simular el comportamiento del script de inicio de sesión
    private function login($data)
    {
        ob_start();

        // Simula los datos POST
        $_POST = $data;

        // Incluye el script real de inicio de sesión
        require_once '../login/loginMonitor.php';

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
