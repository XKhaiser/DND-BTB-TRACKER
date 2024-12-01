const { pool } = require('../../../../server');

class CharacterHandler {
    // Metodo per ottenere i personaggi associati a un ID persona
    async getUserCharacters(idPersona) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT jsonb_object_agg(key, value) AS result
                FROM characters c,
                     jsonb_each(to_jsonb(c)) 
                WHERE key NOT IN ('user_id', 'created_at')
                  AND c.user_id = $1
                GROUP BY c.id;
              `, [idPersona]);
            return result.rows.map(row => row.result);
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
            const result = await client.query(`
                SELECT jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'race', c.race,
                    'class', c.class,
                    'level', c.level,
                    'stats', jsonb_build_object(
                        'strength', COALESCE(s.strength, 0),
                        'dexterity', COALESCE(s.dexterity, 0),
                        'constitution', COALESCE(s.constitution, 0),
                        'intelligence', COALESCE(s.intelligence, 0),
                        'wisdom', COALESCE(s.wisdom, 0),
                        'charisma', COALESCE(s.charisma, 0)
                    )
                ) AS character_data
                FROM characters c
                LEFT JOIN stats s ON s.character_id = c.id
                WHERE c.id = $1;
            `, [idCharacter]);

            if (result.rows.length === 0) {
                throw new Error('Character not found');
            }

            return result.rows[0].character_data;
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
                `
                INSERT INTO characters (id, name, class, race, alignment, level, user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) 
                DO UPDATE SET 
                    name = EXCLUDED.name,
                    class = EXCLUDED.class,
                    race = EXCLUDED.race,
                    alignment = EXCLUDED.alignment,
                    level = EXCLUDED.level
                WHERE characters.user_id = $7
                RETURNING id
                `,
                [
                    characterData.id || null,  // Se non c'è un id, sarà NULL (necessario per evitare errori)
                    characterData.name,
                    characterData.class,
                    characterData.race,
                    characterData.alignment,
                    characterData.level,
                    currentUserID
                ]
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