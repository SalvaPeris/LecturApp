const express = require('express');
const router = express.Router();
const User =require('../models/User');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');

router.get('/users/signin', (req,res)=> {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req,res)=> {
    res.render('users/signup');
});

router.get('/users/profile', async (req,res)=> {
    const user = await User.findOne({email: req.user.email});
    console.log(user);
    res.render('users/profile', { user });
});

router.post('/users/signup', async (req,res)=> {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(name.length <= 0 || email.length <= 0 || password.length <= 0 ){
        errors.push({text: 'Algún campo está vacío.'});
    }
    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden.'});
    }

    /*if(password.length > 4) {
        errors.push({text: 'La contraseña debe tener al menos 4 caracteres.'});
    }*/

    if(errors.length > 0) {
    res.render('users/signup', { errors, name, email, password, confirm_password })
    } else {
       const emailUser = await User.findOne({email: email});
       if(emailUser) {
           req.flash('error_msg','El email ya está en uso.');
           res.redirect('/users/signup');
       }
       const newUser  = new User({ name, email,password});
       newUser.password = await newUser.encryptPassword(password);
       await newUser.save();
       req.flash('success_msg','Registado correctamente');
       res.redirect('/users/signin');
    }

});

router.get('/users/logout', (req,res)=> {
        req.logOut();
        req.flash('success_msg','Se ha cerrado la sesión correctamente.');
        res.redirect('/users/signin');
});

module.exports = router;