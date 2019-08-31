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
import './App.sass';

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

function Nav() {
  return (
    <Navbar>
      <NavbarBrand>
        <NavbarItem><Link to="/">Chockabox</Link></NavbarItem>
      </NavbarBrand>
      <NavbarMenu isActive={true}>
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
