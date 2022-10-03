const prompt = require("prompt-sync")({ sigint: true });



let patenteInput = prompt("Ingrese la patente del vehiculo");

let horaIngreso = prompt("Registre la hora de ingreso del vehiculo");

let horaEgreso = prompt("Ingrese la hora de egreso del vehiculo");

let cantidadHorasEstacionado = prompt("¿Cuanto tiempo estuvo estacionado?")

let precioPorHora = 150;
let autosActuales = 0;

let totalAbonar = cantidadHorasEstacionado * precioPorHora;
alert("se debe la cantidad de" + totalAbonar);



let capacidadTotalVehiculos = 80;
let cantidadVehiculos = parseInt(prompt("Ingrese la cantidad de vehiculos en el estacionamiento"));


function calcularDisponibilidad() {
    return cantidadVehiculos <= capacidadTotalVehiculos;
}

function registrarIngreso() {
    if (calcularDisponibilidad()) {
        autosActuales += 1;
    } else {
        alert("Hay lugar")
    }
}

let ingresoAutos = () =>{
    for (let i = 0; i < autosActuales; i++){
        alert("auto numero" + i)  
    }
    alert("auto numero" + i)

}




/* CUANDO VEAMOS ARRAY 
let listadoVehiculos = [
    {
        patente: "AF428OR",
        vehiculo: "Fiat Pulse",
    }

];

console.log(listadoVehiculos); */


