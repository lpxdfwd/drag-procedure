import React from 'react';
import Loadable from 'react-loadable';

const Loading = () => React.createElement('div', null);

const delay = 200;

const dynamic = loader => Loadable({
  loader,
  delay,
  loading: Loading
});

export const IndexPage = dynamic(() => import(/* webpackChunkName: 'index-page' */'./pages/index/index.page.jsx'));

export const AddPage = dynamic(() => import(/* webpackChunkName: 'add-page' */'./pages/add/add.page.jsx'));
