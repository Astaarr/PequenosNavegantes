let currentType = '';  // Indica si es grupo o monitor
let editingElement = null;  // Almacena el elemento en edición

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idActividad = urlParams.get("id");

    // Cargar los grupos dinámicamente en el select del popup
    cargarGrupos();

    // Si estamos editando una actividad, cargar los datos
    if (idActividad && idActividad !== "nueva") {
        cargarActividad(idActividad);
    }

    // Manejar el envío del formulario
    document.getElementById("formulario").addEventListener("submit", function (e) {
        e.preventDefault();
        guardarActividad(idActividad);
    });
});

// Función para cargar los grupos en el select del popup
function cargarGrupos() {
    axios.post('/PequenosNavegantes/app/backend/admin/obtener_grupos.php', {}, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            let selectGrupo = document.getElementById("selectInput");
            selectGrupo.innerHTML = ""; // Limpiar opciones previas

            response.data.grupos.forEach(grupo => {
                let option = document.createElement("option");
                option.value = grupo.id_grupo;
                option.textContent = grupo.nombre;
                selectGrupo.appendChild(option);
            });
        } else {
            console.error("Error al obtener grupos:", response.data.message);
        }
    })
    .catch(error => console.error("Error cargando grupos:", error));
}

// Función para cargar los datos de la actividad seleccionada
function cargarActividad(id) {
    axios.post('/PequenosNavegantes/app/backend/admin/obtener_actividad.php', JSON.stringify({ id_actividad: id }), {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            const actividad = response.data.actividad;

            document.getElementById("horaInicio").value = actividad.hora_inicio;
            document.getElementById("horaFinal").value = actividad.hora_fin;
            document.getElementById("lugarActividad").value = actividad.lugar;
            document.getElementById("detallesActividad").value = actividad.descripcion;

            // Si la actividad tiene un grupo asociado, seleccionarlo en el <select>
            setTimeout(() => {
                document.getElementById("selectInput").value = actividad.id_grupo;
            }, 500);
        } else {
            console.error("Error al obtener actividad:", response.data.message);
        }
    })
    .catch(error => console.error("Error cargando actividad:", error));
}

// Función para guardar actividad (nueva o editada)
function guardarActividad(id) {
    const actividadData = {
        id_actividad: id !== "nueva" ? id : null,
        hora_inicio: document.getElementById("horaInicio").value,
        hora_fin: document.getElementById("horaFinal").value,
        lugar: document.getElementById("lugarActividad").value,
        descripcion: document.getElementById("detallesActividad").value,
        id_grupo: document.getElementById("selectInput").value
    };

    axios.post("../backend/admin/guardarActividad.php", JSON.stringify(actividadData), {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.data.success) {
            alert("Actividad guardada correctamente.");
            window.location.href = "listadoActividades.html"; // Redirigir a la lista
        } else {
            alert("Error al guardar la actividad.");
        }
    })
    .catch(error => console.error("Error guardando actividad:", error));
}

// Mostrar Popup para agregar grupos
function showPopup(type, card = null) {
    currentType = type;
    editingElement = card;
    document.getElementById("popup").style.display = "flex";
}

// Cerrar Popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Guardar un grupo en la lista de la actividad
function saveCard() {
    const selected = document.getElementById("selectInput").value;

    if (editingElement) {
        // Modo edición: actualizar datos
        editingElement.dataset.select = selected;
        editingElement.querySelector(".name").textContent = selected;
    } else {
        // Modo agregar: crear nueva tarjeta en la lista de grupos
        const container = document.getElementById("groupContainer");

        const cardHTML = `
            <div class="tarjeta" data-select="${selected}">
                <span class="name">${selected}</span>
                <div class="icons">
                    <span class="icon" onclick="this.parentElement.parentElement.remove()">
                        <i class="fa-solid fa-trash"></i>
                    </span>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHTML);
    }

    closePopup();
}
