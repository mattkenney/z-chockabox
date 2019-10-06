import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link, Route, Switch } from 'react-router-dom';
import {
    Container,
    Navbar,
    NavbarBrand,
    NavbarItem,
    NavbarMenu,
    Section
  } from 'bloomer';

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
      <NavbarBrand>
        <NavbarItem><Link to="/">Chockabox</Link></NavbarItem>
      </NavbarBrand>
      <NavbarMenu isActive={true}>
        <NavbarItem><Link to="/deck">Decks</Link></NavbarItem>
        <NavbarItem><Link to="/about">About</Link></NavbarItem>
      </NavbarMenu>
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
