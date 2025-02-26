document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById('formulario');
    const msgError= document.getElementById('campoError');

    formulario.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        const passwordOld = document.getElementById('passwordOld').value.trim();
        const passwordNew = document.getElementById('password').value.trim();

        // Validaciones simples
        if (!passwordOld || !passwordNew) {
            alert("Todos los campos son obligatorios");
            return;
        }

        if (passwordNew.length < 6) {
            alert("La nueva contraseña debe tener al menos 6 caracteres");
            return;
        }

        const data = {
            passwordOld: passwordOld,
            password: passwordNew
        };

        // Enviar los datos al servidor usando Axios
        axios.post('../../backend/cambiarDatosPadre/cambiarPasswordPadre.php', data)
            .then(response => {
                if (response.data.success) {
                    msgError.style.display= 'none';
                    document.getElementById('popupConfirmacion').style.display = 'flex';
                    formulario.reset(); // Limpiar los campos del formulario
                } else {
                    msgError.style.display= 'flex';
                    msgError.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Contraseña Incorrecta';
                    // alert(response.data.message);
                }
            })
            .catch(error => {
                console.error("Error al cambiar la contraseña:", error);
            });
    });
});

function aceptarPopup(){
    document.getElementById('popupConfirmacion').style.display = 'none';
    window.location.href = '../cuentaPadre/cuentaPadre.html'
}

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
        JSON.stringify({ emailRecuperacion: email }), // ✅ Enviar un objeto JSON correctamente
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