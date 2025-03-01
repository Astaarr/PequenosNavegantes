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
        console.log("Respuesta de la API:", respuesta.data); // Muestra la respuesta en la consola
        if (!Array.isArray(respuesta.data)) {
            throw new Error("La API no devolvió un array.");
        }
        
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
    .then(() => {
        // Mostrar el popup
        document.getElementById("popupConfirmacion").style.display = "flex";
    })
    .catch(error => console.error('Error:', error));
}

// Función para cerrar el popup y redirigir
function closePopup() {
    document.getElementById("popupConfirmacion").style.display = "none";
    window.location.href = "../monitorPrincipal/monitorPrincipal.html";
}

// Nueva función para procesar todos los checkboxes
function guardarAsistencia() {
    const checkboxes = document.querySelectorAll('input[name="asistenciaHijo"]');
    checkboxes.forEach(checkbox => {
        const idHijo = checkbox.getAttribute('data-id');
        actualizarAsistencia(idHijo, idProgramacion, checkbox.checked);
    });
}