const path = require('path');
const resolve = dir => {
  return path.join(__dirname, dir)
};

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/": "/",
    outputDir: 'dist',
    assetsDir: '',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    // 是否使用包含运行时编译器的Vue核心的构建
    runtimeCompiler: false,
    devServer      : {
        open: true,
        // host   : '192.168.0.118',
        // port   : 8080,
        https  : false,
        hotOnly: false,
        // proxy  : null,
        // before : app => {
        // },
    },
    chainWebpack: config => {
      // config.resolve.alias
      //   .set('src', resolve('src')).set('assets', resolve('src/assets')); // key,value自行定义，比如.set('@@', resolve('src/components'))
      
      // 移除 vue-cli 内置对 icon svg 文件的处理
      config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end();
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/assets/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
        .use('svgo-loader')
        .loader('svgo-loader')
        .options({
          plugins: [
            { removeAttrs: { attrs: 'fill' } }
          ]
        })
        .end()
    },
    css: { // 配置css模块
      loaderOptions: { // 向预处理器 Loader 传递配置选项
        less: { // 配置less（其他样式解析用法一致）
          javascriptEnabled: true // 设置为true
        }
      }
    },

}