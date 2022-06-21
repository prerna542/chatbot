// NODE IMPORTS GO HERE
/* eslint-disable */
const { join, resolve } = require('path');
const DIRNAME = __dirname;

// PLUGIN AND THIRD PARTY IMPORTS GO HERE
const DOTENV = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// CUSTOM IMPORTS AND CONSTANTS GO HERE
const BABEL_OPTIONS = require(resolve(join(DIRNAME, '/babel.config.json')));
const POSTCSS_OPTIONS = require(resolve(join(DIRNAME, '/postcss.config')));
let ENVIRONMENT_VARIABLES = DOTENV.config({ path: '.env' });
ENVIRONMENT_VARIABLES = { ...process.env };

/************ Webpack configuration object ************/
module.exports = {
  /* The entry point of the application */
  entry: {
    main: resolve(join(DIRNAME, '/src/index.js')),
  },

  /* The output definitions */
  output: {
    /* Stores Files in dist folder at Project root */
    path: resolve(join(DIRNAME, '/dist')),
    filename: 'js/[name].[contenthash].js',
    /* Clean the directory if it exists already */
    clean: true,
  },

  module: {
    rules: [
      /* Emit Images seperately if any are used in the bundle */
      {
        test: /\.(png|jpe?g|tiff|gif|webp|bmp)/,
        type: 'asset/resource',
      },
      /* Process font files if any */
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      /* Process JavaScript Files with proper loaders */
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: BABEL_OPTIONS,
          },
        ],
      },
      /* Process style sheets using loaders */
      {
        test: /\.s?css/,
        use: [
          /* MiniCssExtractPlugin extracts the CSS into seperate files */
          MiniCssExtractPlugin.loader,
          'css-loader',
          /* Postcss-loader uses autoprefixer to add browser vendor prefixes */
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: POSTCSS_OPTIONS,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    /* Use a Plugin to automatically extract CSS files */
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),

    /* Use a Plugin to create HTML File and add imports like CSS,JS automatically */
    new HtmlWebpackPlugin({
      template: resolve(join(DIRNAME, '/index.ejs')),
      filename: 'index.html',
      title: 'BuddyConsole - A console to manage your BankBuddy interface',
      minify: true,
    }),
    /* Use a plugin to see bundle sizes */
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),
    /* Use a plugin to replace environment variables in the code */
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(ENVIRONMENT_VARIABLES),
    }),
  ],

  optimization: {
    runtimeChunk: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /node_modules/,
        parallel: true,
        terserOptions: {
          safari10: true,
          ie8: true,
        },
      }),
      /* Use this plugin to minimize CSS files */
      new CssMinimizerPlugin(),
    ],
  },

  /* Automatically resolve JavaScript,TypeScript and JSX, TSX files
     without requiring the extension in the import */
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  target: ['web', 'es5'],
  devtool: 'eval-cheap-source-map',
  devServer: {
    port: 9000,
    static: {
      directory: resolve(join(DIRNAME, '/dist')),
    },
    compress: false,
  },
};
