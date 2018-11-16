import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import './index.scss'
import api from './api'
import t_select from '../../assets/img/t_select.png'
import t_unSelect from '../../assets/img/t_unselect.png'
import ccbImg from '../../assets/img/jian.png'
import WeChatImg from '../../assets/img/wei.png'

const PAY_TYPE = {
  WE_PAY: {way: '微信支付', select: true, src: WeChatImg},
  CCB_PAY: {way: '建行支付', select: false, src: ccbImg}
}


export default class Index extends Component {
  config = {
    navigationBarTitleText: '确认支付',
    enablePullDownRefresh: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      payWay: [],
      orderNumber: undefined,
    };
  }

  componentWillMount() {
    let options = this.$router.params;
    this.setState({
      orderNumber: options.orderNumber,
    })
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      this.setState({
        payWay: [PAY_TYPE.WE_PAY]
      })
    } else {
      this.setState({
        payWay: [PAY_TYPE.CCB_PAY]
      })
    }
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    let {payWay, payForm} = this.state;
    return (
      <View className='pay_index'>
        {/*支付方式*/}
        <View className='pay_way h4-color'>
          {payWay.map((way) => {
              return <View className='pay_w' onClick={this.selectPayWay.bind(this, way)} key={way.way}>
                <Image className='ver_det_logo_img' src={way.src}/>
                {way.way}<Image className='ver_det_select_img' src={way.select ? t_select : t_unSelect}/>
              </View>
            })}
        </View>
        {/*  查询按钮  */}
        <View className='ord_bot'>
          <View className='ord_btn btn-bg-color btn-color' onClick={this.toPay.bind(this)}>立即支付</View>
        </View>

      </View>
    )
  }


  /**
   * 判断支付方式
   */
  toPay = () => {
    const {payWay} = this.state;
    const way = payWay.filter(val => val.select === true);
    if (process.env.TARO_ENV === 'weapp') {
      this.payment();
    } else {
      this.hPayment(way[0].way);
    }
  };
  /**
   * 小程序支付
   */
  payment = () => {
    const {orderNumber} = this.state;
    Taro.showLoading({title: '正在支付...'});
    api.payment(orderNumber)
      .then((res) => {
        Taro.requestPayment({
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign
        }).then(() => {
          Taro.hideLoading();
          Taro.navigateBack()
        });
      }).catch((error) => {
      Taro.hideLoading();
      Taro.showToast({title: error.message || '提交失败', icon: 'none'})
    });
  };
  /**
   * h5支付
   * @param payWay
   */
  hPayment = (payWay) => {
    const {orderNumber} = this.state;
    Taro.showLoading({title: '正在支付...'});
    api.hPayment(orderNumber, payWay)
      .then((res) => {
        Taro.hideLoading();
        document.documentElement.innerHTML = res;
        setTimeout(() => {
          document.jhform.submit();
        }, 500)
      }).catch((error) => {
      Taro.hideLoading();
      Taro.showToast({title: error.message || '提交失败', icon: 'none'})
    });
  };

  /**
   * 选择支付方式
   * @param way
   */
  selectPayWay = (way) => {
    const {payWay} = this.state;
    payWay.forEach(val => {
      val.way === way.way ? val.select = true : val.select = false;
    });
    this.setState({
      payWay: payWay
    })
  }
}
