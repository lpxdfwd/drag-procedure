import history from '../lib/history.lib';
import { message } from 'antd';
import {LOGIN_PATH} from '../path.static';

export const HTTP_CODE = {
  SUCCESS: 0,
  NOT_LOGIN: 500
};

export const ERROR_LIST = {
  [HTTP_CODE.NOT_LOGIN]: () => {
    message.error('服务器出错，请稍后再试');
    history.replace(LOGIN_PATH);
  }
};
