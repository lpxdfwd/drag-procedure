import React, {Component} from 'react';
import styled from 'styled-components';
import { Modal, Select, DatePicker } from 'antd';

const dataList = [
  { label: '当前话题', value: '早晨问候', key: 1 },
  { label: '推送状态', value: '已完成', key: 2 },
  { label: '最近推送时间', value: '2020-6-1 09:45:34', key: 3 },
  { label: '推送范围', value: '全员', key: 4 },
  { label: '话题交互人数', value: '12013/190203 (6.316%)', key: 5 },
  { label: '话题有效时间', value: '1小时', key: 6 },
  { label: '人均对话轮数', value: '3', key: 7 },
];

class SettingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendRange: '1',
      sendType: '1',
      effectiveTime: '1',
      userTags: []
    }
  }

  handleOk = () => {
    console.log('确定');
    this.props.onCloseModal && this.props.onCloseModal();
  }

  handleCancel = () => this.props.onCloseModal && this.props.onCloseModal();

  handleChange = (val, type) => {
    console.log(val);
    this.setState({
      [type]: val
    })
  }

  handleChangeTime = (val) => {
    console.log(val);
  }

  handleConfirmTime = (val) => {
    console.log(val);
  }

  handleChangeTags = val => {
    this.setState({
      userTags: val
    })
  }

  renderModalTop = () => (
    <TopContainer>
      {
        dataList.map(({label, value, key}) => (
          <TopItem key={key}>{`${label}: ${value}`}</TopItem>
        ))
      }
      <EndTime>数据戒指：6-1 12:00:00</EndTime>
    </TopContainer>
  )

  renderModalEdit = () => {
    const {sendRange, sendType, effectiveTime} = this.state;
    return (
      <EditContainer>
        <EditTitle>再次推送</EditTitle>
        <EditItem>
          <EditItemLabel>推送范围：</EditItemLabel>
          <Select style={{width: 300}} defaultValue={sendRange} onChange={val => this.handleChange(val, 'sendRange')}>
            <Option value="1">全部用户</Option>
            <Option value="2">上一次有推送但未交互</Option>
            <Option value="3">上一次未推送</Option>
            <Option value="4">指定用户</Option>
          </Select>
        </EditItem>
        {
          sendRange === '4' && (
            <EditItem>
              <EditItemLabel />
              <Select placeholder='请输入手机号添加用户' mode="tags" style={{ flex: 1 }} onChange={this.handleChangeTags} />
            </EditItem>
          )
        }
        <EditItem>
          <EditItemLabel>话题有效时间：</EditItemLabel>
          <Select style={{width: 300}} defaultValue={effectiveTime} onChange={val => this.handleChange(val, 'effectiveTime')}>
            <Option value="1">0.5小时</Option>
            <Option value="2">1小时</Option>
            <Option value="3">2小时</Option>
            <Option value="4">4小时</Option>
            <Option value="5">12小时</Option>
            <Option value="6">24小时</Option>
            <Option value="7">72小时</Option>
            <Option value="8">7天</Option>
            <Option value="9">15天</Option>
            <Option value="10">30天</Option>
            <Option value="11">永久</Option>
          </Select>
        </EditItem>
        <EditItem>
          <EditItemLabel>推送方式：</EditItemLabel>
          <Select style={{width: 300}} defaultValue={sendType} onChange={val => this.handleChange(val, 'sendType')}>
            <Option value="1">即时</Option>
            <Option value="2">定时</Option>
          </Select>
        </EditItem>
        {sendType === '2' && (
          <EditItem>
            <EditItemLabel>推送时间：</EditItemLabel>
            <DatePicker showTime placeholder='选择时间' onChange={this.handleChangeTime} onOk={this.handleConfirmTime} />
          </EditItem>
        )}
      </EditContainer>
    );
  }

  render() {
    const {visible} = this.props;
    return (
      <Modal
        title = '话题推送管理'
        onOk = {this.handleOk}
        width={700}
        visible = {visible}
        onCancel = {this.handleCancel}
        okText = '确定'
        cancelText = '取消'
      >
        {this.renderModalTop()}
        {this.renderModalEdit()}
        <PushHistory>话题推送历史</PushHistory>
      </Modal>
    );
  }
}


export default SettingModal;

const TopContainer = styled.div`
  padding-bottom: 10px;
  border-bottom: solid 1px #eee;
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;

const TopItem = styled.div`
  width: 50%;
  line-height: 24px;
  color: #333;
  font-size: 16px;
  margin-bottom: 10px;
`;

const EndTime = styled.div`
  position: absolute;
  bottom: 10px;
  right: 0;
  font-size: 12px;
  color: #333;
`;

const EditContainer = styled.div`
  margin-top: 10px;
`;

const EditTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const EditItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const EditItemLabel = styled.div`
  font-size: 16px;
  color: #333;
  width: 120px;
  text-align: right;
`;

const PushHistory = styled.div`
  color: #66ccff;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
  position: absolute;
  bottom: 16px;
`;
