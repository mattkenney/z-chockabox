#!/usr/bin/env node

'use strict';

// set up Express
const express = require('express');
const app = new express();
app.disable('x-powered-by');

// we do not want to serve the empty template directly
// so redirect to /
app.get('/index.html', function (req, res) {
  res.set('Location', '/');
  res.status(302).end();
});

// serve /static/* and other static files
const path = require('path');
const build = path.join(path.dirname(__dirname), 'build');
app.use(express.static(build, { index: false, redirect: false }));

// set up GraphQL
const { ApolloServer } = require('apollo-server-express');
const schema = require('../dist/schema');
const server = new ApolloServer(schema);
server.applyMiddleware({ app, cors: false });

// server-side render React app
const fs = require('fs');
const ssr = require('../dist/server-side-render').default;
const template = path.join(build, 'index.html');
const root = '<div id="root">';
const [ prelude, coda ] = fs.readFileSync(template, 'utf8').split(root, 2);

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
