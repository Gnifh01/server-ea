const User = require("../database/models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { request, response } = require("express");

module.exports.signup = async (request, response) => {
  let { email, password } = request.body;

  try {
    // SE LA PASSWORD È MINORE DI 8 CARATTERI LANCIA L'ERRORE
    if (password.length < 8) {
      throw new Error("La password dev'essere di almeno 8 caratteri");
    }

    //CONTROLLO SE ESISTE UN UTENTE CON L'EMAIL PASSATA
    let user = await User.findOne({ email: email });
    if (user) {
      //SE L'EMAIL ESISTE GIA LANCIA L'ERRORE
      throw new Error("Esiste già un utente con questa email");
    } else {
      //CRITTOGRAFARE LA PASSWORD CON BCRYPT
      password = await bcrypt.hash(password, 12);
      let userData = new User({ email: email, password: password });
      await userData.save();

      response.send({
        status: 200,
        message: "Utente inserito corretamente!",
        body: {},
      });
    }
  } catch (error) {
    //QUALUNQUE ECCEZIONE RISPONDE AL CLIENT CON IL MESSAGGIO D'ERRORE LANCIATO NEL THROW
    response.send({
      status: 400,
      message: error.message,
      body: {},
    });
  }
};

module.exports.signin = async (request, response) => {
  let { email, password } = request.body;

  try {
    // VERIFICO SE ESISTE L'EMAIL IN CASO DI LOGIN
    let user = await User.findOne({ email: email });
    if (!user) {
      // SE NON ESISTE LANCIO UN ERRORE
      throw new Error("Non esiste un utente con questa email!");
    } else {
      //SE ESISTE, CONTROLLO CHE LA PASSWORD SIA CORRETTA
      //ASSEGNO AD UNA VARIABILE LA COMPARAZIONE DELLA PASSWORD INSERITA CON QUELLA CRIPTATA SUL DB
      let isCorret = await bcrypt.compare(password, user.password);
      if (!isCorret) {
        //SE LE PASSWORD NON CORRISPONDO LANCIA L'ERRORE
        throw new Error("La password inserita non è corretta!");
      } else {
        //CREAIAMO UN TOKEN OVVERO UNA STRINGA UNIVOCA CHE SE SALVATA NEL LOCALSTORAGE CI PERMETERA DI ENTARE SENZA EFFETTUARE IL LOGIN
        const token = await jwt.sign(
          { email: user.email },
          process.env.SECRET_KEY, //SECRET KEY È
          { expiresIn: "1d" } //IMPOSTIAMO LA SCADENZA DEL TOKEN AD 1d OVVERO UN GIORNO
        );
        response.send({
          status: 200,
          message: "Login effettuato correttamente",
          body: token, //RITONA IL TOKEN (DA SALVARE SUCCESSIVAMENTE NEL LOCALSTORAGE)
        });
      }
    }
  } catch (error) {
    response.send({ status: 400, message: error.message, body: {} });
  }
};

module.exports.delete = async (request, response) => {
  let { email, password } = request.body;

  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Quest'utente non esiste");
    } else {
      let deleteData = user.deleteOne({
        email: user.email,
        password: user.password,
      });
      response.send({
        status: 200,
        message: "User eliminato correttamente",
      });
    }
  } catch (error) {
    response.send({ status: 400, message: error.message, body: {} });
  }
};
