<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '../crear_tablas.php.php';


class CrearTablasTest extends TestCase {
    private $mockConexion;
    private $mockStmt;

    protected function setUp(): void {
        // Mock de la conexión a la base de datos
        $this->mockConexion = $this->createMock(mysqli::class);
        $this->mockStmt = $this->createMock(mysqli_stmt::class);

        // Simulación de la conexión a la base de datos y consultas
        $this->mockConexion->method('connect_error')->willReturn(false);
        $this->mockConexion->method('query')->willReturn($this->mockStmt);
        $this->mockConexion->method('select_db')->willReturn(true);

        // Simulación de la consulta para verificar tablas
        $this->mockStmt->method('num_rows')->willReturn(0); // Simula que las tablas no existen
        $this->mockStmt->method('execute')->willReturn(true); // Simula la creación exitosa de las tablas y la inserción de datos
    }

    public function testCrearYVerificarTablas() {
        // Incluir el archivo a probar
        ob_start();
        include './app/backend/crear_tablas.php';
        $output = ob_get_clean();

        // Verificar que no haya errores en la creación y verificación de las tablas
        $this->assertStringNotContainsString("Error", $output);
    }

    public function testInsertarDatos() {
        // Simulación de la consulta para verificar tablas
        $this->mockStmt->method('num_rows')->willReturn(1); // Simula que las tablas existen

        // Incluir el archivo a probar
        ob_start();
        include './app/backend/crear_tablas.php'; 
        $output = ob_get_clean();

        // Verificar que no haya errores en la inserción de datos
        $this->assertStringNotContainsString("Error al insertar datos", $output);
    }
}

?>
