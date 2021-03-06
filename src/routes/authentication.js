const express =require('express');
const router = express.Router();

const passport = require('passport');
const {ValidSession ,IsNotSession} = require('../lib/auth');

router.get('/signup',IsNotSession,(req,res) =>{
    res.render('auth/signup');
})

router.post('/signup',IsNotSession,passport.authenticate('local.signup',{
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

router.get('/login',IsNotSession,(req,res) =>{
    res.render('auth/login');
});
router.post('/login',IsNotSession,(req,res,next) =>{
    passport.authenticate('local.login',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true

    })(req,res ,next);

});

router.get('/profile', ValidSession, (req,res) =>{
    res.render('profile');
});

router.get('/logout',(req,res) =>{
    req.logOut();
    res.redirect('/login');
});
module.exports = router;