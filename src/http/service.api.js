import {requestPostFun, requestGetFun} from './index';


//登陆接口
export const userLogin = data => requestPostFun('/management/login', data);

export const topicSubmit = data => requestPostFun('/management/topic/plan/submit', data);
