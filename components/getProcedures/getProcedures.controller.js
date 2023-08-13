const { getProceduresByIcao } = require("./getProcedures.module");
const errors = require("../../enums/errors")
async function getProceduresByIcaoController(req, res) {
  try {
    const procedures = await getProceduresByIcao(req);
    if (procedures === errors.AIRPORT_NOT_FOUND) {
      res.status(404).send(procedures.description)
    } else {
      res.send(procedures);
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = { getProceduresByIcaoController };
