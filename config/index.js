const config = {
  projectName: 'illegal',
  date: '2018-10-11',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread'
      ]
    },
    typescript: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        baseUrl: '.',
        declaration: false,
        experimentalDecorators: true,
        jsx: 'preserve',
        jsxFactory: 'Nerv.createElement',
        module: 'commonjs',
        moduleResolution: 'node',
        noImplicitAny: false,
        noUnusedLocals: true,
        outDir: './dist/',
        preserveConstEnums: true,
        removeComments: false,
        rootDir: '.',
        sourceMap: true,
        strictNullChecks: true,
        target: 'es6'
      },
      include: [
        'src/**/*'
      ],
      exclude: [
        'node_modules'
      ],
      compileOnSave: false
    }
  },
  defineConstants: {
  },
  copy: {
     patterns: [
    ],
    options: {
    }
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        url: {
          enable: true,
          limit: 10240
        }
      }
    }
  },
  h5: {
    publicPath: '',
    staticDirectory: 'static',
    entry: {
      'app': ['@babel/polyfill', './.temp/app.js'],
    },
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        }
      }
    }
  }
}

module.exports = function (merge) {

  if (process.env.NODE_ENV === 'development') {
    let custom = {};
    if(process.env.npm_lifecycle_script.indexOf('h5') !== -1){
      custom = {defineConstants:{BASE_URL: '""'}}
    }
    return merge({}, config, require('./dev'), custom)
  }
  return merge({}, config, require('./prod'))
}
