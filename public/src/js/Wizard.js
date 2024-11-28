var Wizard = function (args) {
    this.args = args;
};

Wizard.prototype.mostraWizard = function () {
    var _this = this;

    const username = localStorage.getItem('username') || 'Utente';
    const role = localStorage.getItem('role') || 'Giocatore';
    const isMaster = localStorage.getItem('isMaster') === 'true';
    currentUserID = localStorage.getItem('idUser') || 0;

    _this.createCharacter();
};

Wizard.prototype.createCharacter = function () {
    var _this = this;
  
    // Gestisce il salvataggio del personaggio
    $("#createCharacterForm").off("submit").on("submit", function() {
      var name = $('#characterName').val().trim();
      var characterClass = $('#characterClass').val().trim();
      var level = $('#characterLevel').val();
      var race = $('#characterRace').val().trim();
      var alignment = $('#characterAlignment').val().trim();

      var strength = $('#characterStrength').val();
      var dexterity = $('#characterDexterity').val();
      var intelligence = $('#characterIntelligence').val();
      var wisdom = $('#characterWisdom').val();
      var constitution = $('#characterConstitution').val();
      var charisma = $('#characterCharisma').val();
  
      if (name && characterClass && level && race) {
        // Esegui azioni con i dati del personaggio (ad esempio, aggiungilo alla dashboard)
        _this.saveCharacter(
            {
                name: name,
                class: characterClass,
                level: parseInt(level, 10),
                race: race,
                alignment: alignment
            },
            {
                strength: strength,
                dexterity: dexterity,
                intelligence: intelligence,
                wisdom: wisdom,
                constitution: constitution,
                charisma: charisma,
            }
    );
      } else {
        alert("Per favore, compila tutti i campi!");
      }
    });
};

Wizard.prototype.saveCharacter = async function (character, characterStats) {
    var _this = this;

    console.log(character, characterStats)

    try {
        const response = await fetch('/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'createCharacter', character, currentUserID })
        });
  
        const result = await response.json();

        console.log(result);

        var character_id = result.id;

        const responseStats = await fetch('/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'modificaStatsCharacter', characterStats, character_id })
        });

        const resultStats = await responseStats.json();
      } catch (error) {
        console.error('Errore:', error);
      }
}