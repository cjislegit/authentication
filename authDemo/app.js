const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth_demo_app', {
  useNewUrlParser: true
});
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  require('express-session')({
    secret: 'Harley is the best pup',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

//==============
//ROUTES
//==============

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/secret', (req, res) => {
  res.render('secret');
});

//Auth Routes

//Show sign upform
app.get('/register', (req, res) => {
  res.render('register');
});

//Handaling user sign up
app.post('/register', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.render('register');
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secret');
      });
    }
  );
});

app.listen(3000, () => {
  console.log('Connected');
});
