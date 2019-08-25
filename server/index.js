#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const cors = require('cors');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const ssr = require('../dist/ssr').default;

// set up GraphQL server
const { typeDefs, resolvers } = require('../dist/schema');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// read in the empty HTML template, and split it where
// we will insert server-side rendered HTML
const build = path.join(path.dirname(__dirname), 'build');
const root = '<div id="root">';
const [ prelude, coda ] = fs
            .readFileSync(path.join(build, 'index.html'), 'utf8')
            .split(root, 2);

// set up Express
const app = new express();
app.disable('x-powered-by');

// in dev mode, allow cors from local webpack-dev-server
if (app.settings.env === 'development')
{
    app.use(cors({ origin: 'http://localhost:3000' }));
}

// we do not want to serve the empty template directly
app.get('/index.html', function (req, res) {
  res.set('Location', '/');
  res.status(302).end();
});

// serve /static/* and other static files
app.use(express.static(build, { index: false, redirect: false }));

// serve /graphql
server.applyMiddleware({ app, cors: false });

// server-side render React app
app.use(function (req, res) {
  ssr().then(content => {
    const html = [ prelude, root, content, coda ].join('');
    res.send(html);
  });
});

// ready to serve
app.listen({ port: 4000 }, () =>
  console.log('Server ready at http://localhost:4000')
);
