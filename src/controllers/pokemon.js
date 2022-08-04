const fetch = require("node-fetch");
const { Op } = require("sequelize");
const pokemons = require('../database/models').pokemons

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

    // Add pk_id property...
    pokemonData["results"].forEach((pokemon) => {
        const id = pokemon["url"].split("/")[6];
        pokemon["pk_id"] = parseInt(id);
    });

    return { successful: true, pokemonData: pokemonData["results"] };
}

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

async function getDBPokemons(offset = 0, limit = 20) {
    let pokemonDBData;
    try {
        pokemonDBData = await pokemons.findAll({
            attributes: ["pk_id", "name", "url"],
            where: {
                pk_id: {
                    [Op.gte]: offset,
                    [Op.lte]: offset + limit
                }
            },
            order: [['pk_id', 'ASC']],
            raw: true
        });

        if (pokemonDBData.length < limit) {
            return { successful: true, pokemonDBData: [] };
        }

    } catch (error) {
        return { successful: false, error: "Query error." };
    }

    return { successful: true, pokemonDBData };
}

async function insertDBPokemons(pokemonData) {
    // Simplify insert
    try {
        const status = await pokemons.bulkCreate(pokemonData, {
            ignoreDuplicates: true
        });

    } catch (error) {
        console.log(error);
        return { successful: false, error: "Insert error at pokemons table." };
    }

    return { successful: true };
}

async function cleanPokemonData(pokemonData) {
    const finalPokemonObject = {};
    pokemonData.forEach((data) => {
        finalPokemonObject[data["name"]] = data["url"];
    });

    return finalPokemonObject;
}

module.exports = { getMultiplePokemons, getSinglePokemon, getDBPokemons, insertDBPokemons, cleanPokemonData };