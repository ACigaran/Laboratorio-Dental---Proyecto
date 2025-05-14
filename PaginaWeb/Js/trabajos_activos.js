document.addEventListener('DOMContentLoaded', function() {
    // Selectores para Pacientes
    const selectTrabajoPaciente = document.getElementById('trabajoPacienteSelect');
    const extrasPacienteContainer = document.getElementById('extrasPacienteContainer');
    const cantidadGanchosPacienteDiv = document.getElementById('cantidadGanchosPacienteDiv');
    const cantidadDientesPacienteDiv = document.getElementById('cantidadDientesPacienteDiv');
    const conDientesCromoPacienteDiv = document.getElementById('conDientesCromoPacienteDiv');
    const inputGanchosPaciente = document.getElementById('cantidadGanchosPaciente');
    const inputDientesPaciente = document.getElementById('cantidadDientesPaciente');
    const checkConDientesCromoPaciente = document.getElementById('conDientesCromoPaciente');
    const precioCalculadoContadoPacienteSpan = document.getElementById('precioCalculadoContadoPaciente');
    const precioCalculadoMPPacienteSpan = document.getElementById('precioCalculadoMPPaciente');
    const formAsignarPaciente = document.getElementById('formAsignarPaciente');
    const statusAsignarPaciente = document.getElementById('statusAsignarPaciente');

    // Selectores para Consultorios
    const selectTrabajoConsultorio = document.getElementById('trabajoConsultorioSelect');
    const extrasConsultorioContainer = document.getElementById('extrasConsultorioContainer');
    const cantidadGanchosConsultorioDiv = document.getElementById('cantidadGanchosConsultorioDiv');
    const cantidadDientesConsultorioDiv = document.getElementById('cantidadDientesConsultorioDiv');
    const conDientesCromoConsultorioDiv = document.getElementById('conDientesCromoConsultorioDiv');
    const inputGanchosConsultorio = document.getElementById('cantidadGanchosConsultorio');
    const inputDientesConsultorio = document.getElementById('cantidadDientesConsultorio');
    const checkConDientesCromoConsultorio = document.getElementById('conDientesCromoConsultorio');
    const precioCalculadoContadoConsultorioSpan = document.getElementById('precioCalculadoContadoConsultorio');
    const formAsignarConsultorio = document.getElementById('formAsignarConsultorio');
    const statusAsignarConsultorio = document.getElementById('statusAsignarConsultorio');

    // --- Lógica para Pacientes ---
    if (selectTrabajoPaciente) {
        selectTrabajoPaciente.addEventListener('change', function() {
            resetExtrasPaciente();
            actualizarPrecioCalculadoPaciente(); // Actualiza a precio base al cambiar
            mostrarOpcionesExtrasPaciente(this.options[this.selectedIndex]);
        });
        [inputGanchosPaciente, inputDientesPaciente, checkConDientesCromoPaciente].forEach(el => {
            if (el) el.addEventListener('input', actualizarPrecioCalculadoPaciente);
        });
    }

    function resetExtrasPaciente() {
        cantidadGanchosPacienteDiv.style.display = 'none';
        inputGanchosPaciente.value = 0;
        document.getElementById('costoGanchoPaciente').textContent = '';
        cantidadDientesPacienteDiv.style.display = 'none';
        inputDientesPaciente.value = 0;
        document.getElementById('costoDientePaciente').textContent = '';
        conDientesCromoPacienteDiv.style.display = 'none';
        checkConDientesCromoPaciente.checked = false;
    }

    function mostrarOpcionesExtrasPaciente(selectedOption) {
        if (!selectedOption || !selectedOption.dataset.nombreTrabajo) return;
        const nombreTrabajo = selectedOption.dataset.nombreTrabajo.toLowerCase();

        if (nombreTrabajo.includes("cada gancho")) {
            cantidadGanchosPacienteDiv.style.display = 'block';
            const costo = nombreTrabajo.includes("+150") ? 150 : (nombreTrabajo.includes("+100") ? 100 : 0);
            inputGanchosPaciente.dataset.costoUnitario = costo;
            document.getElementById('costoGanchoPaciente').textContent = `(+$${costo} c/u)`;
        }
        if (nombreTrabajo.includes("cada diente")) {
            cantidadDientesPacienteDiv.style.display = 'block';
            const costo = nombreTrabajo.includes("+150") ? 150 : (nombreTrabajo.includes("+100") ? 100 : 0);
            inputDientesPaciente.dataset.costoUnitario = costo;
            document.getElementById('costoDientePaciente').textContent = `(+$${costo} c/u)`;
        }
        if (nombreTrabajo.includes("con dientes")) { // Asumimos que es el de +300
            conDientesCromoPacienteDiv.style.display = 'block';
        }
    }

    function actualizarPrecioCalculadoPaciente() {
        const selectedOption = selectTrabajoPaciente.options[selectTrabajoPaciente.selectedIndex];
        if (!selectedOption || !selectedOption.dataset.precioBase) {
            precioCalculadoContadoPacienteSpan.textContent = '0.00';
            precioCalculadoMPPacienteSpan.textContent = '0.00';
            return;
        }

        let precioBaseContado = parseFloat(selectedOption.dataset.precioBase) || 0;
        let precioBaseMP = parseFloat(selectedOption.dataset.precioMp) || 0; 
        let costoExtra = 0;

        if (cantidadGanchosPacienteDiv.style.display !== 'none') {
            costoExtra += (parseInt(inputGanchosPaciente.value) || 0) * (parseFloat(inputGanchosPaciente.dataset.costoUnitario) || 0);
        }
        if (cantidadDientesPacienteDiv.style.display !== 'none') {
            costoExtra += (parseInt(inputDientesPaciente.value) || 0) * (parseFloat(inputDientesPaciente.dataset.costoUnitario) || 0);
        }
        if (conDientesCromoPacienteDiv.style.display !== 'none' && checkConDientesCromoPaciente.checked) {
            costoExtra += 300; // Costo fijo por "con dientes"
        }

        precioCalculadoContadoPacienteSpan.textContent = (precioBaseContado + costoExtra).toFixed(2);
        if (precioBaseMP > 0) { // Solo calcula MP si hay precio base MP
             precioCalculadoMPPacienteSpan.textContent = (precioBaseMP + costoExtra).toFixed(2); // Asumimos que el extra se suma igual a MP
        } else {
            precioCalculadoMPPacienteSpan.textContent = 'N/A';
        }
    }

    if (formAsignarPaciente) {
        formAsignarPaciente.addEventListener('submit', function(event) {
            event.preventDefault();
            const pacienteId = this.elements.pacienteId.value;
            const trabajoId = this.elements.trabajoId.value;
            const extrasGanchos = parseInt(inputGanchosPaciente.value) || 0;
            const extrasDientes = parseInt(inputDientesPaciente.value) || 0;
            const extrasCromoConDientes = checkConDientesCromoPaciente.checked;
            const precioFinalAsignado = parseFloat(precioCalculadoContadoPacienteSpan.textContent) || 0;

            if (!pacienteId || !trabajoId) {
                mostrarMensaje(statusAsignarPaciente, 'Por favor, seleccione un paciente y un trabajo.', 'red');
                return;
            }
            if (precioFinalAsignado <= 0 && selectTrabajoPaciente.value) { // Evitar enviar si no se ha calculado un precio válido
                mostrarMensaje(statusAsignarPaciente, 'Error al calcular el precio final. Verifique las selecciones.', 'red');
                return;
            }
            const datosParaEnviar = {
                pacienteId,
                trabajoId,
                extras_ganchos_cantidad: extrasGanchos,
                extras_dientes_cantidad: extrasDientes,
                extras_cromo_con_dientes: extrasCromoConDientes,
                precio_final_asignado: precioFinalAsignado
                // , precio_final_mp_asignado: precioFinalMPAsignado
            };

            fetch('/api/pacientes/asignar-trabajo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosParaEnviar) 
            })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje(statusAsignarPaciente, data.message, data.success ? 'green' : 'red');
                if (data.success) {
                    formAsignarPaciente.reset();
                    resetExtrasPaciente();
                    actualizarPrecioCalculadoPaciente();
                    setTimeout(() => window.location.reload(), 2000);
                }
            })
            .catch(error => {
                console.error('Error al asignar trabajo a paciente:', error);
                mostrarMensaje(statusAsignarPaciente, 'Error de conexión al asignar trabajo.', 'red');
            });
        });
    }

    // Lógica para Consultorios
    if (selectTrabajoConsultorio) {
        selectTrabajoConsultorio.addEventListener('change', function() {
            resetExtrasConsultorio();
            actualizarPrecioCalculadoConsultorio();
            mostrarOpcionesExtrasConsultorio(this.options[this.selectedIndex]);
        });
        [inputGanchosConsultorio, inputDientesConsultorio, checkConDientesCromoConsultorio].forEach(el => {
            if (el) el.addEventListener('input', actualizarPrecioCalculadoConsultorio);
        });
    }

    function resetExtrasConsultorio() {
        cantidadGanchosConsultorioDiv.style.display = 'none';
        inputGanchosConsultorio.value = 0;
        document.getElementById('costoGanchoConsultorio').textContent = '';
        cantidadDientesConsultorioDiv.style.display = 'none';
        inputDientesConsultorio.value = 0;
        document.getElementById('costoDienteConsultorio').textContent = '';
        conDientesCromoConsultorioDiv.style.display = 'none';
        checkConDientesCromoConsultorio.checked = false;
    }

    function mostrarOpcionesExtrasConsultorio(selectedOption) {
        if (!selectedOption || !selectedOption.dataset.nombreTrabajo) return;
        const nombreTrabajo = selectedOption.dataset.nombreTrabajo.toLowerCase();

        if (nombreTrabajo.includes("cada gancho")) {
            cantidadGanchosConsultorioDiv.style.display = 'block';
            const costo = nombreTrabajo.includes("+150") ? 150 : (nombreTrabajo.includes("+100") ? 100 : 0);
            inputGanchosConsultorio.dataset.costoUnitario = costo;
            document.getElementById('costoGanchoConsultorio').textContent = `(+$${costo} c/u)`;
        }
        if (nombreTrabajo.includes("cada diente")) {
            cantidadDientesConsultorioDiv.style.display = 'block';
            const costo = nombreTrabajo.includes("+150") ? 150 : (nombreTrabajo.includes("+100") ? 100 : 0);
            inputDientesConsultorio.dataset.costoUnitario = costo;
            document.getElementById('costoDienteConsultorio').textContent = `(+$${costo} c/u)`;
        }
         if (nombreTrabajo.includes("con dientes")) { // Para el caso de "+300 con dientes"
            conDientesCromoConsultorioDiv.style.display = 'block';
        }
    }

    function actualizarPrecioCalculadoConsultorio() {
        const selectedOption = selectTrabajoConsultorio.options[selectTrabajoConsultorio.selectedIndex];
        if (!selectedOption || !selectedOption.dataset.precioBase) {
            precioCalculadoContadoConsultorioSpan.textContent = '0.00';
            return;
        }

        let precioBaseContado = parseFloat(selectedOption.dataset.precioBase) || 0;
        let costoExtra = 0;

        if (cantidadGanchosConsultorioDiv.style.display !== 'none') {
            costoExtra += (parseInt(inputGanchosConsultorio.value) || 0) * (parseFloat(inputGanchosConsultorio.dataset.costoUnitario) || 0);
        }
        if (cantidadDientesConsultorioDiv.style.display !== 'none') {
            costoExtra += (parseInt(inputDientesConsultorio.value) || 0) * (parseFloat(inputDientesConsultorio.dataset.costoUnitario) || 0);
        }
        if (conDientesCromoConsultorioDiv.style.display !== 'none' && checkConDientesCromoConsultorio.checked) {
            costoExtra += 300;
        }

        precioCalculadoContadoConsultorioSpan.textContent = (precioBaseContado + costoExtra).toFixed(2);
    }


    if (formAsignarConsultorio) {
        formAsignarConsultorio.addEventListener('submit', function(event) {
            event.preventDefault();
            const consultorioId = this.elements.consultorioId.value;
            const trabajoId = this.elements.trabajoId.value;
            const extrasGanchos = parseInt(inputGanchosConsultorio.value) || 0;
            const extrasDientes = parseInt(inputDientesConsultorio.value) || 0;
            const extrasCromoConDientes = checkConDientesCromoConsultorio.checked;
            const precioFinalAsignado = parseFloat(precioCalculadoContadoConsultorioSpan.textContent) || 0;

            if (!consultorioId || !trabajoId) {
                mostrarMensaje(statusAsignarConsultorio, 'Por favor, seleccione un consultorio y un trabajo.', 'red');
                return;
            }
            if (precioFinalAsignado <= 0 && selectTrabajoConsultorio.value) {
                mostrarMensaje(statusAsignarConsultorio, 'Error al calcular el precio final. Verifique las selecciones.', 'red');
                return;
            }

            const datosParaEnviar = {
                consultorioId,
                trabajoId,
                extras_ganchos_cantidad: extrasGanchos,
                extras_dientes_cantidad: extrasDientes,
                extras_cromo_con_dientes: extrasCromoConDientes,
                precio_final_asignado: precioFinalAsignado
            };

            fetch('/api/consultorios/asignar-trabajo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosParaEnviar) 
            })
            .then(response => response.json())
            .then(data => {
                mostrarMensaje(statusAsignarConsultorio, data.message, data.success ? 'green' : 'red');
                if (data.success) {
                    formAsignarConsultorio.reset();
                    resetExtrasConsultorio();
                    actualizarPrecioCalculadoConsultorio();
                    setTimeout(() => window.location.reload(), 2000);
                }
            })
            .catch(error => {
                console.error('Error al asignar trabajo a consultorio:', error);
                mostrarMensaje(statusAsignarConsultorio, 'Error de conexión al asignar trabajo.', 'red');
            });
        });
    }

    function mostrarMensaje(elemento, mensaje, color) {
        elemento.textContent = mensaje;
        elemento.style.color = color;
        setTimeout(() => {
            elemento.textContent = '';
        }, 5000);
    }
});