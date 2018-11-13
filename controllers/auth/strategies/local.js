const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

var localOptions = {
    usernameField: 'username',
    passwordField: 'password'
}

var localStrategy = new LocalStrategy(localOptions, function(username, password, done) {
    // Use a DB (with a global UserModel if needed)
    /* the hash below is just an example (compatible with the mock 'admin' user) 
     you may want to use something like 'db.findUser(username, password)' 
     and test if it return a valid user (which password is naturally encrypted) */
    var hash = '$2a$10$CeBuLjpal1TWOgqpy2iob.DGkN85Vw6LwZBvM/0KUOs6PnR82BXG2';
    var user = {
        id: '787afafaof5',
        username: 'admin',
        password: hash,
        admin: true
    }
console.log('-> localStrategy');
    if (username != 'admin' || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Usuário ou senha inválidos.', tip: 'Verifique suas credenciais.' });
    }
    delete user['password']; // if you don't want this available in req object
    return done(null, user, { message: 'Sucesso'});
});

module.exports = localStrategy;