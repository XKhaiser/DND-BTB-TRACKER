var Dashboard = function (args) {
    this.args = args;
};

Dashboard.prototype.mostraDashboard = function () {
    var _this = this;

    const username = localStorage.getItem('username') || 'Utente';
    const role = localStorage.getItem('role') || 'Giocatore';
    const isMaster = localStorage.getItem('isMaster') === 'true';
    currentUserID = localStorage.getItem('idUser') || 0;

    $("#welcomeMsg").html(`Benvenuto, ${username}!`);
    $("#userTypeMsg").html(`Sei connesso come ${role}`);

    _this.mostraPersonaggi();
};

Dashboard.prototype.mostraPersonaggi = async function() {
    var _this = this;

    try {
        const response = await fetch('/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getUserCharacters', currentUserID })
        });
  
        const result = await response.json();

        console.log(result);
        var personaggi = result.data;

        var htmlContent = '';

        personaggi.forEach(function(personaggio) {
            var cardHtml = `
                <div class="card">
                    <div class="card-header">
                        ${personaggio.name}
                    </div>
                    <div class="card-body">
                        <p>${personaggio.descrizione || "Descrizione PG"}</p>
                        ${personaggio.immagine ? `<img src="${personaggio.immagine}" alt="${personaggio.name}" class="img-fluid" />` : ''}
                        ${personaggio.class ? `<p><strong>Classe:</strong> ${personaggio.class}</p>` : ''}
                        ${personaggio.race ? `<p><strong>Razza:</strong> ${personaggio.race}</p>` : ''}
                        ${personaggio.alignment ? `<p><strong>Allineamento:</strong> ${personaggio.alignment}</p>` : ''}
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
            _this.createCharacter()
        });
      } catch (error) {
        console.error('Errore:', error);
      }
}

Dashboard.prototype.createCharacter = function () {
    var _this = this;

    // Mostra la modale
    var modal = new bootstrap.Modal(document.getElementById('createCharacterModal'));
    modal.show();
  
    // Gestisce il salvataggio del personaggio
    document.getElementById('saveCharacter').onclick = function () {
      var name = document.getElementById('characterName').value.trim();
      var characterClass = document.getElementById('characterClass').value.trim();
      var level = document.getElementById('characterLevel').value;
      var race = document.getElementById('characterRace').value.trim();
  
      if (name && characterClass && level && race) {
        // Esegui azioni con i dati del personaggio (ad esempio, aggiungilo alla dashboard)
        _this.saveCharacter({
          name: name,
          class: characterClass,
          level: parseInt(level, 10),
          race: race
        });
  
        // Chiude la modale
        modal.hide();
      } else {
        alert("Per favore, compila tutti i campi!");
      }
    };
};

Dashboard.prototype.saveCharacter = function (character) {
    var _this = this;

    console.log(character)
}