import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import policeLogo from '../../assets/img/text_police.png'
import bg from '../../assets/img/bg_home_index.png'
import tongchuanLogo from '../../assets/img/logo_tongchuan.png'

import global_data from '../../global_data';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '铜川公安交警'
  };

  componentWillMount () {
  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goToAdjudged=()=>{
    Taro.navigateTo({
      url:'/pages/verdict/search'
    })
  };

  goToUnAdjudge=()=>{
    if (global_data.get(global_data.KEYS.LICENSE)
      && global_data.get(global_data.KEYS.LICENSE).driverLicense){
      // 有驾驶证信息，且驾驶证处于绑定状态，跳转至此页面
      Taro.navigateTo({
        url:'/pages/search/approval'
      })
    } else {
      // 没有驾驶证信息，或驾驶证未处于绑定状态，跳转至此页面
      Taro.navigateTo({
        url:'/pages/search/uncertified'
      })
    }

  };

  goToCommonProblem=()=>{
    Taro.navigateTo({
      url:'/pages/home/common/problem'
    })
  };

  render () {
    return (
      <View className='index_flex index_root'>
        <Image className='index_root_bg' src={bg} />
        <Image className='index_police_logo' mode='widthFix' src={policeLogo} />
        <View className='index_flex index_view_button'>
          <Text className='index_text_white index_text_btn index_btn_adjudge' onClick={this.goToAdjudged.bind(this)}>已裁决违法缴款</Text>
          <Text className='index_btn_tip index_margin_top_10'>支持铜川市所有简易程序</Text>
          <Text className='index_btn_tip'>（已裁决电子监控）交通违法缴款</Text>
          <Text className='index_text_white index_text_btn index_btn_unadjudge' onClick={this.goToUnAdjudge.bind(this)}>违法自助裁决缴款</Text>
          <Text className='index_common_problem' onClick={this.goToCommonProblem.bind(this)}>常见问题</Text>
        </View>
        <View className='index_flex index_view_buttom'>
          <Image className='logo_tongchuan' src={tongchuanLogo} mode='widthFix' />
          <Text className='index_text_white index_plice_introduce index_margin_top_10'>铜川市公安局交警支队</Text>
          <Text className='index_text_white index_plice_introduce'>客服电话：400-8012122</Text>
        </View>
      </View>
    )
  }
}

