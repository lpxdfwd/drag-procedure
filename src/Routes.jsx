import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {IndexPage, AddPage, LoginPage} from './loadable';
import {LIST_PATH, LOGIN_PATH, ADD_PATH} from './path.static';

const Routes = () => (
  <Switch>
    <Route exact path={LOGIN_PATH} component={LoginPage}/>
    <Route exact path={ADD_PATH} component={AddPage}/>
    <Route path={LIST_PATH} component={IndexPage}/>
  </Switch>
);

export default Routes;
