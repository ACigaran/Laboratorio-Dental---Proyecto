let usuarioIngresado = localStorage.getItem("usuario");
let avisoCuadro = document.getElementById('cartelDeAviso');

function irAlLogin() {
    if (usuarioIngresado !== null) {
        alert("¡Usted ya se ingreso!");
    } else {
        window.location.href="./Rutas/Login.html"
    }
}

function deslogearse() {
    if (usuarioIngresado !== null) {
        localStorage.removeItem("usuario");
        window.location.href="/"
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
        window.location.href="/pacientes";
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}

function irConsultorios() {
    if (usuarioIngresado !== null) {
        window.location.href="/consultorios";
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}

function irTrabajosActivos() {
    if (usuarioIngresado !== null) {
        window.location.href="/trabajos-activos"    
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}

function irGastosMaterial() {
    if (usuarioIngresado !== null) {
        window.location.href="/gastos-material"
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}

function irBalanceMensual() {
    if (usuarioIngresado !== null) {
        window.location.href="/balance-mensual"
    } else {
        alert('SOLO USUARIOS PUEDEN ACCEDER')
    }
}