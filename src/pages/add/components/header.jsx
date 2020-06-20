import React from 'react';
import { Input, Select } from 'antd';
import {inject, observer} from 'mobx-react';
import {Header, HeaderItem, HeaderItemLabel} from '../style';

const PageHeader = (props) => {
  const handleTagChange = (val) => {
    props.addStore.setState({
      topicHead: {
        ...(props?.addStore?.topicHead || {}),
        tag: val
      }
    });
  }

  const handleInputChange = (val, type) => {
    props.addStore.setState({
      topicHead: {
        ...(props?.addStore?.topicHead || {}),
        [type]: val.currentTarget.value
      }
    });
  }


  return (
    <Header>
      <HeaderItem>
        <HeaderItemLabel>话题名称</HeaderItemLabel>
        <Input value={props?.addStore?.topicHead?.name} onChange={val => handleInputChange(val, 'name')} placeholder='请输入话题名称'/>
      </HeaderItem>
      <HeaderItem>
        <HeaderItemLabel>话题ID</HeaderItemLabel>
        <Input value={props?.addStore?.topicHead?.ename} onChange={val => handleInputChange(val, 'ename')} placeholder='请输入话题ID'/>
      </HeaderItem>
      <HeaderItem>
        <HeaderItemLabel>标签</HeaderItemLabel>
        <Select value={props?.addStore?.topicHead?.tag?.slice() || []} placeholder='请输入标签' mode="tags" style={{ flex: 1 }} onChange={handleTagChange} />
      </HeaderItem>
    </Header>
  );
}

export default inject('addStore')(observer(PageHeader));
