// PER CREARE UN SERVER
const express = require("express");
// PER LE VARIABILI DI SISTEMA
const dotenv = require("dotenv");
// PER CONTROLLARE LA RICHIESTA
const cors = require("cors");
//IMPOSTO IL MODULO PER LA CONNESSIONE AL DB
const dbConnection = require("./database/connection");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/EA-server", require("./routers/user.route"));

dbConnection();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`[Server]: Listening at port ${PORT}...`));
