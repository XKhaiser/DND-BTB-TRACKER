var Dashboard = function (args) {
    this.args = args;
};

Dashboard.prototype.mostraDashboard = function () {
    // Recupera i dati dal localStorage
    const username = localStorage.getItem('username') || 'Utente';
    const role = localStorage.getItem('role') || 'Giocatore';
    const isMaster = localStorage.getItem('isMaster') === 'true';

    // Impostazione dei dati principali
    $('#balance').text('$50');  // Esempio
    $('#missionsCompleted').text('12'); // Esempio
    $('#activePlayers').text('3'); // Esempio
    $('#newCharacters').text('1'); // Esempio

    // Lista dei personaggi (esempio statico)
    const characters = [
      { name: 'Elven Archer', class: 'Arciere', level: 5 },
      { name: 'Dwarven Warrior', class: 'Guerriero', level: 3 },
      { name: 'Human Mage', class: 'Mago', level: 4 }
    ];

    // Creazione della lista dei personaggi
    let characterListHtml = '<div class="row">';
    characters.forEach(character => {
      characterListHtml += `
        <div class="col-md-4 mb-3">
          <div class="card text-white card-custom">
            <div class="card-body">
              <h5 class="card-title">${character.name}</h5>
              <p class="card-text">${character.class} - Livello ${character.level}</p>
            </div>
          </div>
        </div>
      `;
    });
    characterListHtml += '</div>';

    $('#charactersList').html(characterListHtml);

    // Aggiungi il nuovo personaggio
    $('#addCharacterBtn').click(function() {
      alert('Pulsante per aggiungere un nuovo personaggio!');
      // Implementare la logica per aggiungere un nuovo personaggio
    });
};