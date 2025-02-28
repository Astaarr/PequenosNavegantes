////////////////////////////////////////
// ABRIR POPUP RECUPERACIÓN
////////////////////////////////////////
const popup = document.getElementById('popupContainer');

document.getElementById('contraOlvidada').addEventListener("click", function (event) {
    event.preventDefault(); // Evita que el enlace recargue la página
    popup.style.display = "flex";
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
        JSON.stringify({ emailRecuperacion: email }), 
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ) 
    .then(response => {
        if (response.data.success) {
            document.getElementById("popupContainer").style.display = "none";
            document.getElementById("popupCorreo").style.display = "flex"; 
        } else {
            alert("No se ha enviado el correo: " + response.data.message);
        }
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
    const errorGeneral = document.getElementById('errorGeneral');

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
            document.getElementById("popupConfirmacion").style.display = "flex";
        } else {
            errorGeneral.style.display = 'inline';
            errorGeneral.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Correo o Contraseña incorrectos`;
        }
    })
    .catch(error => {
        console.error('Error al iniciar sesión', error);
    });
    
});

function aceptarBtn(){
    document.getElementById("popupConfirmacion").style.display = "none";
    window.location.href = '../index.html'; 
}