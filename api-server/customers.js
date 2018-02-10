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
    class Customers {
        static getAll() {
            return Promise.all([customerDB.search(), certificateDB.search()])
                .then( ([customers, certificates]) => {
                    const certificatesByCustomer = _.groupBy(certificates, 'customerId');
                    return customers.map(customer => {
                        if (certificatesByCustomer[customer._id]) customer.certificates.push(...certificatesByCustomer[customer._id]);
                        return _.omit(customer, ['hash', 'salt'])
                    });
                })
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
                        certificates: []
                    }
                    return customerDB.add(newCustomer);
                })
                .then((newCustomer) => _.omit(newCustomer, ['hash', 'salt']))
        }

        static delete(_id) {
            return customerDB.delete({ _id })
                .then(() => certificateDB.delete({ customerId: _id }, { multi: true }));
        }
    }

    return Customers;
}