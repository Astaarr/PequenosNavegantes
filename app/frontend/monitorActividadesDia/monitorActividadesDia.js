document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const fecha = params.get('fecha');
    const idMonitor = params.get('monitor');
    
    document.getElementById('diaMes').textContent = fecha;
    cargarActividadesDia(fecha, idMonitor);
});

function cargarActividadesDia(fecha, idMonitor) {
    axios.get(`../../backend/monitor/getActividadesMonitor.php?fecha=${fecha}&id_monitor=${idMonitor}`)
    .then(respuesta => {
        const contenedor = document.getElementById('groupContainer');
        contenedor.innerHTML = '';
        
        respuesta.data.forEach(actividad => {
            contenedor.innerHTML += `
                <div class="tarjeta programacion" onclick="abrirAsistencia(${actividad.id_programacion}, '${actividad.nombre_actividad}', '${actividad.nombre_grupo}', '${actividad.hora_inicio}', '${fecha}')">
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
                </div>
            `;
        });
    });
}

function abrirAsistencia(idProgramacion, actividad, grupo, hora, fecha) {
    window.location.href = `../asistenciaHijo/asistenciaHijo.html?id=${idProgramacion}&actividad=${encodeURIComponent(actividad)}&grupo=${encodeURIComponent(grupo)}&hora=${hora}&fecha=${fecha}`;
}

