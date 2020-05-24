import React, {Component} from 'react';
import {Container, Header} from './style';
import PageHeader from './components/header';

class AddPage extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Container>
        <PageHeader />
      </Container>
    );
  }
}

export default AddPage;
