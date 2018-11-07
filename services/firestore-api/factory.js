const admin = require('firebase-admin');
var serviceAccount = require('./credentials/caed-ufsm-admin-sdk.json');

const config = {timestampsInSnapshots: true};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const _db = admin.firestore();
_db.settings(config);

exports.getDbInstance = function() {
	return _db;
}