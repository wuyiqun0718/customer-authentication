const Datastore = require('nedb');

class dbWithPromise {
    constructor(filePath) {
        this.db = new Datastore(filePath);
        this.db.loadDatabase();
    }

    add(doc) {
        return new Promise((resolve, reject) => {
            this.db.insert(doc, (err, newDoc) => {
                if (err) reject(err);
                else resolve(newDoc);
            })
        })
    }

    update(query, update, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.update(query, update, options, (err, numReplaced) => {
                if (err) reject(err);
                else resolve(numReplaced);
            })
        })
    }

    delete(query, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.remove(query, options, (err, numRemoved) => {
                if (err) reject(err);
                else resolve(numRemoved);
            })
        })
    }

    search(query = {}) {
        return new Promise((resolve, reject) => {
            this.db.find(query, (err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            })
        })
    }
}

module.exports = dbWithPromise;