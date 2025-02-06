<?php
include 'conecta.php'; // Incluye la conexión a la base de datos

// Crear la base de datos si no existe
$sqlCrearDB = "CREATE DATABASE IF NOT EXISTS pequenosnavegantes";
mysqli_query($conexion, $sqlCrearDB) or die("Error al crear la base de datos 'pequenosnavegantes': " . mysqli_error($conexion));

// Seleccionar la base de datos
mysqli_select_db($conexion, "pequenosnavegantes") or die("Error al seleccionar la base de datos");


// Función para verificar si existe una tabla
function verificarTabla($conexion, $tabla) {
    $sql = "SHOW TABLES LIKE '$tabla'";
    $query = mysqli_query($conexion, $sql);
    return mysqli_num_rows($query) > 0;
}

// Verifica y crea la tabla 'padre' 
if (!verificarTabla($conexion, 'padre')){
    $sqlPadre = "CREATE TABLE padre (
        id_padre INT AUTO_INCREMENT PRIMARY KEY,
        DNI VARCHAR(9) UNIQUE,
        nombre VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(16),
        token_login VARCHAR(255),
        codigo_restablecer VARCHAR(255),
        token_restablecer VARCHAR(255)
        )";
    mysqli_query($conexion, $sqlPadre) or die("Error al crear la tabla 'padre': " . mysqli_error($conexion));

    // Encriptar contraseñas
    $passwordPadre1 = password_hash('padre123', PASSWORD_DEFAULT);
    $passwordPadre2 = password_hash('padre456', PASSWORD_DEFAULT);

    // Insertar datos en la tabla 'padre'
    $sqlPadreInsert = "INSERT INTO padre (DNI, nombre, password, email, telefono) VALUES
        ('12345678A', 'Daniel Clavel', '$passwordPadre1', 'ejemplo@gmail.com', '600123456'),
        ('23456789B', 'Adri Arcones', '$passwordPadre2', 'ejemplo2@gmail.com', '611987654')";
    mysqli_query($conexion, $sqlPadreInsert) or die("Error al insertar datos en 'padre': " . mysqli_error($conexion));
}

