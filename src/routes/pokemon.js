const express = require("express");
const { getMultiplePokemons, getSinglePokemon, getDBPokemons, insertDBPokemons, cleanPokemonData } = require("../controllers/pokemon")

const router = express();

// Query all pokemons
router.get("/pokemons", async (req, res) => {
    // Pagination params
    const { offset, limit } = req.query;

    // Validations
    if (offset) {
        if (isNaN(offset) || parseInt(offset) < 0) {
            return res.status(400).json({ message: "Invalid offset. Must be an integer bigger than 0." });
        }
    }

    if (limit) {
        if (isNaN(limit) || parseInt(limit) <= 0) {
            return res.status(400).json({ message: "Invalid limit. Must be an integer equal or bigger than 0." });
        }
    }

    // Check the DB first...
    const dbPokemonObject = await getDBPokemons(offset, limit);
    if (!dbPokemonObject.successful) {
        return res.status(400).json({ message: dbPokemonObject.error });
    }

    // If empty, call the API
    if (dbPokemonObject["pokemonDBData"].length === 0) {
        const pokemonDataObject = await getMultiplePokemons(offset, limit);
        if (!pokemonDataObject.successful) {
            return res.status(400).json({ message: pokemonDataObject.error });
        }

        // Save to database
        const { pokemonData } = pokemonDataObject;
        const pokemonInsertObject = await insertDBPokemons(pokemonData);
        if (!pokemonInsertObject.successful) {
            return res.status(400).json({ message: pokemonInsertObject.error });
        }

        const cleanerData = await cleanPokemonData(pokemonData);
        return res.status(200).send(cleanerData);
    }

    // Extract data and simplify data object
    const { pokemonDBData } = dbPokemonObject;
    const cleanerData = await cleanPokemonData(pokemonDBData);

    return res.status(200).send(cleanerData);
});

// Query a single pokemon
router.get("/pokemons/:id", async (req, res) => {
    const { id } = req.params;

    // Validations
    if (isNaN(id) || parseInt(id) < 0) {
        return res.status(400).json({ message: "Invalid id. Must be an integer bigger than 0." });
    }

    // Call the API
    const pokemonDataObject = await getSinglePokemon(id);
    if (!pokemonDataObject.successful) {
        return res.status(400).json({ message: pokemonDataObject.error });
    }

    // Extract values
    const { pokemonData } = pokemonDataObject;
    return res.status(200).send(pokemonData);
});

module.exports = router;