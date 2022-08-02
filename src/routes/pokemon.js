const { express } = require("express");
const { getAllPokemons } = require("../controllers/pokemon")

const router = express();

// Query all pokemons
router.get("/pokemons", async (req, res) => {
    // Call the API
    const pokemonDataObject = await getAllPokemons();
    if (!pokemonObject.successful) {
        return res.status(400).json({ message: pokemonObject.error });
    }

    // Extract values
    const { pokemonData } = pokemonDataObject;
    return res.status(200).send(pokemonData);
});

// Query a single pokemon
router.get("/pokemon/:id", async (req, res) => {


});

module.exports = router;