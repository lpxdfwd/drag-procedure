import React, {Component} from 'react';
import styled from 'styled-components';
import { Modal, Select, DatePicker, message } from 'antd';
import moment from 'moment';
import {submitSendSettings, endSend} from '../../../http/service.api';

const TARGET_TYPE = ['全部用户', '上一次有推送但未交互', '上一次未推送', '指定用户']

const END_SEND_KEYS = ['推送中', '定时推送'];

const dataList = [
  { label: '当前话题', key: 'topic_name' },
  { label: '推送状态', key: 'status' },
  { label: '最近推送时间', key: 'last_actual_start_time' },
  { label: '推送范围', key: 'last_push_target_type', render: ({last_push_target_type}) => last_push_target_type === null ? '-' : TARGET_TYPE[last_push_target_type]},
  { label: '话题交互人数', key: 'percent', render: ({last_push_data}) => {
    if (last_push_data) {
      const {response_count, total_count, percent} = last_push_data;
      return `${response_count || 0}/${total_count || 0} (percent)`
    }
    return '-';
  } },
  { label: '话题有效时间', key: 'last_actual_push_duration', render: ({last_actual_push_duration}) => {
    if (last_actual_push_duration > 0) {
      const h = parseInt(last_actual_push_duration / 3600);
      const m = parseInt(last_actual_push_duration % 3600 / 60);
      if (last_actual_push_duration < 60) return '1分钟';
      return `${h > 0 ? `${h}小时` : ''}${m > 0 ? `${m}分钟` : ''}` || '-';
    }
    return '-';
  }},
  { label: '人均对话轮数', key: 'chat_count_avg', render: ({last_push_data}) => last_push_data ? (last_push_data['chat_count_avg'] || '-') : '-'},
];

class SettingModal extends Component {
  constructor(props) {
    super(props);
    const {settingsDetail} = props;
    this.state = {
      sendRange: 0,
      sendType: 0,
      effectiveTime: -1,
      userTags: [],
      sendTime: ''
    }
  }

  componentDidUpdate(prevProps) {
    const {settingsDetail} = this.props;
    if (prevProps.settingsDetail !== settingsDetail) {
      this.setState({
        sendRange: settingsDetail.push_target_type || 0,
        sendType: settingsDetail.push_time_type || 0,
        effectiveTime: settingsDetail.push_time_duration || -1,
        userTags: settingsDetail.push_target_users || [],
        sendTime: settingsDetail.push_time_start || ''
      })
    }
  }

  handleOk = async() => {
    try {
      const {settingsDetail} = this.props;
      const {status} = settingsDetail || {};
      if (END_SEND_KEYS.includes(status)) return this.handleEndSend();
      this.handleSubmitSend();
    } catch (err) {
      message.error(err.message || '提交失败');
    }
  }

  handleEndSend = async() => {
    const {settingsDetail} = this.props;
    const {topic_id} = settingsDetail || {};
    await endSend({topic_id});
    message.success('中止成功');
  }

  handleSubmitSend = async() => {
    const {sendRange, sendType, userTags, sendTime, effectiveTime} = this.state;
    const {settingsDetail} = this.props;
    const {topic_id, schedule_id} = settingsDetail || {};
    await submitSendSettings({
      topic_id,
      schedule_id,
      push_target_type: sendRange,
      push_target_users: userTags,
      push_time_type: sendType,
      push_time_start: sendTime,
      push_time_duration: effectiveTime
    })
    message.success('提交成功');
    this.props.onCloseModal && this.props.onCloseModal();
  }

  handleCancel = () => this.props.onCloseModal && this.props.onCloseModal();

  handleChange = (val, type) => {
    this.setState({
      [type]: val
    })
  }

  handleConfirmTime = (val) => {
    this.setState({
      sendTime: val ? val.unix() : ''
    })
  }

  handleChangeTags = val => {
    this.setState({
      userTags: val
    })
  }

  renderModalTop = () => {
    const {settingsDetail} = this.props;
    return (
      <TopContainer>
        {
          dataList.map(({label, render, key}) => (
            <TopItem key={key}>{`${label}: ${render ? render(settingsDetail) : (settingsDetail[key] || '-')}`}</TopItem>
          ))
        }
        <EndTime>数据截至：6-1 12:00:00</EndTime>
      </TopContainer>
    );
  }

  renderModalEdit = () => {
    const {sendRange, sendType, effectiveTime, userTags, sendTime} = this.state;
    return (
      <EditContainer>
        <EditTitle>再次推送</EditTitle>
        <EditItem>
          <EditItemLabel>推送范围：</EditItemLabel>
          <Select style={{width: 300}} value={sendRange} onChange={val => this.handleChange(val, 'sendRange')}>
            <Option value={0}>全部用户</Option>
            <Option value={1}>上一次有推送但未交互</Option>
            <Option value={2}>上一次未推送</Option>
            <Option value={3}>指定用户</Option>
          </Select>
        </EditItem>
        {
          sendRange === 3 && (
            <EditItem>
              <EditItemLabel />
              <Select value={userTags} placeholder='请输入手机号添加用户' mode="tags" style={{ flex: 1 }} onChange={this.handleChangeTags} />
            </EditItem>
          )
        }
        <EditItem>
          <EditItemLabel>话题有效时间：</EditItemLabel>
          <Select style={{width: 300}} defaultValue={effectiveTime} onChange={val => this.handleChange(val, 'effectiveTime')}>
            <Option value={30 * 60}>0.5小时</Option>
            <Option value={1 * 60 * 60}>1小时</Option>
            <Option value={2 * 60 * 60}>2小时</Option>
            <Option value={4 * 60 * 60}>4小时</Option>
            <Option value={12 * 60 * 60}>12小时</Option>
            <Option value={24 * 60 * 60}>24小时</Option>
            <Option value={72 * 60 * 60}>72小时</Option>
            <Option value={7 * 24 * 60 * 60}>7天</Option>
            <Option value={15 * 24 * 60 * 60}>15天</Option>
            <Option value={30 * 24 * 60 * 60}>30天</Option>
            <Option value={-1}>永久</Option>
          </Select>
        </EditItem>
        <EditItem>
          <EditItemLabel>推送方式：</EditItemLabel>
          <Select style={{width: 300}} value={sendType} onChange={val => this.handleChange(val, 'sendType')}>
            <Option value={0}>即时</Option>
            <Option value={1}>定时</Option>
          </Select>
        </EditItem>
        {sendType === 1 && (
          <EditItem>
            <EditItemLabel>推送时间：</EditItemLabel>
            <DatePicker value={moment(sendTime * 1000 || new Date())} showTime placeholder='选择时间' onOk={this.handleConfirmTime} />
          </EditItem>
        )}
      </EditContainer>
    );
  }

  render() {
    const {visible, settingsDetail} = this.props;
    const {status} = settingsDetail;
    return (
      <Modal
        title = '话题推送管理'
        onOk = {this.handleOk}
        width={700}
        visible = {visible}
        onCancel = {this.handleCancel}
        okText = {END_SEND_KEYS.includes(status) ? '中止推送' : '确定'}
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
