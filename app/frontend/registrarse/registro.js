// Obtener elementos del DOM
const form = document.getElementById('registro');
const errorMensajeGeneral = document.getElementById('mensaje-error');
const errorMensajeNombre = document.getElementById('error-nombre');
const errorMensajeApellido = document.getElementById('error-apellido');
const errorMensajeEmail = document.getElementById('error-email');
const errorMensajePassword = document.getElementById('error-password');

// Validar nombre
function validarNombre() {
    const nombre = document.getElementById('nombre').value.trim();
    if (nombre === '') {
        mostrarError(errorMensajeNombre, 'El campo Nombre no puede estar vacío.');
        return false;
    } else {
        limpiarError(errorMensajeNombre);
        return true;
    }
}

// Validar apellidos
function validarApellido() {
    const apellido = document.getElementById('apellido').value.trim();
    if (apellido === '') {
        mostrarError(errorMensajeApellido, 'El campo Apellidos no puede estar vacío.');
        return false;
    } else {
        limpiarError(errorMensajeApellido);
        return true;
    }
}

// Validar email
function validarEmail() {
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        mostrarError(errorMensajeEmail, 'El campo Email no puede estar vacío.');
        return false;
    } else if (!emailRegex.test(email)) {
        mostrarError(errorMensajeEmail, 'Por favor, introduce un correo válido.');
        return false;
    } else {
        limpiarError(errorMensajeEmail);
        return true;
    }
}

// Validar contraseña
function validarPassword() {
    const password = document.getElementById('password').value.trim();
    if (password === '') {
        mostrarError(errorMensajePassword, 'El campo Contraseña no puede estar vacío.');
        return false;
    } else if (password.length < 6) {
        mostrarError(errorMensajePassword, 'La contraseña debe tener al menos 6 caracteres.');
        return false;
    } else {
        limpiarError(errorMensajePassword);
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
    const apellidoValido = validarApellido();
    const emailValido = validarEmail();
    const passwordValido = validarPassword();

    if (!nombreValido || !apellidoValido || !emailValido || !passwordValido) {
        mostrarError(errorMensajeGeneral, 'Por favor, corrige los errores antes de continuar.');
        return false;
    } else {
        limpiarError(errorMensajeGeneral);
        return true;
    }
}

// Asociar las validaciones al evento blur
document.getElementById('nombre').addEventListener('blur', validarNombre);
document.getElementById('apellido').addEventListener('blur', validarApellido);
document.getElementById('email').addEventListener('blur', validarEmail);
document.getElementById('password').addEventListener('blur', validarPassword);

// Evento submit 
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita el envío por defecto

    if (validarFormulario()) {
        const data = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        axios.post('http://localhost/PequenosNavegantes/app/backend/registrarse/registrarse.php', JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response.data);
            if (response.data.success) {
                alert('Padre registrado correctamente');
                window.location.href = '../../frontend/login/login.html';
            } else {
                alert(response.data.message);
            }
        })
        .catch(error => {
            console.error('Error al crear cuenta', error);
        });
    }
});