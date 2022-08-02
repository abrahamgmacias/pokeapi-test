import fetch from "node-fetch";

async function getAllPokemons() {
    let pokemonData;
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon");
        pokemonData = await response.json();

    } catch (error) {
        console.log(error);
        return { successful: false, error: "Unable to fetch data from pokeAPI." };
    }

    return { successful: true, pokemonData };
}

getAllPokemons();

// module.exports = { getAllPokemons }