import Global from '../../global_data'
import Request from '../../base/request/index'


function payment(orderNumber) {
  let user = Global.get(Global.KEYS.USER);
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/payment`,
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
    data: {
      "orderId": orderNumber,
      "minOpenId": user && user.open_id
    }
  }).then((res) => {
    return JSON.parse(res);
  });
}
function hPayment(orderNumber, payWay) {
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/h5payment`,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      "orderId": orderNumber,
      "subWay": payWay
    }
  });
}

export default {
  payment,
  hPayment
}
