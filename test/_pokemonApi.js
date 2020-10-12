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
    it("should return the list of pokemon", async () => {
      const res = await request.get("/api/pokemon");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon);
    });
    it("should return a limited list of pokemon", async () => {
      const res = await request.get("/api/pokemon/10");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokeData.pokemon.slice(0, 10));
    });
  });
});
