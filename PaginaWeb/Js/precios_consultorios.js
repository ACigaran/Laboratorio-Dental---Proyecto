function guardarCambiosPreciosConsultorios() {
    const form = document.getElementById('preciosConsultoriosForm');
    const inputs = form.querySelectorAll('input[type="number"][data-id]');
    const statusMensaje = document.getElementById('statusMensajeConsultorios');
    statusMensaje.textContent = 'Guardando...';
    statusMensaje.style.color = 'black';

    const preciosParaEnviar = [];

    for (const input of inputs) {
        const id = input.dataset.id;
        const field = input.dataset.field; 
        if (field === 'PrecioContado') {
            const precioData = {
                id: parseInt(id, 10),
                precioContado: input.value 
            };
            if (precioData.precioContado === '' || precioData.precioContado === null) {
                statusMensaje.textContent = `Error: El precio contado para el trabajo con ID ${id} no puede estar vacío.`;
                statusMensaje.style.color = 'red';
                setTimeout(() => { statusMensaje.textContent = ''; }, 5000);
                return;
            }
            preciosParaEnviar.push(precioData);
        }
    }

    fetch('/api/precios-consultorios/actualizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ precios: preciosParaEnviar })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.message || `Error del servidor: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            statusMensaje.textContent = data.message || 'Cambios guardados con éxito.';
            statusMensaje.style.color = 'green';
        } else {
            statusMensaje.textContent = 'Error: ' + (data.message || 'No se pudieron guardar los cambios.');
            statusMensaje.style.color = 'red';
        }
        setTimeout(() => { statusMensaje.textContent = ''; }, 5000);
    })
    .catch((error) => {
        console.error('Error en fetch (consultorios):', error);
        statusMensaje.textContent = `Error al guardar: ${error.message || 'Error de conexión.'}`;
        statusMensaje.style.color = 'red';
        setTimeout(() => { statusMensaje.textContent = ''; }, 5000);
    });
}