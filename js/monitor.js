// Obtener elementos del DOM
const form = document.getElementById('solicitud-monitor');
const errorMensajeGeneral = document.getElementById('form-errors');
const errorNombre = document.getElementById('error-nombre');
const errorCorreo = document.getElementById('error-correo');
const errorMensaje = document.getElementById('error-mensaje');
const errorCV = document.getElementById('error-cv');
const errorTerminos = document.getElementById('error-terminos');

// Validar nombre
function validarNombre() {
    const nombre = document.getElementById('nombre').value.trim();
    if (nombre === '') {
        mostrarError(errorNombre, 'El campo Nombre no puede estar vacío.');
        return false;
    } else {
        limpiarError(errorNombre);
        return true;
    }
}

// Validar correo
function validarCorreo() {
    const correo = document.getElementById('correo').value.trim();
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo === '') {
        mostrarError(errorCorreo, 'El campo Correo no puede estar vacío.');
        return false;
    } else if (!correoRegex.test(correo)) {
        mostrarError(errorCorreo, 'Por favor, introduce un correo válido.');
        return false;
    } else {
        limpiarError(errorCorreo);
        return true;
    }
}

// Validar mensaje
function validarMensaje() {
    const mensaje = document.getElementById('mensaje').value.trim();
    if (mensaje === '') {
        mostrarError(errorMensaje, 'El campo Mensaje no puede estar vacío.');
        return false;
    } else {
        limpiarError(errorMensaje);
        return true;
    }
}

// Validar CV
function validarCV() {
    const cv = document.getElementById('cv').files[0];
    if (!cv) {
        mostrarError(errorCV, 'Por favor, adjunta tu CV.');
        return false;
    }
    const formatosValidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!formatosValidos.includes(cv.type)) {
        mostrarError(errorCV, 'El CV debe ser un archivo PDF, DOC o DOCX.');
        return false;
    } else {
        limpiarError(errorCV);
        return true;
    }
}

// Validar términos
function validarTerminos() {
    const terminos = document.getElementById('terminos').checked;
    if (!terminos) {
        mostrarError(errorTerminos, 'Debes aceptar los términos.');
        return false;
    } else {
        limpiarError(errorTerminos);
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
    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const mensajeValido = validarMensaje();
    const cvValido = validarCV();
    const terminosValidos = validarTerminos();

    if (!nombreValido || !correoValido || !mensajeValido || !cvValido || !terminosValidos) {
        mostrarError(errorMensajeGeneral, 'Por favor, corrige los errores antes de enviar.');
        return false;
    } else {
        limpiarError(errorMensajeGeneral);
        return true;
    }
}

// Asociar validaciones al evento blur
document.getElementById('nombre').addEventListener('blur', validarNombre);
document.getElementById('correo').addEventListener('blur', validarCorreo);
document.getElementById('mensaje').addEventListener('blur', validarMensaje);
document.getElementById('cv').addEventListener('change', validarCV);
document.getElementById('terminos').addEventListener('change', validarTerminos);

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto
    if (validarFormulario()) {
        console.log('Formulario enviado correctamente.');
        form.submit();
    }
});
