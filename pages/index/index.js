//index.js
var User = require('../../module/user.js')
var Epg = require('../../module/epg.js')
var Log = require('../../module/dflog.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开启视觉之旅！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow: function () {
    // 加载首页数据并缓存
    var welPageTime = 1000
    var timeStart = new Date()
    User.loginInit(function (loginState, userState){
      var lackTime = welPageTime - (new Date() - timeStart)
      console.log(welPageTime)
      console.log(new Date())
      console.log(timeStart)
      console.log(lackTime)
      if (lackTime) {
        setTimeout(() => {  
          initThen(loginState)
        }, lackTime)
      } else {    
        initThen(loginState)
      }
      function initThen(loginState) {
        Log.logi('初始化成功')
        console.log(loginState)
        
        wx.navigateTo({
          url: '../home/home'
        })

        if (loginState === 2) {
          // 已登录
          Log.logi('已登录')
          wx.navigateTo({
            url: '../home/home'
          })
        } else if (loginState === 1) {
          // 游客登录
          Log.logi('游客已登录')          
          wx.navigateTo({
            // url: '../login/login'
            url: '../home/home'
          })
        } else if (loginState === 0) {
          // 未登录
          console.log('未登录')
        }
      }
    },function(){
      Log.loge('初始化失败')
    })
  }
})
