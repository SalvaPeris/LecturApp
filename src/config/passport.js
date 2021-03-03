const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async(email, password, done) => {
        const user = await User.findOne({email: email});
        console.log(user);
    if(!user){
        return done(null, false, {message: 'Usuario no encontrado.'});
    } else {
        console.log(password);
        const match = user.matchPassword(password);

        match.then(function(result) {
            console.log(result);
            if (result) {
                return done(null, user);
                console.log(match);
                console.log('correcto');
            } else {
                return done(null, false, {message: 'Contraseña incorrecta.'});
                console.log(match);
                console.log('incorrecto');
            }
        });
    }
}));

passport.serializeUser((user, done) => { 
    done(null, user.id);
});

passport.deserializeUser((id, done) => { 
    User.findById(id, (err, user) => { 
        done(err, user);
    });
});