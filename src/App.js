import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link, Route, Switch } from 'react-router-dom';

const query = gql`query{hello}`;

function About() {
    return <div>{'About'}</div>;
}

function Home() {
  return (
    <Query query={query}>
      {({ loading, error, data }) =>
        data && !loading ? <div>{`Hello ${data.hello}!`}</div> : null
      }
    </Query>
  );
}

export default function App(props)
{
  return (
    <div>
      <div>
        <div><Link to="/">Home</Link></div>
        <div><Link to="/about">About</Link></div>
      </div>
      <Switch>
        <Route path="/about" component={About}/>
        <Route component={Home}/>
      </Switch>
    </div>
  );
}
