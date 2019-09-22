import React from 'react';

import gql from 'graphql-tag';
//import { useMutation } from '@apollo/react-hooks';
import { Mutation } from 'react-apollo';
import {
  Button,
  Control,
  Field,
  Input,
  Label
} from 'bloomer';

const SEND_TOKEN = gql`mutation sendToken($email: String!) { sendToken(email: $email) }`;

function makeOnSubmit(mutate) {
  return function post(evt) {
    evt.preventDefault();
    const variables = {};
    const elements = evt.currentTarget.elements;
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (element.disabled || !element.name) continue;
      variables[element.name] = element.value;
    }
    mutate({ variables });
  }
}

function handlePost(client, mutate) {
  const variables = ['defaultOptions','mutate','context','body'].reduce((obj,key)=>obj&&obj[key],client);
  if (variables) {
    delete client.defaultOptions.mutate.context.body;
    return mutate({ variables });
  }
}

export default class Login extends React.Component {
  render() {
    if (this.result) {
      return <LoginSent data={this.result.data}/>;
    }
    return (
      <Mutation mutation={SEND_TOKEN}>{(mutate, { client, loading, data }) => {
        if (data) return <LoginSent data={data}/>;
        if (handlePost(client, mutate)) return null;
        return <LoginForm mutate={mutate}/>;
      }}</Mutation>
    );
  }
}

function LoginForm({ mutate }) {
  return (
    <form action='/login' method='post' onSubmit={makeOnSubmit(mutate)}>
      <Field>
        <Label>Email Address</Label>
        <Control>
          <Input name='email' type='email' placeholder='jdoe@example.com' />
        </Control>
      </Field>
      <Button isColor='primary' type='submit'>Send Login Link</Button>
    </form>
  );
}

function LoginSent({ data }) {
    return <div>{`Login link sent to ${data.sendToken}`}</div>;
}
