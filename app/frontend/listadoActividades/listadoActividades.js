document.addEventListener("DOMContentLoaded", function () {
    // Redirigir a detalles de actividad al hacer clic en "+"
    document.querySelector(".add-button").addEventListener("click", function () {
        window.location.href = "../detallesActividad/detallesActividad.html";
    });

    // Manejar clic en editar actividad
    document.querySelectorAll(".tarjeta .icon i.fa-pen-to-square").forEach(icon => {
        icon.parentElement.addEventListener("click", function () {
            const actividad = this.closest(".tarjeta");
            const idActividad = actividad.getAttribute("data-id") || "nueva";
            window.location.href = `../detallesActividad/detallesActividad.html?id=${idActividad}`;
        });
    });

    // Cargar actividades con Axios
    axios.get("../php/getActividades.php")
        .then(response => {
            const actividades = response.data;
            const container = document.getElementById("groupContainer");
            container.innerHTML = "";
            actividades.forEach(actividad => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "tarjeta";
                tarjeta.setAttribute("data-id", actividad.id);
                tarjeta.innerHTML = `
                    <span class="name">${actividad.nombre}</span>
                    <div class="icons">
                        <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                        <span class="icon" onclick="eliminarActividad(${actividad.id})"><i class="fa-solid fa-trash"></i></span>
                    </div>
                `;
                container.appendChild(tarjeta);
            });
        })
        .catch(error => console.error("Error cargando actividades:", error));
});

// Eliminar actividad con Axios
function eliminarActividad(id) {
    if (confirm("¿Seguro que deseas eliminar esta actividad?")) {
        axios.post("../php/eliminarActividad.php", { id })
            .then(() => location.reload())
            .catch(error => console.error("Error eliminando actividad:", error));
    }
}
