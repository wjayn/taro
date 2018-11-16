import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Button, Icon, Image} from '@tarojs/components'
import LCEView from './lce/lce'
import global from '../../global_data'
import api from './api'
import utils from '../../utils'
import './result.scss'
import ModalCustom from './modal/modal';
import car_office from '../../assets/img/car_office.png'
import illegal from '../../assets/img/illegal_time.png'
import errorCode from './modal/errorCode';

/**
 * 违法详情页面
 * url: /pages/search/result?plateNumber=陕xxx&engineNumber=xxx
 */
export default class Result extends Component {

  config = {
    navigationBarTitleText: '违法详情',
    enablePullDownRefresh: true,
  };

  constructor(props) {
    super(props);
    let {params = {}} = this.$router;
    this.state = {
      user: undefined,
      plateNumber: params.plateNumber,
      engineNumber: params.engineNumber,
      illegalList: undefined
    };
  }

  componentWillMount () { }

  componentDidMount () {
    this.loadCarIllegalList.bind(this)()
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.updateUserInfo();
    this.errorRetry();
  }

  componentDidHide () { }

  updateUserInfo(){
    this.setState({
      user: global.get(global.KEYS.USER)
    });
  }

  errorRetry(){
    if (this.refs.lceView && this.refs.lceView.getCurrentStatus() === 'error'){
      this.loadCarIllegalList(true);
    }
  }

  loadCarIllegalList(isRefresh=false) {
    if(!isRefresh){
      this.refs.lceView.showLoading();
    }
    api.loadCarIllegalList(this.state.plateNumber, this.state.engineNumber)
      .then((res) => { //违法排序分类
        let hintIndex = null;
        if (res && res.forEach){
          let handleIllegal = [], unhandleIllegal = [];
          res.forEach((item, index) => {
            if(item.canHandle === 0){
              handleIllegal.push(item);
            }else{
              hintIndex = hintIndex || index;
              unhandleIllegal.push(item);
            }
          });
          res = handleIllegal.concat(unhandleIllegal);
        }
        return {illegalList: res, hintIndex: hintIndex}
      }).then((res) => {
        if(isRefresh){
          Taro.stopPullDownRefresh();
        }else{
          this.refs.lceView.showContent();
        }
        this.setState({
          ...res
        })
      }).catch((error) => {
      let {message, icon} = errorCode.errorCode2Message(error.code, error.message);
        if(isRefresh){
          Taro.stopPullDownRefresh();
          Taro.showToast({title: message || '加載车辆违法失败', icon:'none'})
        }else{
          this.refs.lceView.showError(message || '加載车辆违法失败', icon)
        }
    });
  }



  render () {
    let {user, plateNumber, illegalList=[], hintIndex} = this.state;
    let licenseNo = user && user.driverLicense;
    return (
      <LCEView ref='lceView' onRetry={this.loadCarIllegalList.bind(this)} loadingHint='正在加載车辆违法...'>
        <View className='search-result-bg default-background-color'>

          {!licenseNo && <View className='search-result-top-hint highlight-color'>*您还未认证驾驶证信息，认证后可在线处理违法</View>}
          <View className='search-result-header h2-color'>
            <View className='search-result-list-header'>{plateNumber}</View>
            {user && <View className='search-result-user-view'>当前账号:{utils.formatLast4Number(user.mobile)}
              <Text className='search-result-switch-user'>切换账号</Text></View>}
          </View>

          {illegalList.map((item, index) =>
            <Form key={item.id} onSubmit={this.onConsumeIllegal.bind(this, item)}>
              {index === hintIndex && (<View className='search-result-item-alert highlight-color'>*以下违法不支持线上处理，请至线下窗口办理</View>)}
              <View className='search-result-item-bg'>
                <View className='search-result-item-header h6-color'>
                  <View className='row-align-center'>
                    <Image className='illegal-time' src={illegal} mode='aspectFit'/>
                    {item.createdAtStr}</View>
                  <View className='row-align-center'>
                    <Icon className={`status-tip status-${item.status}`}/>
                    {this.getIllegalStatus(item.status)}</View>
                </View>
                <View className='search-result-details h6-color'>地点：{item.place}</View>
                <View className='search-result-details h6-color'>违法详情：{item.action}</View>
                <View className='search-result-details h6-color flex'>扣分：<View
                  className='highlight-color'>{item.dockPoints}分</View></View>
                <View className='search-result-details h6-color flex'>罚金：<View
                  className='highlight-color'>{item.penaltyAmount}元</View></View>
                {licenseNo && (item.canHandle === 0 ?
                  <Button className='search-result-process-btn primary-color' formType='submit'>立即处理</Button> :
                  <Button className='search-result-process-btn h8-color search-result-disabled-process'
                    formType='submit'>不支持线上处理</Button>)}
              </View>
            </Form>
          )}
          {licenseNo?<View className='search-result-bottom-btn' onClick={this.onQueryMyIllegalOrder.bind(this)}>违法处理订单</View>:
            <View className='search-result-bottom-btn' onClick={this.onLicenseAuth.bind(this)}>驾驶证认证</View>}
          <ModalCustom ref='alert' />
        </View>
      </LCEView>
    )
  }

  onQueryMyIllegalOrder(){
    Taro.navigateTo({url: '/pages/order/index'});
  }

  onLicenseAuth(){
    Taro.navigateTo({url: '/pages/license/bind'});
  }

  onPullDownRefresh(){
    this.loadCarIllegalList.bind(this, true)()
  }
  getIllegalStatus(status){
    let statusHint;
    switch (status) {
      case 0:
        statusHint = '未裁决未缴费';
        break;
      case 1:
        statusHint = '已裁决未缴费';
        break;
      case 2:
        statusHint = '已裁决已缴费';
        break;
    }
    return statusHint;
  }

  onConsumeIllegal(illegalGoods, e){
    let {formId} = e.detail;
    let {license: {driverLicense}} = this.state;
    if (illegalGoods.canHandle === 0){
      Taro.showLoading({ title: '正在处理...'});
      api.consumeIllegal(illegalGoods.id, driverLicense, 'A', formId)
        .then((res) => {
          Taro.hideLoading();
          Taro.navigateTo({url: `/pages/pay/index?orderNumber=${res.id}`});
        }).catch((error) => {
          Taro.hideLoading();
          Taro.showToast({title: error.message || '处理失败', icon:'none'})
        });
    }else{
      this.refs.alert.show({message: '当前违法不支持线上处理, 请至线下交管所办理业务', icon: car_office});
    }
  }


}

