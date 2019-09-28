import React from 'react';

import { Redirect } from 'react-router-dom';

function safe(obj, ...chain) {
  return chain.reduce((obj, key) => obj && obj[key], obj);
}

export default function Errors({error}) {
  const code = safe(error, 'graphQLErrors', 0, 'extensions', 'code');
  if (code === 'UNAUTHENTICATED') return <Redirect to='/login'/>;

  const message = safe(error, 'graphQLErrors', 0, 'message');
  return <div>{message || String(error)}</div>;
}
