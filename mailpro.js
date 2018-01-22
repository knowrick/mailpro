'use strict';
var q = require('q');
var crypto = require('crypto');

var MailPro = function(config) {
    if (config.private && config.public && config.domain && config.secret) {
        this.MailGun = require('mailgun-js')({
            apiKey: config.private,
            domain: config.domain
        });
        this.publicKey = config.public;
        this.secret = config.secret;
    } else {
        return new Error('Mailgun API key and domain are required! See documentation.');
    }
};

MailPro.prototype.getSubscribers = function(list) {
    var defer = q.defer();
    var list = this.MailGun.lists(list);
    list.members().list(function(err, data) {
        if (err) {
            defer.reject(err);
        }
        defer.resolve(data);
    });
    return defer.promise;
};

MailPro.prototype.createSubscriber = function(list, user) {
    var defer = q.defer();
    var list = this.MailGun.lists(list);
    var self = this;

    list.members().create(user, function(err, data) {
        if (err) {
            var response = {
                data: data,
                err: err
            }
            defer.reject(response);
        }
        if (data) {
            defer.resolve(data);
        }
    });
    return defer.promise;
};

MailPro.prototype.updateSubscriber = function(list, user) {
    var defer = q.defer();
    var list = this.MailGun.lists(list);
    list.members(user.address).update(user, function(err, data) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(data);
        }
    });
    return defer.promise;
};

MailPro.prototype.validateEmail = function(email) {
    var defer = q.defer();
    /* Create public instance of mailgun */
    var publicMailGun = new this.MailGun.Mailgun({
        apiKey: this.publicKey
    });
    publicMailGun.get('/address/validate', {
        address: email
    }, function(err, data) {
        if (err) {
            defer.reject(err);
        }
        if (data.is_valid) {
            defer.resolve(true);
        } else {
            defer.reject();
        }
    });
    return defer.promise;
};

MailPro.prototype.encrypt = function(object) {
    return encrypt(object, this.secret);
};

MailPro.prototype.decrypt = function(hash) {
    return decrypt(hash, this.secret);
};

/* Checks if an email belogs to a list*/
MailPro.prototype.subscribed = function(list, email) {
    var defer = q.defer();
    this.MailGun.get('/lists/' + list + '/members/' + email, function(err, data) {
        if (err) {
            if (data.message) {
                defer.resolve(undefined); // user is brand new
            } else {
                defer.reject(err);
            }
        } else {
            if (data.member.address === email && data.member.subscribed) {
                defer.resolve(true);
            } else if (data.member.address === email && !data.member.subscribed) {
                defer.resolve(false);
            } else if (data.member.address !== email) {
                defer.resolve(false);
            } else {
                defer.reject(data);
            }
        }
    });
    return defer.promise;
};

function decrypt(string, secret) {
    var decipher = crypto.createDecipher('aes-256-cbc', secret, new Buffer(16));
    var decrypted = decipher.update(string, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

function encrypt(object, secret) {
    var cipher = crypto.createCipher('aes-256-cbc', secret, new Buffer(16));
    var crypted = cipher.update(JSON.stringify(object), 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

const user = {
    username: 'brandy19',
    age: 23,
    sex: 'female',
    balance: 3339.03
}

module.exports = MailPro;