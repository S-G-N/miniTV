// pages/custom/nav/nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    background: ['推荐', '直播', '电影', '综艺', '电视剧', '音频', '热门', '海外', '华人', '推荐', '直播', '电影', '综艺', '电视剧', '音频', '热门', '海外', '华人', '推荐', '直播', '电影', '综艺', '电视剧', '音频', '热门', '海外', '华人']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showMine() {
      this.triggerEvent('showMine')
    }
  },

  
})
