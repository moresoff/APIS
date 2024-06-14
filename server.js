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

    app.get('/loadMovies', authentication.checkAuthenticated, this.LoadMovies)
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
  
  async doLookup(req, res) { //tuve que cambiar el username y password a req y res 
    const user = req.params.user.toLowerCase();
    const query = { username: user };
    const collection = db.collection("users");
    const userDoc = await collection.findOne(query);
    if (userDoc) {
      res.json({ username: userDoc.username });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }

  async doNew(req, res) { //tuve que cambiar el username y password a req y res 
    const encryptedUsername = req.body.username;
    const encryptedPassword = req.body.password; 
    const key = "CINEMAX - API"; // Clave privada 
    
    // Registrando el nombre de usuario y la contraseña encriptados recibidos
    console.log("Este es el username encriptado que recibió el servidor: " + encryptedUsername);
    console.log("Este es el password encriptado que recibió el servidor: " + encryptedPassword);

    // Desencriptando el nombre de usuario y la contraseña recibidos
    const registroUsername = CryptoJS.AES.decrypt(encryptedUsername, key).toString(CryptoJS.enc.Utf8);
    const registroPassword = CryptoJS.AES.decrypt(encryptedPassword, key).toString(CryptoJS.enc.Utf8);

    // Registrando el nombre de usuario y la contraseña desencriptados
    console.log("Este es el username luego de la desencriptación: " + registroUsername);
    console.log("Este es el password luego de la desencriptación: " + registroPassword);

    // Hasheando la contraseña antes de guardarla en la base de datos
    //parte del bcrypt
    const saltRounds = 10;
    const salt = await Bcrypt.genSalt(saltRounds);
    const hashedRegisterPassword = await Bcrypt.hash(registroPassword, salt);

    // Creando la consulta y actualizando o insertando el usuario
    const query = { username: registroUsername };
    const update = { $set: { password: hashedRegisterPassword } };
    const params = { upsert: true };
    const collection = db.collection('users');
    await collection.updateOne(query, update, params);

    res.json({ success: true }); // Corregido aquí
    console.log("Guardado");
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
async LoadMovies(req,res) {
  const JSON_PATH = 'https://www.mockachino.com/3aa23347-acfb-4e/movies';
  try {
      const response = await fetch(JSON_PATH); // obtener informacion
      const api = await response.json();
      res.json(api); 

  } catch (error) {
      console.error('Error fetching data:', error);
  }   
}
}

new MoviesBackendServer();
