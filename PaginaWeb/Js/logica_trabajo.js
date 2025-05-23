function guardarCambiosPrecios() {
    const form = document.getElementById('preciosForm');
    const inputs = form.querySelectorAll('input[type="number"][data-id]');
    const statusMensaje = document.getElementById('statusMensaje');
    statusMensaje.textContent = 'Guardando...';
    statusMensaje.style.color = 'black';

    const preciosParaEnviar = [];
    const idsProcesados = new Set();

    inputs.forEach(input => {
        const id = input.dataset.id;
        if (!idsProcesados.has(id)) {
            const inputContado = form.querySelector(`input[data-id="${id}"][data-field="PrecioContado"]`);
            const inputMercadoLibre = form.querySelector(`input[data-id="${id}"][data-field="PrecioMercadolibre"]`);
            const precioData = {
                id: parseInt(id, 10),
                precioContado: inputContado ? inputContado.value : null,
                precioMercadoLibre: inputMercadoLibre ? inputMercadoLibre.value : null
            };
            if (precioData.precioContado === '' || precioData.precioContado === null) {
                statusMensaje.textContent = `Error: El precio contado para el trabajo con ID ${id} no puede estar vacío.`;
                statusMensaje.style.color = 'red';
            }
            preciosParaEnviar.push(precioData);
            idsProcesados.add(id);
        }
    });
    if (statusMensaje.style.color === 'red') {
        console.log("Envío cancelado debido a errores de validación en cliente.");
        setTimeout(() => { statusMensaje.textContent = ''; }, 5000);
        return; 
    }
    fetch('/api/precios/actualizar', {
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
        console.error('Error en fetch:', error);
        statusMensaje.textContent = `Error al guardar: ${error.message || 'Error de conexión.'}`;
        statusMensaje.style.color = 'red';
        setTimeout(() => { statusMensaje.textContent = ''; }, 5000);
    });
}