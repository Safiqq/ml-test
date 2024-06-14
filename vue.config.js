const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://fitfirst-ml-backend-haexo7tjpa-et.a.run.app',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
})
