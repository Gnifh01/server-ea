const mongoose = require("mongoose");

//creazione dello Schema Utente (una tabella tipo)
const userSchema = new mongoose.Schema( 
  {
    email: String,    
    username: String,        //valori
    password: String,       //valori
  },
  {
    timestamps: true,       //data di creazione
  }
);

//Esportare lo schema
module.exports = mongoose.model("User", userSchema)