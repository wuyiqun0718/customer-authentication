const pem = require('pem');

module.exports = (customerDB, certificateDB) => {
    class certificate {
        static add(customerId) {
            return new Promise( (resolve, reject) => {
                pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
                    if (err) reject(err);
                    const body = {
                        customerId,
                        isActive: true,
                        key: keys.serviceKey,
                        cert: keys.certificate
                    }
                    certificateDB.add(body).then(newDoc => resolve(newDoc));
                })
            })
        }

        static changeStatus(id, status) {
            return certificateDB.update({ id }, { status });
        }

        static getAll(customerId) {
            return certificateDB.search({ customerId });
        }
    }

    return certificate;
}