import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Container, Header} from './style';
import PageHeader from './components/header';
import Content from './components/content';
import {removeEvent} from '../../lib/event.lib';

@inject('addStore') @observer
class AddPage extends Component {
  componentWillUnmount() {
    removeEvent('setLineArrow');
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
