const LocalStrategy = require('passport-local').Strategy;

const bcrypt    = require('bcryptjs');
const firestore = require('../../../services/firestore-api/firestore');

const colStaff = 'caed-staff';

var localOptions = {
    usernameField: 'username',
    passwordField: 'password'
}

var localStrategy = new LocalStrategy(localOptions, function(username, password, done) {
    var filter = ['username', '==', username];
    firestore.getDocsWithFilter(colStaff, filter, function (docs, err) {
        if (!err && docs) {
            for (var i = 0; i < docs.length; i++) {
                var account = docs[i];
                if (bcrypt.compareSync(password, account.password)) {
                    var user = {
                        id: account.id,
                        username: account.username,
                        admin: account.admin
                    }
                    return done(null, user, { message: 'Sucesso'});
                }
            }
        }
        return done(null, false, { message: 'Usuário ou senha inválidos.', tip: 'Verifique suas credenciais.' });
    });
});

module.exports = localStrategy;