const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

// Login Page
router.get('/login',(req,res)=> res.render('login'));

// Register Page

router.get('/register',(req,res)=> res.render('register'));

router.post('/register',(req,res)=> {
   // console.log(req.body);  
    //res.send('Hello');
    const {name,email,password,password2} = req.body;
    let errors = [];
    
    if(!name || !email || !password || !password2){
        errors.push({msg: "Please fill all feilds"});
    }
    if(password != password2){
        errors.push({msg: "Password mismatch"});
    }
    if(password.length < 6){
        errors.push({msg : 'Password should be atleast 6 characters '});
    }
    if(errors.length > 0){
        res.render('register',{errors,name,email,password,password2});
    }
    else{
       // res.send('Pass');
       User.findOne({email : email})
       .then(user=>{
           if(user){
               //User Exists
               errors.push({msg: 'Email already registered'});
               res.render('register',{
                   errors,
                   name,
                   email,
                   password,
                   password2
               });
           }
           else{
               const newUser = new User({
                   name,
                   email,
                   password
               });
               console.log(newUser);
               //res.send('hello');
               // Hash Password
               bcrypt.genSalt(10,(err,salt)=> {
                   bcrypt.hash(newUser.password,salt,(err,hash)=>{
                       if(err) throw err;

                       newUser.password = hash;
                       newUser.save()
                       .then((user)=> {
                           req.flash('success_msg','You are now registerd and can log in ');
                           res.redirect('/users/login');
                        })
                       .catch(err => console.log(err));
                   });
               });
           }
       }).catch(err=> console.log(err));
    }
});

//Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next);
});

// Logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged Out');
    res.redirect('/users/login');
});

module.exports = router;