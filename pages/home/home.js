// pages/home/home.js
var Epg = require('../../module/epg.js')

Page({
  data: {
    bannerData:{},
    searchComParam:{},
    bannerComTop:0,
    narrowStart:0, // 触发搜索框缩小时，页面向上滚动的距离
    narrowEnd: 0, // 搜索框缩小结束时，页面向上滚动的距离
    navViewHeight:0,
    scaleH: 0,
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    displayMultipleItems: 4
  },
  btnclick:function(){
    this.setData({condition:!this.data.condition})
  },
  tapName: function (event) {
    console.log(event)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建节点选择器
   
    // console.log(this.data.searchComHeight)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('' + this.route)
    var that = this
    Epg.getBanner((data) => {
      console.log(data)
      that.setData({
        bannerData: data.data.result
      })
      console.log(this.data.bannerData)
     }, (err) => { 
       console.log(err)       
     })
     // card
    Epg.getCard((data) => {
      console.log(data)
      that.setData({
        cardData: data.data.result
      })
      console.log(this.data.cardData)
    }, (err) => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function (e) {
    // Do something when page scroll
    console.log(e.scrollTop)
    var scaleH = e.scrollTop - this.data.narrowStart
    if (e.scrollTop > this.data.narrowStart && e.scrollTop < this.data.narrowEnd){
      console.error(this.data.narrowStart)
      console.error(e.scrollTop)

      this.setData({
        scaleH: scaleH
      })
      
      // transform: scaleX(scaleH);
    }
  },

  /**
   * 当前是 tab 页时，点击 tab 时触发
   */
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  getSearchParam(param) {
    console.log(param)

    var that = this
    // 已知banner组件高度时计算scrollH
    if (this.data.bannerComTop) {
      this.setData({
        narrowStart: that.data.bannerComTop - param.detail.searchH,
        narrowEnd: that.data.bannerComTop - param.detail.inputTop
      
      })
    } else {
      // 未知banner组件高度时赋值
      this.setData({
        searchComParam: param.detail
      })
    }
  },
  getBannerTop(t) {
    console.log(t.detail)
    var that = this
    // 已知搜索组件高度时计算scrollH
    if (this.data.searchComHeight){
      this.setData({
        narrowStart: t.detail - that.searchComParam.searchH,
        narrowEnd: t.detail - that.searchComParam.inputTop
      })
    } else {
       // 未知搜索组件高度时赋值
      this.setData({
        bannerComTop: t.detail
      })
    }
  },
  
})