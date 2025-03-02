document.addEventListener("DOMContentLoaded", function() {
    // Llamamos al backend sin pasar parámetros en la URL
    axios.post("../../backend/monitor/getNinosGrupo.php", {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    })
    .then(respuesta => {
        console.log("📌 Respuesta del backend:", respuesta.data);

        if (!respuesta.data.success) {
            throw new Error("❌ No se pudo obtener la información de asistencia.");
        }

        // Insertar los datos en la vista
        document.getElementById('diaAsistencia').textContent = respuesta.data.fecha || "Fecha no disponible";
        document.getElementById('horaAsistencia').textContent = respuesta.data.hora || "Hora no disponible";
        document.getElementById('actividadAsistencia').textContent = respuesta.data.actividad || "Actividad no especificada";
        document.getElementById('grupoAsistencia').textContent = respuesta.data.nombre_grupo || "Grupo no especificado";

        const contenedor = document.getElementById("groupContainer");
        contenedor.innerHTML = ''; // Limpiar antes de agregar

        respuesta.data.ninos.forEach(nino => {
            contenedor.innerHTML += `
                <div class="tarjeta">
                    <span id="nombreHijo">${nino.nombre} ${nino.apellidos}</span>
                    <div class="icons">
                        <span>¿Presente?</span>
                        <input type="checkbox" name="asistenciaHijo" data-id="${nino.id_hijo}"
                               ${nino.asistio ? 'checked' : ''} 
                               onchange="actualizarAsistencia(${nino.id_hijo}, this.checked)">
                    </div>
                </div>
            `;
        });
    })
    .catch(error => {
        console.error("❌ Error cargando datos de asistencia:", error);
        document.getElementById("groupContainer").innerHTML = "<p>Error al cargar la asistencia.</p>";
    });
});


function actualizarAsistencia(idHijo, estado) {
    axios.post('../../backend/monitor/updateAsistencia.php', {
        id_hijo: idHijo,
        asistio: estado
    })
    .then(() => {
        console.log(`✅ Asistencia actualizada para ID ${idHijo}`);
        document.getElementById("popupConfirmacion").style.display = "flex";
    })
    .catch(error => console.error('❌ Error al actualizar asistencia:', error));
}

function closePopup() {
    document.getElementById("popupConfirmacion").style.display = "none";
    window.location.href = "../monitorPrincipal/monitorPrincipal.html";
}
