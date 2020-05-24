import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 36px;
  font-weight: bold;
  color: #333;
  padding-left: 50px;
  box-shadow: 0 2px 20px 2px rgba(0, 0, 0, .2);
`

export const Content = styled.div`
  flex: 1;
  padding-bottom: 1rem;
`

export const PageBottom = styled.div`
  height: 130px;
  box-shadow: 0 2px 20px 2px rgba(0, 0, 0, .2);
  display: flex;
  align-items: center;
  padding-left: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;
