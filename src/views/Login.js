import React from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import {
  Button,
  Control,
  Field,
  Input,
  Label
} from 'bloomer';

const SEND_TOKEN = gql`mutation sendToken($email: String!) { sendToken(email: $email) }`;

export default function Login() {
    let form;
    const [ sendToken ] = useMutation(SEND_TOKEN);
    function onSubmit(evt)
    {
      evt.preventDefault();
      sendToken({ variables: { email: form.elements.email.value } });
    }
    return (
      <form action="/login" method="post" onSubmit={onSubmit} ref={ref => form = ref}>
        <Field>
          <Label>Email Address</Label>
          <Control>
            <Input name="email" type="email" placeholder='jdoe@example.com' />
          </Control>
        </Field>
        <Button/>
      </form>
    );
}
