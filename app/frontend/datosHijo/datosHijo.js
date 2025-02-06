// Obtener elementos del DOM
const form = document.getElementById('formulario');

// Retroceder
function retroceder(){
    window.location.href = '../datosTutor/datosTutor.html';
}

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    let formularioValido = true;

    inputs.forEach(input => {
        if (!validarCampoEspecifico(input)) {
            formularioValido = false;
            console.log( input );
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

        window.location.href = '../datosTarifa/datosTarifa.html';
    } else {
        console.log('Hay errores en el formulario.');
    }

});