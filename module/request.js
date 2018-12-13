var Log = require('./dflog.js')
var Cache = require('./cache.js')
var User = require('./user.js')
export function directlyReq(url, params, done, failure) {
  wx.request({
    url: url, 
    data: params,
    method: 'post',
    dataType: 'json',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      Log.logi(res)
      if (res.statusCode == 200) {
        Log.logi(url + '请求成功')
        done(res)
      } else if (res.statusCode == 600){
        if (res.data.result) {
          Log.loge(url + '请求失败' + res.data.result)
          var errorCode = parseInt(res.data.result)
          if (errorCode === 10001) { // Token expired
            User.notifyTokenExpired()
          }
        }
        // todo 
        failure(errorCode)
      } else {
        failure(-1)
      }
    },
    fail: function (res) {
      Log.loge(url + '请求失败' + res.data)
      failure(res.data)
    },
  })
}
export function cachableReq(url, params, done, failure) {
  console.log(url)
  var key = getCacheKey(url, params)
  Log.logi('cachableReq: key = ' + key)
  var cachedData = Cache.getStorageData(key)
  if (cachedData) {
    console.log('查到有缓存的 ' + key)
    var now = Math.floor(new Date() / 1000)
    if (now <= cachedData.expireAtTime) {
      delete cachedData.expireAtTime
      done(cachedData)
      return // Directly return.
    } else {
      if (params == null) {
        params = { 'updatetime': cachedData.updatetime }
      } else {
        params.updatetime = cachedData.updatetime
      }
    }
  } else {
    if (params == null) {
      params = { 'updatetime': 0 }
    } else {
      params.updatetime = 0
    }
  }
  directlyReq(url, params, function (data) {
    console.log(url)
    console.log(params)
    var now = Math.floor(new Date() / 1000)
    if (!data || data === 0 || data === '0') {
      // Use cache data
      cachedData.expireAtTime = now + parseInt(cachedData.expiretime)
      Cache.setStorageData(key, cachedData)
      console.log('使用了缓存expireAtTime')
      done(cachedData)
    } else if (!data.data.expiretime || data.data.expiretime <= 0) {
      // Remove cache.
      Cache.removeStorageData(key)
      console.log('清除了缓存的expireAtTime')
      done(data)
    } else {
      data.expireAtTime = now + parseInt(data.data.expiretime)
      Cache.setStorageData(key, data)
      console.log('缓存了expireAtTime')
      done(data)
    }
  }, failure)
}

function getCacheKey(url, params) {
  if (params) {
    var extStr = '?'
    for (var item in params) {
      if (item !== 'token') {
        extStr += item + '=' + params[item] + '&'
      }
    }
    if (extStr !== '?') {
      return url + extStr
    }
  }
  return url
}
// module.exports = {
//   directlyReq: directlyReq,
//   cachableReq: cachableReq
// }