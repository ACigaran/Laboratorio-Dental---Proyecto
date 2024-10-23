## Programa de control para un Laboratorio Dental
Se debe crear un programa en c# que se adapte a un dispositivo movil


### Conceptos iniciales

### Parametos basicos a considerar:
- Paciente: Todos los pacientes tienen (Nombre, Apellido, Dirección, lista de fechas de atención, saldo)
- Historial clinico: Cada paciente tendra un historial clinico, dicho historial dara a conocer mediante una
imagen cuantos dientes tiene y cuantos dientes le faltan en funcion del orden numerico de los mismos, trabajos 
que el paciente ya se realizo en la boca (protesis, cromos, reparaciones)

Lista de trabajos que hace el consultorio (string NombreTrabajo, int precioTrabajo)

Asignar saldo a paciente, se selecciona un paciente y se le da un trabajo de los que hace el consultorio,
modificando su saldo actual, se agrega la fecha y el inicio del trabajo.

Adelantar pago, si el paciente entrega cierta cantidad de dinero, se le restara de su saldo del trabajo actual.

Lista de trabajos activos del consultorio con: paciente, fecha de inicio, fecha de entrega esperada y precio.

Balance mensual: dinero que entregaron por adelantado, dinero faltante para completar los trabajos y estimativo
total en funcion de los trabajos activos en el mes
