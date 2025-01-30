// Obtener elementos del DOM
const form = document.getElementById('form-datos-nino');
const errorMensajeGeneral = document.getElementById('form-errors');
const errorNombreNino = document.getElementById('error-nombre-nino');
const errorDniNino = document.getElementById('error-dni-nino');
const errorFechaNacimiento = document.getElementById('error-fecha-nacimiento');

// Validar nombre
function validarNombreNino() {
    const nombre = document.getElementById('nombre-nino').value.trim();
    if (nombre === '') {
        mostrarError(errorNombreNino, 'El campo Nombre y Apellidos no puede estar vacío.');
        return false;
    } else {
        limpiarError(errorNombreNino);
        return true;
    }
}

// Validar DNI
function validarDniNino() {
    const dni = document.getElementById('dni-nino').value.trim();
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (dni === '') {
        mostrarError(errorDniNino, 'El campo DNI no puede estar vacío.');
        return false;
    } else if (!dniRegex.test(dni)) {
        mostrarError(errorDniNino, 'El DNI debe tener 8 dígitos seguidos de una letra.');
        return false;
    } else {
        limpiarError(errorDniNino);
        return true;
    }
}

// Validar fecha de nacimiento
function validarFechaNacimiento() {
    const fecha = document.getElementById('fecha-nacimiento').value;
    if (fecha === '') {
        mostrarError(errorFechaNacimiento, 'Por favor, selecciona una fecha de nacimiento.');
        return false;
    } else {
        limpiarError(errorFechaNacimiento);
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
    const nombreValido = validarNombreNino();
    const dniValido = validarDniNino();
    const fechaValida = validarFechaNacimiento();

    if (!nombreValido || !dniValido || !fechaValida) {
        mostrarError(errorMensajeGeneral, 'Por favor, corrige los errores antes de continuar.');
        return false;
    } else {
        limpiarError(errorMensajeGeneral);
        return true;
    }
}

// Asociar validaciones al evento blur
document.getElementById('nombre-nino').addEventListener('blur', validarNombreNino);
document.getElementById('dni-nino').addEventListener('blur', validarDniNino);
document.getElementById('fecha-nacimiento').addEventListener('blur', validarFechaNacimiento);

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto
    if (validarFormulario()) {
        console.log('Formulario enviado correctamente.');
        form.submit();
    }
});
