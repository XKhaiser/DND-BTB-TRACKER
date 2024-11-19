const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./data.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to the SQLite database.');
});

// Crea la tabella se non esiste
// db.run(`CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, value TEXT)`);

// Endpoint per salvare i dati
app.post('/submit', async (req, res) => {
  const { username, email, password } = req.body;

  // Controllo che i campi obbligatori siano forniti
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email e password sono richiesti." });
  }

  try {
    // Hash della password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inserimento nel database
    db.run(
      `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ id: this.lastID, username, email });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'hashing della password." });
  }
});


// Avvio del server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});