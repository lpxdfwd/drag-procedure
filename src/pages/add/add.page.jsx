import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Container, Header} from './style';
import PageHeader from './components/header';
import ActionButtons from './components/action.buttons';
import Content from './components/content';

@inject('addStore') @observer
class AddPage extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Container>
        <PageHeader />
        <ActionButtons />
        <Content />
      </Container>
    );
  }
}

export default AddPage;
