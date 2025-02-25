<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '../conecta.php';


class ConexionTest extends TestCase {
    private $mockConexion;
    private $mockStmt;

    protected function setUp(): void
    {
        // Mock de la conexión a la base de datos
        $this->mockConexion = $this->createMock(mysqli::class);
        $this->mockStmt = $this->createMock(mysqli_stmt::class);

        // Simulación de la conexión a la base de datos
        $this->mockConexion->method('connect_error')->willReturn(false);
        $this->mockConexion->method('query')->willReturn($this->mockStmt);

        // Simulación de la consulta
        $this->mockStmt->method('num_rows')->willReturn(0); // Simula que la base de datos no existe
        $this->mockStmt->method('execute')->willReturn(true); // Simula la creación exitosa de la base de datos
    }

    public function testConexionBaseDatos()
    {
        // Incluir el archivo a probar
        ob_start();
        include './app/backend/conecta.php';
        $output = ob_get_clean();

        // Verificar el resultado
        $this->assertStringContainsString("Error al conectar con la base de datos", $output);
    }

    public function testCrearBaseDatos()
    {
        // Simula que la base de datos no existe
        $this->mockStmt->method('num_rows')->willReturn(0);

        // Incluir el archivo a probar
        ob_start();
        include './app/backend/conecta.php';
        $output = ob_get_clean();

        // Verificar que la base de datos se haya creado correctamente
        $this->assertStringNotContainsString("Error al crear la base de datos", $output);
    }

    public function testSeleccionarBaseDatos()
    {
        // Simula que la base de datos existe
        $this->mockStmt->method('num_rows')->willReturn(1);

        // Incluir el archivo a probar
        ob_start();
        include './app/backend/conecta.php';
        $output = ob_get_clean();

        // Verificar que se seleccionó la base de datos correctamente
        $this->assertStringNotContainsString("Error al seleccionar la base de datos", $output);
    }
}
