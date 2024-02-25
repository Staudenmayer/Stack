"use strict";
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {auth} = require('./utils/auth');
const passport = require("passport");
const pgSession = require('connect-pg-simple')(session);
const db = require('./utils/db');
require('./utils/passport');

const app = express();

//Cors setup
app.use(cors());

//Body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Session setup
app.use(session({ 
    secret: process.env.SECRET || "secret",
    cookie: {
        maxAge: 1440000,
        httpOnly: true /*,secure: true*/
    },
    resave: false,
    saveUninitialized: false,
    name: process.env.COOKIE_NAME || "session",
    store: new pgSession({pool: db, tableName: 'session_store'})
}));

//Passport setup
app.use(passport.initialize());
app.use(passport.session());

//Swagger setup
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(require('./docs/options.json')), { explorer: true }));

//Private and Public routes
app.use('', require('./public/auth'));
app.use('', auth, require('./private/user'));

//Custom Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).end();
})

app.listen(process.env.PORT || 3002, () => {
    console.log('Server running on http://localhost:' + process.env.PORT || 3002)
})