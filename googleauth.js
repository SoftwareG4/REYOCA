const express = require('express');
const session = require('express-session');
const passport = require('passport');
const UserModel = require('./src/models/M_register_login');
const {createTokens, validateToken}= require('./src/services/JWTauth');
const dotenv = require('dotenv');
dotenv.config();

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/google/callback",
  passReqToCallback: true,
},
async function(request, accessToken, refreshToken, profile, done) {
  console.log(profile)
  await UserModel.googleregisterrentee(profile, (err, result) => {
    if (err) {
      return done(null, "Authentication Failure");
    } else {
      console.log(result)
      return done(null, result);
    }
  });

  // return done(null, 23);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();



app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected', (req, res) => {
  console.log(req.user)
  res.send(`Hello ${req.user}`);
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(8080, () => console.log('listening on port: 8080'));
