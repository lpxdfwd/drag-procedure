import React from 'react';
import {inject, observer} from 'mobx-react';
import { Button, message } from 'antd';
import styled from 'styled-components';
import {ContextHOC} from '../../../components/context';
import {topicSubmit} from '../../../http/service.api';

const formatItem = ({title, repeatText, firstText, mutualType}, id) => ({
  index: id,
  title: title, 
  first_talk: firstText, 
  redo_talk: repeatText,
  inactive_mode: mutualType === '1' ? 'confirm' : 'none', 
  inactive_info: {}
})

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

  const submitCheck = (topicHead, drawList) => {
    const {name, ename, tag} = topicHead;
    if (!name) return '请填写话题名称';
    if (!ename) return '请填写话题ID';
    if (!tag) return '请填写话题标签';
    if (drawList.length <= 2) return '请添加节点';
  }

  const handleSumit = async () => {
    if (!props.ctx.curr || !props.addStore) return;
    const drawList = props.addStore.drawList.slice();
    const lines = props.ctx.curr.cacheLines.slice();
    const {topicHead} = props.addStore;
    const errMsg = submitCheck(topicHead, drawList);
    if (errMsg) return message.error(errMsg);
    const map = {};
    while(lines.length) {
      const line = lines.pop();
      const {formId, formType, toId} = line;
      let drawItem;
      if (formId === 'start') {
        // map[formId] = toId;
        continue;
      }
      if (map[formId]) {
        drawItem = map[formId];
      } else {
        drawList.forEach((item) => {
          if (item.key === formId) map[formId] = drawItem = formatItem(item, formId);
        })
      }
      if (formType === 'n') {
        drawItem.inactive_info.deny_jump = toId === 'end' ? -1 : toId;
      } else if (formType === 'y') {
        drawItem.inactive_info.admit_jump = toId === 'end' ? -1 : toId;
      } else {
        drawItem.inactive_info.other_jump = toId === 'end' ? -1 : toId;
      }
    }
    const res = {
      drawList,
      lines: props.ctx.curr.cacheLines,
      ...topicHead,
      inquireNodes: Object.values(map),
      topic_id: props.topicId
    }
    console.log(res);
    try {
      await topicSubmit(res);
      message.success('保存成功');
    } catch (err) {
      message.error('请求出错');
    }
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
