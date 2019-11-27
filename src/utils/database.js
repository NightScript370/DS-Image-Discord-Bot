import loki from 'lokijs';

const db = new loki('database.db', {
	autoload: true,
	autosave: true,
	autosaveInterval: 25000,
	autoloadCallback: loadCollections,
})

const collections = ['points', 'infractions', 'serverconfig', 'userconfig', 'multiply', 'rules'];
function loadCollections () {
	collections.forEach(x => {
		let coll = db.addCollection(x)

		db[x] = coll
	})
}

export default db
