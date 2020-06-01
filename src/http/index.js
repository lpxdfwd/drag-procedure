import axios from 'axios';
import { message } from 'antd';
import {defaultConfig, fileConfig, getHeader} from './http-config';
import {ERROR_LIST, HTTP_CODE} from './error-list';
import debuggerConsole from '../lib/console.lib';

const BASE_URL = '';

class Request {
  constructor() {
    this.instance = axios.create(defaultConfig);
    this.fileInstance = axios.create(fileConfig);
    this.requestProxy(requestInterceptor);
    this.responseProxy(responseInterceptor);
  }

  requestProxy(onResolve) {
    return this.instance.interceptors.request.use(onResolve);
  }

  responseProxy(onResolve) {
    return this.instance.interceptors.response.use(onResolve);
  }

  request = (url, data, config = {}) => this.instance.post(url, data, config);

  requestGet = (url, data) => this.instance.get(url, {params: data});
}

const requestInterceptor = config => {
  const {data} = config;
  //接口登陆验证
  const newConfig = {...config};
  newConfig.data = JSON.stringify(data);
  newConfig.headers = getHeader(config);
  return newConfig;
};

const responseInterceptor = res => {
  const {data: resData, config} = res;
  const {url} = config;
  const {
    message: msg, errno, frontMsg, data
  } = resData;
  debuggerConsole(`请求路径：${url}\n 请求响应：`, data);
  if (errno === HTTP_CODE.SUCCESS) return data;
  frontMsg && message.error(frontMsg);
  const err = ERROR_LIST[errno];
  err && err(msg);
  const errorObj = {code: errno, message: frontMsg};
  return Promise.reject(errorObj);
};

const requestLib = new Request();

const requestPost = requestLib.request;

const requestGet = requestLib.requestGet;

const createRequestPost = baseUrl => (url, data = {}) => requestPost(baseUrl + url, data);

const createRequestFile = baseUrl => (url, formData) => requestLib.fileInstance.post(baseUrl + url, formData);

const createRequestGet = baseUrl => (url, data = {}) => requestGet(baseUrl + url, data);

//post请求
export const requestPostFun = createRequestPost(BASE_URL);

//file请求
export const requestFileFun = createRequestFile(BASE_URL);

//get请求
export const requestGetFun = createRequestGet(BASE_URL);
