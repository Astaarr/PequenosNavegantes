// Obtener elementos del DOM
const form = document.getElementById('login-form');
const errorMensajeGeneral = document.getElementById('form-errors');
const errorEmail = document.getElementById('error-email');
const errorPassword = document.getElementById('error-password');

// Validar email
function validarEmail() {
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        mostrarError(errorEmail, 'El campo Email no puede estar vacío.');
        return false;
    } else if (!emailRegex.test(email)) {
        mostrarError(errorEmail, 'Por favor, introduce un correo válido.');
        return false;
    } else {
        limpiarError(errorEmail);
        return true;
    }
}

// Validar contraseña
function validarPassword() {
    const password = document.getElementById('password').value.trim();
    if (password === '') {
        mostrarError(errorPassword, 'El campo Contraseña no puede estar vacío.');
        return false;
    } else {
        limpiarError(errorPassword);
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
    const emailValido = validarEmail();
    const passwordValido = validarPassword();

    if (!emailValido || !passwordValido) {
        mostrarError(errorMensajeGeneral, 'Por favor, corrige los errores antes de continuar.');
        return false;
    } else {
        limpiarError(errorMensajeGeneral);
        return true;
    }
}

// Asociar validaciones al evento blur
document.getElementById('email').addEventListener('blur', validarEmail);
document.getElementById('password').addEventListener('blur', validarPassword);

// Evento submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto
    if (validarFormulario()) {
        console.log('Formulario enviado correctamente.');
        form.submit();
    }
});
