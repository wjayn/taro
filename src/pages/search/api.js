import Global from '../../global_data'
import ServerError from '../../base/request/serverError';
import Request from '../../base/request/index.js';

function loadCarIllegalList(plateNumber, engineNumber) {
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/illegalsPlateNumberSearch`,
    method: 'GET',
    data: {
      'plateNumber': plateNumber,
      'engineNumber': engineNumber
    }
  });
}
function loadUserCars() {
  let user = Global.get(Global.KEYS.USER);
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/getBindVehicles`,
    method: 'POST',
  });
}

function loadUserCarIllegalTotal() {
  return loadUserCars()
    .then((cars) => {
      if (!cars || cars.length === 0)
        return cars;
      return cars.map(async (car) => {
        const illegalList = await loadCarIllegalList(car.plateNumber, car.engineNumber);
        illegalList.forEach((item, index) => {
          car.illegalCount = 0;
          car.illegalBuckle = 0;
          car.illegalPrice = 0;
          if(item.status !== 2){
            car.illegalCount++;
            car.illegalPrice += item.penaltyAmount;
            car.illegalBuckle += item.dockPoints;
          }
        });
        return car
      })
    })
}

function consumeIllegal(goodsId, certificateNumber, certificateType, formId) {
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/addOrders`,
    method: 'POST',
    header: {'Content-Type': 'application/json'},
    data:{
      goodsId: goodsId,
      certificateNumber: certificateNumber,
      certificateType: certificateType,
      formId: formId
    }
  });
}

function loadLicense(id) {
  return Request.request({
    url: `${BASE_URL}/api/v1/traffic-police/illegal/business/findCertificateInfo`,
    data:{
      certificate: id,
    }
  });
}

export default {
  loadCarIllegalList,
  loadUserCarIllegalTotal,
  consumeIllegal,
  loadLicense
}
