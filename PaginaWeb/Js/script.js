let usuarioIngresado = localStorage.getItem("usuario");
let avisoCuadro = document.getElementById('cartelDeAviso');

function irAlLogin() {
    if (usuarioIngresado !== null) {
        // avisoCuadro.innerHTML = `
        //     <div width="80vh" height="80vh" position="fixed" z-index=" 1000" style="background-color: brown;">
        //         <h1> !Usted ya esta logeado! </h1>
        //     </div>
        // `;
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

function irPacientes() {
    window.location.href="../Rutas/Pacientes.html";
}