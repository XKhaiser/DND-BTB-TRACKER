var Wizard = function (args) {
    this.args = args;
};

Wizard.prototype.mostraWizard = function () {
    var _this = this;

    const username = localStorage.getItem('username') || 'Utente';
    const role = localStorage.getItem('role') || 'Giocatore';
    const isMaster = localStorage.getItem('isMaster') === 'true';
    currentUserID = localStorage.getItem('idUser') || 0;

    _this.selCharacter();
};

Wizard.prototype.selCharacter = async function () {
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

    var options = `
      <option value="-1" readonly selected>Seleziona un personaggio</option>
    `;

    // var options = ``;

    for (let i = 0; i < personaggi.length; i++) {
      var e = personaggi[i];
      
      options += `
        <option value="${e.id}">${e.name} <span class="text-muted">- ${e.class} - Livello ${e.level}</span></option>
      `;
    }

    $("#pg-select").html(options);

    var element = document.querySelector('#pg-select');
    var choicePg = new Choices(element, {
      shouldSort: false,
      shouldSortItems: false,
      itemSelectText: "",
      classNames: {
        containerOuter: ['choices', 'choice-pg-select'],
      }
    });

    $(".load-page").fadeOut(function() {
      $("#startCharacter").fadeIn();
    })

    $(choicePg.passedElement.element).on("choice", function (e) {
      var id = e.originalEvent.detail.value;
      _this.createCharacter(choicePg, id);
    })

    $("#newPg").off("click").on("click", function() {
      _this.createCharacter();
    })

  } catch (error) {
    console.error('Errore:', error);
  }
}

Wizard.prototype.createCharacter = async function (choicePg, id) {
  var _this = this;

  if (id) {
    try {
      const response = await fetch('/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getCharacterByIdWithStats', id })
      });

      const result = await response.json();

      console.log(result);

      var characterData = result.data;

      $('#characterName').val(characterData.name);
      $('#characterClass').val(characterData.class);
      $('#characterLevel').val(characterData.level);
      $('#characterRace').val(characterData.race);
      $('#characterAlignment').val(characterData.alignment || "Nessuno");

      $('#characterStrength').val(characterData.stats.strength || 8);
      $('#characterDexterity').val(characterData.stats.dexterity || 8);
      $('#characterIntelligence').val(characterData.stats.intelligence || 8);
      $('#characterWisdom').val(characterData.stats.wisdom || 8);
      $('#characterConstitution').val(characterData.stats.constitution || 8);
      $('#characterCharisma').val(characterData.stats.charisma || 8);

      $("#createCharacterForm .btn-primary").html("Salva")
    } catch (error) {
      console.error('Errore:', error);
    }
  } else {
    document.getElementById("createCharacterForm").reset();
  }

  $("#startCharacter").fadeOut(function() {
    $("#containerFormCharacter").fadeIn(function() {
      if (choicePg) {
        choicePg.setChoiceByValue("-1")
      }
    });
  });

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
              alignment: alignment,
              id: id || null
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

  $("#characterMenu").off("click").on("click", function() {
    $("#containerFormCharacter").fadeOut(function() {
      $("#startCharacter").fadeIn();
    });
  })
};

Wizard.prototype.saveCharacter = async function (character, characterStats) {
    var _this = this;

    try {
        const response = await fetch('/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'createCharacter', character, currentUserID })
        });
  
        const result = await response.json();

        var character_id = result.data.id;

        const responseStats = await fetch('/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'modificaStatsCharacter', characterStats, character_id })
        });

        const resultStats = await responseStats.json();
        alert("Lista personaggi aggiornata con successo")
      } catch (error) {
        console.error('Errore:', error);
        alert("Al momento non è possibile fare modifiche ai personaggi, riprova più tardi")
      }
}