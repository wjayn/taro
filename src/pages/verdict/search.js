import Taro, {Component} from '@tarojs/taro';
import {View, Text, Form, Input, Button, Image} from '@tarojs/components';
import api from './api.js'
import global_data from '../../global_data';

import './search.scss'
import t_Logo from '../../assets/img/t_logo.png'

export default class search extends Component {
  config = {
    navigationBarTitleText: '违法查询'
  };

  constructor(props) {
    super(props);
    this.state = {
      verdictNo: ''
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    let {verdictNo} = this.state;
    return (
      <View className='ver_sea_root'>
        {/*查询表单*/}
        <Form className="ver_sea_form_box" onSubmit={this.onSearch.bind(this)}>
          <Input className='ver_sea_massage' onInput={this.onVerdictInputChange.bind(this)} value={verdictNo}
                 placeholder='机动车号牌/处罚决定书编号' maxLength='16' type='text'/>
          <View className='ver_sea_hint btn-color'>
            <Text>支持铜川市所有已裁决需缴费的交通违法缴款</Text>
          </View>
          <Button className='ver_sea_submit btn-color' formType='submit'>查询并缴费</Button>
        </Form>

        {/*底下的logo*/}
        <View className='ver_sea_textPos btn-color'>
          <Image className='ver_sea_img_logo' src={t_Logo}/>
          <View>铜川市公安局交警支队</View>
        </View>

      </View>
    );
  }

  /**
   * 验证表单内容
   */
  onSearch() {
    let {verdictNo} = this.state;
    if (!verdictNo) {
      Taro.showToast({icon: 'loading', title: '请输入信息', duration: 2000});
    } else if (verdictNo.length === 7) {
      this.searchByPlateNumber(verdictNo);
    } else if (verdictNo.length === 8) { // 兼容新能源车
      Taro.showModal({content: '此车请您输入正确的违法编号进行查询处理', showCancel: false});
    } else if (verdictNo.length === 15 || verdictNo.length === 16) {
      this.searchByVerdict(verdictNo.substring(0, 15));
    } else {
      search.showError('输入信息有误');
    }
  }

  /**
   * 表单内容转大写
   * @param e
   */
  onVerdictInputChange(e) {
    this.setState({
      verdictNo: e.detail.value.toUpperCase(),
    })
  }

  /**
   * 车牌号查询
   * @param plateNumber
   */
  searchByPlateNumber(plateNumber) {
    //正则验证车牌号
    if (plateNumber.substring(0, 2) !== "陕B") {
      search.showError('仅支持陕B牌');
      return;
    }
    if (!/^陕B[a-zA-Z0-9]{5}$/.test(plateNumber)) {
      search.showError('请输入正确的车牌号');
      return;
    }

    Taro.showLoading({title: '正在查询...'});
    api.searchByPlateNumber(plateNumber)
      .then((res) => {
        Taro.hideLoading();
        global_data.set(global_data.KEYS.ILLEGAL_LIST, res);
        Taro.navigateTo({
          url: `/pages/verdict/details?isFlag=1&plateNumber=${plateNumber}`,
        })
      }).catch((err) => {
      Taro.hideLoading();
      search.showError(err.message);
    });

  }

  /**
   * 违法编号查询
   * @param verdictNo
   */
  searchByVerdict(verdictNo) {
    if (verdictNo.substring(0, 4) !== 6102) {
      Taro.showModal({content: '该笔违法超出自助处理范围，请到交管部门处理', showCancel: false});
      return;
    }
    Taro.showLoading({title: '正在查询...'});
    api.searchByVerdictNo(verdictNo)
      .then((res) => {
        Taro.hideLoading();
        global_data.set(global_data.KEYS.ILLEGAL_LIST, res);
        Taro.navigateTo({
          url: `/pages/verdict/details?isFlag=3&awardNumber=${verdictNo}`,
        })
      }).catch((error) => {
      Taro.hideLoading();
      search.showError(error.message)
    });
  }

  static showError(error_message) {
    Taro.showToast({
      icon: 'loading',
      title: error_message,
      duration: 2000
    });
  }
}

