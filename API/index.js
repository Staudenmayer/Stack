const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require("passport");
const {auth} = require('./auth');
const qry = require('./db');

require('dotenv').config();

const api = express();
api.use((req,res,next)=>{
    console.log(req);
    next();
})
api.use(cors());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(session({ secret: process.env.SECRET || "secret", cookie: { maxAge: 1440000, httpOnly: true /*,secure: true*/}, resave: false, saveUninitialized: false, name: process.env.COOKIE_NAME || "session" }));
api.use(passport.initialize());
api.use(passport.session());

api.post('/login', passport.authenticate('local'), function(req, res) {
    //console.log(req.user);
    res.setHeader('X-CSRF-Token', req.user.csrf).status(200).end(JSON.stringify(req.user));
});

api.get('/user', auth, (req,res) => {
    //console.log(req.user);
    res.status(200).end(JSON.stringify(req.user));
})

api.post('/logout', auth, async function(req, res) {
    try {
        await qry`UPDATE users SET csrf=NULL where id=${req.user.id}`;
    } catch (error) {
        //If you get here for some reason there is a major issue
        res.status(500).end();
    }
    req.session.destroy();
    res.clearCookie(process.env.COOKIE_NAME || "session").status(200).end();
})

api.listen(process.env.PORT || 3002, () => {
    console.log('Server running on http://localhost:' + process.env.PORT || 3002)
})