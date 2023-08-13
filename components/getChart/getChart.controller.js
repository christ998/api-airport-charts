const { getIcaoBuffer, getPDFPageBuffer } = require("./getChart.module");

async function getChartController(req, res) {
  try {
    const dataFileChart = await getIcaoBuffer(req);
    res.type("application/pdf");
    res.send(dataFileChart);
  } catch (e) {}
}

async function getChartByNameController(req, res) {
  try {
    const chartByNameBuffer = await getPDFPageBuffer(req);
    res.type("application/pdf");
    res.send(chartByNameBuffer);
  } catch (e) {
    res.status(404).send("Carta no encontrada");
  }
}

module.exports = { getChartController, getChartByNameController };
