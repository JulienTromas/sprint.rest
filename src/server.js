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

  server.get("/api/pokemon/:idOrName", (req, res) => {
    if (Number(req.params.idOrName)) {
      const pokemonId = req.params.idOrName;
      res.send(pokeData.pokemon[Number(pokemonId - 1)]);
    } else {
      const pokemonName = req.params.idOrName;
      const output = pokeData.pokemon.filter(
        (pokemon) => pokemon.name === pokemonName
      )[0];
      res.send(output);
    }
  });

  server.patch("/api/pokemon/:idOrName", (req, res) => {
    const { name } = req.query;
    if (Number(req.params.idOrName)) {
      const pokemonId = req.params.idOrName;
      pokeData.pokemon[Number(pokemonId - 1)].name = name;
      res.send(pokeData.pokemon[Number(pokemonId - 1)].name);
    }
    const pokemonName = req.params.idOrName;
    const output = pokeData.pokemon.filter(
      (pokemon) => pokemon.name === pokemonName
    )[0];
    output.name = name;
    res.send(output);
  });

  /*

  DELETE : get and ID or a NAME of a pokemon, find it in the array with its id,
  then remove it from the array with splice



  */
  return server;
};

module.exports = { setupServer };
