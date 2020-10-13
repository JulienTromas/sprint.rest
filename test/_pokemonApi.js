const chai = require("chai");
const chaiHttp = require("chai-http");
const { pokemon } = require("../src/data");
chai.use(chaiHttp);
chai.should();
const pokeData = require("../src/data");
const { setupServer } = require("../src/server");

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
const server = setupServer();
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });

  describe("GET /api/pokemon", () => {
    it("should return the list of all the pokemon", async () => {
      const res = await request.get("/api/pokemon");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon);
    });
    it("should return a limited list of pokemon", async () => {
      const res = await request.get("/api/pokemon").query({ limit: "10" });
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon.slice(0, 10));
    });
  });
  describe("POST /api/pokemon", () => {
    it("should add a pokemon", async () => {
      const newPokemon = {
        id: "152",
        name: "VicDustin",
        classification: "Coding Pokémon",
        types: ["Pizza", "Javascript"],
        resistant: ["Water", "Electric", "Grass", "Fighting", "Fairy"],
        weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
        weight: {
          minimum: "6.04kg",
          maximum: "7.76kg",
        },
        height: {
          minimum: "0.61m",
          maximum: "0.79m",
        },
        fleeRate: 0.1,
        evolutionRequirements: {
          amount: 25,
          name: "Pizza slices",
        },
        evolutions: [
          {
            id: 2,
            name: "DustinVic",
          },
          {
            id: 3,
            name: "VustinDic",
          },
        ],
        maxCP: 951,
        maxHP: 1071,
        attacks: {
          fast: [
            {
              name: "Tackle",
              type: "Normal",
              damage: 12,
            },
            {
              name: "Vine Whip",
              type: "Grass",
              damage: 7,
            },
          ],
          special: [
            {
              name: "Power Whip",
              type: "Grass",
              damage: 70,
            },
            {
              name: "Seed Bomb",
              type: "Grass",
              damage: 40,
            },
            {
              name: "Sludge Bomb",
              type: "Poison",
              damage: 55,
            },
          ],
        },
      };
      const res = await request.post("/api/pokemon").send(newPokemon);
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon[151]);
    });
  });
  describe("GET /api/pokemon/:idOrName", () => {
    it("should return pokemon with the corresponding id", async () => {
      const res = await request.get("/api/pokemon/98");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon[97]);
    });
    it("should return pokemon with the corresponding id", async () => {
      const res = await request.get("/api/pokemon/098");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon[97]);
    });
    it("should return pokemon with the corresponding name", async () => {
      const res = await request.get("/api/pokemon/Butterfree");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon[11]);
    });
  });
  describe("PATCH /api/pokemon/:idOrName", () => {
    it("should be able to modify the pokemon with the corresponding id or name", async () => {
      const res = await request
        .patch("/api/pokemon/Butterfree")
        .query({ name: "ButterTakai" });
      res.should.be.json;
      JSON.parse(res.text).name.should.deep.equal("ButterTakai");
    });
  });
  describe("DELETE /api/pokemon/:idOrName", () => {
    it("should be able to delete the pokemon with the corresponding id or name", async () => {
      const removedPokemon = {
        id: "102",
        name: "Exeggcute",
        classification: "Egg Pokémon",
        types: ["Grass", "Psychic"],
        resistant: [
          "Water",
          "Electric",
          "Grass",
          "Fighting",
          "Ground",
          "Psychic",
        ],
        weaknesses: ["Fire", "Ice", "Poison", "Flying", "Bug", "Ghost", "Dark"],
        weight: {
          minimum: "2.19kg",
          maximum: "2.81kg",
        },
        height: {
          minimum: "0.35m",
          maximum: "0.45m",
        },
        fleeRate: 0.1,
        evolutionRequirements: {
          amount: 50,
          name: "E",
        },
        evolutions: [
          {
            id: 103,
            name: "Exeggutor",
          },
        ],
        maxCP: 978,
        maxHP: 1099,
        attacks: {
          fast: [
            {
              name: "Confusion",
              type: "Psychic",
              damage: 15,
            },
          ],
          special: [
            {
              name: "Ancient Power",
              type: "Rock",
              damage: 35,
            },
            {
              name: "Psychic",
              type: "Psychic",
              damage: 55,
            },
            {
              name: "Seed Bomb",
              type: "Grass",
              damage: 40,
            },
          ],
        },
      };
      const res = await request.delete("/api/pokemon/102");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(removedPokemon);
    });
  });
  describe("GET /api/pokemon/:idOrName/evolutions", () => {
    it("should return the evolutions a Pokemon has", async () => {
      const res = await request.get("/api/pokemon/Staryu/evolutions");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal([{ id: 121, name: "Starmie" }]);
    });
    it("should return an empty array if the Pokemon doesn't have any evolution", async () => {
      const res = await request.get("/api/pokemon/Starmie/evolutions");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal([]);
    });
  });
  describe("GET /api/pokemon/:idOrName/evolutions/previous", () => {
    it("should return the previous evolutions a Pokemon has", async () => {
      const res = await request.get("/api/pokemon/Starmie/evolutions/previous");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal([{ id: 120, name: "Staryu" }]);
    });
  });
  describe("GET /api/types", () => {
    it("should return the list of all the pokemon types", async () => {
      const res = await request.get("/api/types");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.types);
    });
    it("should return a limited list of pokemon types", async () => {
      const res = await request.get("/api/types").query({ limit: "10" });
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.types.slice(0, 10));
    });
  });
  describe("POST /api/types", () => {
    it("should add a pokemon type", async () => {
      const newType = "Pizza";
      const res = await request.post("/api/types").send(newType);
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.types[17]);
    });
  });
  describe("DELETE /api/types/:name", () => {
    it("should remove a pokemon type", async () => {
      const removedType = "Electric";
      const res = await request.delete("/api/types/Electric");
      res.should.be.html;
      res.text.should.deep.equal(removedType);
    });
  });
  describe("GET /api/types/:type/pokemon", () => {
    it("should return the list of all the pokemon of the given type", async () => {
      const fireTypePokemon = [
        { id: "004", name: "Charmander" },
        { id: "005", name: "Charmeleon" },
        { id: "006", name: "Charizard" },
        { id: "037", name: "Vulpix" },
        { id: "038", name: "Ninetales" },
        { id: "058", name: "Growlithe" },
        { id: "059", name: "Arcanine" },
        { id: "077", name: "Ponyta" },
        { id: "078", name: "Rapidash" },
        { id: "126", name: "Magmar" },
        { id: "136", name: "Flareon" },
        { id: "146", name: "Moltres" },
      ];
      const res = await request.get("/api/types/Fire/pokemon");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(fireTypePokemon);
    });
  });
  describe("GET /api/attacks", () => {
    it("should return the list of all the pokemon attacks", async () => {
      const res = await request.get("/api/attacks");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.attacks);
    });
    it("should return a limited list of pokemon attacks", async () => {
      const res = await request.get("/api/attacks").query({ limit: "1" });
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.attacks.fast);
    });
  });
});
