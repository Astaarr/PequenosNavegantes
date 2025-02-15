document.addEventListener("DOMContentLoaded", function () {
    // Cargar actividades al iniciar la página
    cargarActividades();
});

// Función para cargar y mostrar las actividades
function cargarActividades() {
    axios.post('/PequenosNavegantes/app/backend/admin/obtener_actividad.php', {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            const groupContainer = document.getElementById("groupContainer");
            groupContainer.innerHTML = `<span class="add-button" onclick="window.location.href='../detallesActividad/detallesActividad.html'"><i class="fa-solid fa-plus"></i></span>`;

            // Agregar tarjeta por cada actividad
            response.data.actividades.forEach(actividad => {
                groupContainer.innerHTML += `
                    <div class="tarjeta" data-id="${actividad.id_actividad}">
                        <span class="name">${actividad.nombre}</span>
                        <div class="icons">
                            <span class="icon edit" onclick="editarActividad(${actividad.id_actividad})">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </span>
                            <span class="icon delete" onclick="mostrarPopupConfirmacion(${actividad.id_actividad}, '${actividad.nombre}')">
                                <i class="fa-solid fa-trash"></i>
                            </span>
                        </div>
                    </div>
                `;
            });
        } else {
            console.error("Error al obtener actividades:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener actividades:', error);
    });
}

// Función para editar una actividad
function editarActividad(id) {
    window.location.href = `../detallesActividad/detallesActividad.html?id=${id}`;
}

// Función para mostrar el popup de confirmación de eliminación
function mostrarPopupConfirmacion(id, nombre) {
    const popup = document.getElementById("popupConfirmacion");
    const nombreActividad = document.getElementById("nombreActividad");

    // Mostrar el nombre de la actividad en el popup
    nombreActividad.textContent = nombre;

    // Guardar el ID de la actividad en el popup
    popup.dataset.id = id;

    // Mostrar el popup
    popup.style.display = "flex";
}

// Función para confirmar la eliminación de una actividad
function confirmarEliminacion() {
    const popup = document.getElementById("popupConfirmacion");
    const id = popup.dataset.id; //Recupero el id del popup para eliminarlo

    axios.post("/PequenosNavegantes/app/backend/admin/eliminar_actividad.php", JSON.stringify({ id_actividad: id }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.success) {
            document.getElementById("popupFin").style.display = "flex";
            cargarActividades(); 
        } else {
            alert("Error al eliminar la actividad.");
        }
    })
    .catch(error => {
        console.error("Error eliminando actividad:", error);
    });

    closePopup();
}

// Función para cerrar los popups
function closePopup() {
    const popups = document.querySelectorAll(".popup-container");
    popups.forEach(popup => popup.style.display = "none");
}