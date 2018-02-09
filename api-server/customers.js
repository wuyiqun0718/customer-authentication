const crypto = require('crypto');
const _ = require('lodash');
const INTERATIONS = 10000;
const KEY_LEN = 64;
const ALGORITHIM = 'sha512';

const getSalt = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(256, (err, salt) => {
            if (err) reject(err);
            resolve(salt);
        })
    })
}


const getHash = (password, salt) => {
    return new Promise( (resolve, reject) => {
        crypto.pbkdf2(password, salt, INTERATIONS, KEY_LEN, ALGORITHIM, (err, hash) => {
            if (err) reject(err);
            resolve({ hash, salt });
        })
    })
}

module.exports = (customerDB, certificateDB) => {
    class customers {
        static getAll() {
            return customerDB.search()
                .then(customers => customers.map(customer => _.omit(customer, ['hash', 'salt'])));
        }

        static add({ name, email, password }) {
            return getSalt()
                .then(salt => getHash(password, salt))
                .then(({ hash, salt}) => {
                    const newCustomer = {
                        name,
                        email,
                        hash,
                        salt,
                        certificates: 0
                    }
                    return customerDB.add(newCustomer);
                })
                .then((newCustomer) => _.omit(newCustomer, ['hash', 'salt']))
        }

        static delete(_id) {
            return customerDB.delete({ _id });
        }
    }

    return customers;
}