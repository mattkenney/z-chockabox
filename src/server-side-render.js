import React from 'react';
import ReactDOMServer from 'react-dom/server';

import ApolloClient from 'apollo-client';
import serialize from 'serialize-javascript';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { StaticRouter } from "react-router-dom";
import { getDataFromTree } from '@apollo/react-ssr';
import { makeExecutableSchema } from 'graphql-tools';

import App from './App';

export default function (schema, req) {
  const context = {
    origin: req.protocol + '://' + req.get('host'),
    user: req.user
  };

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      mutate: {
        context: {
          body: (req.method === 'POST') ? req.body : null,
        }
      }
    },
    link: new SchemaLink({ context, schema }),
    ssrMode: true
  });

  const app = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url}>
        <App/>
      </StaticRouter>
    </ApolloProvider>
  );

  return getDataFromTree(app).then(() => [
    '<script>',
    'window.__APOLLO_STATE__=',
    serialize(client.extract()),
    '</script>',
    ReactDOMServer.renderToString(app)
  ].join(''));
}
