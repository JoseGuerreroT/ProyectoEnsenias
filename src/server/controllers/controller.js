//const db = require('../database')
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'enseniasbd'
});


function checkWordSpaces(req, res) {
    console.log("asdasd");
    var data = req.body.frase;
    query(data).then(result => {
        // implement your success case...
        console.log("implemente yot...")
        console.log(result); // <-- MANDAR A OTRA FUNCION
    }).catch(err => {
        //throw exception here...
    });

    function query(data) {
        let consulta;
        // --> PARA BUSCAR PALABRAS QUE CONTENGAN ESPACIOS <--
        return new Promise((resolve, reject) => {
            consulta = `SELECT * FROM WordWithSpaces`; // Devuelve todas las palabras con espacios usando la vista sql
            connection.query(consulta, function (error, results, fields) {
                result = JSON.parse(JSON.stringify(results)); // Convertir consulta en json
                let dataJoined = data.join(' '); // Convierte arreglo en un string, (Cada posicion es separada por un espacio)
                result.forEach(function (element) {
                    if (dataJoined.includes(element.nombre) == true) { // Si alguna palabra con espacio de la bd esta contenida en la frase enviada por annyang
                        ReplaceForSlash = element.nombre.toString().replace(new RegExp(" ", 'g'), '/') // Replamzar los espacios de la palabra encontrada por Slash
                        dataJoined = dataJoined.toString().replace(element.nombre, ReplaceForSlash) // Reemplazar los espacios la frase encontrada por slah (ej: adjetivo calificativo -> adjetivo/calificativo)
                    }
                });
                dataAux = dataJoined.split(' '); // Convertir vector toda la frase por espacios, ej: [el] [adjetivo/calificativo] [de] [una] [oracion]
                data = []
                dataAux.forEach(function (element) {
                    data.push(element.replace(new RegExp("/", 'g'), ' ')) // Quitar los slash del vector [el] [adjetivo calificativo] [de] ....
                })
                resolve(data);


                if (error) reject(error); //terminate the promisse...
            });
        });
    }
}

module.exports = {
    checkWordSpaces
}