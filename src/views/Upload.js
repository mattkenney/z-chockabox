import React from 'react';

import gql from 'graphql-tag';
import Button from 'react-bulma-components/lib/components/button';
import Icon from 'react-bulma-components/lib/components/icon';
import {
  Field,
  Control,
  Label,
  Input,
  InputFile
} from 'react-bulma-components/lib/components/form';

import Errors from '../components/Errors';
import MutationForm from '../components/MutationForm';

const UPLOAD_DECK = gql`mutation UPLOAD_DECK($name: String!, $file: Upload!) {
  uploadDeck(name: $name, file: $file) { filename }
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

class UploadForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt)
  {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  render() {
    return (
      <>
        <Field>
          <Label>Name</Label>
          <Control>
            <Input name='name' onChange={this.onChange}  value={this.state.name}/>
          </Control>
        </Field>
        <Field>
          <Label>Data</Label>
          <Control>
            <InputFile icon={<Icon icon="upload"/>} name='file'/>
          </Control>
        </Field>
        <Button color='primary' type='submit'>Upload</Button>
      </>
    );
  }
}
