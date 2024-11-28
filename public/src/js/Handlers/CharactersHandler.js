// Funzione costruttrice per il CharacterHandler
function CharacterHandler() {}

// Aggiungi un metodo al prototipo di CharacterHandler
CharacterHandler.prototype.getCharactersByPersonId = async function (idPersona) {
    try {
        const response = await fetch(`/api/characters/person/${idPersona}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch characters');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching characters:', error);
        return null;
    }
};

// Aggiungi un altro metodo al prototipo per ottenere un singolo personaggio
CharacterHandler.prototype.getCharacterById = async function (idCharacter) {
    try {
        const response = await fetch(`/api/characters/${idCharacter}`, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch character data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching character:', error);
        return null;
    }
};

// Aggiungi un altro metodo per creare un personaggio
CharacterHandler.prototype.createCharacter = async function (characterData) {
    try {
        const response = await fetch(`/api/characters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(characterData),
        });
        if (!response.ok) {
            throw new Error('Failed to create character');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating character:', error);
        return null;
    }
};

// Aggiungi metodi aggiuntivi in modo simile
// ...

// Esportazione della funzione costruttrice
export default CharacterHandler;