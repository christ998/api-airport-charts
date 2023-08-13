const { getProceduresByIcaoController } = require("./getProcedures.controller");

function route(app) {
  app.get("/:icao_code/procedures", getProceduresByIcaoController);
}

module.exports = route;