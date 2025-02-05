// Obtener elementos del DOM
const form = document.getElementById('formulario');

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    inputs.forEach(input => {
        console.log( input );
        if (!validarCampoEspecifico(input)) {
            formularioValido = false;
        }
    });

    const datosTutor = {
        nombrePadre: document.getElementById('nombrePadre').value,
        dniPadre: document.getElementById('dniPadre').value,
        telPadre: document.getElementById('telPadre').value,
        telPadreAdicional: document.getElementById('telPadreAdicional').value,

        nombreAutorizado: document.getElementById('nombreAutorizado').value,
        dniAutorizado: document.getElementById('dniAutorizado').value,
        telAutorizado: document.getElementById('telAutorizado').value
    };
});
