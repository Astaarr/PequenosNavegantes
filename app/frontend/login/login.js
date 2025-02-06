// Obtener elementos del DOM
const form = document.getElementById('formulario');



function submitEmail() {
    const data = {
        emailRecuperacion: document.getElementById('emailRecuperacion')
    }

    console.log("Email recuperacion enviado");

    axios.post('/PequenosNavegantes/app/backend/recuperar_password/enviar_codigo.php', JSON.stringify(data),{
        headers: {
            'Content-Type': 'application/json'
        }
    }) 
    .then(response => {
        console.log(response.data);
        if (response.data.success) {
            alert('Email enviado');
        } else {
            alert(response.data.message || "Error envio email");
        }
    })
    .catch(error => {
        console.error('Error envio email (catch)', error);
    });

}





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
