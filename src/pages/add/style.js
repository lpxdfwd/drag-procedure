import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  padding-left: 50px;
  box-shadow: 0 2px 20px 2px rgba(0, 0, 0, .2);
  align-items: center;
`

export const HeaderItem = styled.div`
  flex: 1;
  display: flex;
  margin-right: 30px;
  align-items: center;
`;

export const  HeaderItemLabel = styled.div`
  font-size: 16px;
  color: #333;
  margin-right: 16px;
  width: 90px;
  text-align: right;
`;
