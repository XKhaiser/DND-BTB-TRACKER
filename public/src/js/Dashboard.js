var Dashboard = function (args) {
    this.args = args;
};

Dashboard.prototype.mostraDashboard = function () {
    // Recupera i dati dal localStorage
    const username = localStorage.getItem('username') || 'Utente';
    const role = localStorage.getItem('role') || 'Giocatore';
    const isMaster = localStorage.getItem('isMaster') === 'true';
};