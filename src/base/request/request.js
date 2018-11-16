import Interceptor from './interceptor';
import Chain from './chain'

class Request{

  constructor(interceptors = [Interceptor.tokenInterceptor, Interceptor.taroInterceptor]){
    console.log('generate request instance');
    this.chain = new Chain(null, interceptors, 0)
  }

  request(requestParams){
    let contentType = requestParams.header && (requestParams.header['content-type']
      || requestParams.header['Content-Type']);
    if (!contentType){
      requestParams.header = {'content-type': 'application/x-www-form-urlencoded'}
    }
    return this.chain.proceed({method: 'GET', ...requestParams})
  }

  addInterceptors(interceptor){
    this.chain.interceptors.unshift(interceptor)
  }
}

export default Request
