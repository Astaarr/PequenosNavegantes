<?php
include 'conecta.php'; // Incluye la conexión a la base de datos

// Crear la base de datos si no existe
$sqlCrearDB = "CREATE DATABASE IF NOT EXISTS pequenosnavegantes";
mysqli_query($conexion, $sqlCrearDB) or die("Error al crear la base de datos 'pequenosnavegantes': " . mysqli_error($conexion));

// Seleccionar la base de datos
mysqli_select_db($conexion, "pequenosnavegantes") or die("Error al seleccionar la base de datos");


// Función para verificar si existe una tabla
function verificarTabla($conexion, $tabla)
{
    $sql = "SHOW TABLES LIKE '$tabla'";
    $query = mysqli_query($conexion, $sql);
    return mysqli_num_rows($query) > 0;
}

// Verifica y crea la tabla 'padre' 
if (!verificarTabla($conexion, 'padre')) {
    $sqlPadre = "CREATE TABLE padre (
        id_padre INT AUTO_INCREMENT PRIMARY KEY,
        DNI VARCHAR(9) UNIQUE,
        nombre VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(16),
        telefono_adicional VARCHAR(16),
        token_login VARCHAR(255),
        codigo_restablecer VARCHAR(255),
        token_restablecer VARCHAR(255)
        )";
    mysqli_query($conexion, $sqlPadre) or die("Error al crear la tabla 'padre': " . mysqli_error($conexion));

    // Encriptar contraseñas
    $passwordPadre1 = password_hash('padre123', PASSWORD_DEFAULT);
    $passwordPadre2 = password_hash('padre234', PASSWORD_DEFAULT);
    $passwordPadre3 = password_hash('padre345', PASSWORD_DEFAULT);
    $passwordPadre4 = password_hash('padre456', PASSWORD_DEFAULT);
    $passwordPadre5 = password_hash('padre567', PASSWORD_DEFAULT);
    $passwordPadre6 = password_hash('padre678', PASSWORD_DEFAULT);
    $passwordPadre7 = password_hash('padre789', PASSWORD_DEFAULT);
    $passwordPadre8 = password_hash('padre890', PASSWORD_DEFAULT);
    $passwordPadre9 = password_hash('padre901', PASSWORD_DEFAULT);
    $passwordPadre10 = password_hash('padre012', PASSWORD_DEFAULT);

    // Insertar datos en la tabla 'padre'
    $sqlPadreInsert = "INSERT INTO padre (DNI, nombre, password, email, telefono, telefono_adicional) VALUES
    ('12345678A', 'Daniel Clavel', '$passwordPadre1', 'daniel@gmail.com', '600123451', '600123452'),
    ('23456789B', 'Adri Arcones', '$passwordPadre2', 'adri@gmail.com', '611987651', '611987652'),
    ('34567890C', 'Lucia Fernandez', '$passwordPadre3', 'lucia@gmail.com', '622345671', '622345672'),
    ('45678901D', 'Carlos Ramirez', '$passwordPadre4', 'carlos@gmail.com', '633456781', '633456782'),
    ('56789012E', 'Laura Sanchez', '$passwordPadre5', 'laura@gmail.com', '644567891', '644567892'),
    ('67890123F', 'David Torres', '$passwordPadre6', 'david@gmail.com', '655678901', '655678902'),
    ('78901234G', 'Sofia Martinez', '$passwordPadre7', 'sofia@gmail.com', '666789011', '666789012'),
    ('89012345H', 'Antonio Ruiz', '$passwordPadre8', 'antonio@gmail.com', '677890121', '677890122'),
    ('90123456I', 'Elena Gutierrez', '$passwordPadre9', 'elena@gmail.com', '688901231', '688901232'),
    ('01234567J', 'Miguel Gomez', '$passwordPadre10', 'miguel@gmail.com', '699012341', '699012342')";
    mysqli_query($conexion, $sqlPadreInsert) or die("Error al insertar datos en 'padre': " . mysqli_error($conexion));
}

