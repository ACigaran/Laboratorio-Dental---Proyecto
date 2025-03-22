function Trabajo (nombreTrabajo, tipoTrabajo, contado, mercadoPago) {
    this.nombre= nombreTrabajo;
    this.tipo= tipoTrabajo;
    this.precioContado= contado;
    this.precioMercadoPago= mercadoPago;
}

// ¡¡HARDCODEO!! TODOS LOS TRABAJOS QUE REALZIA EL LABORATORIO
let acrilico1 = new Trabajo('Protesis Completa', 'Acrilico', 6000, 6600);
let acrilico2 = new Trabajo('Hasta 2 piezas', 'Acrilico', 3500, 3850);
let acrilico3 = new Trabajo('De 3 a 5 piezas', 'Acrilico', 4500, 4950);
let acrilico4 = new Trabajo('De 6 a 10 piezas', 'Acrilico', 5300, 5830);
let acrilico5 = new Trabajo('Más de 10 piezas', 'Acrilico', 6000, 6600);
let acrilico6 = new Trabajo('Provisoria hasta 2 piezas', 'Acrilico', 2000, 2200);

let cromo1 = new Trabajo('Hasta 2 piezas', 'Cromo', 10000, 11000);
let cromo2 = new Trabajo('De 3 a 5 piezas', 'Cromo', 11000, 12100);
let cromo3 = new Trabajo('Más de 5 piezas', 'Cromo', 12000, 13200);

let reparaciones1 = new Trabajo('Sencillas de fractura', 'Reparaciones', 800);
let reparaciones2 = new Trabajo('Con molde', 'Reparaciones', 1000);
let reparaciones3 = new Trabajo('Agregado de diente', 'Reparaciones', 1000);
let reparaciones4 = new Trabajo('Agregado de gancho', 'Reparaciones', 1000);
let reparaciones5 = new Trabajo('Placa de contención', 'Reparaciones', 2000, 2200);
let reparaciones6 = new Trabajo('Placas de blancamiento (inf y sup)', 'Reparaciones', 2000, 2200);
let reparaciones7 = new Trabajo('Tratam. Blanc. (placas + jeringas)', 'Reparaciones', 4000, 4400);

// let trabajosPacientes = [
//     acrilico1, acrilico2, acrilico3,
//     acrilico4, acrilico5, acrilico6,
//     cromo1, cromo2, cromo3, reparaciones1,
//     reparaciones2, reparaciones3, 
//     reparaciones4, reparaciones5,
//     reparaciones6, reparaciones7,
// ];

// =================================
// ====================== > ACRILICO
// =================================

// CAMBIAR NOMBRE
for (i = 1; i < 7; i++) {
    let temporalNombreA = document.getElementById(`nombreCeldaAcrilico`+i);
    if (i == 1) {
        temporalNombreA.innerHTML = acrilico1.nombre;
    } if (i == 2) {
        temporalNombreA.innerHTML = acrilico2.nombre;
    } if (i == 3) {
        temporalNombreA.innerHTML = acrilico3.nombre;
    } if (i == 4) {
        temporalNombreA.innerHTML = acrilico4.nombre;
    } if (i == 5) {
        temporalNombreA.innerHTML = acrilico5.nombre;
    } if (i == 6) {
        temporalNombreA.innerHTML = acrilico6.nombre;
    }
}

// CAMBIAR PRECIO
for (i = 1; i < 13; i++) {
    let temporalPrecioA = document.getElementById('HolderAcrilico'+i);
    if (i == 1) {
        temporalPrecioA.value = acrilico1.precioContado;
    } if (i == 2) {
        temporalPrecioA.value = acrilico1.precioMercadoPago;
    } if (i == 3) {
        temporalPrecioA.value = acrilico2.precioContado;
    } if (i == 4) {
        temporalPrecioA.value = acrilico2.precioMercadoPago;
    } if (i == 5) {
        temporalPrecioA.value = acrilico3.precioContado;
    } if (i == 6) {
        temporalPrecioA.value = acrilico3.precioMercadoPago;
    } if (i == 7) {
        temporalPrecioA.value = acrilico4.precioContado;
    } if (i == 8) {
        temporalPrecioA.value = acrilico4.precioMercadoPago;
    } if (i == 9) {
        temporalPrecioA.value = acrilico5.precioContado;
    } if (i == 10) {
        temporalPrecioA.value = acrilico5.precioMercadoPago;
    } if (i == 11) {
        temporalPrecioA.value = acrilico6.precioContado;
    } if (i == 12) {
        temporalPrecioA.value = acrilico6.precioMercadoPago;
    }
}

