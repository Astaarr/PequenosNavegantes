<?php
use PHPUnit\Framework\TestCase;

class ObtenerGruposTest extends TestCase {
    private $pdo;

    protected function setUp(): void
    {
        // Configurar un mock de la conexión PDO
        $this->pdo = $this->createMock(mysqli::class);
    }

    public function testSesionNoActiva()
    {
        $_SESSION = null;

        ob_start();
        include './app/backend/admin/grupos/obtener_grupos.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertFalse($response['success']);
        $this->assertEquals("No hay sesión activa.", $response['message']);
    }

    public function testConsultaExitosa()
    {
        $_SESSION = ['usuario' => 'prueba'];
        
        $expectedGrupos = [
            ['id_grupo' => 1, 'nombre' => 'Grupo A', 'nombre_monitor' => 'Monitor 1'],
            ['id_grupo' => 2, 'nombre' => 'Grupo B', 'nombre_monitor' => 'Monitor 2']
        ];

        $stmtMock = $this->createMock(mysqli_stmt::class);
        $resultMock = $this->createMock(mysqli_result::class);

        // Configurar el mock para la consulta
        $this->pdo->expects($this->once())
            ->method('query')
            ->with($this->equalTo("SELECT g.id_grupo, g.nombre, m.nombre AS nombre_monitor FROM grupo g JOIN monitor m ON g.id_monitor = m.id_monitor"))
            ->willReturn($resultMock);

        $resultMock->expects($this->once())->method('fetch_assoc')->willReturnOnConsecutiveCalls(...$expectedGrupos, null);

        ob_start();
        include 'ruta/al/archivo.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertTrue($response['success']);
        $this->assertEquals($expectedGrupos, $response['grupos']);
    }

    public function testErrorConsulta()
    {
        $_SESSION = ['usuario' => 'prueba'];

        $this->pdo->expects($this->once())
            ->method('query')
            ->willReturn(false);

        ob_start();
        include './app/backend/admin/grupos/obtener_grupos.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertFalse($response['success']);
        $this->assertStringContainsString("Error en la consulta SQL", $response['message']);
    }
}
