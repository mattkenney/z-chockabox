'use strict';

const deck = require('./deck');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Query: {
    decks: (parent, args, context) => {
      if (!context.user) throw new AuthenticationError();
      return deck.list(context.user);
    }
  },
  Mutation: {
    uploadDeck: (parent, args, context) => {
      if (!context.user) throw new AuthenticationError();
      return args.file.then(file =>
        deck
          .create(context.user, args.name, file.createReadStream())
          .then(() => file)
      )
    }
  }
};
