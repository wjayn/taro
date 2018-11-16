import Taro, { Component } from '@tarojs/taro'
import Index from './pages/home/index'

import './app.scss'

import global_data from './global_data'

class App extends Component {

  config = {
    pages: [
      'pages/home/index',
      'pages/login/login',
      'pages/home/common/problem',
      'pages/license/bind',
      'pages/license/explain/bindExplain',
      'pages/license/explain/infocard',
      'pages/license/result/success',
      'pages/search/uncertified',
      'pages/search/approval',
      'pages/search/result',
      'pages/order/index',
      'pages/pay/index',
      'pages/verdict/search',
      'pages/verdict/details'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '建行违法小程序',
      navigationBarTextStyle: 'black'
    }
  };

  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  componentDidMount () {
  }

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'));
