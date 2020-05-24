import React from 'react';
import { Input, Select } from 'antd';
import {Header, HeaderItem, HeaderItemLabel} from '../style';

const PageHeader = () => {
  return (
    <Header>
      <HeaderItem>
        <HeaderItemLabel>话题名称</HeaderItemLabel>
        <Input placeholder='请输入话题名称'/>
      </HeaderItem>
      <HeaderItem>
        <HeaderItemLabel>话题ID</HeaderItemLabel>
        <Input placeholder='请输入话题ID'/>
      </HeaderItem>
      <HeaderItem>
        <HeaderItemLabel>标签</HeaderItemLabel>
        <Select placeholder='请输入手机号添加用户' mode="tags" style={{ flex: 1 }} onChange={() => {}} />
      </HeaderItem>
    </Header>
  );
}

export default PageHeader;
