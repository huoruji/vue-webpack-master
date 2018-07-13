//扩展配置
const path = require('path');

const HTMLPlugin = require('html-webpack-plugin');

const webpack = require('webpack')

const merge = require('webpack-merge');//合并webpack配置

const isDev = process.env.NODE_ENV === "development"

const ExtractPlugin = require('extract-text-webpack-plugin');

const baseConfig = require('./webpack.config.base');
let config;

const defualtPlugins = [
    new webpack.DefinePlugin({//js可以调用到环境变量
        'process.env':{
            NODE_ENV:isDev?'"development"':'"production"'
        }
    }),
    new HTMLPlugin()
];

const devServer = {
    port: 8001,
    host: '0.0.0.0',
    overlay: {
        errors: true //把错误显示在页面上
    },
    hot: true
};

if (isDev) {//开发环境
    config = merge(baseConfig, {
        devtool: '#cheap-module-eval-source-map',
        module: {
            rules: [
                {
                    test: /\.styl/,
                    use: ['vue-style-loader', 'css-loader', {
                        loader: 'postcss-loader',//自动生成sourceMap,提高编译效率
                        options: {
                            sourceMap: true
                        }
                    }, 'stylus-loader']
                }
            ]
        },
        devServer,
        plugins: defualtPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ])
    });
} else {//生产环境
    config = merge(baseConfig, {
        entry: {
            app: path.join(__dirname, '../src/index.js'),
            vendor: ['vue']
        },
        output: {
            filename: '[name].[chunkHash:8].js'
        },
        module: {
            rules: [
                {
                    test: /\.styl/,
                    use: ExtractPlugin.extract({
                        fallback: 'vue-style-loader',
                        use: ['css-loader', {
                            loader: 'postcss-loader',//自动生成sourceMap,提高编译效率
                            options: {
                                sourceMap: true
                            }
                        }, 'stylus-loader']
                    })
                }
            ]
        },
        plugins:defualtPlugins.concat([
            new ExtractPlugin('styles.[contentHash:8].css'),
            new webpack.optimize.CommonsChunkPlugin({//分开打包类库
                name: 'vendor'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name:'runtime'
            })
        ])
    });
}

module.exports = config