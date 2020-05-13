import React, {Component} from 'react';
import styled from 'styled-components';
import {inject, observer} from 'mobx-react';

@inject('indexStore') @observer
class CountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  doChange = () => {
    this.props.indexStore.setCont && this.props.indexStore.setCont();
  };

  render() {
    const {count} = this.props.indexStore;
    return (
      <Container>
        <CountText>{count}</CountText>
        <ChangeButton onClick={this.doChange}>click</ChangeButton>
      </Container>
    );
  }
}

export default CountPage;

const Container = styled.div`
  padding: 3rem;
`;

const CountText = styled.div`
  text-align: center;
  font-size: .3rem;
  font-weight: bold;
  line-height: .5rem;
`;

const ChangeButton = styled.div`
  font-size: .24rem;
  border-radius: .08rem;
  color: #fff;
  margin: .1rem auto 0;
  width: 1rem;
  height: .5rem;
  line-height: .5rem;
  text-align: center;
  background: blueviolet;
`;
