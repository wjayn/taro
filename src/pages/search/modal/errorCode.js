import not_allowed from '../../../assets/img/query_not_allowed.png'
import max_limit from '../../../assets/img/max_query.png'

const ERROR_CODE = {
  only_small_vehicle_allowed: {icon: not_allowed},
  operating_vehicle_is_not_allowed: {icon: not_allowed},
  only_local_vehicle_allowed: {icon: not_allowed},
  day_query_limits_frequency: {icon: max_limit}
};

/**
 *
 * 负责将errorCode转换为message  icon 不为空则用modal弹框显示
 */
function errorCode2Message(code, message) {
  let params = ERROR_CODE[code];
  return {
    message,
    ...params,
  }
}

export default {
  errorCode2Message: errorCode2Message
}


