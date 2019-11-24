'use strict';

const crypto = require('crypto');

const CassandraStore = require('passwordless-cassandra-store');
const EmailValidator = require("email-validator");
const anyBase = require('any-base');
const email = require("emailjs");
const passwordless = require('passwordless');
const shortUuid = require('short-uuid');

const config = require('../config.json').auth;

const flickrBase58 = anyBase(anyBase.HEX, shortUuid.constants.flickrBase58);

const smtp = email.server.connect(config.smtp);

passwordless.init(new CassandraStore(config.store), config.passwordless);

passwordless.addDelivery(function (token, uid, to, callback, req) {
  const origin = config.origin || req.origin;
  const tokenParam = encodeURIComponent(token);
  const uidParam = encodeURIComponent(uid);
  const text = `${origin}?token=${tokenParam}&uid=${uidParam}`;
  const html = `<a href="${origin}?token=${tokenParam}&amp;uid=${uidParam}">log in</a>`;
  const attachment = [{ data: html, alternative: true }];
  const email = Object.assign({ attachment, text, to }, config.email);
  smtp.send(email, function (err, message)
  {
    if (err) console.log(err);
    callback(err);
  });
});

const requestToken = passwordless.requestToken((user, delivery, callback) => {
    const hmac = user && crypto.createHmac(config.hmac.algorithm, config.hmac.key);
    if (hmac) hmac.update(user);
    const uid = hmac && flickrBase58(hmac.digest('hex'));
    callback(null, uid ? uid : null);
  });

module.exports = function (app) {
  app.use(passwordless.sessionSupport());

  app.use(passwordless.acceptToken({
    enableOriginRedirect: true,
    successRedirect: '/'
  }));

  return function (obj, args, context) {
    return new Promise((resolve, reject) => {
      const user = args.email && String(args.email).trim().toLowerCase();
      if (EmailValidator.validate(user)) {
        const req = {
          body: { user },
          method: 'POST',
          origin: context.origin
        };
        requestToken(req, null, err => err ? reject(err) : resolve(user));
      } else {
        reject(new Error('A valid email address is required'));
      }
    });
  };
};
