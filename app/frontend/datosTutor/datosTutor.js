// Obtener elementos del DOM
const form = document.getElementById('formulario');

// Función para guardar los datos en sessionStorage
function guardarDatos(datos) {
    sessionStorage.setItem("datosTutor", JSON.stringify(datos));
}

// Función para recuperar y autocompletar los datos al cargar la página
function autocompletarFormulario() {
    const datosGuardados = JSON.parse(sessionStorage.getItem("datosTutor"));

    if (datosGuardados) { 
        Object.keys(datosGuardados).forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = datosGuardados[id]; 
            }
        });
    } else {
        // Si no hay datos en sessionStorage, obténlos del servidor
        cargarDatosDesdeServidor();
    }
}

// Función para cargar los datos desde el servidor usando Axios
function cargarDatosDesdeServidor() {
    axios.get("../../backend/reserva/nombrePadre.php") 
        .then(response => {
            console.log(response.data); // Depuración: Ver la respuesta
            if (response.data.success) {
                document.getElementById("nombrePadre").value = response.data.nombre || "";
                document.getElementById("dniPadre").value = response.data.dni || "";
                document.getElementById("telPadre").value = response.data.telefono || "";
                document.getElementById("telPadreAdicional").value = response.data.telefono_adicional || "";

                // Guardar los datos en sessionStorage para futuras visitas
                guardarDatos({
                    nombrePadre: response.data.nombre || "",
                    dniPadre: response.data.dni || "",
                    telPadre: response.data.telefono || "",
                    telPadreAdicional: response.data.telefono_adicional || ""
                });
            } else {
                console.error("Error al obtener los datos:", response.data.message);
            }
        })
        .catch(error => console.error("Error al obtener los datos del padre:", error));
}

// Ejecutar la función cuando la página cargue
document.addEventListener("DOMContentLoaded", autocompletarFormulario);

// Evento submit
form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    let formularioValido = true;
    const inputs = form.querySelectorAll("input");

    inputs.forEach(input => {
        if (!validarCampoEspecifico(input)) {
            formularioValido = false;
        }
    });

    if (formularioValido) {
        const datosTutor = {
            nombrePadre: document.getElementById("nombrePadre").value,
            dniPadre: document.getElementById("dniPadre").value,
            telPadre: document.getElementById("telPadre").value,
            telPadreAdicional: document.getElementById("telPadreAdicional").value,

            nombreAutorizado: document.getElementById("nombreAutorizado").value,
            dniAutorizado: document.getElementById("dniAutorizado").value,
            telAutorizado: document.getElementById("telAutorizado").value
        };

        // Guardar en sessionStorage
        guardarDatos(datosTutor);

        console.log("Datos enviados y guardados:", datosTutor);

        window.location.href = '../datosHijo/datosHijo.html';
    } else {
        console.log("Hay errores en el formulario.");
    }
});
