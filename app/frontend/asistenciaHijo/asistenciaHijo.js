document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    cargarNinos(params.get('id'));
    document.getElementById('diaAsistencia').textContent = params.get('fecha');
    document.getElementById('horaAsistencia').textContent = params.get('hora');
    document.getElementById('grupoAsistencia').textContent = params.get('grupo');
});

function cargarNinos(idProgramacion) {
    axios.get(`../../backend/monitor/getNinosGrupo.php?id_programacion=${idProgramacion}`)
    .then(respuesta => {
        const contenedor = document.getElementById('groupContainer');
        contenedor.innerHTML = '';
        
        respuesta.data.forEach(nino => {
            contenedor.innerHTML += `
                <div class="tarjeta">
                    <span id="nombreHijo">${nino.nombre} ${nino.apellidos}</span>
                    <div class="icons">
                        <span>¿Presente?</span>
                        <input type="checkbox" ${nino.asistio ? 'checked' : ''} 
                               onchange="actualizarAsistencia(${nino.id_hijo}, ${idProgramacion}, this.checked)">
                    </div>
                </div>
            `;
        });
    });
}

function actualizarAsistencia(idHijo, idProgramacion, estado) {
    axios.post('../../backend/monitor/updateAsistencia.php', {
        id_hijo: idHijo,
        id_programacion: idProgramacion,
        asistio: estado
    })
    .then(() => console.log('Asistencia actualizada'))
    .catch(error => console.error('Error:', error));
}