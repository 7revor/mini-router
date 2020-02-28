# 商家应用路由组件
在官方路由组件功能的基础上进行升级

- 舍弃`path-to-regexp`路由匹配方式，采用Object进行跳转以及传参，使用更加灵活。
- 支持自定义路由配置，可在当前页面实时获取，扩展性更高。
- 允许两个router-view在同一层级中出现。

# 使用
## 安装
```
npm i py-mini-router -S
```
## 路由定义
```
export default {
  routes: [
     {
      path: '/home',   // 路由相对地址
      component:'home' // 组件名称，需和router中的slot 一一对应，若不设置则自动匹配path值
    },
    {
      path: '/list',
      children: [
        { path: '/add'},
        { path: '/delete', component: 'deleteItems' },
      ],
    },
  option: {
    initPath: '/home'  // 默认初始目录，即首页
  },
};
```
## 组件引入
```
{
  "component": true,
  "usingComponents": {
    "router-view": "py-mini-router/router/router",
  }
}
```
## 页面配置
注意slot需和路由定义中的component或者path对应（优先级component>path）
```html
<view class="body-content">
  <router>
      <view slot="home">首页</view>  
      <view slot="list" >
          <router>
              <add slot="add"/>
              <delete slot="deleteItems"/>
          </router>
    </view>
  </router>
</view>
```
## 初始化
```js
import routerConfig from './router';   //路由定义
import Router from 'py-mini-router';  //引入初始化方法
Page({
 
  onLoad() {
    this.$router = new Router(routerConfig); // 传入路由配置，绑定至页面实例
  },
  onItemClick(event) {
    this.$router.push({
        path:'xxx',
        param:{
          name:7revor
        }
     });
  },
});
```

# API
## this.$router.currentRoute 当前路由
```
{
      path:'当前路由路径', // 在currentRoute中是绝对路径，在routeRecord中是相对路径
      param:'路由跳转参数',
      // ... 其他任意在路由配置中定义的参数都可以在此获取
}
```

## this.$router.routeRecord 路由表
所有路由以及子路由的路由表，key为绝对路径，value为该路径route配置。（其中route.$path为该路由绝对路径）

## push & replace
```
this.$router.push({
  path:'/pages/home',
  param:{
    id:123,
    name:'7revor'
  }
})
this.$router.push('/pages/home')

this.$router.replace('/pages/home') // replace会替换当前路由栈（暂不支持后退功能）
```
### 参数获取
```
const {currentRoute} = this.$router;
const param = currentRoute.param;
```

## setBeforeChange 路由守卫
设置钩子函数，此函数会在导航变更前调用，若返回的值不为true，则导航不会变化。（可设置多个，若有一个返回false，则不会进行跳转）
```
Page({
  onLoad() {   
    this.$router = new Router(routerConfig);
    this.$router.setBeforeChange(this, 'onBeforeChange');
	},
  onBeforeChange(from, to){//钩子函数可以获取两个参数，from为当前路由，to为即将要跳转的路由
    console.log(from, to)
    return true;
  },
});

```
## removeBeforeChange 删除路由守卫
删除路由守卫，用法和setBeforeChange相同，会删除同一组件（页面）实例上同名的守卫函数（组件销毁后要及时删除注册的守卫函数，否则会导致内存泄漏）

```
Page({
  onLoad() {   
    this.$router = new Router(routerConfig);
    this.$router.setBeforeChange(this, 'onBeforeChange');
	},
  didUnmount(){
    this.$router.removeBeforeChange(this, 'onBeforeChange');
  },
});
```
## setAfterChange 
设置钩子函数，此函数会在导航变更后调用。（可设置多个，按顺序依次执行）
```
Page({
  onLoad() {   
    this.$router = new Router(routerConfig);
    this.$router.setAfterChange(this, 'onAfterChange');
  },
  onAfterChange(){
    // 逻辑
  }
});
```
## removeAfterChange 删除路由监听
删除路由守卫，用法和setAfterChange相同，会删除同一组件（页面）实例上同名的监听函数