// ==============================
// ====================== > CROMO
// ==============================

// CAMBIAR NOMBRE
for (i = 1; i < 4; i++) {
    let temporalNombreC = document.getElementById(`nombreCeldaCromo`+i);
    if (i == 1) {
        temporalNombreC.innerHTML = cromo1.nombre;
    } if (i == 2) {
        temporalNombreC.innerHTML = cromo2.nombre;
    } if (i == 3) {
        temporalNombreC.innerHTML = cromo3.nombre;
    }
}

// CAMBIAR PRECIO
for (i = 1; i < 7; i++) {
    let temporalPrecioC = document.getElementById('HolderCromo'+i);
    if (i == 1) {
        temporalPrecioC.value = cromo1.precioContado;
    } if (i == 2) {
        temporalPrecioC.value = cromo1.precioMercadoPago;
    } if (i == 3) {
        temporalPrecioC.value = cromo2.precioContado;
    } if (i == 4) {
        temporalPrecioC.value = cromo2.precioMercadoPago;
    } if (i == 5) {
        temporalPrecioC.value = cromo3.precioContado;
    } if (i == 6) {
        temporalPrecioC.value = cromo3.precioMercadoPago;
    }
}

// =====================================
// ====================== > REPARACIONES
// =====================================

// CAMBIAR NOMBRE
for (i = 1; i < 8; i++) {
    let temporalNombreR = document.getElementById(`nombreCeldaReparaciones`+i);
    if (i == 1) {
        temporalNombreR.innerHTML = reparaciones1.nombre;
    } if (i == 2) {
        temporalNombreR.innerHTML = reparaciones2.nombre;
    } if (i == 3) {
        temporalNombreR.innerHTML = reparaciones3.nombre;
    } if (i == 4) {
        temporalNombreR.innerHTML = reparaciones4.nombre;
    } if (i == 5) {
        temporalNombreR.innerHTML = reparaciones5.nombre;
    } if (i == 6) {
        temporalNombreR.innerHTML = reparaciones6.nombre;
    } if (i == 7) {
        temporalNombreR.innerHTML = reparaciones7.nombre;
    }
}

// CAMBIAR PRECIO
for (i = 1; i < 11; i++) {
    let temporalPrecioR = document.getElementById('HolderReparaciones'+i);
    if (i == 1) {
        temporalPrecioR.value = reparaciones1.precioContado;
    } if (i == 2) {
        temporalPrecioR.value = reparaciones2.precioContado;
    } if (i == 3) {
        temporalPrecioR.value = reparaciones3.precioContado;
    } if (i == 4) {
        temporalPrecioR.value = reparaciones4.precioContado;
    } if (i == 5) {
        temporalPrecioR.value = reparaciones5.precioContado;
    } if (i == 6) {
        temporalPrecioR.value = reparaciones5.precioMercadoPago;
    } if (i == 7) {
        temporalPrecioR.value = reparaciones6.precioContado;
    } if (i == 8) {
        temporalPrecioR.value = reparaciones6.precioMercadoPago;
    } if (i == 9) {
        temporalPrecioR.value = reparaciones7.precioContado;
    } if (i == 10) {
        temporalPrecioR.value = reparaciones7.precioMercadoPago;
    }
}

// TOMAR EL VALOR QUE ESTA EN EL INPUT 
let escritoInput = document.getElementById('HolderReparaciones10');

function tomarInput() {
    console.log(escritoInput.value);
}

// TENDRIA QUE VER SI EL INPUT CAMBIO, COMPARAR EL VALOR ACTUAL CON EL QUE ESTA EN EL OBJETO Y SI CAMBIO  ASIGNARLE EL NUEVO VALOR
