let mysql = require("mysql");

let conexion = mysql.createConnection({

});

conexion.connect(function(err){
    if(err){
        throw err;
    } else {
        console.log("conexion exitosa");
    }
});

let nombreTrabajo = 'SELECT Nombre FROM TrabajosConsultorios;';
let precioTrabajo = 'SELECT PrecioContado FROM TrabajosConsultorios;';


conexion.query(nombreTrabajo, function(error, lista){
    if(error){
        throw error;
    }else{
        console.log(lista);
    }
});


conexion.end();