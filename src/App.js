import React from 'react';

import Container from 'react-bulma-components/lib/components/container';
import Navbar from 'react-bulma-components/lib/components/navbar';
import Section from 'react-bulma-components/lib/components/section';
import { Link, Route, Switch } from 'react-router-dom';

import Decks from './views/Decks';
import Login from './views/Login';
import Upload from './views/Upload';
import './App.sass';

function About() {
    return <div>{'About'}</div>;
}

function Home() {
    return <div>Welcome!</div>;
}

function Nav() {
  return (
    <Navbar>
      <Navbar.Brand>
        <Navbar.Item renderAs='span'><Link to="/">Chockabox</Link></Navbar.Item>
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Container>
          <Navbar.Item renderAs='span'><Link to="/deck">Decks</Link></Navbar.Item>
          <Navbar.Item renderAs='span'><Link to="/about">About</Link></Navbar.Item>
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
          <Route path="/upload" component={Upload}/>
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
