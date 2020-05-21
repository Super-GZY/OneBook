module.exports = {
    publicPath: './',
    devServer: {
        open: true,
        port: 8085,
        https: false,
        hotOnly: false,
        proxy: {
            // 配置跨域
            '/api': {
                target: 'http://api.zhuishushenqi.com',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/chapter': {
                target: 'http://chapterup.zhuishushenqi.com/chapter/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/chapter': ''
                }
            }
        },
        before: app => { }
    }
}
