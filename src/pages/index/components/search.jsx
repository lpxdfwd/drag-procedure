import React, {memo, useState, useCallback} from 'react';
import { Input, Button } from 'antd';
import styled from 'styled-components';

const Search = ({onSearch}) => {
  const [value, setValue] = useState('');
  const handleValueChange = useCallback((e) => setValue(e.currentTarget.value), [])

  return (
    <Container>
      <Input placeholder='请输入话题名称、ID、标签进行搜索' value={value} maxLength='500px' size='large' onChange={handleValueChange} allowClear/>
      <Button size='large' type='primary' style={{marginRight: '.2rem'}} onClick={() => onSearch(value, true)}>搜名称/ID</Button>
      <Button size='large' type='primary' onClick={() => onSearch(value, false)}>搜标签</Button>
    </Container>
  );
}

export default memo(Search);

const Container = styled.div` 
  margin: 60px;
  display: flex;
  .ant-input-affix-wrapper-lg {
    width: 800px;
    border-radius: 8px;
    margin-right: 20px;
  }
`;
