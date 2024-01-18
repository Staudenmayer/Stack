const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const qry = require('./db');
const { v4: uuidv4 } = require('uuid');
const {ensureLoggedIn} = require('connect-ensure-login');

const propertyDescriptor = {
  usernameField: 'email',
  passwordField: 'password'
};

passport.use( new LocalStrategy(propertyDescriptor ,async function verify(email, password, cb) {
    try {
      let user = await qry`SELECT * from users where email=${email}`;
      if(user.length != 1) return cb(null, false);
      else user = user[0]

      if(bcrypt.compareSync(password, user.password)){
        user.csrf = uuidv4();
        await qry`UPDATE users SET csrf=${user.csrf} where id=${user.id}`;
        delete user.password;
        return cb(null, user);
      }
      return cb(null, false);
    } catch (error) { 
      console.log(error);
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

module.exports = {
  auth: function (req, res, next) {
    if(req.user.csrf === req.headers['x-csrf-token']) (ensureLoggedIn())(req,res,next);
    else return res.status(401).end();
  }
}