'use strict';

module.exports = `
  type Query {
    hello: String
    err: Boolean
  }
  type Mutation {
    sendToken(email: String!): Boolean
  }
`;
