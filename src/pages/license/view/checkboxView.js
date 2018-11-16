/**
 * Created by Ger on 2018/10/17.
 */

import Taro, {Component} from '@tarojs/taro';
import {View, Image} from '@tarojs/components';

import checked from '../../../assets/img/icon_checkbox_checked.png'
import unCheck from '../../../assets/img/icon_checkbox_uncheck.png'

import './checkboxView.css'

export default class checkboxView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAgree:this.props.isAgree,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      isAgree:nextProps.isAgree,
    })
  }

  render() {
    let checkBoxImg;
    if (this.state.isAgree === 1){
      checkBoxImg = checked
    } else {
      checkBoxImg = unCheck;
    }
    return (
      <View className='checkBox_view_checkbox'>
        <Image className='checkBox_checkbox' src={checkBoxImg} onClick={this.selectSwitch} />
      </View>
    );
  }

  selectSwitch = ()=>{
    this.setState({
      isAgree : Math.abs(this.state.isAgree - 1)
    });
    this.props.onClick();
  }
}
