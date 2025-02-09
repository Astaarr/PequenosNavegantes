// Obtener elementos del DOM
const form = document.getElementById('formulario');

// Retroceder
function retroceder(){
    window.location.href = '../datosTutor/datosTutor.html';
}

// Función para guardar los datos en sessionStorage
function guardarDatos(datos) {
    sessionStorage.setItem("datosHijo", JSON.stringify(datos));
}

// Función para recuperar y autocompletar los datos al cargar la página
function autocompletarFormulario() {
    const datosGuardados = JSON.parse(sessionStorage.getItem("datosHijo"));

    if (datosGuardados) { 
        Object.keys(datosGuardados).forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = datosGuardados[id]; // Autocompleta el campo
            }
        });
    }
}

// Ejecutar la función cuando la página cargue
document.addEventListener("DOMContentLoaded", autocompletarFormulario);

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    let formularioValido = true;
    const inputs = document.querySelectorAll("input");

    inputs.forEach(input => {
        if (!validarCampoEspecifico(input)) { 
            formularioValido = false;
        }
    });

    if (formularioValido) {
        const datosHijo = {
            nombreHijo: document.getElementById('nombreHijo').value,
            apellidosHijo: document.getElementById('apellidosHijo').value,
            nacimientoHijo: document.getElementById('nacimientoHijo').value,
            alergiaHijo: document.getElementById('alergiaHijo').value,
            medicacionActual: document.getElementById('medicacionActual').value,
            infoAdicionalHijo: document.getElementById('infoAdicionalHijo').value
        };

        // Guardar en sessionStorage
        guardarDatos(datosHijo);

        console.log("Datos guardados en sessionStorage:", datosHijo);
        
        // Redirigir a la siguiente página
        window.location.href = '../datosTarifa/datosTarifa.html';
    } else {
        console.log("Hay errores en el formulario.");
    }
});
