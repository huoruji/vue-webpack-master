const path = require('path');

const HTMLPlugin = require('html-webpack-plugin');

const webpack = require('webpack')

const isDev = process.env.NODE_ENV === "development"

const ExtractPlugin = require('extract-text-webpack-plugin');

const config = {
    target:'web',
    entry:path.join(__dirname,'./src/index.js'),
    output:{
        filename:'bundle.[hash:8].js',
        path:path.join(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 1024,
                      name: '[name]-aaa.[ext]'
                    }
                  }
                ]
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({//js可以调用到环境变量
            'process.env':{
                NODE_ENV:isDev?'"development"':'"production"'
            }
        }),
        new HTMLPlugin()
    ]
}

if(isDev){
    //开发环境
    config.module.rules.push(
        {
            test:/\.styl/,
            use:['style-loader','css-loader',{
                loader:'postcss-loader',//自动生成sourceMap,提高编译效率
                options:{
                    sourceMap:true
                }
            },'stylus-loader']
        }
    );
    config.devtool = '#cheap-module-eval-source-map',
    config.devServer = {
        port:8001,
        host:'0.0.0.0',
        overlay:{
            errors:true //把错误显示在页面上
        },
        hot:true
    },
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}else{//生产环境
    config.entry={//单独打包类库
        app:path.join(__dirname,'src/index.js'),
        vendor:['vue']
    }
    config.output.filename = '[name].[chunkHash:8].js'
    config.module.rules.push({
        test:/\.styl/,
            use:ExtractPlugin.extract({
                fallback:'style-loader',
                use:['css-loader',{
                        loader:'postcss-loader',//自动生成sourceMap,提高编译效率
                        options:{
                            sourceMap:true
                        }
                    },'stylus-loader']
            })
    });
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({//分开打包类库
            name:'vendor'
        })
    );
}

module.exports = config