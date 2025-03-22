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

conexion.end();