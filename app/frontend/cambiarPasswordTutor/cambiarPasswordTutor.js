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