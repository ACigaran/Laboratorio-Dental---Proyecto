let usuarioIngresado = localStorage.getItem("usuario");
let cuadroAlertas = document.getElementsByClassName('alertas');


function irAlLogin() {
    if (usuarioIngresado !== null) {
        alert("¡Usted ya se ingreso!");
    } else {
        window.location.href="../Rutas/Login.html"
    }
}

function deslogearse() {
    if (usuarioIngresado !== null) {
        localStorage.removeItem("usuario");
        window.location.href="./Index.html"
        alert('Usted se deslogeo exitosamente')
    } else {
        alert('Primero debe logearse');
    }
}

function comprobarUsuario() {
    if (usuarioIngresado !== null) {
        window.location.href="../Rutas/Trabajos.html"
    } else {
        alert('¡SOLO USUARIOS PUEDEN ACCEDER!')
    }
}