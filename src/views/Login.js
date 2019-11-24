import React from 'react';

import gql from 'graphql-tag';
import Button from 'react-bulma-components/lib/components/button';
import Notification from 'react-bulma-components/lib/components/notification';
import { Field, Control, Label, Input } from 'react-bulma-components/lib/components/form';

import Errors from '../components/Errors';
import MutationForm from '../components/MutationForm';

const SEND_TOKEN = gql`mutation sendToken($email: String!) { sendToken(email: $email) }`;

export default function Login() {
  return (
    <MutationForm mutation={SEND_TOKEN}>{({ loading, error, data }) => {
      if (loading) return null;
      if (error) return <Errors error={error}/>;
      if (data) return <LoginSent data={data}/>;
      return <LoginForm/>;
    }}</MutationForm>
  );
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Notification>Enter your email address and we will send you a link to sign in.</Notification>
        <Field>
          <Label>Email Address</Label>
          <Control>
            <Input
              name='email'
              onChange={evt => this.setState({ email: evt.target.value })}
              placeholder='jdoe@example.com'
              type='email'
              value={this.state.email}
            />
          </Control>
        </Field>
        <Button color='primary' type='submit'>Send Login Link</Button>
      </>
    );
  }
}

function LoginSent({ data }) {
  return <div>{`Login link sent to ${data.sendToken}`}</div>;
}
