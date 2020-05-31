import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Container, Header} from './style';
import PageHeader from './components/header';
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
        <Content />
      </Container>
    );
  }
}

export default AddPage;
