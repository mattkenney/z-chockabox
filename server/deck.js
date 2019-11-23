'use strict';

const cassandra = require('cassandra-driver');
const config = require('../config.json').deck;
const client = new cassandra.Client(config.store);
const parse = require('csv-parse');

function create(stream) {
  return new Promise((resolve, reject) => {
    const parser = parse()
      .on('readable', () => {
          let row;
          while (row = parser.read()) {
              console.log(row);
          }
      })
      .on('error', reject)
      .on('end', resolve)
      ;
    stream.pipe(parser);
  });
}

function list(uid) {
  const cql = 'SELECT * FROM decks WHERE uid=?';
  return client
    .execute(cql, [uid], { prepare: true })
    .then(result => result.rows)
    ;
}

module.exports = { create, list };
