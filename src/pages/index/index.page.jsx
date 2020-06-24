import React, {Component} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import { Button, message } from 'antd';
import {Title, Container, Content, PageBottom} from './style';
import Search from './components/search';
import List from './components/list';
import SettingModal from './components/settingModal';
import history from '../../lib/history.lib';
import cacheLib from '../../lib/cache.lib';
import {LIST_PATH, LOGIN_PATH} from '../../path.static';
import {queryTopicList, querySendSettings} from '../../http/service.api';

class IndexPage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      dataList: [],
      settingsDetail: {}
    };
  }

  componentDidMount() {
    if (!cacheLib.sessionId) {
      cacheLib.clear();
      // history.replace(LOGIN_PATH);
    } else {
      //主页面允许匹配非法路由，匹配到重定向
      if (history.location && history.location.pathname !== LIST_PATH) {
        history.replace(LIST_PATH);
      }
      this.initData();
    }
  }

  initData = async(val = '', isName = true) => {
    try {
      const data = await queryTopicList({
        query_content: val,
        query_type: isName ? 'name' : 'tag'
      });
      this.setState({dataList: data.map(item => ({...item, key: item.topic_id}))});
    } catch(err) {
      message.error(err.message || '查询出错');
    }
  }

  querySettingsDetail = async id => {
    try {
      const data = await querySendSettings({topic_id: id});
      this.setState({settingsDetail: data});
    } catch (err) {
      message.error(err.message || '请求出错');
    }
  }

  handleShowSetting = id => {
    console.log('显示弹窗', id);
    this.setState({visible: true});
    this.querySettingsDetail(id);
  }

  handleCloseModal = () => this.setState({visible: false, settingsDetail: {}});

  render() {
    const {visible, dataList, settingsDetail} = this.state;
    return (
      <Container>
        <Title>锦书机器人话题运营管理平台</Title>
        <Content>
          <Search onSearch={this.initData}/>
          <List dataList={dataList} onShowSetting={this.handleShowSetting}/>
        </Content>
        <PageBottom>
          <Button onClick={() => window.open('/add?type=add')} size='large' type='primary' icon={<PlusOutlined />}>新增</Button>
        </PageBottom>
        <SettingModal settingsDetail={settingsDetail || {}} visible={visible} onCloseModal={this.handleCloseModal}/>
      </Container>
    );
  }
}

export default IndexPage;
