/**
 * Created by Qiu on 2018/7/19.
 */
import Taro from '@tarojs/taro'

const globalData = {};

/**
 * key常量
 */
const KEYS = {
  LICENSE: 'license',
  USER: 'user',
  ILLEGAL_LIST: 'illegalList',
  CARS: 'cars'
};

function set (key, val, isStorage=true){
  key = generateTaroKey(key);
  globalData[key] = val;
  if(isStorage){
    Taro.setStorageSync(key, val)
  }
}

function get (key, isStorage=true) {
  key = generateTaroKey(key);
  let value = globalData[key];
  if(!value && isStorage){
    value = Taro.getStorageSync(key);
    globalData[key] = value;
  }
  return value;
}

/**
 * 因为taro 存储格式不同，防止和localStorage key混用
 * @param key
 * @returns {string}
 */
function generateTaroKey(key) {
  return `taro_${key}`;
}


export default {
  get: get,
  set: set,
  KEYS: KEYS,
}
