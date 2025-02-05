////////////////////////////////////////
// HEADER
////////////////////////////////////////
const openMenu = document.querySelector('.open-menu');
const closeMenu = document.querySelector('.close-menu');
const menu = document.getElementById("menu");
const header = document.getElementById("header-main");

if(header){
    openMenu.addEventListener('click', function() {
        openMenu.style.display = "none";
        closeMenu.style.display = "block";
        menu.style.right = "0";
    
    });
    
    closeMenu.addEventListener('click', function() {
        openMenu.style.display = "block";
        closeMenu.style.display = "none";
        menu.style.right = "-500px";
    
    });

    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            header.style.top = "-100px";
        } else {
            header.style.top = "0";
        }
        
        lastScrollTop = scrollTop;
    });
}


////////////////////////////////////////
// CAMPOS ADICIONALES
////////////////////////////////////////
const checkboxes = document.querySelectorAll('.checkbox-adicional');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const campoAdicional = this.closest('.field').querySelector('.campo-adicional');
        if (this.checked) {
            campoAdicional.style.display = "flex";
        } else {
            campoAdicional.style.display = "none";
        }
    });
});


////////////////////////////////////////
// MOSTRAR CONTRASEÑA
////////////////////////////////////////
document.querySelectorAll('.mostrarPassword').forEach(icon => {
    icon.addEventListener('click', function() {
        const passwordInput = document.querySelector('#password');

        // Alternar entre 'password' y 'text'
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });
});


////////////////////////////////////////
// VALIDACIONES
////////////////////////////////////////

// Obtener el formulario
const formulario = document.getElementById('formulario');

// Validar campo
function validarCampoEspecifico(campo) {
    const errorSpan = campo.parentElement.querySelector(".error");
    const valor = campo.value.trim();

    // Si el campo tiene la clase "obligatorio" y está vacío, muestra error
    if (campo.classList.contains('obligatorio') && valor === '') {
        mostrarError(errorSpan, 'El campo no puede estar vacío.');
        return false;
    } else {
        // Si es un campo de tipo email, validar el formato
        if (campo.type === 'email' && !validarEmail(valor)) {
            mostrarError(errorSpan, 'Introduce un correo válido.');
            return false;
        }

        // Validar DNI si el campo tiene la clase "dni"
        if (campo.classList.contains('dni') && !validarDNI(valor)) {
            mostrarError(errorSpan, 'Introduce un DNI válido.');
            return false;
        }

        if (campo.type === 'tel' && !validarTelefono(valor)) {
            mostrarError(errorSpan, 'Introduce un número de teléfono válido.');
            return false;
        }

        // Validar contraseña si el campo tiene el id password
        if (campo.id === 'password' && valor.length < 6) {
            mostrarError(errorSpan, 'La contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        // Validar edad si el campo tiene el id fechaNacimiento
        if (campo.id === 'nacimientoHijo' && !validarEdad(valor)) {
            mostrarError(errorSpan, 'La edad debe estar entre 6 y 7 años.');
            return false;
        }
    }

    limpiarError(errorSpan);
    return true;
}

// Función para validar el formato de un email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar el formato del DNI
function validarDNI(dni) {
    const regex = /^[0-9]{8}[A-Za-z]$/; // Formato DNI español: 8 dígitos + letra
    return regex.test(dni);
}

// Función para validar el formato del teléfono
function validarTelefono(numero) {
    const regex = /^[0-9]{9}$/;
    return regex.test(numero);
}

// Función para validar la edad (entre 6 y 7 años)
function validarEdad(fechaNacimiento) {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNac.getMonth();
    const diaDiferencia = hoy.getDate() - fechaNac.getDate();

    // Ajustar edad si el cumpleaños aún no ha ocurrido este año
    if (mesDiferencia < 0 || (mesDiferencia === 0 && diaDiferencia < 0)) {
        return edad - 1 >= 6 && edad - 1 <= 7;
    }
    return edad >= 6 && edad <= 7;
}

// Función para mostrar el error
function mostrarError(elementoError, mensaje) {
    if (!elementoError) return; // Si es null, salir de la función
    elementoError.style.display = 'inline';
    elementoError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${mensaje}`;
}

// Función para limpiar el error
function limpiarError(elementoError) {
    if (!elementoError) return; // Si es null, salir de la función
    elementoError.style.display = 'none';
}

// Seleccionar todos los inputs y añadir evento 'blur'
const inputs = document.querySelectorAll('input:not([type="button"]):not([type="checkbox"]):not([type="radio"])');
inputs.forEach(input => input.addEventListener('blur', () => validarCampoEspecifico(input)));


////////////////////////////////////////
// COOKIES
////////////////////////////////////////
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}

window.onload = function() {
    const token = getCookie("token_login");

    if (token) {
        axios.post('/PequenosNavegantes/app/backend/login/validarToken.php', JSON.stringify({ token: token }), {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.data.success) {
                // Si el token es válido, redirigir al usuario al dashboard
                window.location.href = "/PequenosNavegantes/app/frontend/paginaPrincipal/index.html";
            }
        })
        .catch(error => {
            console.error("Error al validar el token:", error);
        });
    }
};

