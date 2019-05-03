// Required dependencies 
const express = require('express')
const app = express()
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')
require('dotenv').config()

const port = process.env.PORT || 3000
const provider = process.env.AUTH_PROVIDER

app.use(passport.initialize()) // Used to initialize passport
app.use(passport.session()) // Used to persist login sessions

// Strategy config
passport.use('oauth2', new OAuth2Strategy({
    authorizationURL: provider + '/authorize',
    tokenURL: provider + '/access_token',
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK_URL
  }, 
  function (accessToken, refreshToken, profile, done) {
    console.log("Access token", accessToken)
    console.log("Refresh token", refreshToken)
    done(null, profile) // passes the profile data to serializeUser
  }
))

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
  done(null, user)
})

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user)
})

// Routes
// The passport.authenticate middleware is used here to authenticate the request and runs the function on Strategy config

app.get('/', (req, res) => {
  res.send("You have been authed")
})

app.get('/login', passport.authenticate('oauth2'));
app.get('/auth', passport.authenticate('oauth2', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.listen(port, () => {
  console.log('Oauth2 Server with Passport Started!')
})