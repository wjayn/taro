import Taro, {Component} from '@tarojs/taro';
import {View, Input, Image} from '@tarojs/components';
import ModalCustom from './modal/modal';
import errorCode from './modal/errorCode';
import api from './api';

import './uncertified.scss'
import Verify from './verify/verify';

export default class Uncertified extends Component {
  config = {
    navigationBarTitleText: '违法查询',
    enablePullDownRefresh: true,
  };
  constructor(props) {
    super(props);

    this.state = {
      carNo: '',
      engineNo: '',
      vCode: '',
    }
  }

  //  验证车牌号码
  verifyCarNo = () => {
    let reg = /^[陕]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警]{1}[A-Z0-9]{0,1}$/;
    return reg.test(this.state.carNo);
  };

  // 验证发动机号
  verifyEngineNo = () => {
    let reg = /^[\da-zA-Z]{6}$/;
    return reg.test(this.state.engineNo);
  };

  // 输入框同步到state
  inputCheck = (dataType, event) => {
    let value = event.detail.value;
    if (dataType === 'carNo') {
      value = value.toUpperCase();
    }
    let data = {};
    data[dataType] = value;
    this.setState(data);
  };

  // 过滤数据
  filterData(){
    if (!this.verifyCarNo()) {
      Taro.showToast({
        icon: 'none',
        title: '请输入正确的车牌号码！',
        mask: true
      })
    } else if (!this.verifyEngineNo()) {
      Taro.showToast({
        icon: 'none',
        title: '请输入正确的发动机号！',
        mask: true
      })
    } else if (!this.refs.verify.verify(this.state.vCode)) {
      Taro.showToast({
        icon: 'none',
        title: '验证码错误！',
        mask: true
      })
    } else{
      this.submitQuery();
    }
  };

  // 提交数据
  submitQuery(){
    let {carNo, engineNo} = this.state;
    Taro.showLoading({title: '正在查询车辆...', mask: true});
    api.loadCarIllegalList(carNo, engineNo)
      .then((res) => {
        Taro.hideLoading();
        Taro.navigateTo({
          url: `/pages/search/result?plateNumber=${carNo}&engineNumber=${engineNo}`
        });
      }).catch((err) => {
        Taro.hideLoading();
        let {message, icon} = errorCode.errorCode2Message(err.code, err.message);
        if (icon){
          this.refs.alert.show({message, icon});
        }else{
          Taro.showToast({icon: 'none', title: message||'查询失败', mask: true});
        }

      });
  };

  componentDidMount() {
    this.verifyCarNo();
  }

  componentDidShow() {
    if (this.refs.verify) {
      this.refs.verify.refresh()
    }
  }

  render() {
    return (
      <View className='unCertified'>
        <View className='input-wrap'>
          <View className='input-item input-border-color input-color'>
            <Input type='text' placeholder='车牌号码' placeholder-class='placeholder'
              onInput={this.inputCheck.bind(this, 'carNo')} value={this.state.carNo} />
          </View>
          <View className='input-item input-border-color input-color'>
            <Input type='text' placeholder='请输入发动机号后六位' placeholder-class='placeholder'
              onInput={this.inputCheck.bind(this, 'engineNo')} />
          </View>
          <View className='input-item flex hb vc input-border-color input-color'>
            <Input type='number' maxLength='4' placeholder='请输入验证码' placeholder-class='placeholder'
              onInput={this.inputCheck.bind(this, 'vCode')} />
            <Verify className='verify-pic' ref='verify' />
          </View>
        </View>
        <ModalCustom ref='alert' />
        <View className='prompt highlight-color'>
          *&nbsp;仅限查询交通安全管理部门核发的陕西号牌小型、非营运机动车车辆违法
        </View>
        <View className='bot'>
          <View className='btn btn-bg-color btn-color' onClick={this.filterData.bind(this)}>查询</View>
        </View>
      </View>
    );
  }
}
