
let precioHora = 250;
let capacidadTotalVehiculos = 80;
let estacionamiento;
let loading = document.getElementById("loading");
let inputPatente = document.getElementById("patente_vehiculo");
let table = document.getElementById("table");

function initPage() {
    estacionamiento = new Estacionamiento([], capacidadTotalVehiculos, precioHora);
    loading.style.display = "none";
    actualizarClima();
    estacionamiento.listadoVehiculos = getListadoVehiculosLocalStorage();
    actualizarTabla(estacionamiento.listadoVehiculos);
    actualizarTextLugaresDisponibles();
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
        actualizarListadoVehiculosLocalStorage();

        return ({ "status": true, "message": "Auto ingresado" });
    } else {
        return ({ "status": false, "message": "No hay lugar" });
    }
}

let botonIngreso = document.getElementById("botonIngreso");
botonIngreso.onclick = () => {
    let patente = inputPatente.value;
    let result = registrarIngreso(patente);
    if (result.status) {
        inputPatente.value = null;
        actualizarTabla(estacionamiento.listadoVehiculos);
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
    actualizarTabla(estacionamiento.listadoVehiculos);
    actualizarListadoVehiculosLocalStorage();

    return ({ "status": true, "message": "Auto egresado" });
}

let botonEgreso = document.getElementById("botonEgreso");
botonEgreso.onclick = () => {
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

function actualizarTabla(listaAutos) {
    clearTable();
    for (let i = 0; i < listaAutos.length; i++) {
        const autoEstacionamiento = listaAutos[i];
        addRow(autoEstacionamiento);
    }
}

function clearTable() {
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function addRow(autoEstacionamiento) {
    const rowCount = table.rows.length;
    const row = table.insertRow(rowCount);

    let cellPatente = row.insertCell(0);
    cellPatente.innerHTML = autoEstacionamiento.auto.patente;

    let cellHoraIngreso = row.insertCell(1);
    cellHoraIngreso.innerHTML = getTimeStringFromDate(autoEstacionamiento.dateHanddler.horaEntrada);

    let cellHoraEgreso = row.insertCell(2);
    cellHoraEgreso.innerHTML =getTimeStringFromDate(autoEstacionamiento.dateHanddler.horaSalida);

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

let buscarPatente = document.getElementById("buscarPatente");
buscarPatente.onclick = () => {
    let patente = inputPatente.value;
    if (patente !== null && patente !== "") {
        loading.style.display = "inline-block";

        setTimeout(() => {
            loading.style.display = "none";
            let newLista = findListadoAutoEstacionamientoByPatente(patente);
            actualizarTabla(newLista);
        }, 3000);
    } else {
        actualizarTabla(estacionamiento.listadoVehiculos);
    }
}

function actualizarListadoVehiculosLocalStorage() {
    let listadoVehiculosJSON = JSON.stringify(estacionamiento.listadoVehiculos);
    localStorage.setItem("listadoVehiculos", listadoVehiculosJSON);
}

function getListadoVehiculosLocalStorage() {
    const listadoVehiculos = localStorage.getItem("listadoVehiculos");

    if(listadoVehiculos !== null) {
        return JSON.parse(listadoVehiculos);
    } else {
        return [];
    }
}

function getTimeStringFromDate(date) {
    if(date !== null) {
        const format = "HH:mm DD/MM/YYYY";
        return moment(date).format(format);
    } else {
        return "";
    }   
}



