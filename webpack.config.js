const path = require('path');
const webpack = require('webpack');
const typescript = require('typescript');
const { AotPlugin } = require('@ngtools/webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const rules = [
  { test: /\.html$/, loader: 'html-loader' },
  { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
  { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader' },
  {
    test: /\.css$/,
    exclude: root('src', 'app'),
    loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader']})
  },
  // all css required in src/app files will be merged in js files
  {test: /\.css$/, include: root('src', 'app'), loader: 'raw-loader'},

  // support for .scss files
  // use 'null' loader in test mode (https://github.com/webpack/null-loader)
  // all css in src/style will be bundled in an external css file
  {
    test: /\.(scss|sass)$/,
    exclude: root('src', 'app'),
    loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader']})
  },
  // all css required in src/app files will be merged in js files
  {test: /\.(scss|sass)$/, exclude: root('src', 'style'), loader: 'raw-loader!sass-loader'},
  
  /* File loader for supporting fonts, for example, in CSS files. */
  {
    test: /\.(eot|woff2?|woff?|svg|ttf?)([\?]?.*)$/,
    use: 'file-loader'
  }
];

const plugins = [
  
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new ExtractTextPlugin({filename: 'css/[name].[hash].css'}),
  new HtmlWebpackPlugin({
    template: './index.html',
    chunksSortMode: 'dependency',
    extraFiles: {
      'styles_css': 'styles.css'
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module) => module.context && /node_modules/.test(module.context)
  })
];

if (process.env.NODE_ENV === 'production') {
  rules.push({
    test: /\.ts$/, loaders: ['@ngtools/webpack']
  });
  plugins.push(
    new AotPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: 'src/app/app.module#AppModule'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true
      },
      compress: {
        unused: true,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        drop_console: true,
        sequences: true,
        booleans: true,
        screw_ie8: true,
        warnings: false
      },
      comments: false
    })
  );
} else {
  rules.push({
    test: /\.ts$/,
    loaders: [
      'awesome-typescript-loader', 'angular-router-loader', 'angular2-template-loader'
    ]
  });
  plugins.push(
    new webpack.NamedModulesPlugin(),
    new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, path.resolve(__dirname, './notfound'))
  );
}

module.exports = {
  cache: true,
  context: __dirname,
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    stats: {
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      errors: true,
      errorDetails: false,
      hash: false,
      timings: false,
      modules: false,
      warnings: false
    },
    hot:true,
    inline:true,
    disableHostCheck:true,
    host:'0.0.0.0',
    publicPath: '/build/',
    port: 4200
  },
  devtool: 'sourcemap',
  entry: {
    app: ['zone.js/dist/zone','./src/polyfills.ts', './src/main.ts']
    //polyfills: './src/polyfills.ts',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name]-chunk.js',
    publicPath: '/build/',
    path: path.resolve(__dirname, 'build')
  },
  node: {
    console: false,
    global: true,
    process: true,
    Buffer: false,
    setImmediate: false
  },
  module: {
    rules,
    loaders: [
      {
        test: /\.css$/, // Only .css files
        loader: 'style!css' // Run both loaders
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html','.xlsx'],
    modules: [
      'src',
      'node_modules',
      
    ],
    
  },
  plugins
};

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}