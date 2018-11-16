console.log('load dev');
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    BASE_URL: '"http://tcpolice.sxwinstar.net"'
  },
  weapp: {},
  h5: {
    devServer: {
      port: 4200,
      proxy: {
        '/api': {
          target: 'http://192.168.118.86:10001',
          secure: false,
          changeOrigin: true
        },
        '/online':{
          target: 'http://wechat.sxeccellentdriving.com',
          secure: false,
          changeOrigin: true
        }
      }
    }
  }
};
