import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {IndexPage, CountPage} from './loadable';

const Routes = () => (
  <Switch>
    <Route exact path='/count' component={CountPage}/>
    <Route path='/' component={IndexPage}/>
  </Switch>
);

export default Routes;
