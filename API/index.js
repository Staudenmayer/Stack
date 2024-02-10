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
require('./utils/passport');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SECRET || "secret", cookie: { maxAge: 1440000, httpOnly: true /*,secure: true*/}, resave: false, saveUninitialized: false, name: process.env.COOKIE_NAME || "session" }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(require('./docs/options.json')), { explorer: true }));
app.use('', require('./public/auth'));
app.use('', auth, require('./private/user'));

app.listen(process.env.PORT || 3002, () => {
    console.log('Server running on http://localhost:' + process.env.PORT || 3002)
})