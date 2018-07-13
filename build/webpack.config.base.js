//被依赖的配置
const path = require('path');

const createVueLoaderOptions = require('./vue-loader.config.js');

const isDev = process.env.NODE_ENV === "development"


const config = {
    target:'web',
    entry:path.join(__dirname,'../src/index.js'),
    output:{
        filename:'bundle.[hash:8].js',
        path:path.join(__dirname,'../dist')
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader',
                options:createVueLoaderOptions(isDev)
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {   //忽略掉node_module中的文件
                test: /\.js$/,
                loader: 'babel-loader',
                exclude:/node_module/
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 1024,
                      name: 'resource/[path][name].[hash:8].[ext]'//根据开发目录，生成资源目录结构
                    }
                  }
                ]
            }
        ]
    }
}



module.exports = config