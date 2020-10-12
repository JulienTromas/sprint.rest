const chai = require("chai");
const chaiHttp = require("chai-http");
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
    it("should be able to modify the pokemon with the corresponding id", async () => {
      const res = await request
        .patch("/api/pokemon/Butterfree")
        .query({ name: "ButterTakai" });
      res.should.be.json;
      JSON.parse(res.text).name.should.deep.equal("ButterTakai");
    });
  });
});
