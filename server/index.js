#!/usr/bin/env node

'use strict';

const config = require('../config.json');

// set up Express
const express = require('express');
const app = new express();
app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);

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

// set up auth
app.use(require('cookie-session')(config.session));
const sendToken = require('./auth')(app);

// set up GraphQL
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
resolvers.Mutation.sendToken = sendToken;
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({
  context: ({ req }) => ({
      origin: req.protocol + '://' + req.get('host'),
      user: req.user
  }),
  schema
});
server.applyMiddleware({ app, cors: false });

// support multipart/form-data POST
const multer  = require('multer');
const upload = multer({ storage: multer.diskStorage({}), ...config.multer}).any();
app.post('/upload', (req, res, next) => {
  upload(req, res, () => {
    req.files.forEach(file => {
      req.body[file.fieldname] = Promise.resolve({
        createReadStream: function () {
          const result = fs.createReadStream(file.path);
          fs.unlink(file.path, err => err && console.log(err));
          return result;
        },
        encoding: file.encoding,
        filename: file.originalname,
        mimetype: file.mimetype
      });
    });
    next();
  });
});

// server-side render React app
const fs = require('fs');
const ssr = require('../dist/server-side-render').default;
const template = path.join(build, 'index.html');
const root = '<div id="root">';
const [ prelude, coda ] = fs.readFileSync(template, 'utf8').split(root, 2);

app.use(express.urlencoded({ extended: false }));
app.use(function (req, res) {
  ssr(schema, req)
    .then(content => {
      const html = [ prelude, root, content, coda ].join('');
      res.send(html);
    })
    .catch(error => {
      // code = error.graphQLErrors[0].extensions.code
      const code = ['graphQLErrors',0,'extensions','code'].reduce((obj,key)=>obj&&obj[key],error);
      if (code === 'UNAUTHENTICATED')
      {
          return res.redirect('/login');
      }
      res.status(500).send(String(error));
    })
  ;
});

// ready to serve
app.listen({ port: 4000 }, () =>
  console.log('Server ready at http://localhost:4000')
);
