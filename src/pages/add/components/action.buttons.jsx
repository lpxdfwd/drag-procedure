import React from 'react';
import {inject, observer} from 'mobx-react';
import { Button, message } from 'antd';
import styled from 'styled-components';


const ActionButtons = inject('addStore')(observer(props => {
  const handleToBig = () => {
    if (props.addStore.scale >= 3) {
      return message.info('已经是最大了');
    }
    props.addStore.onToBig && props.addStore.onToBig();
  };

  const handleToSmall = () => {
    if (props.addStore.scale <= 0.6) {
      return message.info('不能再小了');
    };
    props.addStore.onToSmall && props.addStore.onToSmall();
  };

  return (
    <Container>
      <Button>新增节点</Button>
      <Button onClick={handleToBig}>放大</Button>
      <Button onClick={handleToSmall}>缩小</Button>
    </Container>
  );
}));

export default ActionButtons;

const Container = styled.div`
  position: absolute;
  left: 50px;
  top: 150px;
  z-index: 1000;
  display: flex;
  .ant-btn {
    margin-right: 20px;
    border-radius: 8px;
    &:hover {
      background: #1B90FF;
      color: #fff;
    }
  }
`;
