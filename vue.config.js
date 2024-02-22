module.exports = {
    // publicPath: './',
    // outputDir:'dist',
    // assetsDir:'static',
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
            }
        }
    },
    devServer: {
        proxy: {//解决跨域问题
            '/api': {
                // 此处的写法，目的是为了 将 /api 替换成 https://autumnfish.cn/
                target: 'https://autumnfish.cn/',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/loc': {
              // 此处的写法，目的是为了 将 /api 替换成 https://autumnfish.cn/
              target: 'http://localhost:28019',
              // 允许跨域
              changeOrigin: true,
              ws: true,
              pathRewrite: {
                '^/loc': '/api'
              }
            },
            '/cigar_shop': {
              // 此处的写法，目的是为了 将 /api 替换成 https://autumnfish.cn/
              target: 'http://localhost:29001',
              // 允许跨域
              changeOrigin: true,
              ws: true,
              pathRewrite: {
                '^/cigar_shop': '/api'
              }
            },
            '/illustration': {
              // 此处的写法，目的是为了 将 /api 替换成 https://autumnfish.cn/
              target: 'http://localhost:29001',
              // 允许跨域
              changeOrigin: true,
              ws: true,
              pathRewrite: {
                '^/illustration': '/api'
              }
            },
        }
    }
};
