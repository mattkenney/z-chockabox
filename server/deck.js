'use strict';

const cassandra = require('cassandra-driver');
const config = require('../config.json').deck;
const client = new cassandra.Client(config.store);
const parse = require('csv-parse');
const shortUuid = require('short-uuid');

const unique = shortUuid(shortUuid.constants.flickrBase58);

const cards = `
  INSERT INTO cards
  (cid, did, rand, last, next, question, answer)
  VALUES
  (?, ?, ?, ?, ?, ?, ?)
`;

const decks = `
  INSERT INTO decks (uid, did, name) VALUES (?, ?, ?)
`;

function db(cql, ...params) {
  return client
          .execute(cql, params, { prepare: true })
          .then(result => result.rows)
          ;
}

function create(uid, name, stream) {
  const did = unique.new();
  const now = new Date().toISOString();
  return new Promise((resolve, reject) => {
    const parser = parse({ skip_empty_lines: true })
      .on('readable', () => {
        let row;
        while (row = parser.read()) {
          db(cards, unique.new(), did, Math.random(), now, now, row[0], row[1]);
        }
      })
      .on('error', reject)
      .on('end', resolve)
      ;
    db(decks, uid, did, name)
      .then(() => stream.pipe(parser))
      ;
  });
}

const list = (uid => db('SELECT did AS id, name FROM decks WHERE uid=?', uid));

module.exports = { create, list };
