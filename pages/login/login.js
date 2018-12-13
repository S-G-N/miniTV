// pages/login/login.js
var user = require('../../module/user.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    password:'',
    loginBtnAvailable:true,
    tipText: ''
  },
  inputAccount(e) {
    let that = this
    this.setData({
      account: e.detail.value
    })
    this.setData({
      loginBtnAvailable: that.data.account && that.data.password ? false : true
    })
    console.log(this.data.loginBtnAvailable)
  },
  inputPassword(e) {
    let that = this
    console.log(this.account)
    console.log(this.password)
    this.setData({
      password: e.detail.value
    })
    this.setData({
      loginBtnAvailable: that.data.account && that.data.password ? false : true
    })
    console.log(this.data.loginBtnAvailable)
    
  },
  login() {
    var that = this
    console.log('点击登录');
    // master_user_id: this.data.account,
    // master_user_pwd: this.data.password,
    var data = {
      master_user_id: 'ran.cui22@net263.com',
      master_user_pwd: 'a123456',
      device_type: '2', // 设备类型 1:安卓手机，2:iPhone，3:iPad
      device_id: '10013',
      app_version: 'v1'
      // token:'e4b832f198f131dfe62c876228df1a10'
    }
    console.log(data)
    user.login(data, this.done, this.failur)
  },
  done(res) {
    console.log(res);
    wx.navigateTo({
      url: '../home/home'
    })
  },
  failur(err) {
    this.setData({
      tipText: err
    })
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})