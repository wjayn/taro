import Taro, { Component } from '@tarojs/taro'
import { View,Text, Image, ScrollView } from '@tarojs/components'

import './problem.scss'

import pic_01 from '../../../assets/img/pic_01.jpg'
import pic_02 from '../../../assets/img/pic_02.jpg'

export default class Problem extends Component {

  constructor(props){
    super(props);
    this.state= {
      currentIndex: 0
    }
  }

  config = {
    navigationBarTitleText: '常见问题'
  };


  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {

    let adjudgedStyle = this.state.currentIndex === 0? 'problem_btn_select':'problem_btn_unselect';
    let unAdjudgedStyle = this.state.currentIndex === 1? 'problem_btn_select':'problem_btn_unselect';
    let adjudgedContent = this.state.currentIndex === 0?'problem_contentShow':'problem_contentHiden';
    let unAdjudgedContent = this.state.currentIndex === 1?'problem_contentShow':'problem_contentHiden';
    return (
      <View className='problem_content problem_flex'>
        <View className='problem_view_btn'>
          <Text className={adjudgedStyle} onClick={this.tabChoiced.bind(this, 0)}>已裁决违法处理</Text>
          <Text className={unAdjudgedStyle} onClick={this.tabChoiced.bind(this, 1)}>未裁决违法处理</Text>
        </View>
        <ScrollView className='problem_view_content'>
          <View className={adjudgedContent}>
            <View className='b'>1.关于小程序专用二维码的使用注意事项：</View>
            <View>小程序二维码有两种：</View>
            <View>（1）方形二维码：对微信版本没有限制，目前用户手机中的微信版本基本上都能扫描识别。</View>
            <View>（2）圆形二维码：此二维码仅供微信6.5.7以上版本使用；如果扫描后无法识别，请将微信升级至最新版本。</View>
            <View className='problem_img_view'>
              <Image className='problem_image' mode='widthFix' src={pic_01} />
              <Image className='problem_image' mode='widthFix' src={pic_02} />
            </View>
            <View className='b'>2.关于小程序在线缴费的注意事项及常见问题：</View>
            <View>（1）小程序在线缴费办理的时间为8:00-18:00；其它时间为系统维护时间，暂停在线缴费；</View>
            <View>（2）办理大厅裁决完成后，有可能出现查询不到已裁决违法记录的情况，用户可以稍候再进行查询缴费；</View>
            <View>（3）用户使用小程序缴费后，有可能出现违法记录依然未解锁的情况，用户可以24时后再进行查询；</View>
            <View>（4）目前小程序缴费仅适用于2018年2月1日之后完成裁决的违法；</View>
            <View>（5）目前小程序仅支持车牌号码或处罚决定书编号查询，建议用户优先使用处罚决定书编号查询。</View>
          </View>
          <Text className={unAdjudgedContent}>显示：未裁决违法处理
            显示 未裁决违法处理
            显示 未裁决违法处理
            显示 未裁决违法处理
            显示 未裁决违法处理
            显示 未裁决违法处理</Text>
        </ScrollView>
      </View>
    )
  }

  tabChoiced = (id)=>{
    this.setState({
      currentIndex : id
    });
  }
}
