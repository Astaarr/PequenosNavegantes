<?php

use PHPUnit\Framework\TestCase;

class ConectaTest extends TestCase
{
    private $conexion;
    private $host = "localhost";
    private $usuario = "root";
    private $password = "";
    private $dbname = "pequenosnavegantes";

    /**
     * Configuración inicial antes de cada prueba.
     * Intenta establecer una conexión con MySQL.
     */
    protected function setUp(): void
    {
        // Intentar conectar a MySQL sin seleccionar la base de datos todavía
        $this->conexion = new mysqli($this->host, $this->usuario, $this->password);

        // Verificar si hay un error en la conexión
        if ($this->conexion->connect_error) {
            $this->fail("Error al conectar con MySQL: " . $this->conexion->connect_error);
        }
    }

    /**
     * Prueba que verifica si la base de datos existe o la crea si no está presente.
     */
    public function testBaseDeDatosExisteOCrear()
    {
        // Comprobar si la base de datos existe
        $sql = "SHOW DATABASES LIKE '{$this->dbname}'";
        $query = $this->conexion->query($sql);

        if ($query->num_rows <= 0) {
            // Si la base de datos no existe, intentamos crearla
            $sql = "CREATE DATABASE {$this->dbname}";
            $this->assertTrue(
                $this->conexion->query($sql),
                "Error al crear la base de datos: " . $this->conexion->error
            );
        }

        // Verificar nuevamente que la base de datos se haya creado correctamente
        $query = $this->conexion->query("SHOW DATABASES LIKE '{$this->dbname}'");
        $this->assertGreaterThan(
            0,
            $query->num_rows,
            "La base de datos no fue creada correctamente"
        );
    }

    /**
     * Prueba que verifica si la base de datos puede ser seleccionada correctamente.
     */
    public function testSeleccionarBaseDeDatos()
    {
        $this->assertTrue(
            $this->conexion->select_db($this->dbname),
            "Error al seleccionar la base de datos: " . $this->conexion->error
        );
    }
}
