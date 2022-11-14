let precioHora = 250;
let capacidadTotalVehiculos = 80;
let estacionamiento;

function initPage() {
    estacionamiento = new Estacionamiento([], capacidadTotalVehiculos, precioHora);
    actualizarTextLugaresDisponibles();
}

initPage();

function actualizarTextLugaresDisponibles() {
    const lugaresDisponiblesElement = document.getElementById("lugares_disponibles");
    lugaresDisponiblesElement.innerText = "Lugares Disponibles: " + lugaresDisponibles();
}

function lugaresDisponibles() {
    let contadorAutosEstadoIngresado = 0;
    for(let i = 0; i < estacionamiento.listadoVehiculos.length; i++) {
        if (estacionamiento.listadoVehiculos[i].estado === "INGRESADO") {
            contadorAutosEstadoIngresado++;
        }
    }
    return capacidadTotalVehiculos - contadorAutosEstadoIngresado;
}

function hayDisponibilidad() {
    return estacionamiento.listadoVehiculos.length < capacidadTotalVehiculos;
}

function registrarIngreso(patente) {
    if (patente === null || patente === "") {
        return ({ "status": false, "message": "Patente no ingresada" });
    }

    // VER ESTO
    let listaAutosEstacionamientoEncontrados = findListadoAutoEstacionamientoByPatente(patente);
    for (let i = 0; i < listaAutosEstacionamientoEncontrados.length;  i++) {
        if (listaAutosEstacionamientoEncontrados[i].estado === "INGRESADO") {
            return ({ "status": false, "message": "Auto ya ingresado" });
        }
    }

    if (hayDisponibilidad()) {
        let auto = new Auto(patente);
        let horaIngreso = new Date();
        let dateHanddler = new DateHanddler(horaIngreso, null);

        let autoEstacionamiento = new AutoEstacionamiento(auto, dateHanddler, "INGRESADO", "")
        estacionamiento.listadoVehiculos.push(autoEstacionamiento);
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
        updateTable(estacionamiento.listadoVehiculos);
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

function registrarEgreso(patente) {
    if(patente === null || patente === "") {
        return ({ "status": false, "message": "Patente no ingresada" });
    }

    for(let i = 0; i < estacionamiento.listadoVehiculos.length; i++) {
        if (estacionamiento.listadoVehiculos[i].auto.patente === patente) {
            estacionamiento.listadoVehiculos[i].estado = "EGRESADO";
        }
    }
    actualizarTextLugaresDisponibles();
    updateTable(estacionamiento.listadoVehiculos);
    return ({ "status": true, "message": "Auto ingresado" });
}

let botonEgreso = document.getElementById("botonEgreso");
botonEgreso.onclick = () => {
    let inputPatente = document.getElementById("patente_vehiculo");
    let patente = inputPatente.value;
    let result = registrarEgreso(patente);
    if (result.status) {
        Swal.fire({
            title: 'Auto egresado!',
            text: 'Se realizó el egreso con éxito!',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        })
    } else {
        Swal.fire({
            title: 'Error!',
            text: result.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

function updateTable(listaAutos) {
    clearTable();
    for (let i = 0; i < listaAutos.length; i++) {
        const autoEstacionamiento = listaAutos[i];
        addRow(autoEstacionamiento);
    }
}

function clearTable() {
    for (let i = 1; i < table.rows.length; i++) {
        table.deleteRow(i);
    }
}

// tabla con historial vehiculos

function addRow(autoEstacionamiento) {
    const table = document.getElementById('table');
    const rowCount = table.rows.length;
    const row = table.insertRow(rowCount);

    let cellPatente = row.insertCell(0);
    cellPatente.innerHTML = autoEstacionamiento.auto.patente;

    let cellHoraIngreso = row.insertCell(1);
    cellHoraIngreso.innerHTML = autoEstacionamiento.dateHanddler.getTimeStringFromDate(autoEstacionamiento.horaIngreso);

    let cellMonto = row.insertCell(2);
    cellMonto.innerHTML = autoEstacionamiento.monto;

    let cellEstado = row.insertCell(3);
    cellEstado.innerHTML = autoEstacionamiento.estado;

}

let buscarVehiculo = document.getElementById("buscarPatente");
buscarPatente.onclick = () => {
    let newLista = findListadoAutoEstacionamientoByPatente(patente);
    updateTable(newLista);
}

function findListadoAutoEstacionamientoByPatente(patente) {
    let lista = []
    for (let i = 0; i < estacionamiento.listadoVehiculos.length; i++) {
        if (estacionamiento.listadoVehiculos[i].auto.patente === patente) {
            lista.push(estacionamiento.listadoVehiculos[i]);
        }
    }
    return lista;
}


let listadoVehiculosJSON = JSON.stringify("listadoVehiculos");
localStorage.setItem("listadoVehiculos", listadoVehiculosJSON);


//fetch ("https://www.smn.gob.ar/");