
let capacidadTotalVehiculos = 80;
let estacionamiento;


function initPage() {
    estacionamiento = new Estacionamiento(capacidadTotalVehiculos);
    actualizarTextLugaresDisponibles();
}

initPage();

function actualizarTextLugaresDisponibles() {
    let lugaresDisponiblesElement = document.getElementById("lugares_disponibles");
    lugaresDisponiblesElement.innerText = "Lugares Disponibles: " + lugaresDisponibles();
}



function lugaresDisponibles() {
    return capacidadTotalVehiculos - estacionamiento.listadoVehiculos.length;

}

function hayDisponibilidad() {
    return estacionamiento.listadoVehiculos.length < capacidadTotalVehiculos;
    // alert con libreria sweet. HAY DISPONIBILIDAD
}

function registrarIngreso(patente) {
    if (hayDisponibilidad()) {
        let auto1 = new Auto(patente);
        estacionamiento.listadoVehiculos.push(auto1);
        actualizarTextLugaresDisponibles();
        Swal.fire({
            title: 'Auto ingresado!',
            text: `Auto patente ${patente} se ingreso correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } else {
        Swal.fire({
            title: 'Error!',
            text: "No hay lugar disponible",
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}


let botonIngreso = document.getElementById("botonIngreso");
botonIngreso.onclick = () => {
    let inputPatente = document.getElementById("patente_vehiculo");
    let patente = inputPatente.value;
    let patente1= inputPatente.value = "";
    registrarIngreso(patente);
}


let botonEgreso = document.getElementById("botonEgreso");
botonEgreso.onclick = () => {
    let inputPatente = document.getElementById("patente_vehiculo");
    let patente = inputPatente.value;
    let patente1 = inputPatente.value = "";

    let cantidadAutosPrevioEgreso = estacionamiento.listadoVehiculos.length;
    let nuevaLista = estacionamiento.listadoVehiculos.filter(auto => auto.patente !== patente);
    estacionamiento.listadoVehiculos = nuevaLista;



    if (estacionamiento.listadoVehiculos.length < cantidadAutosPrevioEgreso) {
        actualizarTextLugaresDisponibles();
        Swal.fire({
            title: 'Auto removido!',
            text: 'Se realizó el egreso con éxito!',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        })
    } else {
        Swal.fire({
            title: 'Atencion!',
            text: 'El auto no se encuentra en el estacionamiento',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        })
    }
}


function findAutoByPatente(patente) {
    for (const auto of estacionamiento.listadoVehiculos) {
        if (auto.patente === patente) {
            return auto;
        }
    }
    return null;
}
actualizarTextLugaresDisponibles();

/* 
const dateTime = luxon.DateTime; 
const now = DateTime.now; */


let listadoVehiculosJSON = JSON.stringify("listadoVehiculos");
localStorage.setItem("listadoVehiculos", listadoVehiculosJSON);


/* TABLA 

function actualizarTabla() {
    let body = document.getElementsByTagName("body")[0];

    // Crea un elemento <table> y un elemento <tbody>
    let tabla = document.createElement("table");
    let tblBody = document.createElement("tbody");

    // Creo las filas
    for (let i = 0; i < estacionamiento.listadoVehiculos; i++) {
        // Crea las hileras de la tabla
        let fila = document.createElement("tr");

        for (let j = 0; j < 4; j++) {
            let columna = document.createElement("td");
            let textoCelda = document.createTextNode("celda en la hilera " + i + ", columna " + j);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }

        // agrega la hilera al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(hilera);
    }

    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(tabla);
    // modifica el atributo "border" de la tabla y lo fija a "2";
    tabla.setAttribute("border", "2");
}
*/
