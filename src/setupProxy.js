'use strict';

const proxy = require('http-proxy-middleware');
const proxy4000 = proxy({ target: 'http://localhost:4000' });

module.exports = function (app) {
  // passwordless authentication
  app.use((req, res, next) => req.query.token ?
                                proxy4000(req, res, next) : next());

  // GraphQL
  app.use('/graphql', proxy4000);
};
