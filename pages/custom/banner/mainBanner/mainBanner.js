// pages/custom/banner/mainBanner.js
import Request from "../request.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataBanner: Array
  },
  onshow:function() {
    console.log(this.data.dataBanner)
  },
  attached: function (e) {
  },
  /**
   * 组件的初始数据
   */
  data: {
    background: null,
    current: 0,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 5000,
    duration: 1,
    previousMargin: 0,
    nextMargin: 0,
    currentIndex:0
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange: function (e) {
      this.setData({
        currentIndex: e.detail.current
      })
    }
  },
  ready() {
    // 在组件实例进入页面节点树时执行
    var that = this
    setTimeout(function () {  
      const query = that.createSelectorQuery()
      query.select('#swiper-box-secondary').boundingClientRect(function (res) {
        that.triggerEvent('getBannerTop', res.top)
      })
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
      })
    }, 300)
  }
})
