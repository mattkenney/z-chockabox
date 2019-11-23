import React from 'react';

import gql from 'graphql-tag';
import Button from 'react-bulma-components/lib/components/button';
import Icon from 'react-bulma-components/lib/components/icon';
import { Field, Control, Label, InputFile } from 'react-bulma-components/lib/components/form';

import Errors from '../components/Errors';
import MutationForm from '../components/MutationForm';

const UPLOAD_DECK = gql`mutation UPLOAD_DECK($file: Upload!) {
  uploadDeck(file: $file) { filename }
}`;

export default function Upload() {
  return (
    <MutationForm mutation={UPLOAD_DECK} upload>{({ loading, error, data }) => {
      if (loading) return null;
      if (error) return <Errors error={error}/>;
      if (data) return <pre>{JSON.stringify(data,null,2)}</pre>;
      return <UploadForm/>;
    }}</MutationForm>
  );
}

function UploadForm() {
  return (
    <>
      <Field>
        <Label>Deck</Label>
        <Control>
          <InputFile icon={<Icon icon="upload"/>} name='file'/>
        </Control>
      </Field>
      <Button color='primary' type='submit'>Upload</Button>
    </>
  );
}
