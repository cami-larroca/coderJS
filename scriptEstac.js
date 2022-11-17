
let precioHora = 250;
let capacidadTotalVehiculos = 80;
let estacionamiento;

function initPage() {
    estacionamiento = new Estacionamiento([], capacidadTotalVehiculos, precioHora);
    actualizarTextLugaresDisponibles();
    let loading = document.getElementById("loading")
    loading.style.display = "none";
    actualizarClima();
}

initPage();

function actualizarClima() {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=-31.4135&lon=-64.1811&appid=fcef5e4b349bc4bc75237372b67d4ce4&units=metric')
        .then(response => response.json())
        .then(response => {
            let temperatura = response["main"]["temp"];
            const actualizarClimaElement = document.getElementById("clima");
            actualizarClimaElement.innerText = "Clima de hoy: " + Math.trunc(temperatura) + "°";
        })
        .catch(error => {
            console.log(error);
        });
}

function actualizarTextLugaresDisponibles() {
    const lugaresDisponiblesElement = document.getElementById("lugares_disponibles");
    lugaresDisponiblesElement.innerText = "Lugares Disponibles: " + lugaresDisponibles();
}

function lugaresDisponibles() {
    let contadorAutosEstadoIngresado = 0;
    for (let i = 0; i < estacionamiento.listadoVehiculos.length; i++) {
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

    let listaAutosEstacionamientoEncontrados = findListadoAutoEstacionamientoByPatente(patente);
    for (let i = 0; i < listaAutosEstacionamientoEncontrados.length; i++) {
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
    if (patente === null || patente === "") {
        return ({ "status": false, "message": "Patente no ingresada" });
    }
    if (isAutoEnEstacionamientoByPatente(patente) === false) {
        return ({ "status": false, "message": "El auto no esta en el estacionamiento" });
    }

    for (let i = 0; i < estacionamiento.listadoVehiculos.length; i++) {
        if (estacionamiento.listadoVehiculos[i].auto.patente === patente) {
            estacionamiento.listadoVehiculos[i].estado = "EGRESADO";
            estacionamiento.listadoVehiculos[i].dateHanddler.horaSalida = new Date();
        }
    }
    actualizarTextLugaresDisponibles();
    updateTable(estacionamiento.listadoVehiculos);
    return ({ "status": true, "message": "Auto egresado" });
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
    const table = document.getElementById('table');
    while (table.rows.length > 1) {
        table.deleteRow(1);
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
    cellHoraIngreso.innerHTML = autoEstacionamiento.dateHanddler.getTimeStringFromDate(autoEstacionamiento.dateHanddler.horaEntrada);

    let cellHoraEgreso = row.insertCell(2);
    cellHoraEgreso.innerHTML = autoEstacionamiento.dateHanddler.getTimeStringFromDate(autoEstacionamiento.dateHanddler.horaSalida);

    let cellEstado = row.insertCell(3);
    cellEstado.innerHTML = autoEstacionamiento.estado;

}

function isAutoEnEstacionamientoByPatente(patente) {
    let lista = findListadoAutoEstacionamientoByPatente(patente);
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].estado === "INGRESADO") {
            return true;
        }
    }
    return false;
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

let buscarVehiculo = document.getElementById("buscarPatente");
buscarPatente.onclick = () => {
    let inputPatente = document.getElementById("patente_vehiculo");
    let patente = inputPatente.value;
    if (patente !== null && patente !== "") {
        let loading = document.getElementById("loading")
        loading.style.display = "inline-block";

        setTimeout(() => {
            let loading = document.getElementById("loading")
            loading.style.display = "none";
            let newLista = findListadoAutoEstacionamientoByPatente(patente);
            updateTable(newLista);
        }, 3000);
    } else {
        updateTable(estacionamiento.listadoVehiculos);
    }
}

let listadoVehiculosJSON = JSON.stringify("listadoVehiculos");
localStorage.setItem("listadoVehiculos", listadoVehiculosJSON);



