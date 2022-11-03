
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
}

function registrarIngreso(patente) {
    if (patente === null || patente === "") {
        return ({ "status": false, "message": "Patente no ingresada" });
    }
    if (hayDisponibilidad()) {
        let auto1 = new Auto(patente);
        estacionamiento.listadoVehiculos.push(auto1);
        actualizarTextLugaresDisponibles();
        return ({ "status": true, "message": "Auto ingresado" });
    } else {
        return ({ "status": false, "message": "No hay lugar" });
    }
}



let botonIngreso = document.getElementById("botonIngreso");
botonIngreso.onclick = () => {
    let inputPatente = document.getElementById("patente_vehiculo");
    let patente = inputPatente.value;

    let result = registrarIngreso(patente);
    if (result.status) {
        inputPatente.value = null;
        updateTable();
        Swal.fire({
            title: 'Auto ingresado!',
            text: `Auto patente ${patente} se ingreso correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } else {
        Swal.fire({
            title: 'Error!',
            text: result.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}


let botonEgreso = document.getElementById("botonEgreso");
botonEgreso.onclick = () => {
    let inputPatente = document.getElementById("patente_vehiculo");
    let patente = inputPatente.value;
    if (patente === "") {
        Swal.fire({
            title: 'Error!',
            text: 'No se ingresó ninguna patente',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
    }


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
            title: 'Atención!',
            text: 'El auto no se encuentra en el estacionamiento',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        })
    }
}


function updateTable() {
    clearTable();
    for (let i = 0; i < estacionamiento.listadoVehiculos.length; i++) {
        const auto = estacionamiento.listadoVehiculos[i];
        addRow(auto);
    }
}

function clearTable() {
    for(let i= 1; i < table.rows.length; i++) {
        table.deleteRow(i);
    } 
}

function addRow(auto) {
    let table = document.getElementById('table');
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    let cellPatente = row.insertCell(0);
    cellPatente.innerHTML = auto.patente;

    let cellHoraIngreso = row.insertCell(1);
    cellHoraIngreso.innerHTML = auto.patente;

    let cellMonto = row.insertCell(2);
    cellMonto.innerHTML = auto.patente;

    let cellEstadoActual = row.insertCell(3);
    cellEstadoActual.innerHTML = auto.patente;
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



