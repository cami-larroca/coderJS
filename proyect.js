
let horaIngreso = prompt("Registre la hora de ingreso del vehiculo");

let horaEgreso = prompt("Ingrese la hora de egreso del vehiculo");

let cantidadHorasEstacionado = prompt("¿Cuanto tiempo estuvo estacionado?")

let precioPorHora = 150;

let totalAbonar = cantidadHorasEstacionado * precioPorHora;
alert("se debe la cantidad de" + totalAbonar); 

class Estacionamiento {
    constructor(listadoVehiculos, capacidadTotalVehiculos) {
        this.listadoVehiculos = []
        this.capacidadTotalVehiculos = capacidadTotalVehiculos
    }
}

const estacionamientoJson = JSON.stringify(Estacionamiento);
localStorage.setItem("Estacionamiento", estacionamientoJson);

class Auto {
    constructor (patente){
        this.patente = patente;
    }
}

const AutoJson = JSON.stringify(Auto);
localStorage.setItem("Auto", AutoJson);


// Inicializo estacionamiento
let capacidadTotalVehiculos = parseInt(prompt("Ingrese la cantidad de vehiculos que permite el estacionamiento"));
let estacionamiento = new Estacionamiento(capacidadTotalVehiculos);

function registrarIngreso(patente) {
    if (hayDisponibilidad()) {
        let auto1 = new Auto(patente);
        estacionamiento.listadoVehiculos.push(auto1);
        alert(`Auto patente ${patente} se ingreso correctamente`); 
    } else {
        alert("No hay lugar")
    }
}

const registrarIngresoJson = JSON.stringify(registrarIngreso);
localStorage.setItem = ("registrarIngreso", registrarIngresoJson);

function hayDisponibilidad() {
    return estacionamiento.listadoVehiculos.length < capacidadTotalVehiculos;
}


// Ingreso un vehiculo
let patenteIngresada = prompt("Ingrese la patente del vehiculo");
registrarIngreso(patenteIngresada);

const patenteJson = JSON.stringify(patenteIngresada);
localStorage.setItem ("patenteIngresada", patenteJson);

// Ingreso un vehiculo mas
let patenteIngresada2 = prompt("Ingrese la patente del vehiculo");
registrarIngreso(patenteIngresada2);

const patenteIngresada2Json = JSON.stringify(patenteIngresada2);
localStorage.setItem("patenteIngresada2", patenteIngresada2Json);

console.log(estacionamiento);

const busquedaPorPatente = listadoVehiculos.find((vehiculo) => {
    return vehiculo.patente === "";
});

console.log(busquedaPorPatente);

const encontrarPatente = listadoVehiculos.filter((vehiculo) => {
    return vehiculo.patente === "";
});

console.log(encontrarPatente);

