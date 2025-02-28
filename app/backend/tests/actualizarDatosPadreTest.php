<?php
use PHPUnit\Framework\TestCase;

require_once './app/backend/cambiarDatosPadre/actualizarDatosPadre.php';

class PadreUpdateTest extends TestCase
{
    private $pdo;

    protected function setUp(): void
    {
        // Configurar un mock de la conexión PDO
        $this->pdo = $this->createMock(mysqli::class);
    }

    public function testUsuarioNoAutenticado()
    {
        $_SESSION = [];

        ob_start();
        require_once '/app/backend/cambiarDatosPadre/actualizarDatosPadre.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertFalse($response['success']);
        $this->assertEquals("Usuario no autenticado", $response['message']);
    }

    public function testDatosNoRecibidos()
    {
        $_SESSION['id_padre'] = 1;
        
        ob_start();
        require_once '/app/backend/cambiarDatosPadre/actualizarDatosPadre.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertFalse($response['success']);
        $this->assertEquals("No se recibieron datos", $response['message']);
    }

    public function testActualizacionExitosa()
    {
        $_SESSION['id_padre'] = 1;
        
        $stmtMock = $this->createMock(mysqli_stmt::class);
        
        $this->pdo->expects($this->once())
            ->method('prepare')
            ->willReturn($stmtMock);
        
        $stmtMock->expects($this->once())->method('bind_param');
        $stmtMock->expects($this->once())->method('execute')->willReturn(true);
        
        ob_start();
        require_once '/app/backend/cambiarDatosPadre/actualizarDatosPadre.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertTrue($response['success']);
        $this->assertEquals("Datos actualizados correctamente", $response['message']);
    }

    public function testErrorActualizacion()
    {
        $_SESSION['id_padre'] = 1;
        
        $stmtMock = $this->createMock(mysqli_stmt::class);
        
        $this->pdo->expects($this->once())
            ->method('prepare')
            ->willReturn($stmtMock);
        
        $stmtMock->expects($this->once())->method('bind_param');
        $stmtMock->expects($this->once())->method('execute')->willReturn(false);
        
        ob_start();
        require_once '/app/backend/cambiarDatosPadre/actualizarDatosPadre.php';
        $output = ob_get_clean();
        
        $response = json_decode($output, true);

        $this->assertFalse($response['success']);
        $this->assertEquals("Error al actualizar los datos", $response['message']);
    }
}
