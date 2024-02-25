"use strict";
const express = require('express');
const bcrypt = require("bcrypt");
const passport = require("passport");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const db = require('../utils/db');
const { auth } = require('../utils/auth');
const schema = require('../utils/schemas');
const { sendMail } = require('../utils/mail');
const { user } = require('pg/lib/defaults');

require('dotenv').config();
const router = express.Router();

router.post('/register', async function(req, res, next) {
    try {
        schema.validate('login', req.body);
        let password = await bcrypt.hash(req.body.password, 10);
        await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [req.body.email, password])
        //sendMail('s.staudenmayer@outlook.com', 'Test', 'text');
        next();
    } catch (error) {
        console.error(error)
        if(error.code == 23505){
            return res.status(400).end("Email is already in use");
        }
        if(error.message.includes("ValidationError")){
            if(error.message.includes("email")){
                return res.status(400).end("Email is not valid")
            }
            if(error.message.includes("password")){
                return res.status(400).end("Password is not valid")
            }
        }
        return res.status(500).end("Something went wrong");
    }
},
passport.authenticate('local'),
function(req, res) {
    if(req.user && req.user.csrf){
        res.setHeader('X-CSRF-Token', req.user.csrf).status(200).end(JSON.stringify(req.user));
    }
});

router.post('/google', async function(req, res, next) {
    try {
        const response = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                code: req.body.token,
                client_id: process.env.GOOGLE_APP_ID,
                client_secret: process.env.GOOGLE_APP_SECRET,
                redirect_uri: "postmessage",
                grant_type: "authorization_code"
            }
        );
        const accessToken = response.data.access_token;
        // Fetch user details using the access token
        const userResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        if (userResponse && userResponse.data) {
            // Set the userDetails data property to the userResponse object
            req.body.email = userResponse.data.email;
            req.body.password = userResponse.data.sub;
            let password = await bcrypt.hash(req.body.password, 10);
            let users = await db.query('SELECT * FROM users where email=$1', [req.body.email]);
            if(users.rowCount == 0) {
                await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [userResponse.data.email, password])
            }
            return next();
        } else {
            // Handle the case where userResponse or userResponse.data is undefined
            return res.status(401).end();
        }
    } catch (error) {
        console.error(error)
        res.status(500).end();
    }
},
passport.authenticate('local'),
function(req, res) {
    if(req.user && req.user.csrf){
        res.setHeader('X-CSRF-Token', req.user.csrf).status(200).end(JSON.stringify(req.user));
    }
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.setHeader('X-CSRF-Token', req.user.csrf).status(200).end(JSON.stringify(req.user));
});

router.post('/logout', auth, async function(req, res) {
    try {
        await db.query('UPDATE users SET csrf=NULL where id=$1', [req.user.id])
    } catch (error) {
        //If you get here for some reason there is a major issue
        res.status(500).end();
    }
    req.session.destroy();
    res.clearCookie(process.env.COOKIE_NAME || "session").status(200).end();
})

module.exports = router;