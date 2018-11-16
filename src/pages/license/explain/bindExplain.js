import Taro, {Component, Events} from '@tarojs/taro';
import {View, Text } from '@tarojs/components';
import CheckboxView from '../view/checkboxView'

import './bindExplain.scss'

export default class BindExplain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAgree:this.$router.params.isAgree,
    }
  }

  config = {
    navigationBarTitleText: '驾驶证业务说明'
  }

  render() {
    return (
      <View className='bind_explain_view_root'>
        <Text className='bind_explain_text_content'>
          此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代此处为文字替代
        </Text>
        {this.state.isAgree==0?<View className='bind_explain_view_agree'>
          <CheckboxView onClick={this.agree.bind(this)} isAgree={this.state.isAgree} />
          <Text className='bind_explain_agree'>阅读并同意驾驶证认证业务说明</Text>
        </View>:null}
      </View>
    );
  }

  agree=()=>{
    this.setState({
      isAgree: Math.abs(this.state.isAgree - 1)
    });
    Taro.eventCenter.trigger('agree', 1);
    Taro.navigateBack();
  }

}
