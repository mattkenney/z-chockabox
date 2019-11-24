'use strict';

module.exports = `
  scalar Upload

  type Deck {
    id: ID!
    name: String!
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    decks: [ Deck! ]!

    hello: String
    err: Boolean
  }

  type Mutation {
    sendToken(email: String!): String
    uploadDeck(name: String!, file: Upload!): File!
  }
`;
