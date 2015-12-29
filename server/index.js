const passport = require('passport');
const express = require('express');
const FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;
const https = require('https');
const session = require('express-session');
const axios = require('axios');

const server = express();

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

server.use(session({secret: process.env.SESSION_SECRET || 'adsfdsfga'}));
server.use(express.static('client'));

server.use(passport.initialize());
server.use(passport.session());

const host = process.env.HOST || 'http://localhost:9000';

passport.use(new FitbitStrategy({
        clientID:     process.env.ID,
        clientSecret: process.env.SECRET,
        callbackURL: host + "/auth/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, {token: accessToken});
    }
));

server.get('/',
    passport.authenticate('fitbit', {scope: ['weight', 'profile']}));

server.get('/auth/callback',
    passport.authenticate('fitbit', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log('at callback callback');
        console.log(req.user);
        res.redirect('/app.html');
    }
);

server.get('/data', (req, res) => {

    axios.get('https://api.fitbit.com/1/user/-/profile.json', {
        headers: {
            Authorization: 'Bearer ' + req.user.token
        }
    }).then(response => {
        res.send(response.data);
    }).catch(e => {
        console.log(e);
    });
});

const port = process.env.PORT || 9000;

server.listen(port, () => {
    console.log(`${server.name} listening at ${server.url}`);
});
