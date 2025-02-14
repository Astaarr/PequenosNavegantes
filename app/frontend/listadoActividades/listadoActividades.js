document.addEventListener("DOMContentLoaded", function () {
    // Redirigir a detalles de actividad al hacer clic en "+"
    document.querySelector(".add-button").addEventListener("click", function () {
        window.location.href = "../detallesActividad/detallesActividad.html";
    });

    // Cargar actividades con Axios
    cargarActividades();
});

function cargarActividades() {
    axios.post('/PequenosNavegantes/app/backend/admin/obtener_actividad.php', {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);

        if (response.data.success) {
            let groupContainer = document.getElementById("groupContainer");

            // Verificar si el contenedor existe
            if (!groupContainer) {
                console.error("El contenedor de actividades no se encontró en el DOM.");
                return;
            }

            // Limpiar el contenedor antes de agregar nuevas actividades
            groupContainer.innerHTML = `
                <span class="add-button" onclick="showPopup('grupo')"><i class="fa-solid fa-plus"></i></span>
            `;

            response.data.actividades.forEach(actividad => {
                let actividadHTML = `
                    <div class="tarjeta" data-id="${actividad.id_actividad}">
                        <span class="name">${actividad.nombre}</span>
                        <div class="icons">
                            <span class="icon" onclick="editarActividad(${actividad.id_actividad})">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </span>
                            <span class="icon" onclick="eliminarActividad(${actividad.id_actividad})">
                                <i class="fa-solid fa-trash"></i>
                            </span>
                        </div>
                    </div>
                `;

                groupContainer.innerHTML += actividadHTML;
            });
        } else {
            console.error("Error al obtener actividades:", response.data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener actividades:', error);
    });
}

// Función para editar actividad
function editarActividad(id) {
    window.location.href = `../detallesActividad/detallesActividad.html?id=${id}`;
}

// Función para eliminar actividad con Axios
function eliminarActividad(id) {
    if (confirm("¿Seguro que deseas eliminar esta actividad?")) {
        axios.post("/PequenosNavegantes/app/backend/admin/eliminar_actividad.php", JSON.stringify({ id_actividad: id }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.data.success) {
                alert("Actividad eliminada correctamente.");
                cargarActividades(); // Recargar la lista después de eliminar
            } else {
                alert("Error al eliminar la actividad.");
            }
        })
        .catch(error => {
            console.error("Error eliminando actividad:", error);
        });
    }
}
