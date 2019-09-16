'use strict';

const crypto = require('crypto');

const CassandraStore = require('passwordless-cassandra-store');
const email = require("emailjs");
const passwordless = require('passwordless');
const config = require('../config.json').auth;

passwordless.init(new CassandraStore(config.store), config.passwordless);

passwordless.addDelivery(function (token, uid, to, callback) {
  const authority = 'http://localhost:3000';
  const tokenParam = encodeURIComponent(token);
  const uidParam = encodeURIComponent(uid);
  const text = `${authority}?token=${tokenParam}&uid=${uidParam}`;
  const html = `<a href="${authority}?token=${tokenParam}&amp;uid=${uidParam}">log in</a>`;
  const attachment = [{ data: html, alternative: true }];
  const email = Object.assign({ attachment, text, to }, config.email);
  smtp.send(email, function (err, message)
  {
    if (err) console.log(err);
    callback(err);
  });
});

module.exports = function (app) {
  app.use(passwordless.sessionSupport());

  app.use(passwordless.acceptToken({
    enableOriginRedirect: true,
    successRedirect: '/'
  }));

  return () => {
    return new Promise(resolve => {
      passwordless.requestToken((user, delivery, callback) => {
        const norm = (typeof user === 'string') && user.trim().toLowerCase();
        const hmac = norm && crypto.createHmac(config.hmac.algorithm, config.hmac.key);
        if (hmac) hmac.update(norm);
        const uid = hmac && hmac.digest('hex');
        callback(null, uid ? uid : null);
        resolve(true);
      });
    })
  };
};
