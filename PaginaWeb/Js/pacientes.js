function Paciente(nombre, apellido) {
    this.name = nombre;
    this.lastname = apellido;
    this.trabajoActivo = [{}];
    function agregarTrabajo(trabajo) {
        this.trabajoActivo = trabajo;
    }
}

let paciente1 = new Paciente('Juan', 'Bolpi');

function verPacientePrueba() {
    console.log(paciente1.name, paciente1.lastname, paciente1.trabajoActivo);
}
