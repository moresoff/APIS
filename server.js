import express from 'express';
import db from './db.js';
import passport from 'passport';
import Authentication from "./auth.js";
import fs from 'fs';
import path from 'path'; 
import CryptoJS from 'crypto-js'; 
import Bcrypt from 'bcrypt';


const dirname = fs.realpathSync('.');

class MoviesBackendServer {
  constructor() {
    const app = express();
    
    app.use(express.json());
    app.use(express.static('public'));

    app.use(express.urlencoded({extended: false}));
    const authentication = new Authentication(app);
    
   
  
    app.get('/login/', this.login);
    app.post('/login/', passport.authenticate('local', {failureRedirect: '/login'}));
    app.get('/lookup/:user', authentication.checkAuthenticated, this.doLookup);
    app.post('/registro' , this.doNew)
    app.get('/', authentication.checkAuthenticated, this.goHome);
    app.get('/logout/', authentication.checkAuthenticated, this.doLogout);
    
    app.listen(3000, () => console.log('Listening on port 3000'));    
  }

  async login(req, res) {
    res.sendFile(path.join(dirname, "public/login.html"));
  }

  async goHome(req, res) {
    res.sendFile(path.join(dirname, "public/home.html"));
  }
  
  async doLookup(username, password) {
    const user = username.params.username.toLowerCase();
    const query = { username: user };
    const collection = db.collection("users");
    await collection.findOne(query);
    const response = {
      username: user,
      password: password
    };
    password.json(response);
    console.log("Guardado")
  }
  async doNew(username, password) {
    const encryptedUsername = username.body.username;
    const encryptedPassword = password.body.password; //ME MARCA ERROR EN EL SEGUNDO PASSWORD 
    const key = "CINEMAX - API"; //CONTRASEÑA
    //SOLO MUESTRA 
    console.log("Este es el username encriptado que recibio el server: " + username.body.username);
    console.log("Este es el password encriptado que recibio el server: " + username.body.password);
   
    const registroUsername = CryptoJS.AES.decrypt(encryptedUsername, key).toString(CryptoJS.enc.Utf8);
    const registroPassword = CryptoJS.AES.decrypt(encryptedPassword, key).toString(CryptoJS.enc.Utf8);
    // mostaemos como se ve username y password una vez desencriptado

    console.log("Este es el username luego de la desencriptacion: " + registroUsername);
    console.log("Este es el password luego de la desencriptacion: " + registroPassword);
  // hasheamos la contraseña antes de guardarla en la base de datos
//PARTE DE LA LIBRERIA DE BCRYPT
      const saltRounds = 10;
      const salt = await Bcrypt.genSalt(saltRounds);
      const hashedRegisterPassword = await Bcrypt.hash(registroPassword, salt);
  
      // Crear la consulta y actualizar o insertar el usuario
    const query = { username: registroUsername };
    const update = { $set: { password: hashedRegisterPassword } };
    const params = { upsert: true };
    const collection = db.collection('users');
    await collection.updateOne(query, update, params);

    
    password.json({ success: true });
    console.log("guardado");
  }

  

  async doLogout(req, res) {
    req.logout(err => {
      if (err) {
        return res.status(500).json({ error: 'Log-out failed' });
      }
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ error: 'Session destruction failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
      });
    });
  }

}
 
  


new MoviesBackendServer();