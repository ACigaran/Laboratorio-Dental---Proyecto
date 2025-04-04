let usuarioIngresado = localStorage.getItem("usuario");
let avisoCuadro = document.getElementById('cartelDeAviso');

function irAlLogin() {
    if (usuarioIngresado !== null) {
        // avisoCuadro.innerHTML = `
        //     <div style="background-color: brown; width=80vh; height=80vh; position=absolute; z-index=1000; ">
        //         <h1> !Usted ya esta logeado! </h1>
        //     </div>
        // `;
        alert("¡Usted ya se ingreso!");
    } else {
        window.location.href="./Rutas/Login.html"
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

function irListaTrabajos() {
    if (usuarioIngresado !== null) {
        window.location.href="./Rutas/SeleccionarLista/PublicoObjetivo.html"
    } else {
        alert('¡SOLO USUARIOS PUEDEN ACCEDER!')
    }
}

function irPacientes() {
    if (usuarioIngresado !== null) {
        window.location.href="./Rutas/Pacientes.html";
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}

function irConsultorios() {
    if (usuarioIngresado !== null) {
        window.location.href="./Rutas/Consultorios.html";
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}

function irTrabajosActivos() {
    if (usuarioIngresado !== null) {
        window.location.href="./Rutas/TrabajosActivos.html"    
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}

function irGastosMaterial() {
    if (usuarioIngresado !== null) {
        window.location.href="./Rutas/GastosMaterial.html"
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}

function irBalanceMensual() {
    if (usuarioIngresado !== null) {
        window.location.href="./Rutas/BalanceMensual.html"
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}