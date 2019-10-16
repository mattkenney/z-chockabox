import React from 'react';

import Container from 'react-bulma-components/lib/components/container';
import Navbar from 'react-bulma-components/lib/components/navbar';
import Section from 'react-bulma-components/lib/components/section';
import gql from 'graphql-tag';
import { Link, Route, Switch } from 'react-router-dom';
import { Query } from 'react-apollo';

import Decks from './views/Decks';
import Errors from './components/Errors';
import Login from './views/Login';
import './App.sass';

const query = gql`query{hello}`;

function About() {
    return <div>{'About'}</div>;
}

function Home() {
  return (
    <Query query={query}>
      {({ loading, error, data }) => {
        if (error) return <Errors error={error}/>;
        if (loading || !data) return null;
        return <div>{`Hello ${data.hello}!`}</div>;
      }}
    </Query>
  );
}

function Nav() {
  return (
    <Navbar>
      <Navbar.Brand>
        <Navbar.Item><Link to="/">Chockabox</Link></Navbar.Item>
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Container>
          <Navbar.Item><Link to="/deck">Decks</Link></Navbar.Item>
          <Navbar.Item><Link to="/about">About</Link></Navbar.Item>
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  );
}

function Content() {
  return (
    <Section>
      <Container>
        <Switch>
          <Route path="/about" component={About}/>
          <Route path="/deck" component={Decks}/>
          <Route path="/login" component={Login}/>
          <Route component={Home}/>
        </Switch>
      </Container>
    </Section>
  );
}

export default function App()
{
  return <div><Nav/><Content/></div>;
}
