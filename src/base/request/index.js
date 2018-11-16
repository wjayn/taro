import Taro from '@tarojs/taro';
import Request from './request';
import Interceptor from './interceptor';

let requestList = {};

function getRequest() {
  let env = Taro.getEnv();
  let requestInstance = requestList[env];
  if (!requestInstance){
    if (env === Taro.ENV_TYPE.WEB || env === Taro.ENV_TYPE.RN){
      requestInstance = new Request([Interceptor.tokenInterceptor,
        Interceptor.timeoutInterceptor, Interceptor.taroInterceptor]);
    }else{
      requestInstance = new Request();
    }
    requestList[env] = requestInstance
  }
  return requestInstance;
}

function request(requestParams){
  return getRequest().request(requestParams)
}

function addInterceptors(interceptor){
  getRequest().addInterceptors(interceptor)
}
export default {
  request,
  addInterceptors
}
