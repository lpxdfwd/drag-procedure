import React from 'react';
import { Space } from 'antd';

export const getColumns = options => [
  {
    title: '话题名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '话题ID',
    dataIndex: 'ename',
    key: 'ename',
  },
  {
    title: '标签',
    dataIndex: 'tag',
    key: 'tag',
    render: (record) => record ? record.join(', ') : ''
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: '修改时间',
    key: 'update_time',
    dataIndex: 'update_time',
  },
  {
    title: '操作',
    key: 'action',
    render: (record) => (
      <Space size="middle">
        <a onClick={() => options.onShowEdit(record.key)}>修改</a>
        <a onClick={() => options.onShowManagement(record.key)}>推送管理</a>
      </Space>
    ),
  },
];