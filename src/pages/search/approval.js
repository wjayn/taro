import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image} from '@tarojs/components';
import api from './api';
import car_icon from '../../assets/img/car.png'
import more from '../../assets/img/more.png'
import license_icon from '../../assets/img/license.png'
import './approval.scss'
import global_data from '../../global_data';

export default class Approval extends Component {
  config = {
    navigationBarTitleText: '违法查询',
    enablePullDownRefresh: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      license: undefined,
      cars: undefined
    }
  }


  componentDidMount() {
    this.loadMyLicense.bind(this)();
    this.loadCars.bind(this)();
  }

  render() {
    let {license, cars} = this.state; // todo 缺少车主姓名、驾驶证有效期、累计积分
    return (
      <View className='approval default-background-color'>
        {license && <View className='card-box card-default-color card-bg-color' >
          <View className='caption flex card-caption-color'>
            <Image src={license_icon} className='icon' />
            <Text>驾驶证</Text>
          </View>
          <View className='info'>
            <View className='flex item'>
              <View className='label'>姓名:</View>
              <View className='val'>{license.name}</View>
            </View>
            <View className='flex item'>
              <View className='label'>驾驶证号:</View>
              <View className='val'>{license.driverLicense}</View>
            </View>
            <View className='flex item'>
              <View className='label'>有效期至:</View>
              <View className='val'>{license.replaceDate}</View>
            </View>
            <View className='flex hb item'>
              <View className='flex'>
                <View className='label'>累计积分:</View>
                <View className='val color-d83734'>{license.totalDockPoints}分</View>
              </View>
              <View className='flex'>
                <View className='label'>剩余分数:</View>
                <View className='val color-d83734'>{12 - (license.totalDockPoints || 0)}分</View>
              </View>
            </View>
          </View>
        </View>}
        {cars && cars.map((car, index) => (<View key={index} className='card-box car card-default-color card-bg-color'>
          <View className='caption flex hb card-caption-color'>
            <View className='flex hc'>
              <Image src={car_icon} className='icon' />
              <Text>机动车</Text>
            </View>
            <View className='detail flex hc more-color' onClick={this.queryCar.bind(this)}>
              <Image className='ico' src={more}/>
              <Text>详情查询</Text>
            </View>
          </View>
          <View className='info'>
            <View className='flex hb ve first'>
              <View className='carNo'>{car.plateNumber}</View>
              <View className='flex name'>
                <View className='label'>姓名:</View>
                <View className='val'>{car.name}</View>
              </View>
            </View>
            <View className='flex ha second'>
              <View>总条数<View className='color-d83734'>{car.illegalCount}条</View>
              </View>
              <View>总记分<View className='color-d83734'>{car.illegalBuckle}分</View>
              </View>
              <View>总金额<View className='color-d83734'>{car.illegalPrice}元</View>
              </View>
            </View>
          </View>
        </View>))}
        <View className='bot'>
          <View className='btn btn-bg-color btn-color' onClick={this.queryOtherCar.bind(this)}>
            {cars && cars.length > 0?'查询其他车辆':'机动车违法查询'}</View>
        </View>
      </View>
    );
  }
  queryCar(){
    let {car} = this.state;
    if (car){
      Taro.navigateTo({
        url: `/pages/search/result?plateNumber=${car.plateNumber}&engineNumber=${car.engineNumber}`
      });
    }else{
      this.queryOtherCar();
    }
  }

  loadCars(){
    this.setState({
      cars: global_data.get(global_data.KEYS.CARS)
    });
    api.loadUserCarIllegalTotal()
      .then((cars) => {
        this.setState({
          cars: cars
        });
        global_data.set(global_data.KEYS.CARS, cars)
      });
  }

  loadMyLicense() {
    this.setState({
      license: global_data.get(global_data.KEYS.LICENSE)
    });
    api.loadLicense()
      .then((res) => {
        this.setState({
          license: res
        });
        global_data.set(global_data.KEYS.LICENSE, res)
      })
  }

  queryOtherCar(){
    Taro.navigateTo({
      url: '/pages/search/uncertified'
    });
  }
}
