document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const idProgramacion = params.get('id');
    
    // Actualizar todos los elementos del título
    document.getElementById('diaAsistencia').textContent = params.get('fecha');
    document.getElementById('horaAsistencia').textContent = params.get('hora');
    document.getElementById('actividadAsistencia').textContent = decodeURIComponent(params.get('actividad'));
    document.getElementById('grupoAsistencia').textContent = decodeURIComponent(params.get('grupo'));

    cargarNinos(idProgramacion);
    
    // Configurar botón de actualización
    document.querySelector('button').addEventListener('click', guardarAsistencias);
});

let asistenciasPorActualizar = [];

function cargarNinos(idProgramacion) {
    axios.get(`../../backend/monitor/getNinosGrupo.php?id_programacion=${idProgramacion}`)
    .then(respuesta => {
        const contenedor = document.getElementById('groupContainer');
        contenedor.innerHTML = '';
        
        respuesta.data.forEach(nino => {
            contenedor.innerHTML += `
                <div class="tarjeta">
                    <span class="nombreHijo">${nino.nombre} ${nino.apellidos}</span>
                    <div class="icons">
                        <span>¿Presente?</span>
                        <input type="checkbox" ${nino.asistio ? 'checked' : ''} 
                               data-id-hijo="${nino.id_hijo}"
                               data-id-programacion="${idProgramacion}">
                    </div>
                </div>
            `;
        });
    });
}

function guardarAsistencias() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const asistencias = [];
    
    checkboxes.forEach(checkbox => {
        asistencias.push({
            id_hijo: parseInt(checkbox.dataset.idHijo),
            id_programacion: parseInt(checkbox.dataset.idProgramacion),
            asistio: checkbox.checked ? 1 : 0
        });
    });
    
    axios.post('../../backend/monitor/updateAsistencia.php', { asistencias })
    .then(() => {
        document.getElementById('popupConfirmacion').style.display = 'flex';
    });
}

function closePopup() {
    document.getElementById('popupConfirmacion').style.display = 'none';
    // Volver al listado de actividades
    const params = new URLSearchParams(window.location.search);
    window.location.href = `../monitorActividadesDia/monitorActividadesDia.html?fecha=${params.get('fecha')}&monitor=${params.get('monitor')}`;
}