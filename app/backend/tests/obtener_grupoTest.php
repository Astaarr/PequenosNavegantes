<?php
use PHPUnit\Framework\TestCase;

class ObtenerGrupoTest extends TestCase {
    private $pdo;

    protected function setUp(): void
    {
        // Configurar un mock de la conexión PDO
        $this->pdo = $this->createMock(mysqli::class);
    }

    public function testGrupoEncontrado()
    {
        $idGrupo = 1;
        $expectedGrupo = ['id_grupo' => 1, 'nombre' => 'Grupo de prueba'];

        $stmtMock = $this->createMock(mysqli_stmt::class);
        $resultMock = $this->createMock(mysqli_result::class);

        // Configurar el mock para la consulta
        $this->pdo->expects($this->once())
            ->method('prepare')
            ->with($this->equalTo("SELECT * FROM grupo WHERE id_grupo = ?"))
            ->willReturn($stmtMock);

        $stmtMock->expects($this->once())->method('bind_param')->with("i", $idGrupo);
        $stmtMock->expects($this->once())->method('execute');
        $stmtMock->expects($this->once())->method('get_result')->willReturn($resultMock);
        
        $resultMock->expects($this->once())->method('num_rows')->willReturn(1);
        $resultMock->expects($this->once())->method('fetch_assoc')->willReturn($expectedGrupo);

        ob_start();
        include './app/backend/admin/grupos/obtener_grupo.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertTrue($response['success']);
        $this->assertEquals($expectedGrupo, $response['grupo']);
    }

    public function testGrupoNoEncontrado()
    {
        $idGrupo = 99;

        $stmtMock = $this->createMock(mysqli_stmt::class);
        $resultMock = $this->createMock(mysqli_result::class);

        $this->pdo->expects($this->once())
            ->method('prepare')
            ->with($this->equalTo("SELECT * FROM grupo WHERE id_grupo = ?"))
            ->willReturn($stmtMock);

        $stmtMock->expects($this->once())->method('bind_param')->with("i", $idGrupo);
        $stmtMock->expects($this->once())->method('execute');
        $stmtMock->expects($this->once())->method('get_result')->willReturn($resultMock);
        
        $resultMock->expects($this->once())->method('num_rows')->willReturn(0);

        ob_start();
        include './app/backend/admin/grupos/obtener_grupo.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertFalse($response['success']);
        $this->assertEquals("Grupo no encontrado.", $response['message']);
    }
}
