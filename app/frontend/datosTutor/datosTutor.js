// Obtener elementos del DOM
const form = document.getElementById('formulario');

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
        const datosTutor = {
            nombrePadre: document.getElementById('nombrePadre').value,
            dniPadre: document.getElementById('dniPadre').value,
            telPadre: document.getElementById('telPadre').value,
            telPadreAdicional: document.getElementById('telPadreAdicional').value,
            
            nombreAutorizado: document.getElementById('nombreAutorizado').value,
            dniAutorizado: document.getElementById('dniAutorizado').value,
            telAutorizado: document.getElementById('telAutorizado').value
        };

        window.location.href = '../datosHijo/datosHijo.html';
    } else {
        console.log('Hay errores en el formulario.');
    }

});
