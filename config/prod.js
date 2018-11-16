const chunk = 'chunk';
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    BASE_URL: '"https://mobile.sxwinstar.net/wechat_access"'
  },
  weapp: {},
  h5: {
    chunkDirectory: chunk,
    miniCssExtractPluginOption: {
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    },
    webpackChain (chain, webpack) {
      chain.merge({
        output: {
          filename: '[name].[contenthash].js',
          chunkFilename: `${chunk}/[id].[contenthash].js`,
        }
      })
    }
  }
};
