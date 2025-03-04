document.addEventListener("DOMContentLoaded", function () {
    axios.get('../../backend/authMonitor.php', { withCredentials: true })
    .then(response => {
        if (!response.data.auth) {
            window.location.href = "../loginMonitor/loginMonitor.html";
        }
    })
    .catch(error => {
        console.error("Error verificando sesión:", error);
        // En caso de error, redirige también para evitar accesos no deseados
        window.location.href = "../loginMonitor/loginMonitor.html";
    });
    // Obtener la fecha desde la URL
    const params = new URLSearchParams(window.location.search);
    const fecha = params.get('fecha');

    if (!fecha) {
        console.error("❌ No se recibió ninguna fecha.");
        document.getElementById('groupContainer').innerHTML = "<p>Error: No se ha seleccionado ninguna fecha.</p>";
        return;
    }

    console.log(`📅 Cargando actividades para la fecha: ${fecha}`);
    
    // Mostrar la fecha en la interfaz
    document.getElementById('diaMes').textContent = fecha;

    // Llamar al backend para obtener detalles de la actividad
    cargarActividadesDia(fecha);
});

function cargarActividadesDia(fecha) {
    axios.post("../../backend/monitor/getActividadesMonitor.php", { fecha }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(respuesta => {
        const contenedor = document.getElementById('groupContainer');
        contenedor.innerHTML = '';

        if (respuesta.data.success && respuesta.data.actividades.length > 0) {
            respuesta.data.actividades.forEach(actividad => {
                const tarjeta = document.createElement('div');
                tarjeta.classList.add('tarjeta', 'programacion');
                tarjeta.onclick = () => abrirAsistencia(
                    actividad.id_programacion,
                    actividad.nombre_actividad,
                    actividad.nombre_grupo,
                    actividad.hora_inicio,
                    fecha
                );

                tarjeta.innerHTML = `
                    <div class="campo">
                        <i class="fa-solid fa-clock"></i>
                        <div class="hora">${actividad.hora_inicio}</div>
                    </div>
                    <div class="campo moreInfo">
                        <div class="actividad">${actividad.nombre_actividad}</div>
                        <div class="grupo">${actividad.nombre_grupo}</div>
                    </div>
                    <div class="campo moreInfo">
                        <div class="duracion">${actividad.duracion} mins</div>
                        <div class="lugar">${actividad.lugar}</div>
                    </div>
                `;

                contenedor.appendChild(tarjeta);
            });
        } else {
            contenedor.innerHTML = "<p>No hay actividades programadas para este día.</p>";
        }
    })
    .catch(error => {
        console.error("❌ Error cargando actividades:", error);
    });
}



function abrirAsistencia() {
    console.log("📌 Redirigiendo a asistencia...");
    window.location.href = "../asistenciaHijo/asistenciaHijo.html";
}
