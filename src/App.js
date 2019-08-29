import React from 'react';

import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
import { Route, Switch } from 'react-router-dom';

const query = gql`query{hello}`;

function Home(props) {
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

export default function App(props)
{
  return (
    <Switch>
        <Route path="/about" render={routeProps => <div>{'About'}</div>}/>
        <Route render={routeProps => <Home {...props}/>}/>
    </Switch>
  );
}
