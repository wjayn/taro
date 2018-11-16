import Request from '../../base/request/index';
import dictionaries from './dictionaries';
import ServerError from '../../base/request/serverError';

function searchByPlateNumber(plateNumber) {
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/plateNumberSearch`,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      'plateNumber': plateNumber
    }
  }).then((res) => {
    let currentTime = new Date().getTime();
    return res.filter((item) => {
      return item.status === 1;
    }).map((item) => {
      if (currentTime - item.awardAt >= 1296000000) {
        item.isLeeFee = 2;
      } else {
        item.isLeeFee = 1;
      }
      return item;
    });
  });
}
function searchByVerdictNo(verdictNo) {
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/awardNumberIllegalSearch`,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      'awardNumber': verdictNo
    },
  });
}
function addOrders(id, certificateType, formId) {
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/addOrders`,
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
    data: {
      'goodsId': id,
      'formId': formId,
      'certificateType': certificateType
    }
  }).catch((err) => {
    let message = dictionaries.add_order_errorMessage[err.code];
    if (message) {
      throw new ServerError(err.code, message);
    }
    throw err;
  });
}

export default {
  searchByPlateNumber,
  searchByVerdictNo,
  addOrders,
}
