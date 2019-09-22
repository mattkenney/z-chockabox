'use strict';

const crypto = require('crypto');

const CassandraStore = require('passwordless-cassandra-store');
const email = require("emailjs");
const passwordless = require('passwordless');
const config = require('../config.json').auth;
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
    const norm = (typeof user === 'string') && user.trim().toLowerCase();
    const hmac = norm && crypto.createHmac(config.hmac.algorithm, config.hmac.key);
    if (hmac) hmac.update(norm);
    const uid = hmac && hmac.digest('hex');
    callback(null, uid ? uid : null);
  });

module.exports = function (app) {
  app.use(passwordless.sessionSupport());

  app.use(passwordless.acceptToken({
    enableOriginRedirect: true,
    successRedirect: '/'
  }));

  return (obj, args, context, info) => {
    const user = args.email;
    if (!user) return;
    return new Promise((resolve, reject) => {
      const req = {
        body: { user },
        method: 'POST',
        origin: context.origin
      };
      requestToken(req, null, err => err ? reject(err) : resolve(user));
    })
  };
};
