"use strict";
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const qry = require('./db');
const schema = require('./schemas')

const propertyDescriptor = {
  usernameField: 'email',
  passwordField: 'password',
};

passport.use(
  new LocalStrategy(propertyDescriptor, async function verify(email, password, cb) {
    try {
      //schema.validate('login', {email: email, password: password})
      let user = await qry`SELECT * from users where email=${email}`;
      if (user.length != 1) return cb(null, false);
      else user = user[0];
      if (bcrypt.compareSync(password, user.password)) {
        user.csrf = uuidv4();
        await qry`UPDATE users SET csrf=${user.csrf} where id=${user.id}`;
        delete user.password;
        return cb(null, user);
      }
      return cb(null, false);
    } catch (error) {
      console.error(error)
      return cb(null, false);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
