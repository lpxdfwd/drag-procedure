import React, {Component} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import { Button } from 'antd';
import {Title, Container, Content, PageBottom} from './style';
import Search from './components/search';
import List from './components/list';
import SettingModal from './components/settingModal';
import history from '../../lib/history.lib';
import cacheLib from '../../lib/cache.lib';
import {LIST_PATH, LOGIN_PATH} from '../../path.static';

class IndexPage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    if (!cacheLib.sessionId) {
      cacheLib.clear();
      history.replace(LOGIN_PATH);
    } else {
      //主页面允许匹配非法路由，匹配到重定向
      if (history.location && history.location.pathname !== LIST_PATH) {
        history.replace(LIST_PATH);
      }
    }
  }

  handleShowSetting = id => {
    console.log('显示弹窗', id);
    this.setState({visible: true});
  }

  handleCloseModal = () => this.setState({visible: false})

  render() {
    const {visible} = this.state;
    console.log(visible);
    return (
      <Container>
        <Title>锦书机器人话题运营管理平台</Title>
        <Content>
          <Search/>
          <List onShowSetting={this.handleShowSetting}/>
        </Content>
        <PageBottom>
          <Button onClick={() => window.open('/add')} size='large' type='primary' icon={<PlusOutlined />}>新增</Button>
        </PageBottom>
        <SettingModal visible={visible} onCloseModal={this.handleCloseModal}/>
      </Container>
    );
  }
}

export default IndexPage;
