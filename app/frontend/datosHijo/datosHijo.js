// Obtener elementos del DOM
const form = document.getElementById('formulario');

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto

    inputs.forEach(input => {
        console.log( input );
        if (!validarCampoEspecifico(input)) {
            formularioValido = false;
        }
    });

    const datosHijo = {
        nombreHijo: document.getElementById('nombreHijo').value,
        apellidosHijo: document.getElementById('apellidosHijo').value,
        nacimientoHijo: document.getElementById('nacimientoHijo').value,

        alergiaHijo: document.getElementById('alergiaHijo').value,
        medicacionActual: document.getElementById('medicacionActual').value,
        infoAdicionalHijo: document.getElementById('infoAdicionalHijo').value
    };
});
