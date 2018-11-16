import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image } from '@tarojs/components';

import './success.scss'

import bindSuccess from '../../../assets/img/logo_bind_success.png'
import explainClose from '../../../assets/img/explain_close.png'

export default class Success extends Component {

  constructor(props) {
    super(props);
  }

  config = {
    navigationBarTitleText: '驾驶证认证'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  render() {
    return (
      <View className='success_view_root'>
        <View className='success_view_content'>
          <Image className='success_image' src={bindSuccess} />
          <Text className='success_text'>认证成功</Text>
          <View className='success_view_btn' onClick={this.dealOIllegal.bind(this)}>
            <Text className='success_btn'>去处理违法</Text>
          </View>
        </View>
        <Image src={explainClose} className='explainClose' onClick={this.closePage.bind(this)} />
      </View>
    );
  }

  dealOIllegal=()=>{
    Taro.redirectTo({
      url: '/pages/search/approval'
    })
  }

  closePage=()=>{
    Taro.navigateBack();
  }
}
