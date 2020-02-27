# 商家应用路由组件
在官方路由组件功能的基础上进行升级

- 舍弃`path-to-regexp`路由匹配方式，采用Object进行跳转以及传参，使用更加灵活。
- 支持自定义路由配置，可在当前页面实时获取，扩展性更高。
- 允许两个router-view在同一层级中出现。

# 安装
```
npm i py-mini-router -S
```

# 使用
```js
import routerConfig from './router';   //路由定义
import Router from 'py-mini-router';  //引入初始化方法
Page({
 
  onLoad() {
    this.$router = new Router(routerConfig)
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

# 路由定义
```
export default {
  routes: [
     {
      path: '/',
      component:'home' // 组件名称，需和router中的slot 一一对应，若不设置则自动匹配path值去掉斜杠
    },
    {
      path: '/list',
      children: [
        { path: '/add'},
        { path: '/delete', component: 'deleteItems' },
      ],
    },
  option: {
    initPath: '/home',
  },
};
```

# router
路由包裹组件
## 定义
```
{
  "component": true,
  "usingComponents": {
    "router-view": "py-mini-router/router/router",
  }
}
```

# 页面
注意slot需和路由定义中的component或者path对应（优先级component>path）
```
//page.axml
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

# API
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
```
### currentRoute
合并跳转时传入的参数以及路由定义的参数
```
{
  path:'/pages/home',
  param:{
    id:123,
    name:'7revor'
  },
  customOption:'xxx' // 任何自定义配置（在routeConfig中定义）
}
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
删除路由守卫，用法和setBeforeChange相同，会删除同一组件（页面）实例上同名的守卫函数
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
