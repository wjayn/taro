/**
 * Created by Ger on 2018/10/29.
 */

import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image, Text} from '@tarojs/components'
import './login.scss'

import logoPhone from '../../assets/img/logo_phone.png'
import logoVCode from '../../assets/img/logo_vcode.png'
import loginApi from './api'
import global_data from '../../global_data';

export default class login extends Component {


  constructor(props){
    super(props);
    this.state = {
      loginPhoneNo: '',
      loginVerifyCode: '',
      text: '获取验证码',
      count: 60,
      canClick:true,
      randomImage:'',
      imgCode:''
    };
  }

  msgVerifyId = '';

  config = {
    navigationBarTitleText: '登录'
  };
  componentWillMount(){
  }

  componentDidMount () {
    this.checkLogin.bind(this)();
    this.getRandomImage.bind(this)();
  }

  render() {
    return (
      <View className='login_root flex'>
        <View className='login_view_input login_view_top_60 login_view_flex_row' >
          <Image className='login_logo' src={logoPhone} />
          <Input className='login_input login_phoneNo' type='number' placeholder='请输入手机号码' maxLength='11' onInput={this.loginPhoneNoChanged.bind(this)} />
        </View>
        <View className='login_view_input login_view_flex_row'>
          <Image className='login_logo' src={logoVCode} />
          <Input className='login_input' placeholder='请输入图片验证码' maxLength='4' onInput={this.imgCodeChanged.bind(this)} />
          <View className='login_view_countdown'>
            <Image className='pic_verifycode'  src={this.state.randomImage} onClick={this.getRandomImage.bind(this)} mode='widthFix' />
          </View>
        </View>
        <View className='login_view_input login_view_flex_row'>
          <Image className='login_logo' src={logoVCode} />
          <Input className='login_input' type='number' placeholder='请输入验证码' maxLength='6' onInput={this.loginVCodeChanged.bind(this)} />
          <View className='login_view_countdown'>
            <Text className='login_verify_code login_down_text' onClick={this.obtianVCode.bind(this)}>{this.state.text}</Text>
          </View>
        </View>
        <Text className='login_text_white login_text_btn' onClick={this.login.bind(this)}>登录</Text>
      </View>
    );
  }

  checkLogin(user){
    user = user || global_data.get(global_data.KEYS.USER);
    if (!user) {
      return
    }
    if (Taro.getCurrentPages().length > 1){
      Taro.navigateBack();
    }else {
      if(user.driverLicense){
        Taro.redirectTo({url: '/pages/search/approval'});
      }else{
        Taro.redirectTo({url: '/pages/search/uncertified'});
      }
    }
  }


  //获取图片验证码
  getRandomImage =() => {
    Taro.showLoading();
    loginApi.getRandomImage()
      .then((res) => {
        Taro.hideLoading();
        this.setState({
          randomImage: 'data:image/png;base64,' + res.imgBase64,
        });
      }).catch(() => {
      Taro.hideLoading();
    })
  };

  loginPhoneNoChanged(event) {
    this.setState({
      loginPhoneNo: event.target.value
    });
  }

  imgCodeChanged(event){
    this.setState({
      imgCode: event.target.value
    });
  }

  loginVCodeChanged(event){
    this.setState({
      loginVerifyCode: event.target.value
    });
  }


  phoneCheck = (str)=>{
    var telreg= /^1[0-9]{10}/;
    if (telreg.test(str)){
      return true;
    }
    return false;
  }

  loginPhoneNoCheck(){
    if (!this.state.loginPhoneNo){
      Taro.showToast({
        icon: 'none',
        title: '手机号不能为空',
        mask: true
      });
      return false;
    } else {
      if (this.state.loginPhoneNo.length === 11 && this.phoneCheck(this.state.loginPhoneNo)){
        return true;
      } else {
        Taro.showToast({
          icon: 'none',
          title: '请输入正确的手机号',
          mask: true
        });
        return false;
      }
    }
  }

  imgCodeCheck(){
    if(!this.state.imgCode){
      Taro.showToast({
        icon: 'none',
        title: '图片验证码不能为空',
        mask: true
      });
      return false;
    } else {
      if (this.state.imgCode.length !== 4){
        Taro.showToast({
          icon: 'none',
          title: '请输入正确的图片验证码',
          mask: true
        });
        return false
      }
      return true;
    }
  }

  loginVerifyCodeCheck(){
    if (!this.state.loginVerifyCode){
      Taro.showToast({
        icon: 'none',
        title: '验证码不能为空',
        mask: true
      });
      return false;
    } else {
      if (this.state.loginVerifyCode.length !== 6){
        Taro.showToast({
          icon: 'none',
          title: '请输入正确的验证码',
          mask: true
        });
        return false;
      }
    }
    return true;
  }

  obtianVCode  = () => {
    if (this.state.canClick && this.loginPhoneNoCheck() && this.imgCodeCheck()){
      Taro.showLoading();
      loginApi.checkImgCode(this.state.imgCode)
        .then((res)=>{
          Taro.hideLoading();
          this.sendMsgCode(res)
        }).catch(() => {
        Taro.hideLoading();
      })
    }
  };

  sendMsgCode(checkid){
    const data = {
      types: '1',
      autograph: '1',
      appSecret: '1',
      checkId: checkid,
      phoneNumber: this.state.loginPhoneNo
    };
    this.startCountDown();
    Taro.showLoading();
    loginApi.sendMsgCode(data)
      .then((res) => {
        Taro.hideLoading();
        this.msgVerifyId = res;
      }).catch((err) => {
        Taro.hideLoading();
        if (err.code === 'judgeError.message.NotRule') {
          err.message = '手机号码或图片验证码输入错误！';
        }
        Taro.showToast({title: err.message || '网络繁忙，请稍后重试!', icon: 'none'});
    })
  }

  startCountDown=()=>{
    if (this.state.count > 0){
      this.setState({
        text: this.state.count + 's后重新获取',
        count: this.state.count - 1,
        canClick: false
      });
      setTimeout(() => {
        this.startCountDown();
      }, 1000)
    } else {
      this.setState({
        text: '获取验证码',
        count: 60,
        canClick: true
      });
    }
  };

  login = ()=>{
    if (this.loginPhoneNoCheck() && this.loginVerifyCodeCheck()){
      Taro.showLoading();
      loginApi.h5Login(this.msgVerifyId, this.state.loginVerifyCode, this.state.loginPhoneNo)
        .then((user) => {
          Taro.hideLoading();
          this.checkLogin(user);
        }).catch(() => {
        Taro.hideLoading();
      })
    }
  }
}
