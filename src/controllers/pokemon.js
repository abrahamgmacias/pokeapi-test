const fetch = require("node-fetch");

// Query pokemons by range
async function getMultiplePokemons(offset = 0, limit = 20) {
    let pokemonData;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        pokemonData = await response.json();

    } catch (error) {
        console.log(error);
        return { successful: false, error: "Unable to fetch data from pokeAPI." };
    }

    // Simplify data object
    const finalPokemonObject = {};
    pokemonData["results"].forEach((data) => {
        finalPokemonObject[data["name"]] = data["url"];
    });

    return { successful: true, finalPokemonObject };
}

// Gap at 905, after 1000 => 10000
// Query pokemon by id
async function getSinglePokemon(id) {
    let pokemonData;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        pokemonData = await response.json();

    } catch (error) {
        console.log(error);
        return { successful: false, error: `Unable to fetch data from pokeAPI under id: ${id}.` };
    }

    return { successful: true, pokemonData };
}

module.exports = { getMultiplePokemons, getSinglePokemon };