CREATE KEYSPACE IF NOT EXISTS chockabox
  WITH REPLICATION = {
   'class' : 'SimpleStrategy',
   'replication_factor' : 1
  };

USE chockabox;

CREATE TABLE IF NOT EXISTS decks (
  did text,
  uid text,
  name text,
  PRIMARY KEY (uid, did)
);

CREATE TABLE IF NOT EXISTS cards (
  cid text,
  did text,
  rand int,
  last timestamp,
  next timestamp,
  question text,
  answer text,
  PRIMARY KEY (did, cid)
);
