const pokeData = require("./data");
const express = require("express");

const setupServer = () => {
  const server = express();

  server.use(express.json());

  server.get("/api/pokemon", (req, res) => {
    if (!req.query.limit) res.send(pokeData.pokemon);
    const { limit } = req.query;
    const output = [];
    for (let i = 0; i < Number(limit); i++) {
      output.push(pokeData.pokemon[i]);
    }
    res.send(output);
  });
  server.post("/api/pokemon", (req, res) => {
    const newPokemon = req.body;
    pokeData.pokemon.push(newPokemon);
    res.send(newPokemon);
  });

  server.get("/api/pokemon/:id", (req, res) => {
    const pokemonId = req.params.id;
    res.send(pokeData.pokemon[Number(pokemonId - 1)]);
  });

  server.get("/api/pokemon/:name", (req, res) => {
    const pokemonName = req.params.name;
    const output = pokeData.pokemon.filter(
      (pokemon) => pokemon.name === pokemonName
    )[0];
    res.send(output);
  });

  server.patch("/api/pokemon/name/:idOrname", (req, res) => {
    const pokemonName = req.params.name;
    const output = pokeData.pokemon.filter(
      (pokemon) => pokemon.name === pokemonName
    )[0];
    res.send(output);
  });
  return server;
};

module.exports = { setupServer };
