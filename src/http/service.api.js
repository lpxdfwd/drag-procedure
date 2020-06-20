import {requestPostFun, requestGetFun} from './index';


//登陆接口
export const userLogin = data => requestPostFun('/management/login', data);

//提交新增/编辑话题
export const topicSubmit = data => requestPostFun('/management/topic/plan/submit', data);

//查询话题列表
export const queryTopicList = data => requestGetFun('/management/topic/search', data);

//查询编辑话题
export const queryDetail = data => requestGetFun('/management/topic/plan/edit', data);

//查询推送管理
export const querySendSettings = data => requestGetFun('/management/topic/schedule/edit', data);

//提交推送管理
export const submitSendSettings = data => requestPostFun('/management/topic/schedule/submit', data);

//中止推送
export const endSend = data => requestPostFun('/management/topic/schedule/terminate', data);
