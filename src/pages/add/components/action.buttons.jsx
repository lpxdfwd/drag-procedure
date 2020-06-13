import React from 'react';
import {inject, observer} from 'mobx-react';
import { Button, message } from 'antd';
import styled from 'styled-components';
import {ContextHOC} from '../../../components/context';


const ActionButtons = inject('addStore')(observer(props => {
  const handleToBig = () => {
    if (props.addStore.scale >= 3) {
      return message.info('已经是最大了');
    }
    props.addStore.onChangeSize && props.addStore.onChangeSize('big');
  };

  const handleToSmall = () => {
    if (props.addStore.scale <= 0.7) {
      return message.info('不能再小了');
    };
    props.addStore.onChangeSize && props.addStore.onChangeSize('small');
  };

  const handleShowAdd = () => {
    const {setState, addVisible} = props.addStore;
    if (addVisible) return;
    setState && setState({addVisible: true});
  };

  const handleClearForm = () => {
    if (!props.ctx.curr || !props.addStore) return;
    props.addStore.setState({drawList: props.addStore.drawList.slice(0, 2)});
    props.ctx.curr.clearAll();
  }

  const handleSumit = () => {
    if (!props.ctx.curr || !props.addStore) return;
    const drawList = props.addStore.drawList.slice();
    const lines = props.ctx.curr.cacheLines.slice();
    const map = {};
    while(lines.length) {
      const {formId, formType, toId} = lines.pop();
      let drawItem;
      if (formId === 'start') {
        map[formId] = toId;
        continue;
      }
      if (map[formId]) {
        drawItem = map[formId];
      } else {
        map[formId] = drawItem = {};
      }
      drawItem[formType] = toId;
    }
    const res = {
      drawList,
      lines: props.ctx.curr.cacheLines,
      res: map
    }
    // console.log(JSON.stringify(res));
  };

  return (
    <Container>
      <Button onClick={handleShowAdd}>新增节点</Button>
      <Button onClick={handleToBig}>放大</Button>
      <Button onClick={handleToSmall}>缩小</Button>
      <Button type="primary" onClick={handleSumit}>保存</Button>
      <Button type="primary" danger onClick={handleClearForm}>清空</Button>
    </Container>
  );
}));

export default ContextHOC(ActionButtons);

const Container = styled.div`
  position: absolute;
  left: 50px;
  top: 20px;
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
