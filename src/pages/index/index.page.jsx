import React from 'react';
import styled from 'styled-components';
import history from '../../lib/history.lib';

const IndexPage = () => (
  <Container>
    <Content>Welcome Use!</Content>
    <Content onClick={() => history.push('/count')}>Please Click!</Content>
  </Container>
);

export default IndexPage;

const Container = styled.div`
  padding-top: 3rem;
`;

const Content = styled.div`
  text-align: center;
  font-size: .3rem;
  line-height: .5rem;
  font-weight: bold;
`;
