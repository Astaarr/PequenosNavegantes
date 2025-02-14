let currentType = '';  // Indica si es grupo o monitor
let editingElement = null;  // Almacena el elemento en edición

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
                    <span class="icon" onclick="showPopup('${currentType}', this.parentElement.parentElement)"><i class="fa-solid fa-pen-to-square"></i></span>
                    <span class="icon" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-trash"></i></span>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHTML);
    }

    closePopup();
}