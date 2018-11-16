import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.scss'
import api from './api';
import utils from '../../utils'
import global from '../../global_data'

/**
 * 违法订单
 */
export default class Index extends Component {

  config = {
    navigationBarTitleText: '违法订单',
    enablePullDownRefresh: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      user: undefined
    };
  }

  componentWillMount() {
    this.loadIllegalOrders.bind(this)()
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    this.setState({
      user: global.get(global.KEYS.USER)
    });
  }

  componentDidHide() {
  }

  render() {
    let {orders, user} = this.state;
    let licenseNo = user && user.driverLicense;
    return (
      <View className='ord_index default-background-color'>
        {/*  提示  */}
        <View className='ord_prompt highlight-color'>
          *&nbsp;若出现违法记录不全，请在5-10分钟后重新查询处理，或可转人工处理：4008-012-122
        </View>

        {/*订单详情*/}
        <View className="ord_details_list">
          {orders.map((item) => {
              const orders = item.orders;
              const ordersIllegal = item.ordersIllegal[0];
              return <View className='ord_details card-bg-color h4-color' key={item.id}>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>{ordersIllegal.plateNumber}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>驾驶员姓名:</Text>
                  <Text className='ord_detail_r_text'>{ordersIllegal.litigant}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>裁决编号:</Text>
                  <Text className='ord_detail_r_text'>{ordersIllegal.serialNumber}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>违法时间:</Text>
                  <Text className='ord_detail_r_text'>{utils.formatTime(ordersIllegal.createdAt)}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>违法地点:</Text>
                  <Text className='ord_detail_r_text'>{ordersIllegal.place}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>违法行为:</Text>
                  <Text className='ord_detail_r_text'>{ordersIllegal.action}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>裁决时间:</Text>
                  <Text className='ord_detail_r_text'>{utils.formatTime(ordersIllegal.awardAt)}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>罚款金额:</Text>
                  <Text className='ord_detail_r_text highlight-color'>{ordersIllegal.penaltyAmount}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>扣分:</Text>
                  <Text className='ord_detail_r_text highlight-color'>{ordersIllegal.dockPoints}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>支付时间:</Text>
                  <Text className='ord_detail_r_text'>{utils.formatTime(orders.payEndTime)}</Text>
                </View>
                <View className='ord_detail_view h2-color'>
                  <Text className='ord_detail_l_text'>订单状态:</Text>
                  <Text className='ord_detail_r_text'>{api.changStatus(ordersIllegal.status, orders.refundStatus, false)}</Text>
                </View>
                <View className='ord_detail_state'>
                  <View className={`ord_origin ${ordersIllegal.status === 2 ? 'red' : ''}`}></View>
                  {api.changStatus(ordersIllegal.status, orders.refundStatus)}
                </View>
              </View>
            }
          )}
        </View>

        {/*  查询按钮  */}
        {!licenseNo && <View className='ord_bot'>
          <View className='ord_btn btn-bg-color btn-color' onClick={this.toBind.bind(this)}>驾驶证认证</View>
        </View>}

      </View>
    )
  }

  /**
   * 查询违法订单详情
   * @param isRefresh
   */
  loadIllegalOrders(isRefresh = false) {
    if (!isRefresh) {
      Taro.showLoading({title: '正在加载违法订单...'});
    }
    api.loadIllegalOrders()
      .then((res) => {
        this.hideLoading(isRefresh);
        this.setState({
          orders: res
        })
      }).catch((error) => {
      this.hideLoading(isRefresh);
      Taro.showToast({title: error.message || '加载违法订单失败', icon: 'none'})
    });
  }

  /**
   * 去认证信息卡
   */
  toBind = () => {
    Taro.navigateTo({
      url: `/pages/license/bind`,
    })
  };

  hideLoading(isRefresh) {
    if (isRefresh) {
      Taro.stopPullDownRefresh();
    } else {
      Taro.hideLoading();
    }
  }

  onPullDownRefresh() {
    this.loadCarIllegalList.bind(this, true)()
  }
}

