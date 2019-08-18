'use strict';

const fs = require('fs');
const path = require('path');

const cors = require('cors');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('../dist/schema');
const ssr = require('../dist/ssr').default;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const build = path.join(path.dirname(__dirname), 'build');
console.log(build);
const template = fs
        .readFileSync(path.join(build, 'index.html'), 'utf8')
        .replace(/%([^%]*)%/g, (m, key) => process.env[key] || '')
        ;
const root = '<div id="root">';
const [ prelude, coda ] = template.split(root, 2);

const app = new express();

app.use(cors());

//app.use('/favicon.ico', express.static(build));
//app.use('/manifest.json', express.static(build));
//app.use('/robots.txt', express.static(build));

server.applyMiddleware({ app });

app.get('/', function (req, res) {
  ssr().then(content => {
    const html = [ prelude, root, content, coda ].join('');
    res.send(html);
  });
});

app.use(express.static(build));

app.listen({ port: 4000 }, () =>
  console.log('Server ready at http://localhost:4000')
);
