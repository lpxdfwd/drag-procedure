import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Container, Header} from './style';
import PageHeader from './components/header';
import Content from './components/content';
import {removeEvent} from '../../lib/event.lib';
import history from '../../lib/history.lib';
import cacheLib from '../../lib/cache.lib';
import {LOGIN_PATH} from '../../path.static';

@inject('addStore') @observer
class AddPage extends Component {
  componentWillUnmount() {
    removeEvent('setLineArrow');
    removeEvent('altEvent');
    this.props.addStore.reset();
  }

  componentDidMount() {
    if (!cacheLib.sessionId) {
      cacheLib.clear();
      // history.replace(LOGIN_PATH);
    }
  }

  render() {
    return (
      <Container>
        <PageHeader />
        <Content />
      </Container>
    );
  }
}

export default AddPage;
