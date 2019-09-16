'use strict';

const { AuthenticationError } = require("apollo-server-express");

module.exports = {
  Query: {
    hello: () => 'World',
    err:() => { throw new AuthenticationError('err!') }
  },
  Mutation: {
  }
};
