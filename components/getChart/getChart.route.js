const { getChartByNameController } = require("./getChart.controller");

function route(app) {
  app.get("/:country/:icao/:chartname", getChartByNameController);
}

module.exports = route;
