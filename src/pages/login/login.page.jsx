import React, {Component} from 'react';
import styled from 'styled-components';
import { Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import history from '../../lib/history.lib';
import cacheLib from '../../lib/cache.lib';
import {LIST_PATH} from '../../path.static';
import {userLogin} from '../../http/service.api';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: ''
        };
    }

    componentDidMount() {
        if (cacheLib.sessionId) {
            history.replace(LIST_PATH);
        }
    }

    handleChangeItem = (value, type) => this.setState({ [type]: value });

    check = () => {
        const {mobile, password} = this.state;
        if (!mobile) return '请填写手机号';
        if (!(/^1[3456789]\d{9}$/.test(mobile))) return '请填写正确的手机号';
        if (!password) return '请填写密码';
        return null;
    }

    handleSubmit = async () => {
        const err = this.check();
        if (err) return message.error(err);
        const {mobile, password} = this.state;
        try {
            const data = await userLogin({mobile, password});
            cacheLib.sessionId = cacheLib.loginSession;
            message.success('登陆成功');
            history.replace('/')
        } catch({code, message: msg}) {
            const err = ERROE_LIST.find(item => item.code === code);
            if (err) {
                message.error(err.msg);
            } else {
                message.error('登录失败');
            }
        }
        
    }

    render() {
        return (
            <Container>
                <Title>锦书话题管理平台</Title>
                <FormBox>
                    <Input onChange={e => this.handleChangeItem(e.currentTarget.value, 'mobile')} size="large" placeholder="请输入手机号" prefix={<UserOutlined />} />
                    <Input type='password' onChange={e => this.handleChangeItem(e.currentTarget.value, 'password')} size="large" placeholder="请输入密码" prefix={<LockOutlined />} />
                    <Button style={{width: '100%'}} size="large" type="primary" onClick={this.handleSubmit}>登录</Button>
                </FormBox>
            </Container>
        );
    }
}

export default LoginPage;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Title = styled.div`
    font-size: 30px;
    font-weight: bold;
    color: #333;
`;

const FormBox = styled.div`
    width: 500px;
    margin-top: 50px;
    .ant-input-affix-wrapper-lg {
        margin-bottom: 20px;
        border-radius: 8px;
    }
`;
