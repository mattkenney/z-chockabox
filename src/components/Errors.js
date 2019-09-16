import React from 'react';

import { Redirect } from 'react-router-dom';

export default function Errors({error})
{
    const code = ['graphQLErrors',0,'extensions','code'].reduce((obj,key)=>obj&&obj[key],error);
    if (code === 'UNAUTHENTICATED')
    {
        return <Redirect to='/login'/>;
    }
    return <div>{String(error)}</div>;
}
