import React from 'react';

import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';

const query = gql`query{hello}`;

function App(props) {
  return (
    <ApolloProvider client={props.client}>
      <Query query={query}>
        {({ loading, error, data }) =>
          data && !loading ? <div>{`Hello ${data.hello}!`}</div> : null
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
