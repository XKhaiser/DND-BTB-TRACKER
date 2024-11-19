const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

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
db.run(`CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, value TEXT)`);

// Endpoint per salvare i dati
app.post('/submit', (req, res) => {
  const { value } = req.body;
  db.run(`INSERT INTO data (value) VALUES (?)`, [value], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, value });
    }
  });
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});