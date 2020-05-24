import React, {useCallback, useState} from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import {getColumns} from './static';
import {dataSource} from './mock.data'

//分页条数
const PAGE_SIZE = 10;

const List = ({onShowSetting}) => {
  const [current, setCurrent] = useState(1)
  const handleShowEdit = useCallback(id => {
    console.log('修改' + id);
  }, []);

  const handleShowManagement = useCallback(id => {
    console.log('推送管理' + id);
    onShowSetting && onShowSetting(id)
  }, []);

  const handlePageChange = useCallback(current => setCurrent(current), [])
  
  return (
    <Container>
      <Title>机器人对话话题列表</Title>
      <Table 
        pagination={{
          total: dataSource.length,
          current,
          pageSize: PAGE_SIZE,
          onChange: handlePageChange
        }} 
        hideOnSinglePage
        columns={getColumns({onShowEdit: handleShowEdit, onShowManagement: handleShowManagement})} 
        dataSource={dataSource}
      />
    </Container>
  );
}

export default List;

const Container = styled.div`
  padding: 0 60px 130px;
`;

const Title = styled.div`
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  line-height: 36px;
`;
