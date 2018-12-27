// pages/custom/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scale: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    // scale: 2,
  },
  /**
   * 组件的方法列表
   */
  methods: {

  },
  tap2() {
    // this.setData({
    //   scale: 3
    // })
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  ready() {
    // 在组件实例进入页面节点树时执行
    console.error(555)
    const query = this.createSelectorQuery()
    var that = this
    // 阴影高度
    query.select('#search').boundingClientRect(function (res) {
      console.log(88888)
      console.log(res)
      that.setData({
        searchH: res.height
      })
    })
    // 搜索框top
    query.select('#inputContainer').boundingClientRect(function (res) {
      console.log(6666666)
      console.log(res)
    })
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.error(res)
      // that.setData({
      //   inputTop: res[1].top,
      //   searchH: res[0].height
      // })
      var param={
        'inputTop': res[1].top,
        'searchH': res[0].height,
        'scrollH': res[0].height - res[1].top
      }
      that.triggerEvent('getSearchParam',param)
    })
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
})
