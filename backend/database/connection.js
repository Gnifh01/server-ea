// PER COLLEGARERCI AL DB E SCAMBIARE DATI
const mongoose = require("mongoose");

//FUNZIONE PER COLLEGARSI AL DB
module.exports = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[Server]: Connessione al Database stabilita...");
  } catch (error) {
    console.log(
      `[Server]: Non sono riuscito a connettermi al Database: ${error}`
    );
  }
};
