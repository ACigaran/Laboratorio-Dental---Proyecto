document.addEventListener('DOMContentLoaded', function() {
    const formAgregarGasto = document.getElementById('formAgregarGasto');
    const statusAgregarGasto = document.getElementById('statusAgregarGasto');
    const tablaGastosBody = document.querySelector('table tbody'); 

    if (formAgregarGasto) {
        formAgregarGasto.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const nombreMaterial = document.getElementById('nombreMaterialInput').value.trim();
            const precioMaterial = document.getElementById('precioMaterialInput').value;
            if (!nombreMaterial || !precioMaterial) {
                mostrarMensaje(statusAgregarGasto, "Por favor, complete todos los campos.", "red");
                return;
            }
            const precioNum = parseFloat(precioMaterial);
            if (isNaN(precioNum) || precioNum <= 0) {
                mostrarMensaje(statusAgregarGasto, "Ingrese un precio válido.", "red");
                return;
            }
            mostrarMensaje(statusAgregarGasto, "Agregando gasto...", "blue");
            fetch('/api/gastos-material/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombreMaterial: nombreMaterial, precioMaterial: precioNum })
            })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje(statusAgregarGasto, data.message, data.success ? 'green' : 'red');
                if (data.success && data.gasto && tablaGastosBody) {
                    formAgregarGasto.reset(); 
                    const nuevaFila = tablaGastosBody.insertRow(0); 
                    nuevaFila.insertCell(0).textContent = data.gasto.NombreMaterial;
                    nuevaFila.insertCell(1).textContent = `$${data.gasto.Precio.toFixed(2)}`;
                    nuevaFila.insertCell(2).textContent = data.gasto.FechaFormateada;
                    const filaVacia = tablaGastosBody.querySelector('td[colspan="3"]');
                    if (filaVacia) {
                        filaVacia.parentElement.remove();
                    }
                }
            })
            .catch(error => {
                console.error('Error al agregar gasto:', error);
                mostrarMensaje(statusAgregarGasto, "Error de conexión al agregar el gasto.", "red");
            });
        });
    }

    function mostrarMensaje(elemento, mensaje, color) {
        if (elemento) {
            elemento.textContent = mensaje;
            elemento.style.color = color;
            setTimeout(() => {
                elemento.textContent = '';
            }, 4000);
        }
    }
});