// Verifica y crea la tabla de 'tutor_adicional'

if (!verificarTabla($conexion, 'tutor_adicional')) {
    $sqlTutorAdicional = "CREATE TABLE tutor_adicional (
        id_tutor INT AUTO_INCREMENT PRIMARY KEY,
        DNI VARCHAR (9) UNIQUE,
        nombre VARCHAR(100),
        telefono_autorizado VARCHAR(16),
        id_padre INT,
        FOREIGN KEY (id_padre) REFERENCES padre(id_padre) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlTutorAdicional) or die("Error al crear la tabla 'tutor_adicional': " . mysqli_error($conexion));

    $sqlTutorAdicionalInsert = "INSERT INTO tutor_adicional (DNI, nombre, telefono_autorizado, id_padre) VALUES
        ('34567890C', 'Juan Perez', '622345678', 1),
        ('45678901D', 'Maria Garcia', '633456789', 2)";
    mysqli_query($conexion, $sqlTutorAdicionalInsert) or die("Error al insertar datos en 'tutor_adicional': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'solicitud_monitor'
if (!verificarTabla($conexion, 'solicitud_monitor')) {
    $sqlSolicitudMonitor = "CREATE TABLE solicitud_monitor (
        id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(16) NOT NULL,
        curriculum TEXT NOT NULL
    )";
    mysqli_query($conexion, $sqlSolicitudMonitor) or die("Error al crear la tabla 'solicitud_monitor': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'solicitud_monitor'
    $sqlSolicitudMonitorInsert = "INSERT INTO solicitud_monitor (nombre, apellidos, email, telefono, curriculum) VALUES
        ('Carlos', 'Gómez Pérez', 'carlos.gomez@example.com', '644123456', 'uploads/curriculums/cv_carlos_gomez.pdf'),
        ('Laura', 'Martínez Sánchez', 'laura.martinez@example.com', '655987654', 'uploads/curriculums/cv_laura_martinez.pdf')";
    mysqli_query($conexion, $sqlSolicitudMonitorInsert) or die("Error al insertar datos en 'solicitud_monitor': " . mysqli_error($conexion));
}


// Verifica y crea tabla 'monitor
if (!verificarTabla($conexion, 'monitor')) {
    $sqlMonitor = "CREATE TABLE monitor (
        id_monitor INT AUTO_INCREMENT PRIMARY KEY,
        DNI VARCHAR(9) UNIQUE,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(16) NOT NULL,
        curriculum TEXT NOT NULL
        )";
    mysqli_query($conexion, $sqlMonitor) or die("Error al crear la tabla 'monitor': " . mysqli_error($conexion));

    // Encriptar contraseñas
    $passwordMonitor1 = password_hash('monitor123', PASSWORD_DEFAULT);
    $passwordMonitor2 = password_hash('monitor456', PASSWORD_DEFAULT);
    $passwordMonitor3 = password_hash('monitor456', PASSWORD_DEFAULT);
    $passwordMonitor4 = password_hash('monitor456', PASSWORD_DEFAULT);
    $passwordMonitor5 = password_hash('monitor456', PASSWORD_DEFAULT);


    // Insertar datos en la tabla 'monitor'
    $sqlMonitorInsert = "INSERT INTO monitor (DNI, nombre, apellidos, password, email, telefono, curriculum) VALUES
        ('34567890C', 'Juan', 'Perez', '$passwordMonitor1', 'monitor1@gmail.com', '622345678', 'uploads/curriculums/cv_juan_perez.pdf'),
        ('45678901D', 'Maria', 'Garcia', '$passwordMonitor2', 'maria.gomez@example.com', '633456789', 'uploads/curriculums/cv_maria_garcia.pdf'),
        ('56789012E', 'Carlos', 'Ramirez', '$passwordMonitor3', 'carlos.ramirez@example.com', '644567890', 'uploads/curriculums/cv_carlos_ramirez.pdf'),
        ('67890123F', 'Laura', 'Fernandez', '$passwordMonitor4', 'laura.fernandez@example.com', '655678901', 'uploads/curriculums/cv_laura_fernandez.pdf'),
        ('78901234G', 'David', 'Lopez', '$passwordMonitor5', 'david.lopez@example.com', '666789012', 'uploads/curriculums/cv_david_lopez.pdf')";

    mysqli_query($conexion, $sqlMonitorInsert) or die("Error al insertar datos en 'monitor': " . mysqli_error($conexion));
}
// Verifica y crea la tabla 'grupo'
if (!verificarTabla($conexion, 'grupo')) {
    $sqlGrupo = "CREATE TABLE grupo (
        id_grupo INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        id_monitor INT,
        FOREIGN KEY (id_monitor) REFERENCES monitor(id_monitor) ON DELETE SET NULL
        )";
    mysqli_query($conexion, $sqlGrupo) or die("Error al crear la tabla 'grupo': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'grupo'
    $sqlGrupoInsert = "INSERT INTO grupo (nombre, id_monitor) VALUES
        ('Grupo 1', 1),
        ('Grupo 2', 2),
        ('Grupo 3', 3),
        ('Grupo 4', 4),
        ('Grupo 5', 5)";
    mysqli_query($conexion, $sqlGrupoInsert) or die("Error al insertar datos en 'grupo': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'actividad'
if (!verificarTabla($conexion, 'actividad')) {
    $sqlActividad = "CREATE TABLE actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL
    )";
    mysqli_query($conexion, $sqlActividad) or die("Error al crear la tabla 'actividad': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'actividad'
    $sqlActividadInsert = "INSERT INTO actividad (nombre, descripcion) VALUES
        ('Atrapa la bandera', 'Hay dos equipos, y cada uno tiene una bandera en su base. El objetivo es correr hasta la base del equipo contrario, coger su bandera y llevarla de vuelta a la propia base sin que te atrapen. Si un jugador entra en el territorio enemigo y lo tocan, queda “congelado” y debe quedarse quieto hasta que un compañero lo libere tocándolo. El equipo que primero lleve la bandera contraria a su base, gana. Así que piensa bien tu estrategia, corre rápido y trabaja en equipo.'),
        ('Decorar las espadas', 'Este juego consiste en diseñar y decorar espadas de cartón utilizando diferentes materiales artísticos. Cada niño recibe una espada en blanco y una variedad de materiales como pinturas, pegatinas, purpurina, cintas de colores y papel decorativo. El objetivo es personalizar su espada, utilizando la imaginación y de la manera mas original.'),
        ('Barcos de papel', 'Los niños crean barcos de cartulina. Luego, los decoran con pinturas, pegatinas o banderas para personalizarlos. Finalmente, los prueban en el agua.'),
        ('Lanzar las anillas', 'Este juego consiste en lanzar anillas e intentar encajarlas en los conos que están colocados a cierta distancia. Sin embargo, hay un reto adicional: llevar un parche en un ojo, lo que hace que la percepción de profundidad sea más difícil y añade un nivel extra de dificultad.'),
        ('Encajar las llaves', 'Los niños tienen varias llaves recortadas en papel y deben encontrar la silueta correcta donde encajarlas. Cada llave tiene una forma única, por lo que deben observar bien los contornos y probar hasta encontrar la coincidencia exacta.')";
    mysqli_query($conexion, $sqlActividadInsert) or die("Error al insertar datos en 'actividad': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'hijo'
if (!verificarTabla($conexion, 'hijo')) {
    $sqlHijo = "CREATE TABLE hijo (
        id_hijo INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        medicacion TEXT,
        alergias TEXT,
        datos_adicionales TEXT,
        id_padre INT NOT NULL,
        id_grupo INT, 
        FOREIGN KEY (id_padre) REFERENCES padre(id_padre) ON DELETE CASCADE,
        FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE SET NULL
        )";
    mysqli_query($conexion, $sqlHijo) or die("Error al crear la tabla 'hijo': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'hijo'
    $sqlHijoInsert = "INSERT INTO hijo ( nombre, apellidos, fecha_nacimiento, medicacion, alergias, datos_adicionales, id_padre, id_grupo) VALUES
    ('Daniel', 'Clavel Vega', '2015-11-15', 'Ninguna', 'Ninguna', 'Ninguna', 1, 1),
    ('Adri', 'Arcones', '2018-04-23', 'Ninguna', 'Ninguna', 'Ninguna', 2, 1),
    ('Lucia', 'Fernandez', '2017-07-05', 'Ninguna', 'Ninguna', 'Ninguna', 3, 1),
    ('Carlos', 'Ramirez', '2016-02-14', 'Ninguna', 'Ninguna', 'Ninguna', 4, 1),
    ('Laura', 'Sanchez', '2015-09-10', 'Ninguna', 'Ninguna', 'Ninguna', 5, 1),
    ('David', 'Torres', '2017-06-12', 'Ninguna', 'Ninguna', 'Ninguna', 6, 1),
    ('Sofia', 'Martinez', '2018-10-01', 'Ninguna', 'Ninguna', 'Ninguna', 7, 1),
    ('Antonio', 'Ruiz', '2016-03-22', 'Ninguna', 'Ninguna', 'Ninguna', 8, 1),
    ('Elena', 'Gutierrez', '2015-12-30', 'Ninguna', 'Ninguna', 'Ninguna', 9, 1),
    ('Miguel', 'Gomez', '2017-08-19', 'Ninguna', 'Ninguna', 'Ninguna', 10, 1),

    ('Julia', 'Perez', '2016-01-20', 'Ninguna', 'Polen', 'Ninguna', 1, 2),
    ('Diego', 'Lopez', '2018-03-15', 'Ibuprofeno', 'Ninguna', 'Ninguna', 2, 2),
    ('Carmen', 'Gomez', '2017-05-30', 'Ninguna', 'Lácteos', 'Ninguna', 3, 2),
    ('Jose', 'Fernandez', '2016-04-12', 'Ninguna', 'Ninguna', 'Ninguna', 4, 2),
    ('Raul', 'Gutierrez', '2018-09-18', 'Paracetamol', 'Ninguna', 'Ninguna', 5, 2),

    ('Ana', 'Ruiz', '2015-07-21', 'Ninguna', 'Nueces', 'Ninguna', 6, 3),
    ('Victor', 'Martinez', '2016-08-05', 'Ninguna', 'Ninguna', 'Ninguna', 7, 3),
    ('Isabel', 'Ramirez', '2017-02-10', 'Ninguna', 'Mariscos', 'Ninguna', 8, 3),
    ('Pedro', 'Torres', '2016-11-01', 'Ibuprofeno', 'Ninguna', 'Ninguna', 9, 3),
    ('Clara', 'Sanchez', '2018-01-14', 'Ninguna', 'Huevo', 'Ninguna', 10, 3),

    ('Jorge', 'Lopez', '2015-05-25', 'Ninguna', 'Ninguna', 'Ninguna', 1, 4),
    ('Sergio', 'Gomez', '2018-06-18', 'Ninguna', 'Ninguna', 'Ninguna', 2, 4),
    ('Paula', 'Fernandez', '2017-03-09', 'Ibuprofeno', 'Ninguna', 'Ninguna', 3, 4),
    ('Beatriz', 'Perez', '2016-10-28', 'Ninguna', 'Polvo', 'Ninguna', 4, 4),
    ('Ruben', 'Martinez', '2018-02-12', 'Ninguna', 'Picaduras', 'Ninguna', 5, 4),

    ('Monica', 'Gutierrez', '2015-12-02', 'Paracetamol', 'Ninguna', 'Ninguna', 6, 5),
    ('Mario', 'Ramirez', '2016-09-14', 'Ninguna', 'Huevo', 'Ninguna', 7, 5),
    ('Pablo', 'Sanchez', '2017-01-07', 'Ninguna', 'Ninguna', 'Ninguna', 8, 5),
    ('Natalia', 'Torres', '2018-07-23', 'Ibuprofeno', 'Ninguna', 'Ninguna', 9, 5),
    ('Andres', 'Lopez', '2015-04-05', 'Ninguna', 'Ninguna', 'Ninguna', 10, 5),

    ('Samuel', 'Rodríguez Pérez', '2017-05-15', 'Ninguna', 'Ninguna', 'Ninguna', 1, NULL),
    ('Valeria', 'González López', '2019-08-20', 'Ninguna', 'Ninguna', 'Ninguna', 1, NULL)";
    mysqli_query($conexion, $sqlHijoInsert) or die("Error al insertar datos en 'hijo': " . mysqli_error($conexion));
}


// Verifica y crea la tabla 'programacion_actividad'
if (!verificarTabla($conexion, 'programacion_actividad')) {
    $sqlProgramacionActividad = "CREATE TABLE programacion_actividad (
        id_programacion INT AUTO_INCREMENT PRIMARY KEY,
        id_actividad INT,
        id_grupo INT,
        fecha DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        duracion INT NOT NULL,
        lugar VARCHAR(255) NOT NULL,
        FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE CASCADE,
        FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE
    )";
    mysqli_query($conexion, $sqlProgramacionActividad) or die("Error al crear la tabla 'programacion_actividad': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'programacion_actividad'
    $sqlProgramacionActividadInsert = "INSERT INTO programacion_actividad (id_actividad, id_grupo, fecha, hora_inicio, duracion, lugar) VALUES
        (1, 1, '2025-03-01', '10:00:00', 120, 'Patio'),
        (2, 2, '2025-03-01', '10:00:00', 120, 'Patio')";
    mysqli_query($conexion, $sqlProgramacionActividadInsert) or die("Error al insertar datos en 'programacion_actividad': " . mysqli_error($conexion));
}


// Verifica y crea la tabla 'asistencia'
if (!verificarTabla($conexion, 'asistencia')) {
    $sqlAsistencia = "CREATE TABLE asistencia (
        id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
        asistio BOOLEAN NOT NULL,
        id_hijo INT NOT NULL,
        id_programacion INT NOT NULL, 
        FOREIGN KEY (id_hijo) REFERENCES hijo(id_hijo) ON DELETE CASCADE,
        FOREIGN KEY (id_programacion) REFERENCES programacion_actividad(id_programacion) ON DELETE CASCADE,
        UNIQUE (id_hijo, id_programacion) -- Restricción para evitar duplicados
    )";
    mysqli_query($conexion, $sqlAsistencia) or die("Error al crear la tabla 'asistencia': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'asistencia'
    $sqlAsistenciaInsert = "INSERT INTO asistencia (asistio, id_hijo, id_programacion) VALUES
        (1, 1, 1),
        (1, 2, 1),
        (1, 3, 1),
        (0, 4, 1),
        (1, 5, 1),
        (0, 6, 1),
        (1, 7, 2)";
    mysqli_query($conexion, $sqlAsistenciaInsert) or die("Error al insertar datos en 'asistencia': " . mysqli_error($conexion));
}


// Verifica y crea la tabla 'campamento'
if (!verificarTabla($conexion, 'campamento')) {
    $sqlCampamento = "CREATE TABLE campamento (
        id_campamento INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        precio DECIMAL(6,2) NOT NULL,
        id_programacion INT NOT NULL,
        municipio TEXT,
        direccion TEXT,
        codigo_postal VARCHAR(5),
        FOREIGN KEY (id_programacion) REFERENCES programacion_actividad(id_programacion) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlCampamento) or die("Error al crear la tabla 'campamento': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'campamento'
    $sqlCampamentoInsert = "INSERT INTO campamento (nombre, fecha_inicio, fecha_fin, precio, id_programacion, municipio, direccion, codigo_postal) VALUES
        ('Campamento 1', '2021-07-01', '2021-07-15', 200.00, 1, 'Madrid', 'Calle Mayor 1', '28001'),
        ('Campamento 2', '2021-08-01', '2021-08-15', 200.00, 2, 'Madrid', 'Calle Mayor 2', '28002')";
    mysqli_query($conexion, $sqlCampamentoInsert) or die("Error al insertar datos en 'campamento': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'inscripcion'
if (!verificarTabla($conexion, 'inscripcion')) {
    $sqlInscripcion = "CREATE TABLE inscripcion (
        id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
        fecha_inscripcion DATE NOT NULL,
        numero_dias INT,
        precio DECIMAL(6,2),
        fecha_json TEXT,
        plan ENUM('Basico', 'Intermedio', 'Avanzado') NOT NULL DEFAULT 'Basico',
        id_hijo INT NOT NULL,
        id_campamento INT,
        estado_pago ENUM('Pendiente', 'Pagado', 'No Pagado') NOT NULL DEFAULT 'Pendiente',
        FOREIGN KEY (id_hijo) REFERENCES hijo(id_hijo) ON DELETE CASCADE,
        FOREIGN KEY (id_campamento) REFERENCES campamento(id_campamento) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlInscripcion) or die("Error al crear la tabla 'inscripcion': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'inscripcion'
    $sqlInscripcionInsert = "INSERT INTO inscripcion (fecha_inscripcion, numero_dias, precio, fecha_json, id_hijo, id_campamento) VALUES
        ('2021-07-12', 8, 20 , 'prueba1', 1, 1),
        ('2022-01-21', 7, 18 , 'prueba2', 2, 2)";
    mysqli_query($conexion, $sqlInscripcionInsert) or die("Error al insertar datos en 'inscripcion': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'admin'
if (!verificarTabla($conexion, 'admin')) {
    $sqlAdmin = "CREATE TABLE admin (
        id_admin INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL
        )";
    mysqli_query($conexion, $sqlAdmin) or die("Error al crear la tabla 'admin': " . mysqli_error($conexion));

    // Encriptar contraseñas
    $passwordAdmin1 = password_hash('admin123', PASSWORD_DEFAULT);
    $passwordAdmin2 = password_hash('admin456', PASSWORD_DEFAULT);
    // Insertar datos en la tabla 'admin'
    $sqlAdminInsert = "INSERT INTO admin (email, password) VALUES
        ('admin1@gmail.com', '$passwordAdmin1'),
        ('admin2@gmail.com', '$passwordAdmin2')";
    mysqli_query($conexion, $sqlAdminInsert) or die("Error al insertar datos en 'admin': " . mysqli_error($conexion));
}


// Tabla 'comunicacion' para gestionar mensajes entre padres y administración
if (!verificarTabla($conexion, 'comunicacion')) {
    $sqlComunicacion = "CREATE TABLE comunicacion (
        id_comunicacion INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        asunto VARCHAR(100) NOT NULL,
        mensaje TEXT NOT NULL,
        id_padre INT NOT NULL,
        id_hijo INT NOT  NULL,
        id_monitor INT NOT NULL,
        FOREIGN KEY (id_padre) REFERENCES padre(id_padre) ON DELETE CASCADE,
        FOREIGN KEY (id_hijo) REFERENCES hijo(id_hijo) ON DELETE CASCADE,
        FOREIGN KEY (id_monitor) REFERENCES monitor(id_monitor) ON DELETE CASCADE
    )";
    mysqli_query($conexion, $sqlComunicacion) or die("Error al crear la tabla 'comunicacion': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'comunicacion'
    $sqlComunicacionInsert = "INSERT INTO comunicacion (fecha, asunto, mensaje, id_padre, id_hijo, id_monitor) VALUES
        ('2021-06-01', 'Asunto 1', 'Mensaje de la comunicación 1', 1, 1, 1),
        ('2021-06-01', 'Asunto 2', 'Mensaje de la comunicación 2', 2, 2, 2)";
    mysqli_multi_query($conexion, $sqlComunicacionInsert) or die("Error al insertar datos en 'comunicacion': " . mysqli_error($conexion));
}