// Verifica y crea tabla 'monitor
if(!verificarTabla($conexion, 'monitor')){
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

    // Insertar datos en la tabla 'monitor'
    $sqlMonitorInsert = "INSERT INTO monitor (DNI, nombre, apellidos, password, email, telefono, curriculum) VALUES
        ('34567890C', 'Juan', 'Perez', '$passwordMonitor1', 'juan.perez@example.com', '622345678', 'uploads/curriculums/cv_juan_perez.pdf'),
        ('45678901D', 'Maria', 'Garcia', '$passwordMonitor2', 'maria.gomez@example.com', '633456789', 'uploads/curriculums/cv_maria_garcia.pdf')";
    mysqli_query($conexion, $sqlMonitorInsert) or die("Error al insertar datos en 'monitor': " . mysqli_error($conexion));
}
// Verifica y crea la tabla 'grupo'
if(!verificarTabla($conexion, 'grupo')){
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
        ('Grupo 2', 2)";
    mysqli_query($conexion, $sqlGrupoInsert) or die("Error al insertar datos en 'grupo': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'actividad'
if(!verificarTabla($conexion,'actividad')){
    $sqlActividad = "CREATE TABLE actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL
    )";
    mysqli_query($conexion, $sqlActividad) or die("Error al crear la tabla 'actividad': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'actividad'
    $sqlActividadInsert = "INSERT INTO actividad (nombre, descripcion) VALUES
        ('Actividad 1', 'Descripcion de la actividad 1'),
        ('Actividad 2', 'Descripcion de la actividad 2')";
    mysqli_query($conexion, $sqlActividadInsert) or die("Error al insertar datos en 'actividad': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'hijo'
if (!verificarTabla($conexion, 'hijo')){
    $sqlHijo = "CREATE TABLE hijo (
        id_hijo INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        medicacion TEXT,
        alergias TEXT,
        datos_adicionales TEXT,
        id_padre INT NOT NULL,
        id_grupo INT NOT NULL, 
        FOREIGN KEY (id_padre) REFERENCES padre(id_padre) ON DELETE CASCADE,
        FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlHijo) or die("Error al crear la tabla 'hijo': " . mysqli_error($conexion));
    
    // Insertar datos en la tabla 'hijo'
    $sqlHijoInsert = "INSERT INTO hijo ( nombre, apellidos, fecha_nacimiento, medicacion, alergias, datos_adicionales, id_padre, id_grupo) VALUES
        ('Daniel', 'Clavel Vega', '2015-11-15', 'Ninguna', 'Ninguna', 'Ninguna', 1, 1),
        ('Adri', 'Arcones', '2018-04-23', 'Ninguna', 'Ninguna', 'Ninguna', 2,1 )";
    mysqli_query($conexion, $sqlHijoInsert) or die("Error al insertar datos en 'hijo': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'asistencia'
if(!verificarTabla($conexion, 'asistencia')){
    $sqlAsistencia = "CREATE TABLE asistencia (
        id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        asistio BOOLEAN NOT NULL,
        id_hijo INT NOT NULL,
        id_grupo INT NOT NULL, 
        FOREIGN KEY (id_hijo) REFERENCES hijo(id_hijo) ON DELETE CASCADE,
        FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlAsistencia) or die("Error al crear la tabla 'asistencia': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'asistencia'
    $sqlAsistenciaInsert = "INSERT INTO asistencia (fecha, asistio, id_hijo, id_grupo) VALUES
        ('2021-06-01', 1, 1, 1),
        ('2021-06-01', 1, 2, 1)";
    mysqli_query($conexion, $sqlAsistenciaInsert) or die("Error al insertar datos en 'asistencia': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'programacion_actividad'
if(!verificarTabla($conexion, 'programacion_actividad')){
    $sqlProgramacionActividad = "CREATE TABLE programacion_actividad (
        id_programacion INT AUTO_INCREMENT PRIMARY KEY,
        id_actividad INT,
        id_grupo INT,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        lugar VARCHAR(255) NOT NULL,
        FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo) ON DELETE CASCADE,
        FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlProgramacionActividad) or die("Error al crear la tabla 'programacion_actividad': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'programacion_actividad'
    $sqlProgramacionActividadInsert = "INSERT INTO programacion_actividad (id_actividad, id_grupo, hora_inicio, hora_fin, lugar) VALUES
        (1, 1, '10:00:00', '12:00:00', 'Patio'),
        (2, 2, '10:00:00', '12:00:00', 'Patio')";
    mysqli_query($conexion, $sqlProgramacionActividadInsert) or die("Error al insertar datos en 'programacion_actividad': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'campamento'
if(!verificarTabla($conexion, 'campamento')){
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
if(!verificarTabla($conexion, 'inscripcion')){
    $sqlInscripcion = "CREATE TABLE inscripcion (
        id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
        fecha_inscripcion DATE NOT NULL,
        id_hijo INT NOT NULL,
        id_campamento INT NOT NULL,
        estado_pago ENUM('Pendiente', 'Pagado', 'No Pagado') NOT NULL DEFAULT 'Pendiente',
        FOREIGN KEY (id_hijo) REFERENCES hijo(id_hijo) ON DELETE CASCADE,
        FOREIGN KEY (id_campamento) REFERENCES campamento(id_campamento) ON DELETE CASCADE
        )";
    mysqli_query($conexion, $sqlInscripcion) or die("Error al crear la tabla 'inscripcion': " . mysqli_error($conexion));

    // Insertar datos en la tabla 'inscripcion'
    $sqlInscripcionInsert = "INSERT INTO inscripcion (fecha_inscripcion, id_hijo, id_campamento) VALUES
        ('2021-06-01', 1, 1),
        ('2021-06-01', 2, 2)";
    mysqli_query($conexion, $sqlInscripcionInsert) or die("Error al insertar datos en 'inscripcion': " . mysqli_error($conexion));
}

// Verifica y crea la tabla 'admin'
if(!verificarTabla($conexion, 'admin')){
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
if (!verificarTabla($conexion, 'comunicacion')){
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
