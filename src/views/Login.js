import React from 'react';

import gql from 'graphql-tag';
import MutationForm from '../components/MutationForm';
import {
  Button,
  Control,
  Field,
  Input,
  Label
} from 'bloomer';

const SEND_TOKEN = gql`mutation sendToken($email: String!) { sendToken(email: $email) }`;

export default class Login extends React.Component {
  render() {
    if (this.result) {
      return <LoginSent data={this.result.data}/>;
    }
    return (
      <MutationForm mutation={SEND_TOKEN}>{(mutate, { client, loading, data }) => {
        if (data) return <LoginSent data={data}/>;
        return <LoginForm mutate={mutate}/>;
      }}</MutationForm>
    );
  }
}

function LoginForm({ mutate }) {
  return (
    <div>
      <Field>
        <Label>Email Address</Label>
        <Control>
          <Input name='email' type='email' placeholder='jdoe@example.com' />
        </Control>
      </Field>
      <Button isColor='primary' type='submit'>Send Login Link</Button>
    </div>
  );
}

function LoginSent({ data }) {
    return <div>{`Login link sent to ${data.sendToken}`}</div>;
}
