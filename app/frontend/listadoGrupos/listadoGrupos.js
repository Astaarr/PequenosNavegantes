document.addEventListener("DOMContentLoaded", function () {
    // Cargar grupos al iniciar la página
    cargarGrupos();
});

// Función para cargar y mostrar los grupos
function cargarGrupos() {
    axios.post('/PequenosNavegantes/app/backend/admin/grupos/obtener_grupos.php', {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            const groupContainer = document.getElementById("groupContainer");
            groupContainer.innerHTML = `<span class="add-button" onclick="abrirDetallesGrupo()"><i class="fa-solid fa-plus"></i></span>`;

            // Agregar tarjeta por cada grupo
            response.data.grupos.forEach(grupo => {
                groupContainer.innerHTML += `
                    <div class="tarjeta" data-id="${grupo.id_grupo}">
                        <div class="info">
                            <span class="name"><i class="fa-solid fa-users"></i> ${grupo.nombre}</span>
                            <span class="name"><i class="fa-solid fa-user-check"></i> ${grupo.nombre_monitor}</span>
                        </div>
                        <div class="icons">
                            <span class="icon edit" onclick="abrirDetallesGrupo(${grupo.id_grupo})">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </span>
                            <span class="icon delete" onclick="mostrarPopupConfirmacion(${grupo.id_grupo}, '${grupo.nombre}')">
                                <i class="fa-solid fa-trash"></i>
                            </span>
                        </div>
                    </div>
                `;
            });
        } else {
            console.error("Error al obtener grupos:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener grupos:', error);
    });
}

// Función para abrir detallesGrupo.html
function abrirDetallesGrupo(idGrupo = null) {
    let url = '../detallesGrupo/detallesGrupo.html';
    if (idGrupo) {
        url += `?id=${idGrupo}`; // Agregar el ID del grupo a la URL si estamos editando
    }
    window.location.href = url;
}

// Función para mostrar el popup de confirmación de eliminación
function mostrarPopupConfirmacion(id, nombre) {
    const popup = document.getElementById("popupConfirmacion");
    const nombreGrupoEliminar = document.getElementById("nombreGrupoEliminar");

    // Mostrar el nombre del grupo en el popup
    nombreGrupoEliminar.textContent = nombre;

    // Guardar el ID del grupo en el popup
    popup.dataset.id = id;

    // Mostrar el popup
    popup.style.display = "flex";
}

// Función para confirmar la eliminación de un grupo
function confirmarEliminacion() {
    const popup = document.getElementById("popupConfirmacion");
    const id = popup.dataset.id; // Recuperar el ID del popup para eliminarlo

    axios.post("/PequenosNavegantes/app/backend/admin/grupos/eliminar_grupo.php", JSON.stringify({ id_grupo: id }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            cargarGrupos(); // Recargar la lista de grupos
        } else {
            alert("Error al eliminar el grupo.");
        }
    })
    .catch(error => {
        console.error("Error eliminando grupo:", error);
    });

    closePopup();
}

