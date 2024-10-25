
## Programa de control para un Laboratorio Dental
Crear un programa en c# que se adapte a un dispositivo movil,
debera funcionar como una base de datos de los pacientes totales del
consultorio, administrador de saldos ($$$) del laboratorio, y ser una
agenda sobre trabajos activos y finalizados.

## Funciones
### Parametos basicos a considerar:

- Pacientes: Tienen un Nombre, Apellido, Dirección del hogar, lista de fechas de atención (con los trabajos realizados en esa fecha), saldo del trabajo activo
- Consultorios: Tiene un Nombre, Direccion de local, lista de trabajos realizados, saldo activo, lista propia de precios

| Metodos y clases a implementar | Responsabilidad |
------------------------|-----------------|
| Historial Clinico | Conocer cantidad de dientes que tiene y la cantidad de dientes que le faltan (segun la numeración de los dientes en si), lista de trabajos (protesis, cromos, arreglos) que ya se realizo en la boca |
| Trabajos Consultorio | Conocer todos los trabajos que realiza el consultorio segun su nombre y precio |
| Asignar Saldos | Asignarle a un paciente un trabajo de los * Trabajos Consultorio * un saldo activo, una fecha de "inicio de trabajo" |
| Adelanto Pago-Saldo | Conoce las fechas que el paciente se atendio y puede restar una parte o el total del saldo del paciente |
| Trabajos Activos | Conoce todos los pacientes con trabajos activos, en que fecha inicio el trabajo, el valor total del trabajo, cuanto dinero entrego y cuanto dinero falta para terminar el saldo |
| Balance mensual | (Similar a trabajos activos) Total del dinero que ingreso al laboratorio en el mes, total del dinero faltante para terminar los trabajos, estimativo total en funcion de cuantos trabajos se realizaron en el mes |
| Cambio Fecha | Un paciente puede cancelar una fecha de trabajo y cambiarla para una fecha futura |