function registrarPago(tipoEntidad, idParaActualizar, montoIngresado) {
    const montoPago = parseFloat(montoIngresado);
    const statusElement = document.getElementById(`status-pago-${idParaActualizar}-${tipoEntidad.toLowerCase()}`);
    if (isNaN(montoPago) || montoPago <= 0) {
        mostrarMensajeFila(statusElement, "Ingrese un monto válido.", "red");
        return;
    }
    let url = '';
    let body = {};
    if (tipoEntidad === 'Paciente') {
        url = '/api/pagos/paciente-asignacion';
        body = { asignacionId: idParaActualizar, montoPago: montoPago };
    } else if (tipoEntidad === 'Consultorio') {
        url = '/api/pagos/consultorio-asignacion';
        body = { asignacionId: idParaActualizar, montoPago: montoPago };
    } else {
        mostrarMensajeFila(statusElement, "Tipo de entidad desconocido.", "red");
        return;
    }
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        mostrarMensajeFila(statusElement, data.message, data.success ? 'green' : 'red');
        if (data.success) {
            const fila = document.getElementById(`fila-trabajo-${tipoEntidad.toLowerCase()}-${idParaActualizar}`);
            if (fila) {
                const nuevoCobrado = parseFloat(data.nuevoMontoCobrado);
                const precioTotal = parseFloat(data.precioTotal);
                if (!isNaN(nuevoCobrado) && !isNaN(precioTotal)) {
                    fila.querySelector('.monto-cobrado').textContent = `$${nuevoCobrado.toFixed(2)}`;
                    const faltante = precioTotal - nuevoCobrado;
                    fila.querySelector('.monto-faltante').textContent = `$${faltante.toFixed(2)}`;
                }
            }
            document.getElementById(`pago-${idParaActualizar}-${tipoEntidad.toLowerCase()}`).value = '';
        }
    })
    .catch(error => {
        console.error(`Error al registrar pago para ${tipoEntidad} ID ${idParaActualizar}:`, error);
        mostrarMensajeFila(statusElement, "Error de conexión.", "red");
    });
}

function marcarComoEntregado(tipoEntidad, idParaActualizar) {
    const statusElement = document.getElementById(`status-entrega-${idParaActualizar}-${tipoEntidad.toLowerCase()}`);
    let url = '';
    if (tipoEntidad === 'Paciente') {
        url = `/api/pacientes/${idParaActualizar}/marcar-entregado`;
    } else if (tipoEntidad === 'Consultorio') {
        url = `/api/consultorios/asignacion/${idParaActualizar}/marcar-entregado`;
    } else {
        mostrarMensajeFila(statusElement, "Tipo de entidad desconocido.", "red");
        return;
    }
    if (!confirm("¿Está seguro de que desea marcar este trabajo como entregado? Se eliminará de esta lista.")) {
        return;
    }
    fetch(url, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        mostrarMensajeFila(statusElement, data.message, data.success ? 'green' : 'red');
        if (data.success) {
            const fila = document.getElementById(`fila-trabajo-${tipoEntidad.toLowerCase()}-${idParaActualizar}`);
            if (fila) {
                fila.remove(); 
            }
            setTimeout(() => window.location.reload(), 1500);
        }
    })
    .catch(error => {
        console.error(`Error al marcar como entregado para ${tipoEntidad} ID ${idParaActualizar}:`, error);
        mostrarMensajeFila(statusElement, "Error de conexión.", "red");
    });
}

function mostrarMensajeFila(elemento, mensaje, color) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.color = color;
        setTimeout(() => {
            elemento.textContent = '';
        }, 4000);
    }
}