import React from 'react';

import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

class FormImpl extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(evt) {
    evt.preventDefault();
    const variables = {};
    const elements = evt.currentTarget.elements;
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (element.disabled || !element.name) continue;
      variables[element.name] = element.files ? element.files[0] : element.value;
    }
    this.props.mutate({ variables });
  }

  render() {
    const props = this.props;
    const attr = {};
    if (props.upload) attr.encType = 'multipart/form-data';
    return (
      <form
        action={props.location.pathname}
        method='post'
        onSubmit={this.onSubmit}
        {...attr}
        >
        {props.children(props.result)}
      </form>
    );
  }
}

const Form = withRouter(FormImpl);

export default class MutationForm extends React.Component {
  constructor(props) {
    super(props);

    this.onCompleted = this.onCompleted.bind(this);
    this.onError = this.onError.bind(this);
  }

  makeMutate(mutate) {
    if (this.context.method === 'POST' && !this.context._mutatation_result) {
      this.context._mutatation_result = {
        called: true,
        loading: true
      };
      if (!this.context._mutation_promise) {
        this.context._mutation_promise = new Promise(resolve =>
            this.context._mutation_resolve = resolve);
      }
      mutate({ variables: this.context.body });
    }
    return mutate;
  }

  onCompleted(data) {
    const result = this.context._mutatation_result;
    if (result) {
      result.loading = false;
      result.data = data;
    }
    if (this.props.onCompleted) this.props.onCompleted(data);
    if (this.context._mutation_resolve) this.context._mutation_resolve();
  }

  onError(err) {
    const result = this.context._mutatation_result;
    if (result) {
      result.loading = false;
      result.error = err;
    }
    if (this.props.onError) this.props.onError(err);
    if (this.context._mutation_resolve) this.context._mutation_resolve();
  }

  render() {
    const { children, onCompleted, onError, upload, ...rest } = this.props;
    if (this.context._mutatation_result) {
      return children(this.context._mutatation_result);
    }
    return (
      <Mutation onCompleted={this.onCompleted} onError={this.onError} {...rest}>
        {(mutate, result) => (
          <Form mutate={this.makeMutate(mutate)} result={result} upload={upload}>
            {children}
          </Form>
        )}
      </Mutation>
    );
  }
};

const MutationFormContext = MutationForm.contextType = React.createContext({});

export function MutationFormProvider(props) {
  return (
    <MutationFormContext.Provider value={props.request || {}}>
      {props.children}
    </MutationFormContext.Provider>
  );
};

export function waitForMutation(context) {
  return (context._mutation_promise || Promise.resolve());
};
