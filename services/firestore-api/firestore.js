const factory = require('./factory');

module.exports = {

	getAllDocs: function(collection, callback) {
		var db = factory.getDbInstance();
		var colRef = db.collection(collection);
		var allDocs = colRef.get()
			.then(snapshot => {
				var documents = [];
				snapshot.forEach(doc => {
					// set 'id' key
					var data = doc.data();
					data.id = doc.id;
					documents.push(data);
				});
				callback(documents);
		    })
		    .catch(err => {
		    	console.log('Error getting documents', err);
		    	callback({}, err);
		    });
	},

	addDoc: function(collection, doc, callback) {
    	var db = factory.getDbInstance();
		var colRef = db.collection(collection);
		var addDoc = colRef.add(doc)
			.then(ref => {
				console.log('Added document with ID: ', ref.id);
				callback(ref.id);
			}).catch(err => {
				console.log('Error in adding documents: ', err);
				callback({}, err);
			});
	},

	updateDoc: function(collection, id, doc, callback) {
		var db = factory.getDbInstance();
		var docRef = db.collection(collection).doc(id);
		var updateSingle = docRef.update(doc)
			.then(() => {
		    	console.log("Document successfully updated!");
				callback(id);
			}).catch(err => {
		    	console.error("Error updating document: ", err);
		    	callback({}, err);
			});
	},

	deleteDoc: function(collection, id, callback) {
		var db = factory.getDbInstance();
		var docRef = db.collection(collection).doc(id);
		var deleteDoc = docRef.delete()
			.then(() => {
				console.log("Document successfully deleted!");
				callback(id);
			}).catch(err => {
				console.error("Error removing document: ", err);
				callback({}, err);
			});
	}

}