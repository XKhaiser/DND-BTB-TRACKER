const { pool } = require('../../../../server');
const bcrypt = require('bcrypt');

class LoginHandler {
    async loginUser(username, password) {
      // Logica di login
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
  
        if (!user) {
          throw new Error('Utente non trovato.');
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
          throw new Error('Credenziali non valide.');
        }
  
        return user; // restituisce l'utente loggato
      } finally {
        client.release();
      }
    }
}

module.exports = LoginHandler;