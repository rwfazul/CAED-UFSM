var passport       = require('passport');
var localStrategy  = require('./strategies/local');
var jwtStrategy    = require('./strategies/jwt');

passport.use(localStrategy);
passport.use(jwtStrategy);

var authLocal = function(req, res) { 
  passport.authenticate('local', 
  { 
    session: false,
    badRequestMessage : 'Por favor, preencha o formulário.',
  }, 
  function(err, user, info) {
    if (err || !user) return res.status(401).json(info); 
    req.logIn(user, { session: false }, function(err) {
      if (err) { return res.status(501).json(info); }
    });
  })(req, res);
}

var authJwt = passport.authenticate('jwt', {
  session: false, 
  failureRedirect: '/caed'
}); 

var authJwtFoward = function(req, res, next) {
  passport.authenticate('jwt', 
  	{ session: false }, 
    function(err, user, info) {
      if (err || !user) { console.log('-> err | user'+err); return next(); }
      req.logIn(user, { session: false }, function(err) {
        if (err) { console.log('-> err:'+err);return next(); }
        return res.redirect('/admin');
      });
  })(req, res, next);
}

module.exports = {
  authLocal,
  authJwt,
  authJwtFoward
}