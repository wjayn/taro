import Taro, {Component} from '@tarojs/taro';
import {View, Canvas} from '@tarojs/components';
import './verify.scss'

export default class Verify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: undefined
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    return (
        <View id='verify' className='verify' onClick={this.refresh.bind(this)}>
          <Canvas className='full' canvasId='code'></Canvas>
        </View>
    );
  }

  refresh = () => {
    let randomCode = '';
    while (randomCode.length !== 4){
      randomCode = Math.random().toString();
      if (randomCode.length >= 6){
        randomCode = randomCode.substring(2, 6);
      }
    }
    this.setState({
      code: randomCode
    });
    this.draw(randomCode)
  };

  getCanvas(){
    let context = Taro.createCanvasContext('code', this.$scope);
    if (!context){
      let canvas = document.getElementById('code');
      context = canvas && canvas.getContext('2d');
    }
    if (!context){ // 兼容h5
      let canvas = document.createElement('canvas');
      canvas.id = 'code';
      canvas.width = 80;
      canvas.height = 20;
      canvas.innerHTML = '您的浏览器版本不支持canvas';
      let parent = document.getElementById('verify');
      parent.appendChild(canvas);
      context = canvas.getContext('2d');
    }
    if (context.setTextBaseline){
      context.setTextBaseline('middle');
      context.setFillStyle('white');
      context.setStrokeStyle('white');
      context.setFontSize(16);
    }else{
      context.textBaseline = 'middle';
      context.fillStyle  = 'white';
      context.strokeStyle = 'white';
      context.font = '16px Arial'
    }

    return context;
  }

  draw(code){
    let context = this.getCanvas();
    context.clearRect(0, 0, 80, 20);
    for (let i = 0; i < code.length; i++) {
      let char = code[i];
      let deg = (Math.random() - 0.5) * Math.PI / 4;
      context.translate(10 + (i * 20), 10);
      context.rotate(deg);
      context.fillText(char, 0, 0, 20);
      context.rotate(-deg);
      context.translate(-(10 + (i * 20)), -10);
      context.beginPath();
      context.moveTo(parseInt(Math.random() * 80), parseInt(Math.random() * 20));
      context.lineTo(parseInt(Math.random() * 80), parseInt(Math.random() * 20));
      context.stroke();
    }
    context.draw && context.draw();
  }

  verify = (verifyCode) => {
    let {code} = this.state;
    code = code.toString();
    return code === verifyCode;
  }
}

