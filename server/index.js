const passport = require('passport');
const express = require('express');
const FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const axios = require('axios');
const bodyParser = require('body-parser');
const mongo = require('mongoskin');

const server = express();

const http = require('http').Server(server);
const io = require('socket.io')(http);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

const mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/bulker';
const store = new MongoDBStore({
    uri: mongoUri,
    collection: 'sessions'
});
const db = mongo.db(mongoUri, {nativeParser: true});
db.bind('measurements');

server.use(bodyParser.json());
server.use(session({
    secret: process.env.SESSION_SECRET || 'adsfdsfga',
    store
}));
server.use(express.static('public'));

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
        console.log(req.user);
        res.redirect('/app.html');
    }
);

server.get('/user', (req, res) => {
    res.send({
        token: req.user.token
    });
});

const pushMeasurements = user => {
    db.measurements.find({user}).toArray((err, res) => {
        io.to(user).emit('measurements', res);
    });
};

server.post('/data', (req, res) => {
    const datapoint = {
        user: req.body.user,
        waist: req.body.waist,
        weight: req.body.weight,
        time: new Date(req.body.time)
    };
    db.measurements.insert(datapoint, (err, item) => {
        pushMeasurements(datapoint.user);
        res.send(item);
    });
});

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('activate', message => {
        socket.join(message.user);
        pushMeasurements(message.user);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    })
});

const port = process.env.PORT || 9000;

http.listen(port, () => {
    console.log(`server running on port ${port}`);
});
