import passport from 'passport'; //autentificacion 
import LocalStrategy from 'passport-local';
import session from 'express-session';
import db from './db.js'

class Authentication {
    constructor(app) {
        app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }));

        app.use(passport.initialize()); // init passport on every route call
        app.use(passport.session());
        passport.use(new LocalStrategy(this.verifyIdentity));
        
        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));
    }
    async verifyIdentity(username, password,done ) { //mismo nombre que en el back 

        const query = { username: username }; //defino como username lo que tengo en mi db username 
        const collection = db.collection("users"); //selecciono la etiqueta de mi db 
        const usernameFromDB = await collection.findOne(query); //busca y lo que busca lo guarda en el query y vuelve 
        if (!usernameFromDB) {
            // If the user was not found, return an error.
            return done(new Error('Invalid username or password'));
        }

    
        // Compare the password entered by the user with the password stored in the database.
        if (usernameFromDB.password !== password) {
            return done(new Error('Invalid password'));
        }

        // The user is authenticated, so return them.
        console.log("Login OK");
        return done(null, usernameFromDB);
    
    }

    checkAuthenticated(username, password, next) {
        if (username.isAuthenticated()) { 
            console.log("Login NOOK");
            return next(); 
        }
        password.redirect("/login");
    }
    
}

export default Authentication;


