import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {configure} from 'mobx';
import {Provider} from 'mobx-react';
import {Router} from 'react-router-dom';
import store from './store';
import history from './lib/history.lib';
import Routes from './Routes';
import GlobalStyle from './style/global.style';

configure({enforceActions: 'observed'});

const App = () => (
  <Fragment>
    <Provider {...store}>
      <Router history={history}>
        <Routes/>
      </Router>
    </Provider>
    <GlobalStyle/>
  </Fragment>
);

ReactDOM.render(<App />, document.getElementById('root'));
