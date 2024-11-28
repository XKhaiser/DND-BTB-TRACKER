const bcrypt = require('bcrypt');
const { pool } = require('../../../../server');

class RegistrazioneHandler {
    async registerUser(username, password) {
      // Logica di registrazione
      // Inserisci l'utente nel database
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = await pool.connect();
      try {
        const result = await client.query(
          `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username`,
          [username, hashedPassword]
        );
        return result.rows[0]; // restituisce l'utente registrato
      } finally {
        client.release();
      }
    }
}

module.exports = RegistrazioneHandler;