const { pool } = require('../../../../server');

class CharacterHandler {
    // Metodo per ottenere i personaggi associati a un ID persona
    async getUserCharacters(idPersona) {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM characters WHERE user_id = $1', [idPersona]);
            return result.rows;
        } catch (error) {
            console.error('Error fetching characters:', error);
            throw new Error('Failed to fetch characters');
        } finally {
            client.release();
        }
    }

    // Metodo per ottenere un singolo personaggio tramite ID
    async getCharacterById(idCharacter) {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM characters WHERE id = $1', [idCharacter]);
            if (result.rows.length === 0) {
                throw new Error('Character not found');
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching character:', error);
            throw new Error('Failed to fetch character data');
        } finally {
            client.release();
        }
    }

    // Metodo per creare un nuovo personaggio
    async createCharacter(characterData) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO characters (name, class, user_id) VALUES ($1, $2, $3) RETURNING *`,
                [characterData.name, characterData.class, characterData.userID]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating character:', error);
            throw new Error('Failed to create character');
        } finally {
            client.release();
        }
    }
}

module.exports = CharacterHandler;