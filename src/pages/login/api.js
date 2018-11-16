import Taro from '@tarojs/taro';
import global_data from '../../global_data';
import Request from '../../base/request/index';

const LoginApiConfig = {
  getRandomImageUrl: `${BASE_URL}/online/api/v3/smsSend/getRandomCode`,//获取图片验证码
  checkImgCode: `${BASE_URL}/online/api/v3/smsSend/checkImgCode?validateCode=`,//验证图片验证码
  sendMsgCodeUrl: `${BASE_URL}/online/api/v3/smsSend`,//发送短信验证码
  loginUrl: `${BASE_URL}/api/v1/traffic-police/illegal/business/login`,//登录
};

export default {
  getRandomImage: getRandomImage,
  checkImgCode: checkImgCode,
  sendMsgCode: sendMsgCode,
  h5Login: h5Login,
  loginJudge: loginJudge,
};

function getRandomImage() {
  return Request.request({
    url: LoginApiConfig.getRandomImageUrl,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    dataType: '',
    responseType: 'arraybuffer'
  }).then((res) => {
    return {
      checkId: res.header.checkid,
      imgBase64: Taro.arrayBufferToBase64(new Uint8Array(res.data))
    };
  });
}

function checkImgCode(imgCode) {
  return Request.request({
    url: LoginApiConfig.checkImgCode + imgCode,
    method: 'GET'
  }).then((res) => {
    return res.data.checkId;
  });
}

function sendMsgCode(params) {
  return Request.request({
    url: LoginApiConfig.sendMsgCodeUrl,
    data: {
      'checkId': params.checkId,
      'phoneNumber': params.phoneNumber,
      'types': params.types,
      'autograph': params.autograph,
      'appSecret': params.appSecret,
    },
    method: 'POST'
  }).then((res) => {
      return res.text;
  });
}


function h5Login(msgVerifyId, loginVerifyCode, loginPhoneNo) {
  return Request.request({
    url: LoginApiConfig.loginUrl,
    header: {
      'content-type': 'application/json'
    },
    data: JSON.stringify({
      'verifySerial': msgVerifyId,
      'verify': loginVerifyCode,
      'mobile': loginPhoneNo,
    }),
    method: 'POST',
  }).then((user) => {
    user = {
      token_id: user.token,
      driverLicense: user.bindCard,
      mobile: loginPhoneNo
    };
    global_data.set(global_data.KEYS.USER, user);
    return user;
  });
}

function loginJudge() {
  let user = global_data.get(global_data.KEYS.USER);
  if (!user || !user.token_id) {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      //todo 微信登录
    }else {
      Taro.navigateTo({
        url: '/pages/login/login'
      });
    }
  }
}
