var express = require("express");
require("dotenv").config();
var helmet = require("helmet");
var cookieParser = require("cookie-parser");
const routes = require("./routes");
const cors = require("cors");
const { dbConnection } = require("./config/database");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
dbConnection();
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


routes(app);
app.get("/", (req, res) => {
  res.send("Bienvenido")
})
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});

module.exports = app;
