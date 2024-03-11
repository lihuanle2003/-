const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  configureWebpack:{
    devServer:{
      // 设置代理服务器
      proxy:{
        "/api":{
          target:"http://localhost:3000",
          changeOrigin:true,
          pathRewrite:{
            "^/api":""
          }
        }
      },
      host:'0.0.0.0',
      port:"8080",
      client:{
        webSocketURL:"ws://0.0.0.0:8080/ws"
      },
      headers:{
        'Access-Control-Allow-Origin':"*"
      }
    }
  }
})
