const pokeData = require("./data");
const express = require("express");

const setupServer = () => {
  const server = express();

  server.use(express.json());

  server.get("/api/pokemon", (req, res) => {
    if (!req.query) res.send(pokeData.pokemon);
    res.send(pokeData.pokemon);
  });
  server.get("/api/pokemon/:limit", (req, res) => {
    const pokemonLimit = req.params.limit;
    const output = [];
    for (let i = 0; i < Number(pokemonLimit); i++) {
      output.push(pokeData.pokemon[i]);
    }
    res.send(output);
  });

  server.post("/api/pokemon", (req, res) => {
    const newPokemon = req.body;
    pokeData.pokemon.push(newPokemon);
    res.send(newPokemon);
  });
  return server;
};

module.exports = { setupServer };
