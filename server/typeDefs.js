'use strict';

module.exports = `
  type Query {
    decks: [ Deck! ]!

    hello: String
    err: Boolean
  }

  type Mutation {
    sendToken(email: String!): String
  }

  type Deck {
    id: ID!
    name: String!
  }
`;
