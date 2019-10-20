'use strict';

const { AuthenticationError } = require('apollo-server-express');
const deck = require('./deck');

module.exports = {
  Query: {
    decks: (parent, args, context) => {
      if (!context.user) throw new AuthenticationError();
      return deck.list(context.user);
    },

    hello: () => 'World',
    err:() => { throw new AuthenticationError('err!') }
  },
  Mutation: {
    uploadDeck: (parent, args, context) => args.file.then(file => {
      const { filename, mimetype,  encoding } = file;
      return { filename, mimetype,  encoding };
    })
  }
};
