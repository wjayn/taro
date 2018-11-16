import Request from '../../base/request/index'

function loadIllegalOrders() {
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/ordersList`,
    method: 'POST',
  });
}

const changStatus = (itemStatus, refundStatus, isOrderStatus = true) => {
  let orderStatus = '';
  let redStatus = '';
  switch (itemStatus) {
    case 0:
      orderStatus = '未处理';
      break;
    case 1:
      orderStatus = '处理成功';
      break;
    case 2:
      if (refundStatus === 0 || refundStatus === 3) {
        redStatus = '处理失败，系统将在3-5个工作日内为您退款';
      } else if (refundStatus === 1) {
        redStatus = '处理失败，已退款';
      } else if (refundStatus === 2) {
        redStatus = '处理失败，退款失败';
      }
      orderStatus = '处理失败';
      break;
    case 3:
      orderStatus = '处理中';
      redStatus = '处理中，请24小时后查看处理结果';
      break;
    default:
      break;
  }
  return isOrderStatus ? orderStatus : redStatus;

};
export default {
  loadIllegalOrders,
  changStatus
}
