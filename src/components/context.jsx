import React from 'react';

export const context = React.createContext({});

export const MyProvider = context.Provider;

export const MyConsumer = context.Consumer;

export const ContextHOC = Com => props => (
  <MyConsumer>
    {value => (
      <Com ctx={value} {...props}/>
    )}
  </MyConsumer>
);
