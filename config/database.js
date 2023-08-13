const { Client } = require("pg");
const connectionData = {
  user: process.env.USER_POSTGRES,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD_POSTGRES,
  port: 5432,
};
const client = new Client(connectionData);
const dbConnection = async () => {
  try {
    await client.connect();
    console.log("DB Postgres Online");
  } catch (error) {
    throw new Error("Error al iniciar DB: ", error);
  }
};
module.exports = { dbConnection, client };
