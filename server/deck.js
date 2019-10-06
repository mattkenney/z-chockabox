'use strict';

const cassandra = require('cassandra-driver');
const config = require('../config.json').deck;
const client = new cassandra.Client(config.store);

function list(uid) {
  const cql = 'SELECT * FROM decks WHERE uid=?';
  return client
    .execute(cql, [uid], { prepare: true })
    .then(result => result.rows)
    ;
}

module.exports = { list };
