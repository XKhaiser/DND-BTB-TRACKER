var Dashboard = function (args) {
    this.args = args;
};

Dashboard.prototype.mostraDashboard = function () {
    const username = localStorage.getItem('username') || 'Utente';
    const role = localStorage.getItem('role') || 'Giocatore';
    const isMaster = localStorage.getItem('isMaster') === 'true';

    $("#welcomeMsg").html(`Benvenuto, ${username}!`);
    $("#userTypeMsg").html(`Sei connesso come ${role}`);

    const personaggi = [
        { nome: 'Mario', descrizione: 'Un guerriero coraggioso', immagine: 'mario.jpg' },
        { nome: 'Luigi', descrizione: 'Un mago misterioso', immagine: 'luigi.jpg' },
        { nome: 'Peach', descrizione: 'Una principessa saggia', immagine: 'peach.jpg' },
        { nome: 'Bowser', descrizione: 'Un temibile nemico', immagine: '' }
    ];

    var htmlContent = '';

    personaggi.forEach(function(personaggio) {
        var cardHtml = `
            <div class="card">
                <div class="card-header">
                    ${personaggio.nome}
                </div>
                <div class="card-body">
                    <p>${personaggio.descrizione}</p>
                    ${personaggio.immagine ? `<img src="${personaggio.immagine}" alt="${personaggio.nome}" class="img-fluid" />` : ''}
                </div>
            </div>
        `;
        htmlContent += cardHtml;
    });

    var addCardHtml = `
        <div class="card add-card">
            <div class="card-body text-center">
                <button class="btn btn-primary" id="addCharacterBtn">Aggiungi Personaggio</button>
            </div>
        </div>
    `;
    htmlContent += addCardHtml;

    $('#pg-list').append(htmlContent);

    $('#addCharacterBtn').on('click', function() {
        // TODO
    });
};