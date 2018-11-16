import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image } from '@tarojs/components';

import './infocard.scss'

import infoCard01 from '../../../assets/img/explain_infocard_01.png'
import infoCard02 from '../../../assets/img/explain_infocard_02.png'
import explainClose from '../../../assets/img/explain_close.png'

export default class Infocard extends Component {

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
      <View className='explain_view_root'>
        <View className='explain_view_content'>
          <Image className='explain_image explain_paddingTop_10' mode='widthFix' src={infoCard01} />
          <Image className='explain_image' mode='widthFix' src={infoCard02} />
          <Text className='explain_text'>红框内为信息卡卡号</Text>
        </View>
        <Image src={explainClose} className='explainClose' onClick={this.closePage.bind(this)} />
      </View>
    );
  }

  closePage=()=>{
    Taro.navigateBack();
  }
}
