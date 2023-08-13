const getChartRoute = require('../components/getChart/getChart.route')
const getProceduresRoute = require('../components/getProcedures/getProcedures.route')
function routes(app) {
    getChartRoute(app)
    getProceduresRoute(app)
}


module.exports = routes;
