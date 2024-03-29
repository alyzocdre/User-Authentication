const express = require('express');
const expresslayouts = require('express-ejs-layouts');
const mongoose  = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
//Passport config

require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;

//connect to MongoDB

mongoose.connect(db,{useNewUrlParser : true})
.then(()=>console.log('MongoDB connected..'))
.catch(err => console.log(err));

// EJS
app.use(express.static('./styles'));
app.use(expresslayouts);
app.set('view engine','ejs');

// BodyParser

app.use(express.urlencoded({extended:false}));
// Express Session

app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized:true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());    

//connect flash
app.use(flash());
//Global Variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// Routes

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log(`Server started on port ${PORT}`));