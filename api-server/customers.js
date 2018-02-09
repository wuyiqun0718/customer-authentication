const crypto = require('crypto');
const INTERATIONS = 10000;
const KEY_LEN = 64;
const ALGORITHM = 'sha512';

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
        crypto.pbkdf2(password, salt, INTERATIONS, KEY_LEN, (err, hash) => {
            if (err) reject(err);
            resolve({ hash, salt });
        })
    })
}

module.exports = (customerDB, certificateDB) => {
    class customers {
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
        }

        static delete({ email, password }) {
            let hashInStore = null;
            return customerDB.search({ email })
                .then(customer => {
                    hashInStore = customer.hash;
                    return getHash(password, customer.salt)
                })
                .then( ({ hash }) => {
                    if (hash === hashInStore) return customerDB.delete({ email });
                    else return "Wrong Password";
                })
        }
    }

    return customers;
}