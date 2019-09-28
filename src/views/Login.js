import React from 'react';

import gql from 'graphql-tag';
import {
  Button,
  Control,
  Field,
  Input,
  Label
} from 'bloomer';

import Errors from '../components/Errors';
import MutationForm from '../components/MutationForm';

const SEND_TOKEN = gql`mutation sendToken($email: String!) { sendToken(email: $email) }`;

export default function Login() {
  return (
    <MutationForm mutation={SEND_TOKEN}>{(mutate, { loading, error, data }) => {
      if (loading) return null;
      if (error) return <Errors error={error}/>;
      if (data) return <LoginSent data={data}/>;
      return <LoginForm mutate={mutate}/>;
    }}</MutationForm>
  );
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
