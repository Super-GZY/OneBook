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
            '/chapterApi': {
                target: 'http://chapterup.zhuishushenqi.com',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/chapterApi': ''
                }
            },
            '/log': {
                target: 'http://localhost:3000/api/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/log': ''
                }
            }
        },
        before: app => { }
    }
}
