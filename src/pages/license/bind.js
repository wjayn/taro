import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, Input} from '@tarojs/components';

import './bind.scss'
import CheckboxView from './view/checkboxView'
import logoCard from '../../assets/img/logo_card.png'
import logoPhone from '../../assets/img/logo_phone.png'
import logoVCode from '../../assets/img/logo_vcode.png'
import iconDoubt from '../../assets/img/icon_card_doubt.png'
import bindApi from './bindApi'

export default class Bind extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAgree:0,
      infoCard:'',
      phoneNo:'',
      verifyCode:'',
      text: '获取验证码',
      count: 60,
      canClick:true
    }
    Taro.eventCenter.on('agree', (args)=>{
      this.setState({
        isAgree:args
      });
    })
    Taro.eventCenter.on('obtainVerifyCode', (args)=>{
      console.log('obtain', '验证码获取：' + args);
    })
  }

  xh='';

  config = {
    navigationBarTitleText: '驾驶证认证'
  }


  render() {
    return (
      <View className='bind_view_root'>
        <View className='bind_view_input bind_view_top_60 bind_view_flex_row'>
          <Image className='bind_logo' src={logoCard} />
          <Input className='bind_input' placeholder='信息卡卡号' type='number' placeholderTextColor='#F2F2F2' maxLength='18' onInput={this.infoCardChanged.bind(this)} />
          <Image src={iconDoubt} className='bind_explain_logo' onClick={this.gotoInfocardExplain.bind(this)} />
        </View>
        <View className='bind_view_input bind_view_flex_row'>
          <Image className='bind_logo' src={logoPhone} />
          <Input className='bind_input' type='number' placeholder='信息卡手机号后四位' maxLength='11' onInput={this.phoneNoChanged.bind(this)} />
        </View>
        <View className='bind_view_input bind_view_flex_row'>
          <Image className='bind_logo' src={logoVCode} />
          <Input className='bind_input' type='number' placeholder='验证码' maxLength='6' onInput={this.verifyCodeChanged.bind(this)} />
          <View className='bind_view_countdown'>
            <Text className='bind_count_down_text' onClick={this.obtainVerifyCode.bind(this)}>{this.state.text}</Text>
          </View>
        </View>
        <View className='bind_view_top_110 bind_view_flex_row bind_justify_content_center'>
          <CheckboxView className='bind_checkbox' isAgree={this.state.isAgree}  onClick={this.switchAgree.bind(this)} />
          <Text className='bind_text_26 '>阅读并同意</Text>
          <Text className='bind_text_26 bind_text_2F4E87 bind_text_underline' onClick={this.gotoBindExplain.bind(this)}>驾驶证认证业务说明</Text>
        </View>
        <View className='bind_view_tip'>
          <Text className='bind_text_tip bind_text_D83734 bind_text_26'>*请绑定本人的交通安全信息卡</Text>
        </View>
        <View className='bind_view_btn'>
          <Text className='bind_btn_text bind_btn_sure' onClick={this.bindInfoCard.bind(this)}>确定</Text>
          <Text className='bind_btn_text bind_btn_apply' onClick={this.gotoApplyCard.bind(this)}>申办信息卡</Text>
        </View>
      </View>
    );
  }

  gotoInfocardExplain(){
    Taro.navigateTo({
      url:'/pages/license/explain/infocard'
    })
  }

  gotoBindExplain(){
    Taro.navigateTo({
      url:'/pages/license/explain/bindExplain?isAgree=' + this.state.isAgree,
    })
  }

  switchAgree(){
    this.setState({
      isAgree:Math.abs(this.state.isAgree-1)
    })
  }

  infoCardChanged(event){
    this.setState(
      {
        infoCard:event.target.value
      }
    )
  }

  phoneNoChanged(event){
    this.setState(
      {
        phoneNo:event.target.value
      }
    )
  }

  verifyCodeChanged(event){
    this.setState(
      {
        verifyCode:event.target.value
      }
    )
  }

  bindInfoCardCheck(){
    if (this.state.infoCard){
      return true;
    }
    Taro.showToast({
      icon: 'none',
      title: '请输入正确的交通安全信息卡卡号',
      mask: true
    });

    return false;
  }

  bindPhoneNoCheck(){
    if (!this.state.phoneNo){
      Taro.showToast({
        icon: 'none',
        title: '手机号后四位不能为空',
        mask: true
      });
      return false;
    }
    if (this.state.phoneNo.length !== 4 ){
      Taro.showToast({
        icon: 'none',
        title: '请输入正确的手机号后四位',
        mask: true
      });
      return false;
    }
    return true;
  }

  bindVerifyCodeCheck(){
    if (this.state.verifyCode && this.state.verifyCode.length === 6){
      return true;
    }
    Taro.showToast({
      icon: 'none',
      title: '请输入正确的验证码',
      mask: true
    });
    return false;
  }

  startCountDown=()=>{
    if (this.state.count > 0){
      this.setState({
        text:this.state.count + 's后重新获取',
        count:this.state.count -1,
        canClick: false
      });
      setTimeout(() => {
        this.startCountDown();
      }, 1000)

    } else {
      this.setState({
        text:'获取验证码',
        count:60,
        canClick:true
      });
    }
  }

  obtainVerifyCode=()=>{
    if (!this.state.canClick){
      return false;
    }
    if (!this.bindPhoneNoCheck()){
      return false;
    }
    Taro.showLoading();
    bindApi.sendMsg(this.state.infoCard, this.state.phoneNo)
      .then((res)=>{
      Taro.hideLoading();
        this.startCountDown();
        this.xh = res.xh
      }).catch(() => {
      Taro.hideLoading();
    })
  }

  bindInfoCard=()=>{
    if (!this.state.isAgree){
      Taro.showToast({
        icon: 'none',
        title: '请阅读并同意《驾驶证认证业务说明》',
        mask: true
      });
      return
    }
    if (this.bindInfoCardCheck() && this.bindPhoneNoCheck() && this.bindVerifyCodeCheck()){
      Taro.showLoading();
      bindApi.bindInfoCard(this.state.infoCard, this.state.phoneNo, this.xh, this.state.verifyCode)
        .then((res)=>{
        Taro.hideLoading();
          if (res.driverLicense && res.status === 2){
            Taro.navigateTo({
              url:'./result/success'
            })
          }
        }).catch(() => {
        Taro.hideLoading();
      })
    }
  }

  gotoApplyCard=()=>{
    alert('申请交通安全信息卡')
  }

}
