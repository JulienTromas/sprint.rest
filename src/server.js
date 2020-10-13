const pokeData = require("./data");
const express = require("express");
const { pokemon } = require("./data");

const setupServer = () => {
  function objectSlicer(object, lastKey) {
    const filteredKeys = Object.keys(object).slice(0, lastKey);
    const newObject = {};
    filteredKeys.forEach(function(key) {
      newObject[key] = object[key];
    });
    return newObject;
  }

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

  server.delete("/api/pokemon/:idOrName", (req, res) => {
    if (Number(req.params.idOrName)) {
      const pokemonId = req.params.idOrName;
      const output = pokeData.pokemon.splice(pokemonId - 1, 1);
      res.send(output[0]);
    } else {
      const pokemonName = req.params.idOrName;
      const removedPokemonId = pokeData.pokemon.filter(
        (pokemon) => pokemon.name === pokemonName
      )[0].id;
      const output = pokeData.pokemon.splice(removedPokemonId - 1, 1);
      res.send(output[0]);
    }
  });

  server.get("/api/pokemon/:idOrName/evolutions", (req, res) => {
    if (Number(req.params.idOrName)) {
      const pokemonId = req.params.idOrName;
      const output = pokeData.pokemon[pokemonId - 1];
      if (output.evolutions) res.send(output.evolutions);
      else {
        res.send([]);
      }
    } else {
      const pokemonName = req.params.idOrName;
      const output = pokeData.pokemon.filter(
        (pokemon) => pokemon.name === pokemonName
      )[0];
      if (output.evolutions) res.send(output.evolutions);
      else {
        res.send([]);
      }
    }
  });

  server.get("/api/pokemon/:idOrName/evolutions/previous", (req, res) => {
    if (Number(req.params.idOrName)) {
      const pokemonId = req.params.idOrName;
      const output = pokeData.pokemon[pokemonId - 1];
      res.send(output["Previous evolution(s)"]);
    } else {
      const pokemonName = req.params.idOrName;
      const output = pokeData.pokemon.filter(
        (pokemon) => pokemon.name === pokemonName
      )[0];
      res.send(output["Previous evolution(s)"]);
    }
  });

  server.get("/api/types", (req, res) => {
    if (!req.query.limit) res.send(pokeData.types);
    const { limit } = req.query;
    const output = [];
    for (let i = 0; i < Number(limit); i++) {
      output.push(pokeData.types[i]);
    }
    res.send(output);
  });

  server.post("/api/types", (req, res) => {
    const newType = req.body;
    pokeData.types.push(newType);
    res.send(newType);
  });

  server.delete("/api/types/:name", (req, res) => {
    const typeName = req.params.name;
    const removedType = pokeData.types.filter((type) => type === typeName)[0];
    const output = pokeData.types.splice(
      pokeData.types.indexOf(removedType),
      1
    );
    res.send(output[0]);
  });

  server.get("/api/types/:type/pokemon", (req, res) => {
    const typeName = req.params.type;
    const output = pokeData.pokemon.filter((pokemon) =>
      pokemon.types.includes(typeName)
    );
    const pokemonList = [];
    for (let i = 0; i <= output.length - 1; i++) {
      pokemonList.push(objectSlicer(output[i], 2));
    }
    res.send(pokemonList);
  });
  server.get("/api/attacks", (req, res) => {
    if (!req.query.limit) res.send(pokeData.attacks);
    const { limit } = req.query;
    const output = [];
    output.push(pokeData.attacks);
    res.send(output);
  });

  return server;
};

module.exports = { setupServer };
