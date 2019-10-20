import React from 'react';

import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import Errors from '../components/Errors';

const QUERY_DECKS = gql`query decks { decks { id name } }`;

export default function Decks() {
  return (
    <>
      <Link to='/upload'>Upload</Link>
      <Query query={QUERY_DECKS}>{({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <Errors error={error}/>;
        if (data && data.decks) return data.decks.map(deck => <div key={deck.id}>{deck.name}</div>);
      }}</Query>
    </>
  );
}
