# v3-supermall[基于vue3的商城pc的客户端项目]

- akin:如何启动这个项目
```shell
npm i
```
```shell
npm run serve
```

- 需要手动修改本机hosts文件，以及webpack.config.js一段
```diff
# 只需要增加这一行
+127.0.0.1 www.corho.com
```
```diff
  chainWebpack: config => { // 把加载中图标打包成base64，不用发请求直接看到图片
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
    // 这个是给webpack - dev - server开启可IP和域名访问
+    config.devServer.disableHostCheck(true)
  },
```

- 支付宝测试沙箱账号，里面有100个W，随便花!!!
```diff
+买家账号jfjbwb4477@sandbox.com
+登录密码111111
+支付密码111111
```

- 项目中比较有意思的3个大功能
  1. 账号密码登录 token 
  2. qq三方OAuth登录 token
  3. 支付宝API支付 

- 项目特色
  1. 数据请求懒加载： useIntersectionObserver,加载首页，滚动到一个品类模块就请求这个模块的数据，随用随请求，节省网络带宽
  2. 请求数据求骨架屏展示
  3. 对Vuex的大量使用，Vue组件中dispath到store的子模块的action(对应Vue的网络请求)里做异步网络请求操作然后将结果commit到这个模块下的mutation中，然后在mutation（对应Vue的methods）中修改这个模块下的state里的数据, 很多公司都是不管你异步不异步，都先进actions，commit到mutations里，因为这样出BUG概率被降到最小
  4. 登录业务：token
  5. 支付业务：支付宝支付
  6. 购物车：对Vuex大量的实践，对商品数据CRUD，如果已登录：对接后端P2P的进行购物车数据的CRUD; 如果未登录： 对本地购物车数据的localstorage的CRUD；

- 项目API文档回顾
  - api.html