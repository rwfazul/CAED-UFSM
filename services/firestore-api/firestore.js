const factory = require('./factory');


var getDocs = function (query, callback) {
	query.get()
		.then(snapshot => {
			var documents = [];
			snapshot.forEach(doc => {
				var data = doc.data();
				data.id = doc.id;
				if (data.timestamp != null)
					data.timestamp = ((data.timestamp).toDate()).toLocaleDateString();
				documents.push(data);
			});
			callback(documents);
		})
		.catch(err => {
			console.log('Error getting documents', err);
			callback({}, err);
		});
};

module.exports = {

	getAllDocs: function (collection, callback) {
		var db = factory.getDbInstance();
		var colRef = db.collection(collection);
		var allDocs = colRef;
		getDocs(allDocs, callback);
	},

	getDocsWithFilter: function (collection, filter, callback) {
		var db = factory.getDbInstance();
		var colRef = db.collection(collection);
		var query = colRef.where(...filter);
		getDocs(query, callback);
	},

	getCount: function (collection, year, callback) {
		var db = factory.getDbInstance();
		var colRef = db.collection(collection);
		var query = colRef
			.select("tipoAtendimento", "timestamp")
			.get()
			.then(snapshot => {
				var documents = [];
				snapshot.forEach(doc => {
					var data = doc.data();
					data.timestamp = ((data.timestamp).toDate());
					if(data.timestamp.getFullYear() == year){
						data.timestamp = data.timestamp.toLocaleDateString();
						documents.push(data);
					}
				});
				callback(documents);
			})
			.catch(err => {
				console.log('Error getting documents', err);
				callback({}, err);
			});

	},

	getDocsPagination: function (collection, colOrder, filter, page, callback) {
		var db = factory.getDbInstance();
		var colRef = db.collection(collection);
		var limit = page > 1 ? ((page - 1) * 5) : 5;
		if (colOrder && filter) {
			var query = colRef
				.where(...filter)
				.orderBy(colOrder[0], "desc")
				.orderBy(colOrder[1], "desc")
				.limit(limit);
		} else {
			var query = colRef
				.limit(limit);
		}
		if (page == 1) {
			getDocs(query, callback);
		} else if (page > 1) {
			query.get()
				.then(documentSnapshots => {
					var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
					if (colOrder && filter) {
						var next = colRef
							.where(...filter)
							.orderBy(colOrder[0], 'desc')
							.orderBy(colOrder[1], 'desc')
							.startAfter(lastVisible)
							.limit(5);
					} else {
						var next = colRef
							.startAfter(lastVisible)
							.limit(5);
					}
					getDocs(next, callback);
				})
				.catch(err => {
					console.log('Error getting documents', err);
					callback({}, err);
				});
		}
	},

	addDoc: function (collection, doc, callback) {
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

	updateDoc: function (collection, id, doc, callback) {
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

	deleteDoc: function (collection, id, callback) {
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