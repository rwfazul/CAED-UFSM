const passportJWT = require("passport-jwt");

const JWTStrategy = passportJWT.Strategy;

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) token = req.cookies['jwt'];
  return token;
};

var jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: 'my_secret' // change it (e.g. get from env.)
}

var jwtStrategy = new JWTStrategy(jwtOptions, function(jwtPayload, next) {
    // find the user in db and do some stuff if needed
    if (jwtPayload.id == '787afafaof5') {
        var user = {
            id: '787afafaof5',
            username: 'admin',
            admin: true
        }        
        next(null, user);
    } else {
        next(null, false);
    }
});

module.exports = jwtStrategy;