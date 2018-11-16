import Taro from '@tarojs/taro';
import Global from '../../global_data';
import ServerError from './serverError';

function tokenInterceptor(chain) {
  let requestParams = chain.requestParams;
  let user = Global.get(Global.KEYS.USER);
  if (!requestParams){
    return Promise.reject(new Error('请求参数不能为空'));
  }

  if (requestParams && requestParams.header){
    requestParams.header.token = user && user.token_id;
  }

  return chain.proceed(requestParams)
    .then((res) => {
      if (res.statusCode >= 400){
        throw new Error(res.data)
      }
      let {data} = res;
      if (!data.code) { //非服务器标准协议
        return res
      }
      if (data.code !== 'success'){
        if (data.errorCode === 'auth_error'){
          Global.set(Global.KEYS.USER, null);
          Taro.navigateTo({url: '/pages/login/login'});
        }
        throw new ServerError(data.errorCode, data.message);
      }
      return data.data || data
    });
}

function formDataInterceptor(chain) {
  let requestParams = chain.requestParams;
  let method = requestParams && requestParams.method && requestParams.method.toLowerCase();
  let hasBody = method === 'post' || method === 'put';
  let contentType = requestParams && requestParams.header && (requestParams.header['Content-Type']
    || requestParams.header['content-type']);
  let isFormDataContentType = contentType && contentType.indexOf('form-data') >= 0
    || contentType.indexOf('form-data') >= 0;
  let handleFormData = requestParams && requestParams.data && !requestParams.data.toString().indexOf('FormData') >= 0;
  if(hasBody && isFormDataContentType && handleFormData){
    let formData = new FormData();
    Object.keys(requestParams.data).forEach(function (key) {
      formData.append(key, requestParams.data[key])
    });
    requestParams.data = formData
  }
  return chain.proceed(requestParams)
}

function timeoutInterceptor(chain) {
  let requestParams = chain.requestParams;
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      timeout = undefined;
      reject({message: '网络链接超时,请稍后再试！'});
    }, requestParams && requestParams.timeout || 30000);
    chain.proceed(requestParams).then((res) => {
      if(!timeout)
        return;
      clearTimeout(timeout);
      resolve(res)
    })
  })
}

function taroInterceptor(chain) {
  return Taro.request(chain.requestParams);
}

export default {
  tokenInterceptor,
  formDataInterceptor,
  timeoutInterceptor,
  taroInterceptor,

}
