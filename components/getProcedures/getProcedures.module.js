const { client } = require("../../config/database");
const errors = require("../../enums/errors")

async function getProceduresByIcao(req) {
  const icao_code = req.params.icao_code.toUpperCase();
  const result_procedures = await client.query(
    "SELECT * FROM getProceduresByIcao($1)",
    [icao_code]
  );
  if (!result_procedures.rows.length > 0) {
    return errors.AIRPORT_NOT_FOUND;
  }
  const result_country = await client.query(
    "SELECT code FROM country c INNER JOIN airport a on c.id = a.country_fk WHERE a.icao = $1",
    [icao_code]
  );
  const result_airport_name = await client.query(
    "SELECT name from airport WHERE icao = $1",
    [icao_code]
  );
  const response = {
    country: result_country.rows[0].code,
    icao: icao_code,
    airport_name: result_airport_name.rows[0].name,
    procedures: result_procedures.rows,
  };
  return response;
}

module.exports = {
  getProceduresByIcao,
};
