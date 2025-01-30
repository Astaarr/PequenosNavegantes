// Obtener elementos del DOM
const form = document.getElementById('form-extras');
const errorMensajeGeneral = document.getElementById('form-errors');
const errorTransporte = document.getElementById('error-transporte');
const errorComidas = document.getElementById('error-comidas');

// Validar transporte
function validarTransporte() {
    const transporte = document.getElementById('transporte').value;
    if (transporte === '') {
        mostrarError(errorTransporte, 'Por favor, selecciona una opción de transporte.');
        return false;
    } else {
        limpiarError(errorTransporte);
        return true;
    }
}

// Validar comidas
function validarComidas() {
    const comidas = document.getElementById('comidas').value;
    if (comidas === '') {
        mostrarError(errorComidas, 'Por favor, selecciona una opción de comidas.');
        return false;
    } else {
        limpiarError(errorComidas);
        return true;
    }
}

// Mostrar error
function mostrarError(elementoError, mensaje) {
    elementoError.textContent = mensaje;
    elementoError.style.display = 'block';
}

// Limpiar error
function limpiarError(elementoError) {
    elementoError.textContent = '';
    elementoError.style.display = 'none';
}

// Validar formulario completo
function validarFormulario() {
    const transporteValido = validarTransporte();
    const comidasValido = validarComidas();

    if (!transporteValido || !comidasValido) {
        mostrarError(errorMensajeGeneral, 'Por favor, corrige los errores antes de finalizar el registro.');
        return false;
    } else {
        limpiarError(errorMensajeGeneral);
        return true;
    }
}

// Asociar validaciones al evento blur
document.getElementById('transporte').addEventListener('blur', validarTransporte);
document.getElementById('comidas').addEventListener('blur', validarComidas);

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto
    if (validarFormulario()) {
        console.log('Formulario enviado correctamente.');
        form.submit();
    }
});
