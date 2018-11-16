import Taro from '@tarojs/taro';
import global_data from '../../global_data';

import Request from '../../base/request/index';

const BindConfig = {
  verifyCodeUrl: `${BASE_URL}/api/v1/traffic-police/illegal/business/sendCcbMsg`,//发送建行验证码
  bindUrl: `${BASE_URL}/api/v1/traffic-police/illegal/business/bindCardInfo`,//绑定交通安全信息卡
};

export default {
  sendMsg: sendMsg,
  bindInfoCard: bindInfoCard,
};

function sendMsg(infoCard, phoneNo) {
  return Request.request({
    url: BindConfig.verifyCodeUrl,
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
    data: {
      'kh': infoCard,
      'sjh': phoneNo
    }
  }).then((res) => {
    return {
      kh: res.kh,
      xh: res.xh
    };
  });
}


function bindInfoCard(infoCard, phoneNo, xh, vCode) {
  return Request.request({
    url: BindConfig.bindUrl,
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
    data: {
      'kh': infoCard,
      'sjh': phoneNo,
      'xh': xh,
      'yzm': vCode
    }
  }).then((res) => {
    let user = global_data.get(global_data.KEYS.USER);
    if (user) {
      user.driverLicense = res.driverLicense;
      global_data.set(global_data.KEYS.USER, user);
    }
    return res.driverLicense;
  });
}
