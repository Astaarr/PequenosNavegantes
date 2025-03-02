<?php

use PHPUnit\Framework\TestCase;

class crear_tablasTest extends TestCase
{
    private $pdo;

    /**
     * Configuración inicial antes de ejecutar cada test.
     * Se establece la conexión a la base de datos utilizando PDO.
     */
    protected function setUp(): void
    {
        try {
            // Conectar a la base de datos usando PDO
            $this->pdo = new PDO('mysql:host=localhost;dbname=pequenosnavegantes', 'root', '');
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // Si la conexión falla, marcar el test como fallido
            $this->fail("Error al conectar con la base de datos: " . $e->getMessage());
        }
    }

    /**
     * Prueba que verifica si la conexión con la base de datos se ha establecido correctamente.
     */
    public function testConexionEsExitosa()
    {
        $this->assertNotNull($this->pdo, "La conexión a la base de datos no se ha establecido correctamente.");
    }

    /**
     * Prueba que verifica la inserción y recuperación de un usuario en la tabla "usuarios".
     * 1. Se crea la tabla "usuarios" si no existe.
     * 2. Se inserta un usuario de prueba.
     * 3. Se consulta la base de datos para recuperar al usuario insertado.
     * 4. Se verifica que el usuario recuperado coincide con el esperado.
     */
    public function testInsertarYRecuperarUsuario()
    {
        // 1️ Crear la tabla "usuarios" si no existe
        $this->pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL
        )");

        // 2️ Insertar un usuario en la base de datos
        $stmt = $this->pdo->prepare("INSERT INTO usuarios (nombre) VALUES (:nombre)");
        $stmt->execute(['nombre' => 'Juan']);

        // 3️ Recuperar el usuario insertado
        $stmt = $this->pdo->query("SELECT nombre FROM usuarios WHERE nombre = 'Juan'");
        $usuario = $stmt->fetchColumn();

        // 4️ Verificar que el usuario recuperado es "Juan"
        $this->assertEquals('Juan', $usuario, "El usuario no se recuperó correctamente de la base de datos.");
    }
}
