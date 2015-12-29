const passport = require('passport');
const express = require('express');

const FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;;


const server = express();

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

server.use(passport.initialize());

passport.use(new FitbitStrategy({
        clientID:     process.env.ID,
        clientSecret: process.env.SECRET,
        callbackURL: "http://localhost:9000/auth/example/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));


server.get('/', (req, res, next) => {
   res.send('hi');
    next();
});

server.get('/auth/example',
    passport.authenticate('fitbit', {scope: ['weight', 'profile']}));

server.get('/auth/example/callback',
    passport.authenticate('fitbit', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log('at callback callback');
        console.log(req);
        res.redirect('/');
    }
);

const port = 9000;

server.listen(port, () => {
    console.log(`${server.name} listening at ${server.url}`);
});
