require('dotenv').config();
const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurazione PostgreSQL usando le variabili di ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: true
});

// Esporta il pool per utilizzarlo negli handler
module.exports = { pool };

const LoginHandler = require('./public/src/js/Handlers/LoginHandler');
const RegistrazioneHandler = require('./public/src/js/Handlers/RegistrazioneHandler');
const CharacterHandler = require('./public/src/js/Handlers/CharactersHandler');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Creazione delle istanze degli handler
const registrazioneHandler = new RegistrazioneHandler();
const loginHandler = new LoginHandler();
const characterHandler = new CharacterHandler();

// Endpoint Generico per l'azione
app.post('/action', async (req, res) => {
  const { action, ...params } = req.body;

  try {
    let result;

    // Gestisci le azioni
    switch (action) {
      case 'login':
        result = await loginHandler.loginUser(params.username, params.password);
        res.status(200).json({ message: 'Login effettuato con successo!', user: result });
        break;
      
      case 'register':
        result = await registrazioneHandler.registerUser(params.username, params.password);
        res.status(200).json({ message: 'Registrazione completata con successo!', user: result });
        break;

      case 'getUserCharacters':
        result = await characterHandler.getUserCharacters(params.currentUserID);
        res.status(200).json({ message: 'Lista personaggi per utente corrente', data: result });
        break;

      case 'createCharacter':
        result = await characterHandler.createCharacter(params.character, params.currentUserID);
        res.status(200).json({ message: 'Lista personaggi per utente corrente', data: result });
        break;

      case 'modificaStatsCharacter':
        result = await characterHandler.modificaStatsCharacter(params.characterStats, params.character_id);
        res.status(200).json({ message: 'Lista personaggi per utente corrente', data: result });
        break;

      default:
        res.status(400).json({ error: 'Azione non riconosciuta.' });
        break;
    }
  } catch (error) {
    console.error('Errore nel server:', error);  // Aggiungi un log esplicito dell'errore
    res.status(500).json({ error: error.message });
  }
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
