

class DateHanddler {
    constructor(horaEntrada, horaSalida) {
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
    } 
    
    getTimeStringFromDate(date) {
        if(date != null) {
            const format = "HH:mm DD/MM/YYYY";
            return moment(date).format(format);
        } else {
            return "";
        }   
    }
}




