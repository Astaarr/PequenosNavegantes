////////////////////////////////////////
// ABRIR POPUP
////////////////////////////////////////
const popup = document.getElementById('popupContainer');

document.getElementById('contraOlvidada').addEventListener("click", function (event) {
    event.preventDefault(); // Evita que el enlace recargue la página
    popup.style.display = "flex";
});

document.getElementById('cerrarPopup').addEventListener("click", function () {
    popup.style.display = "none";
});


////////////////////////////////////////
// CORREO RECUPERACIÓN
////////////////////////////////////////
function submitEmail() {
    const email = document.getElementById('emailRecuperacion').value.trim();

    if(!email){
        console.error("El campo de email esta vacio");
        alert("El campo de email esta vacio");
        return;
    }

    axios.post('/PequenosNavegantes/app/backend/recuperar_password/enviar_codigo.php', 
        JSON.stringify({ emailRecuperacion: email }), // ✅ Enviar un objeto JSON correctamente
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ) 
    .then(response => {
        console.log("Respuesta del servidor:", response.data);
        alert(response.data.message);
    })
    .catch(error => {
        console.error('Error al enviar el email:', error);
    });
}


////////////////////////////////////////
// ENVIAR FORMULARIO
////////////////////////////////////////

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

    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        recordar: document.getElementById('recordar').checked
    };

    console.log("Datos enviados:", data);

    axios.post('/PequenosNavegantes/app/backend/login/loginPadre.php', JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);
        if (response.data.success) {
            alert('Login exitoso');
            window.location.href = '../../frontend/paginaPrincipal/index.html'; 
        } else {
            alert(response.data.message || "Error en el inicio de sesión");
        }
    })
    .catch(error => {
        console.error('Error al iniciar sesión', error);
    });
    
});
