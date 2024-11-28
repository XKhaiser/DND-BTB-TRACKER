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
    async createCharacter(characterData, currentUserID) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO characters (name, class, race, alignment, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [characterData.name, characterData.class, characterData.race, characterData.alignment, currentUserID]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating character:', error);
            throw new Error('Failed to create character');
        } finally {
            client.release();
        }
    }

    // Metodo per creare un nuovo personaggio
    async modificaStatsCharacter(characterStats, character_id) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                INSERT INTO stats (strength, dexterity, constitution, intelligence, wisdom, charisma, character_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                ON CONFLICT (character_id) 
                DO UPDATE SET 
                    strength = EXCLUDED.strength,
                    dexterity = EXCLUDED.dexterity,
                    constitution = EXCLUDED.constitution,
                    intelligence = EXCLUDED.intelligence,
                    wisdom = EXCLUDED.wisdom,
                    charisma = EXCLUDED.charisma
                RETURNING *
                `,
                [characterStats.strength, characterStats.dexterity, characterStats.constitution, characterStats.intelligence, characterStats.wisdom, characterStats.charisma, character_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error creating character:', error);
            throw new Error('Failed to create character', error);
        } finally {
            client.release();
        }
    }
}

module.exports = CharacterHandler;