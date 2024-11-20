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
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password sono richiesti." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, password_hash) VALUES (?, ?)`,
      [username, hashedPassword],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ id: this.lastID, username });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'hashing della password." });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password sono richiesti." });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Errore del server.' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    res.status(200).json({
      message: 'Login effettuato con successo!',
      user: { id: user.id, username: user.username, role: user.role, isMaster: user.role === 'master' }
    });
  });
});




// Avvio del server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});