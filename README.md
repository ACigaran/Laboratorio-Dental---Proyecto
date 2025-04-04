
## Programa de control para un Laboratorio Dental (v 2.0)
Crear una pagina utilizando html, css, js y mysql que se adapte a un dispositivo movil,
debera funcionar para administrar y gestionar los trabajos de un laboratorio.
Manejara peticiones a la base de datos, diferentes tablas de precios, pacientes,
consultorios y a su vez servira para administrar las ganancias del laboratorio y
gastos de materiales, contando con una agenda de trabajos activos, saldo pendiente,
saldo cobrado y capital invertido.
___
![Imagen portada](https://media.istockphoto.com/id/1202232185/es/vector/proceso-de-impresi%C3%B3n-3d-m%C3%A9dica-de-pr%C3%B3tesis-dentales.jpg?s=612x612&w=0&k=20&c=rXaMQbw0fFl3S09jH54AfWVSx4LYeBxqTuA_msBiSSw=)
___
## Funciones
### Parametos basicos a considerar:

- Trabajos: Nombre del trabajo, Tipo del trabajo, Precio Contado, Precio MercadoPago.
- Pacientes: Tienen un Nombre, Apellido, Lista de trabajos realizados, Trabajo activo.
- Consultorios: Tiene un Nombre, Direccion, lista de trabajos realizados, Trabajo activo.

| Metodos y clases a implementar | Responsabilidad |
------------------------|-----------------|
| Trabajos Consultorio | Conocer todos los trabajos que realiza el consultorio segun su nombre y precio (los trabajos en pacientes y consultorios son iguales, pero con diferente precio) |
| Asignar Saldos | Asignarle a un paciente un trabajo de los * Trabajos Consultorio * un saldo activo, una fecha de "inicio de trabajo" |
| Adelanto Pago-Saldo | Puede restar una parte o el total del saldo activo del paciente |
| Trabajos Activos | Conoce todos los pacientes con trabajos activos, en que fecha inicio el trabajo, el valor total del trabajo, cuanto dinero entrego y cuanto dinero falta para terminar el saldo |
| Balance mensual | Total del dinero que ingreso al laboratorio en el mes, total del dinero faltante para terminar los trabajos, estimativo total en funcion de cuantos trabajos se realizaron en el mes |
| Gasto mensual | Total del dinero que salio del laboratorio en el mes, cada x tiempo el laboratorio debe comprar materiales para trabajar, esas compras/gastos entran aqui |
