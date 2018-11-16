import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'

import './modal.scss'

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    }
  }

  componentDidMount() {
  }

  render() {
    let {isShow, message, icon} = this.state;
    return isShow?<View className='modal' onClick={this.close.bind(this)}>
        <View className='m-wrap'>
          <Image className='img' src={icon} mode='aspectFit'/>
          <View className='text'>{message}</View>
          <View className='btn' onClick={this.confirm.bind(this)}>我知道了</View>
        </View>
      </View>:undefined;
  }

  show = (params) => {
    this.setState({
      ...params,
      isShow: true,
    });
  };
  hide = () => {
    this.onChangeShow(false);
  };

  confirm(){
    this.onChangeShow(false, this.props.confirm);
  };

  close(){
    this.onChangeShow(false, this.props.close);
  };

  onChangeShow(isShow, callback){
    this.setState({
      isShow: isShow
    }, callback);
  }


}
