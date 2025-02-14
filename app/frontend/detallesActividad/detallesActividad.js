let currentType = '';  // Indica si es grupo o monitor
let editingElement = null;  // Almacena el elemento en edición

// Mostrar Popup
function showPopup(type, card = null) {
    currentType = type;
    editingElement = card;

    // Si es edición, llenar los campos con los valores actuales
    if (card) {
        document.getElementById("selectInput").value = card.dataset.select;
    } else {
        document.getElementById("selectInput").value = "Grupo 1";
    }

    document.getElementById("popup").style.display = "flex";
}


// Eliminar Popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function saveCard() {
    const selected = document.getElementById("selectInput").value;

    if (editingElement) {
        // Modo edición: actualizar datos
        editingElement.dataset.select = selected;
        editingElement.querySelector(".name").textContent = selected;
    } else {
        // Modo agregar: crear nueva tarjeta
        const container = currentType === "grupo" ? document.getElementById("groupContainer") : document.getElementById("monitorContainer");

        const cardHTML = `
            <div class="tarjeta" data-select="${selected}">
                <span class="name">${selected}</span>
                <div class="icons">
                    <span class="icon" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-trash"></i></span>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHTML);
    }

    closePopup();
}




document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idActividad = urlParams.get("id");

    if (idActividad && idActividad !== "nueva") {
        axios.get(`../php/getActividad.php?id=${idActividad}`)
            .then(response => {
                const actividad = response.data;

                document.getElementById("horaInicio").value = actividad.horaInicio;
                document.getElementById("horaFin").value = actividad.horaFin;
                document.getElementById("lugarActividad").value = actividad.lugarActividad;
                document.getElementById("detallesActividad").value = actividad.detallesActividad;
            })
            .catch(error => console.error("Error cargando actividad:", error));
    }
});

// Guardar cambios en la actividad
document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const idActividad = urlParams.get("id");

    const detallesActividad = {
        id: idActividad !== "nueva" ? idActividad : null,
        horaInicio: document.getElementById("horaInicio").value,
        horaFin: document.getElementById("horaFin").value,
        lugar: document.getElementById("lugarActividad").value,
        descripcion: document.getElementById("detallesActividad").value
    };

    axios.post("../php/guardarActividad.php", actividadData)
        .then(() => window.location.href = "ListadoActividades.html")
        .catch(error => console.error("Error guardando actividad:", error));
});