#!/usr/bin/env node

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
const template = fs
        .readFileSync(path.join(build, 'index.html'), 'utf8')
        .replace(/%([^%]*)%/g, (m, key) => process.env[key] || '')
        ;
const root = '<div id="root">';
const [ prelude, coda ] = template.split(root, 2);

const app = new express();
app.disable('x-powered-by');

if (app.settings.env === 'development')
{
    app.use(cors({ origin: 'http://localhost:3000' }));
}

// we do not want to serve the empty template directly
app.get('/index.html', function (req, res) {
  res.set('Location', '/');
  res.status(302).end();
});

server.applyMiddleware({ app });

app.use(express.static(build, { index: false }));

app.use(function (req, res) {
  ssr().then(content => {
    const html = [ prelude, root, content, coda ].join('');
    res.send(html);
  });
});

app.listen({ port: 4000 }, () =>
  console.log('Server ready at http://localhost:4000')
);
