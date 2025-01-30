// Obtener elementos del DOM
const form = document.getElementById('form-datos-tutor');
const errorMensajeGeneral = document.getElementById('form-errors');
const errorNombreTutor = document.getElementById('error-nombre-tutor');
const errorCorreoTutor = document.getElementById('error-correo-tutor');
const errorDniTutor = document.getElementById('error-dni-tutor');
const errorTelefonoTutor = document.getElementById('error-telefono-tutor');
const errorVenir = document.getElementById('error-venir');
const datosTutorAdicional = document.getElementById('datos-tutor-adicional');

// Validar nombre
function validarNombreTutor() {
    const nombre = document.getElementById('nombre-tutor').value.trim();
    if (nombre === '') {
        mostrarError(errorNombreTutor, 'El campo Nombre no puede estar vacío.');
        return false;
    } else {
        limpiarError(errorNombreTutor);
        return true;
    }
}

// Validar correo
function validarCorreoTutor() {
    const correo = document.getElementById('correo-tutor').value.trim();
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo === '') {
        mostrarError(errorCorreoTutor, 'El campo Correo no puede estar vacío.');
        return false;
    } else if (!correoRegex.test(correo)) {
        mostrarError(errorCorreoTutor, 'Por favor, introduce un correo válido.');
        return false;
    } else {
        limpiarError(errorCorreoTutor);
        return true;
    }
}

// Validar DNI
function validarDniTutor() {
    const dni = document.getElementById('dni-tutor').value.trim();
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (dni === '') {
        mostrarError(errorDniTutor, 'El campo DNI no puede estar vacío.');
        return false;
    } else if (!dniRegex.test(dni)) {
        mostrarError(errorDniTutor, 'El DNI debe tener 8 dígitos seguidos de una letra.');
        return false;
    } else {
        limpiarError(errorDniTutor);
        return true;
    }
}

// Validar teléfono
function validarTelefonoTutor() {
    const telefono = document.getElementById('telefono-tutor').value.trim();
    const telefonoRegex = /^[0-9]{9}$/;
    if (telefono === '') {
        mostrarError(errorTelefonoTutor, 'El campo Teléfono no puede estar vacío.');
        return false;
    } else if (!telefonoRegex.test(telefono)) {
        mostrarError(errorTelefonoTutor, 'El Teléfono debe tener 9 dígitos.');
        return false;
    } else {
        limpiarError(errorTelefonoTutor);
        return true;
    }
}

// Mostrar/ocultar datos adicionales
document.getElementById('venir').addEventListener('change', (event) => {
    if (event.target.value === 'no') {
        datosTutorAdicional.style.display = 'block';
    } else {
        datosTutorAdicional.style.display = 'none';
    }
});

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
    const nombreValido = validarNombreTutor();
    const correoValido = validarCorreoTutor();
    const dniValido = validarDniTutor();
    const telefonoValido = validarTelefonoTutor();

    if (!nombreValido || !correoValido || !dniValido || !telefonoValido) {
        mostrarError(errorMensajeGeneral, 'Por favor, corrige los errores antes de continuar.');
        return false;
    } else {
        limpiarError(errorMensajeGeneral);
        return true;
    }
}

// Asociar validaciones al evento blur
document.getElementById('nombre-tutor').addEventListener('blur', validarNombreTutor);
document.getElementById('correo-tutor').addEventListener('blur', validarCorreoTutor);
document.getElementById('dni-tutor').addEventListener('blur', validarDniTutor);
document.getElementById('telefono-tutor').addEventListener('blur', validarTelefonoTutor);

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validarFormulario()) {
        console.log('Formulario enviado correctamente.');
        form.submit();
    }
});
