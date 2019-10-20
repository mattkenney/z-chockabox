import React from 'react';

import gql from 'graphql-tag';
import Button from 'react-bulma-components/lib/components/button';
import Icon from 'react-bulma-components/lib/components/icon';
import { Field, Control, Label, InputFile } from 'react-bulma-components/lib/components/form';

import Errors from '../components/Errors';
import MutationForm from '../components/MutationForm';

const UPLOAD_DECK = gql`mutation UPLOAD_DECK($file: Upload!) { uploadDeck(file: $file) { filename } }`;

export default function Upload() {
  return (
    <MutationForm mutation={UPLOAD_DECK} upload>{(mutate, { loading, error, data }) => {
      if (loading) return null;
      if (error) return <Errors error={error}/>;
      if (data) return <pre>{JSON.stringify(data,null,2)}</pre>;
      return <UploadForm mutate={mutate}/>;
    }}</MutationForm>
  );
}

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Field>
          <Label>Deck</Label>
          <Control>
            <input type='file' name='file' onChange={evt => console.log(evt.target.files[0].file)}/>
          </Control>
        </Field>
        <Button color='primary' type='submit'>Upload</Button>
      </div>
    );
  }
}

//            <InputFile
//              boxed
//              icon={<Icon icon="upload"/>}
//              onChange={evt => console.log(evt.target.files[0].file)}
//              name='file'
//              placeholder="Textarea"
//            />
