document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const fecha = params.get('fecha');

    document.getElementById('diaMes').textContent = fecha;

    // Obtener el ID del monitor desde la sesión y luego cargar las actividades
    axios.post("../../backend/monitor/nombreMonitor.php", {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (response.data.success) {
            cargarActividadesDia(fecha);
        } else {
            console.error("No se pudo obtener el ID del monitor.");
        }
    })
    .catch(error => {
        console.error("Error verificando sesión del monitor:", error);
    });
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
                        <div class="lugar">${actividad.ubicacion}</div>
                    </div>
                `;

                contenedor.appendChild(tarjeta);
            });
        } else {
            contenedor.innerHTML = "<p>No hay actividades programadas para este día.</p>";
        }
    })
    .catch(error => {
        console.error("Error cargando actividades:", error);
    });
}

function abrirAsistencia(idProgramacion, actividad, grupo, hora, fecha) {
    window.location.href = `../monitorActividadesDia/monitorActividadesDia.html?fecha=${fecha}`;
}
