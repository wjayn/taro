import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, Form, Button} from '@tarojs/components';
import api from './api.js'
import './details.scss';
import global_data from '../../global_data';
import utils from '../../utils';
import t_prompt from '../../assets/img/t_prompt.png'
import t_del from '../../assets/img/t_del.png'
import t_select from '../../assets/img/t_select1.png'
import t_unSelect from '../../assets/img/t_unselect1.png'

export default class Details extends Component {
  config = {
    navigationBarTitleText: '违法详情'
  };

  constructor(props) {
    super(props);
    this.state = {
      isPrompt: true,
      illegalList: [],
      identification: undefined,
      totalPrice: 0,
      currentIllegal: undefined,
      isFlag: undefined,
    };
  }

  componentWillMount() {
    let options = this.$router.params;
    let illegalList = global_data.get(global_data.KEYS.ILLEGAL_LIST);
    console.log(options, illegalList);
    let identification;
    if (options.isFlag === '1') {
      identification = `车牌号: ${options.plateNumber}`;
    } else if (options.isFlag === '2') {
      identification = `证件号码: ${options.certificateNumber.substring(0, 6)}****${options.certificateNumber.substring(14)}`;
    } else if (options.isFlag === '3') {
      identification = `裁决书编号: ${options.awardNumber}`
    }
    this.setState({
      illegalList: illegalList,
      isFlag: options.isFlag,
      identification: identification,
    });
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
    let {isPrompt, identification, illegalList, isFlag, totalPrice} = this.state;
    return (
      <View className='ver_det_bigBox'>
        {/*提示内容*/}
        {isPrompt && <View className='ver_det_prompt bg-white'>
          <Image className='prompt_img' src={t_prompt}/>
          <View className='prompt_text'>若出现违法记录不全，请在5-10分钟后重新查询处理，或转人工处理4008-012-122。</View>
          <Image className='prompt_img' onClick={this.onClosePrompt.bind(this)} src={t_del}/>
        </View>}

        {/*违法内容*/}
        <View className='ver_det_content'>
          <View className='ver_det_plate'>
            <Text className='ver_det_plate_text'>{identification}</Text>
          </View>
          {illegalList.map((illegal) => {
            return <View className='ver_det_illegal' key={illegal.id} onClick={this.onSelect.bind(this, illegal)}>
              <View className='illegal_details'>
                {isFlag === 1 ? (<View>
                  <View className='illegal_car illegal_detail_view'><Text className='illegal_details_text'>违法人:</Text>{illegal.litigant}</View>
                  <View className='bg-white illegal_detail_view'><Text className='illegal_details_text'>裁决书编号:</Text>{illegal.awardNumber}</View>
                </View>) : (<View>
                  <View className='illegal_car illegal_detail_view'><Text className='illegal_details_text'>车牌号:</Text>{illegal.plateNumber}</View>
                  <View className='bg-white illegal_detail_view'><Text className='illegal_details_text'>违法人:</Text>{illegal.litigant}</View>
                </View>)}
                <View className='bg-gray illegal_detail_view'><Text className='illegal_details_text'>违法时间:</Text>{utils.formatTime(illegal.createdAt)}
                </View>
                <View className='bg-white illegal_detail_view'><Text className='illegal_details_text'>违法地点:</Text>{illegal.place}</View>
                <View className='bg-gray illegal_detail_view'><Text className='illegal_details_text'>违法行为:</Text>{illegal.action}</View>
                <View className='bg-white illegal_detail_view'><Text className='illegal_details_text'>裁决时间:</Text>{utils.formatTime(illegal.awardAt)}
                </View>
                <View className='bg-gray illegal_detail_view'><Text className='illegal_details_text'>罚款金额:</Text>{illegal.penaltyAmount}元</View>

                {illegal.isLeeFee === 2 && <View className='redText illegal_detail_view'>有滞纳金，不支持在线办理</View>}
                {illegal.isPay && <View className='greenText illegal_detail_view'>缴费成功正在处理，请24小时后查询处理结果</View>}
              </View>
              <Image className='ver_det_select_img' src={illegal.isSelect ? t_select : t_unSelect}/>
              {illegal.isLeeFee !== 2 && <Image className='ver_det_select_img' src={illegal.isSelect ? t_select : t_unSelect}/>}
            </View>;
          })}
          {illegalList.length === 0 && <View className='ver_det_noIllegal'>没有待处理的违法</View>}
        </View>

        {/*合计显示及缴费按钮*/}
        <Form onSubmit={this.onSubmitOrder.bind(this)} reportSubmit='true'>
          {illegalList.length > 0 && <View className='ver_det_bottom_way'>
            <View className='ver_det_total'>合计：
              <Text className='ver_det_mr-50'>￥{totalPrice}</Text>
            </View>
            <Button className='ver_det_payment' formType='submit'>立即缴费</Button>
          </View>}
        </Form>

      </View>
    );
  }

  /**
   * 关闭提示
   */
  onClosePrompt = () => {
    this.setState({
      isPrompt: false
    })
  };

  /**
   * 提交表单，发送表单模板
   * @param e
   */
  onSubmitOrder = e => {
    let {formId} = e.detail;
    this.addOrders(formId);
  };

  /**
   * 选择要处理的违法
   * @param illegal
   */
  onSelect = illegal => {
    if (illegal.isLeeFee === 2) {//有滞纳金不做操作
      return;
    }
    let {illegalList} = this.state;
    illegalList.forEach(val => { //判断选中内容，修改图片
      val.id === illegal.id ? val.isSelect = true : val.isSelect = false;
    });
    this.setState({
      illegalList: illegalList,
      currentIllegal: illegal,
      totalPrice: illegal.penaltyAmount
    });
  };

  /**
   * 添加订单
   * @param formId
   */
  addOrders = formId => {
    let {currentIllegal} = this.state;
    // 判断是否满足处理范围
    if (!currentIllegal) {
      Taro.showToast({title: '请选择要处理的违法', icon: 'loading'});
      return;
    }
    if (currentIllegal.awardNumber.substring(0, 4) !== 6102) {
      Taro.showModal({content: '该笔违法超出自助处理范围，请到交管部门处理', showCancel: false});
      return;
    }
    if (currentIllegal.penaltyAmount >= 1000) {
      Taro.showModal({content: '该笔违法超出自助处理范围，请到交管部门处理', showCancel: false});
      return;
    }

    Taro.showLoading({title: '正在处理...'});
    let {id, certificateType} = currentIllegal;
    api.addOrders(id, certificateType, formId)
      .then((res) => {
        Taro.hideLoading();
        Taro.navigateTo({
          url: `/pages/pay/index?orderNumber=${res.message}`,
        })
      }).catch((error) => {
      Taro.hideLoading();
      if (error.message) {
        Taro.showModal({content: error.message, showCancel: false});
      } else {
        Taro.showToast({title: error.message || '系统当前繁忙', icon: 'loading'});
      }
    });
  };
}

