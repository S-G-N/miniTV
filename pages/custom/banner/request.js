// 数据请求

module.exports = {
  reqBanner: function(callback) {
    console.log('发起请求!')
    wx.request({
      url: 'http://192.168.1.109:9088/banner', //仅为示例，并非真实的接口地址
    data: {},
    method:'post',
    dataType: 'json',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data.mainbanner)
      callback(res.data.mainbanner)
    }
  })
  }
}