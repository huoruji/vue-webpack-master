module.exports = (isDev)=>{
    return {
        preserveWhitepace:true,//去掉htm中的空格
        extractCSS:isDev,//根据环境需要，选择需不需要另外打包css,不用将所有的css都加载到页面上，.vue文件中的css也会单独打包出来
        cssModules:{},
    }
}