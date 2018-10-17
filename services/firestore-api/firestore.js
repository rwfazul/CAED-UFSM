const admin = require('firebase-admin');
var serviceAccount = require('./credentials/caed-ufsm-admin-sdk.json');

const config = {timestampsInSnapshots: true};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var _db = admin.firestore();
_db.settings(config);

exports.getDbInstace = function() {
	return _db;
}