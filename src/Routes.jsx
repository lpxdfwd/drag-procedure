import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {IndexPage, AddPage} from './loadable';

const Routes = () => (
  <Switch>
    
    <Route exact path='/' component={IndexPage}/>
    <Route exact path='/add' component={AddPage}/>
    
  </Switch>
);

export default Routes;
