export default class Router {
  constructor(config) {
    this.currentRoute = {// 当前路由
      path: '', // 路径
    };
    this.history = [];   // 历史记录
    this.registerComponents = new Map();
    this.routeRecord = Object.create(null); // 路由页面
    this.waitCallComponents = []; //待渲染页面
    this._beforePathChange = null; // 路由守卫
    this._afterPathChange = null; // 跳转后回调

    this._init(config); // 路由初始化
  }
  /**
   * 路由初始化
   * @param {array} routes 子路由
   */
  _init(config) {
    config.routes.forEach(route => {
      this._recordInit(route, this.routeRecord)
    })
    let initPath = '/'; // 默认路由
    if (config.option && config.option.initPath) {
      initPath = config.option.initPath;
    }
    this.push(initPath);
  }
  /**
   * 路由初始化
   * @param {*} route 当前路由
   * @param {*} parentMap 父路由
   */
  _recordInit(route, parentRoute) {
    const currRouteKey = route.path.replace(/^\/([^\/]*).*/, '$1');
    parentRoute[currRouteKey] = { ...route };
    if (route.children && route.children.length) { // 含有子路由
      const children = route.children;
      parentRoute[currRouteKey].children = {};
      children.forEach(child => {
        this._recordInit(child, parentRoute[currRouteKey].children);
      })
    }
  }
  /**
   * 路由跳转
   * @param {object} param 跳转参数
   * @param {string} param.path 跳转路径
   */
  push(param) {
    let route = typeof param === 'string' ? { path: param } : param;
    const [targetRoute, componentList] = this._matchRouteRecord(route); // 获取目标路由
    const nextRoute = { ...targetRoute, ...route };
    if (!this._invokeBeforeHooks(nextRoute)) { // 阻止跳转
      return;
    }
    this._freshView(componentList); // 刷新页面
    this.currentRoute = nextRoute;
    this.history.push(nextRoute);
    this._invokeAfterHooks && this._invokeAfterHooks();

  }
  /**
  * 路由跳转（替换当前页面栈）
  * @param {object} param 跳转参数
  * @param {string} param.path 跳转路径
  */
  replace(param) {
    let route = typeof param === 'string' ? { path: param } : param;
    const [targetRoute, componentList] = this._matchRouteRecord(route); // 获取目标路由
    const nextRoute = { ...targetRoute, ...route };
    if (!this._invokeBeforeHooks(nextRoute)) { // 阻止跳转
      return;
    }
    this._freshView(componentList); // 刷新页面
    this.currentRoute = nextRoute;
    this.history.pop();
    this.history.push(nextRoute);
    this._invokeAfterHooks && this._invokeAfterHooks();
  };

  /**
   * 路由匹配
   * @param {*} route 目标路由
   */
  _matchRouteRecord(route) {
    const pathList = route.path.replace(/^\/(.*)$/, '$1').split('/');
    const componentList = [];
    return [pathList.reduce((record, name) => {
      const target = record[name];
      componentList.push(target.component || name);
      return target.children || target
    }, this.routeRecord), componentList]
  }
  /**
   * 刷新页面
   * @param {array}} componentList 组件列表
   */
  _freshView(componentList) {
    this.waitCallComponents = componentList; // 待渲染组件
    for (let component of this.registerComponents.values()) {
      const oldName = component.data.name;  // 旧组件
      const newName = this.waitCallComponents.shift(); // 新组件
      component.setData({ name: newName });
      if (oldName !== newName) {  // 路由改变
        break;
      }
    }
  }
  /**
   * 组件注册
   * @param {*} component 
   */
  registerComponent(component) {
    var $id = component.$id;
    if (this.waitCallComponents.length > 0) {
      component.setData({ name: this.waitCallComponents.shift() }); // 取出待渲染组件中的第一个渲染
    }
    this.registerComponents.set($id, component);
  }
  /**
   * 组件注销
   * @param {*} component 
   */
  removeComponent(component) {
    var $id = component.$id;
    this.registerComponents.delete($id);
  }

  /**
   * 设置跳转前监听
   * @param {*} page 当前页面实例
   * @param {*} methodName 监听方法
   */
  setBeforeChange(page, methodName) {
    if (page === null) {
      this._beforePathChange = null;
      return;
    }
    if (page[methodName] instanceof Function) {
      this._beforePathChange = _this[methodName].bind(page);
    }
  }
  /**
   * 设置跳转后回调
   * @param {*} page 当前页面实例
   * @param {*} methodName 回调方法
   */
  setAfterChange(page, methodName) {
    if (page === null) {
      this._afterPathChange = null;
      return;
    }
    if (page[methodName] instanceof Function) {
      this._afterPathChange = page[methodName].bind(page);
    }

  }
  /**
   * 跳转前确认
   * @param {*} 跳转目标页面 
   */
  _invokeBeforeHooks(nextRoute) {
    if (this._beforePathChange === null) return true;
    return this._beforePathChange(this.currentRoute, nextRoute);
  };
  /**
   * 跳转成功回调
   */
  _invokeAfterHooks() {
    if (this._afterPathChange === null)
      return true;
    return this._afterPathChange();
  }
}