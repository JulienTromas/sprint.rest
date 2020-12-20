const pokeData = require("./data");
const express = require("express");

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
    res.send(pokeData.pokemon[pokeData.pokemon.length - 1]);
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
    res.send(pokeData.types[pokeData.types.length - 1]);
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
    let output = [];
    output = Object.values(
      objectSlicer(pokeData.attacks, limit)
    ).reduce((a, b) => a.concat(b));
    res.send(output);
  });

  server.get("/api/attacks/fast", (req, res) => {
    if (!req.query.limit) res.send(pokeData.attacks.fast);
    const { limit } = req.query;
    const output = [];
    for (let i = 0; i < Number(limit); i++) {
      output.push(pokeData.attacks.fast[i]);
    }
    res.send(output);
  });
  server.get("/api/attacks/special", (req, res) => {
    if (!req.query.limit) res.send(pokeData.attacks.special);
    const { limit } = req.query;
    const output = [];
    for (let i = 0; i < Number(limit); i++) {
      output.push(pokeData.attacks.special[i]);
    }
    res.send(output);
  });

  server.get("/api/attacks/:name", (req, res) => {
    const attackName = req.params.name;
    let output;

    for (const key in pokeData.attacks) {
      for (let i = 0; i < pokeData.attacks[key].length - 1; i++) {
        if (pokeData.attacks[key][i].name === attackName) {
          output = pokeData.attacks[key][i];
        }
      }
    }
    res.send(output);
  });

  server.get("/api/attacks/:name/pokemon", (req, res) => {
    const attackName = req.params.name;
    const pokemonList = [];
    pokeData.pokemon.forEach((pokemon) => {
      for (const key in pokemon.attacks) {
        for (let i = 0; i < pokemon.attacks[key].length - 1; i++) {
          if (pokemon.attacks[key][i].name === attackName) {
            pokemonList.push(objectSlicer(pokemon, 2));
          }
        }
      }
    });
    res.send(pokemonList);
  });
  server.post("/api/attacks/fast", (req, res) => {
    const newAttack = req.body;
    pokeData.attacks.fast.push(newAttack);
    res.send(pokeData.attacks.fast[pokeData.attacks.fast.length - 1]);
  });
  server.post("/api/attacks/special", (req, res) => {
    const newAttack = req.body;
    pokeData.attacks.special.push(newAttack);
    res.send(pokeData.attacks.special[pokeData.attacks.special.length - 1]);
  });
  server.patch("/api/attacks/:name", (req, res) => {
    let { name, type, damage } = req.query;
    damage = Number(damage);
    const attackName = req.params.name;
    for (const key in pokeData.attacks) {
      for (let i = 0; i < pokeData.attacks[key].length - 1; i++) {
        if (pokeData.attacks[key][i].name === attackName) {
          pokeData.attacks[key][i] = { name, type, damage };
        }
      }
    }
    res.send(pokeData.attacks.fast[0]);
  });
  server.delete("/api/attacks/:name", (req, res) => {
    const attackName = req.params.name;
    let removedAttack;
    for (const key in pokeData.attacks) {
      for (let i = 0; i < pokeData.attacks[key].length - 1; i++) {
        if (pokeData.attacks[key][i].name === attackName) {
          removedAttack = pokeData.attacks[key].splice(i, 1);
        }
      }
    }
    res.send(removedAttack[0]);
  });

  return server;
};
/*
ATTACK OBJECT
       FAST OBJECT : ARRAY OF ATTACK OBJECTS
       SPECIAL OBJECT : ARRAY OF ATTACK OBJECTS

HYDRO PUMP ===> ATTACK / SPECIAL / OBJECT HYDRO PUMP
GO INSIDE ATTACK OBJECT, GO INTO FIRST OBJECT, GO INTO ARRAY OF ATTACKS, CHECK EACH ATTACK OBJECT NAME

*/
module.exports = { setupServer };
