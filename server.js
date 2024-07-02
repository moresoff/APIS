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

    app.get('/loadMovies', authentication.checkAuthenticated, this.LoadMovies.bind(this));
    app.get('/login/', this.login);
    app.post('/login/', passport.authenticate('local', { failureRedirect: '/login' }));
    app.get('/lookup/:user', authentication.checkAuthenticated, this.doLookup.bind(this));
    app.post('/registro', this.doNew.bind(this));
    app.get('/', authentication.checkAuthenticated, this.goHome.bind(this));
    app.get('/logout/', authentication.checkAuthenticated, this.doLogout.bind(this));
    app.get('/loadCines', authentication.checkAuthenticated, this.LoadCines.bind(this));
    app.post('/comments', authentication.checkAuthenticated, this.saveComment.bind(this));
    app.get('/comments', authentication.checkAuthenticated, this.showComments.bind(this));
    app.post('/comentario', authentication.checkAuthenticated, this.saveComentario.bind(this));
    app.get('/comentario', authentication.checkAuthenticated, this.showComentario.bind(this));



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

  async LoadMovies(req, res) {
    const JSON_PATH = 'https://www.mockachino.com/3aa23347-acfb-4e/movies';
    try {
      const response = await fetch(JSON_PATH);
      const api = await response.json();
      res.json(api);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async LoadCines(req, res) {
    const API_URL = 'https://www.mockachino.com/8113743e-f0f9-4d/cines';
    try {
      const response = await fetch(API_URL);
      const api = await response.json();
      res.json(api);
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
 //comentarios de cine
  async saveComment(req, res) {
    const { cine, comentario } = req.body;
    const username = req.user.username;

    const collection = db.collection('comments');

    try {
      await collection.insertOne({ username, cine, comentario });
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving comment:', error);
      res.status(500).json({ error: 'Error saving comment to database' });
    }
  }

  async showComments(req, res) {
    const collection = db.collection('comments');

    try {
      const comments = await collection.find().toArray();
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Error fetching comments from database' });
    }
  }

  // comentarios de peliculas 
  async saveComentario(req, res) {
    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: 'No está autenticado' });
    }
    const { pelicula, comment } = req.body;
    const username = req.user.username;
    
    const collection = db.collection('comentario');
    
    try {
        await collection.insertOne({ username, pelicula, comment });
        res.json({ success: true });
    } catch (error) {
        console.error('Error al guardar el comentario:', error);
        res.status(500).json({ error: 'Error al guardar el comentario en la base de datos' });
    }
}

async showComentario(req, res) {
    const collection = db.collection('comentario');
    try {
        const comentario = await collection.find().toArray();
        res.json(comentario);
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        res.status(500).json({ error: 'Error al obtener los comentarios de la base de datos' });
    }
}
}

new MoviesBackendServer();
