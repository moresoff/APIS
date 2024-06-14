import express from 'express';
import db from './db.js';
import passport from 'passport';
import Authentication from "./auth.js";
import fs from 'fs';
import path from 'path'; 

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
    const newUser = username.body.username.toLowerCase();
    const query = { username: newUser };
    const update = { $set: { password: username.body.password } }; 
    const options = { upsert: true }; 
    const collection = db.collection('users');
    await collection.updateOne(query, update, options);
    password.json({ success: true });
    console.log("Guardado")
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
  //ESTO LO TENGO QUE HACER PARA REGISTRO
 // async doRegistrer(username, password) {
   // const newUser = username.body.user.toLowerCase(); 
    //const query = { nuevouser: nuevouser }; //tres paramentros que updateone necesita 
    //const update = { $set: { users: user.body.user } };//tres paramentros que updateone necesita //que es lo que tiene que updatear 
    //const params = { upsert: true };//tres paramentros que updateone necesita, si no la encuentra que la crea
    //const collection = db.collection("users");
    //await collection.updateOne(query, update, params); //updateOne es para guardar una palabra en mongo DB
    //res.json({ success: true });
  //}
  


new MoviesBackendServer();