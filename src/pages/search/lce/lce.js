import Taro, {Component} from '@tarojs/taro';
import {View, Image} from '@tarojs/components';
import query_bg from '../../../assets/img/query_bg.png';
import query_icon from '../../../assets/img/query_icon.png';
import max_query from '../../../assets/img/max_query.png';
import './lce.scss';

export default class LCEView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      loading: false,
      icon: undefined,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    let {error, loading, icon} = this.state;
    let {loadingHint='加载中...'} = this.props;
    let view = null;
    if (error) {
      view = (<View className='error-view' onClick={this.retry}>
        <Image className='error-img' src={icon || max_query} mode='aspectFit' />
        <View className='message'>{error}</View>
        <View className='retry'>点击重试</View>
      </View>);
    }else if(loading) {
      view = (<View className='loading-view'>
        <Image className='query-bg' src={query_bg} mode='aspectFit' />
        <Image className='query-icon' src={query_icon} mode='aspectFit' />
        <View className='query-hint'>{loadingHint}</View>
      </View>);
    }else {
      view = this.props.children;
    }
    return view;
  }

  retry = () => {
    let {onRetry} = this.props;
    if (typeof onRetry === 'function'){
      onRetry();
    }
  };

  showError = (error, icon) => {
    this.setState({
      error: error,
      loading: false,
      icon: icon
    })
  };

  showContent = () => {
    this.setState({
      error: undefined,
      loading: false,
    })
  };

  showLoading = () => {
    this.setState({
      error: undefined,
      loading: true,
    })
  };

  getCurrentStatus = () => {
    return (this.state.loading && 'loading') || (this.state.error && 'error') || 'content'
  }
}

