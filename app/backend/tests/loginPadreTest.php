<?php

use PHPUnit\Framework\TestCase;

class loginPadreTest extends TestCase
{
    private $conexion;
    private $host = "localhost";
    private $usuario = "root";
    private $password = "";
    private $dbname = "pequenosnavegantes";

    protected function setUp(): void
    {
        // Conectar a la base de datos
        $this->conexion = new mysqli($this->host, $this->usuario, $this->password, $this->dbname);
        if ($this->conexion->connect_error) {
            $this->fail("Error al conectar con MySQL: " . $this->conexion->connect_error);
        }
    }

    protected function tearDown(): void
    {
        $this->conexion->close();
    }

    public function testInicioSesionExitoso() {
        // Insertar usuario de prueba
        $email = "prueba@example.com";
        $password = "123456";
        $nombre = "Usuario"; 
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
        $sql = "INSERT INTO padre (nombre, email, password) VALUES (?, ?, ?)";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("sss", $nombre, $email, $hashed_password);
        $stmt->execute();
        $stmt->close();
    
        // Simular una solicitud HTTP POST a login.php
        $data = json_encode(["email" => $email, "password" => $password]);
        $ch = curl_init("http://localhost/PequenosNavegantes/backend/login.php");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
        $response = json_decode(curl_exec($ch), true);
        curl_close($ch);
        
    
        // Verificar que el inicio de sesión fue exitoso
        $this->assertTrue($response["success"], "Error en el inicio de sesión");
    
        // Eliminar usuario de prueba
        $sql = "DELETE FROM padre WHERE email = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->close();
    }
}
