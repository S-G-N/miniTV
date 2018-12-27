// pages/home/home.js
var Epg = require('../../module/epg.js')

Page({
  data: {
    bannerData:{},
    bannerComTop:0,
    narrowStart:0, // 触发搜索框缩小时，页面向上滚动的距离
    narrowEnd: 0, // 搜索框缩小结束时，页面向上滚动的距离
    scrollH:0,// 伸缩的高度
    searchH:0,
    searchHeight:0,
    inputHeight:0,
    inputH: 0,
    inputTop: 0,
    isMini:false,
    scaleRight:false,
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
    var that = this
    setTimeout(function(){
      //创建节点选择器
      const query = that.createSelectorQuery()
      query.select('#search').boundingClientRect(function (res) {
        console.log('search的高')
      })
      query.select('#searchInput').boundingClientRect(function (res) {
        console.log('searchInput的高')
      })
      query.select('#searchContainer').boundingClientRect(function (res) {
        console.log('searchContainer的高')
        console.error(res)
      })
      query.select('#inputContainer').boundingClientRect(function (res) {
        console.log('inputContainer的高')
      })
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        console.error(res)
        console.error('searchContainer高：' + res[2].height)
        console.error('searchInput上边：' + res[1].top)

        that.setData({
          inputTop: res[1].top,
          inputHeight: res[3].height,// 通过获取container的高
          inputH: res[3].height, // 动态绑定的高
          searchHeight: res[2].height,// 通过获取container的高
          searchH: res[2].height, // 动态绑定的高
          scrollH: res[2].height - res[1].top,
        })
        if (that.data.bannerComTop) {
          that.setData({
            narrowStart: that.data.bannerComTop - that.data.inputTop - that.data.inputHeight,
            narrowEnd: that.data.bannerComTop - that.data.inputTop
          })
        }
      })
    },300)
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
    var H = this.data.inputHeight - (e.scrollTop - this.data.narrowStart)
    var that = this
    if (e.scrollTop >= this.data.narrowStart && e.scrollTop <this.data.narrowEnd){
      var percent = (e.scrollTop - this.data.narrowStart )/ this.data.inputHeight
      console.error(that.data.searchHeight)
      console.error(that.data.scrollH)

        this.setData({
          inputH: that.data.inputHeight * (1 - percent),
          searchH: that.data.searchHeight - that.data.scrollH *  percent,
          isMini: false
        })
    } else if (e.scrollTop < this.data.narrowStart) {
      this.setData({
        inputH: that.data.inputHeight,
        searchH: that.data.searchHeight,
        isMini: false
      })
    } else if (e.scrollTop > this.data.narrowEnd) {
      this.setData({
        inputH: 0,
        searchH: that.data.inputTop,
        isMini:true
      })
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
  getBannerTop(param) {
    console.log(param.detail)
    var that = this
    // 已知搜索组件高度时计算scrollH
    if (this.data.searchHeight){
      console.log('right')
      this.setData({
        narrowStart: that.data.bannerComTop - that.data.inputTop - that.data.inputHeight,
        narrowEnd: that.data.bannerComTop - that.data.inputTop
      })
    } else {
       // 未知搜索组件高度时赋值
      this.setData({
        bannerComTop: param.detail
      })
    }
  }, 
  showMinePage(){
    // 主页缩小， 显示"我的"
    console.log('主页缩小显示"我的')
    var that = this;
    this.setData({
      scaleRight: !that.data.scaleRight
    })
    // 绑定事件，点击还原
  },
  cancelScaleRight(){
    console.log("触发了点击还原")
    if (this.data.scaleRight){
      this.setData({
        scaleRight: false
      })
    }
  }

})