require('dotenv').config(); // Carica le variabili di ambiente

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Configurazione PostgreSQL usando le variabili di ambiente
const pool = new Pool({
  user: process.env.DB_USER,         // Variabile di ambiente
  host: process.env.DB_HOST,         // Variabile di ambiente
  database: process.env.DB_DATABASE, // Variabile di ambiente
  password: process.env.DB_PASSWORD, // Variabile di ambiente
  port: process.env.DB_PORT,         // Variabile di ambiente
});

// Crea la tabella se non esiste (da eseguire manualmente in PostgreSQL o come script)
const createTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      );
    `);
  } finally {
    client.release();
  }
};

createTable(); // Crea la tabella all'avvio del server

// Endpoint per salvare i dati
app.post('/submit', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password sono richiesti." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username`,
        [username, hashedPassword]
      );
      const user = result.rows[0];
      res.json({ id: user.id, username: user.username });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'hashing della password." });
  }
});

// Endpoint per il login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password sono richiesti." });
  }

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

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
  } catch (err) {
    return res.status(500).json({ error: 'Errore del server.' });
  } finally {
    client.release();
  }
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});