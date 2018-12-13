/* user interface */ 
var USER_URL_BASE = 'https://user.italk.colnv.com:8443/df200/'
var Request = require('./request.js')
var Log = require('./dflog.js')
var Epg = require('./epg.js')
var Cache = require('./cache.js')
console.log(Request)
console.log(Epg)
console.log(Log)
const TOKEN_EXPIRE_THRESHOLD = 300 // Update token 300s before it expired.
const MAX_HISTORY_ITEM = 40 // Max number of seek records (count with main id).
export const StorageKey = {
  'USERDATA': 'ukuserdata',
  'HISTORYLIST': 'ukhistorylist',
  'SESSIONDATA': 'uksessiondata',
  'BANNERDATA': 'ukbannerdata',
  'CARDDATA': 'ukcarddata'
}

export const LoginState = {
  'NONE': 0,    // Not logged in.
  'VISITOR': 1, // Logged in as visitor.
  'USER': 2     // Logged in as ordinary user.
}

export const UserState = {
  'ERR': -1,
  'RESERVE': 0,
  'TRIAL': 1,
  'NORMAL': 2,
  'CANCELING': 3,
  'INVALID': 4
}
var mUserData = {}
var mUserSessionData = {}
// 登录初始化
export function loginInit(done, failure) {
  Log.logd('loginInit: IN.')
  loadUserData()
  if (mUserSessionData.loginState === LoginState.NONE) {
    console.log('未登录状态')
    // 未登录状态
    // 可进行自动登录
    if (mUserData.isAutoLogin === 1 && mUserData.autoLoginId &&
      mUserData.autoLoginId.length > 0) {
      // Find auto login id, try auto login.
      autoLogin(function () {
        // Auto login success, involve the callback.
        Log.logd('loginInit: auto login done.')
        if (done) {
          done(mUserSessionData.loginState, mUserSessionData.userState)
        }
      }, function (error) {
        // Auto login failed, try visitor login.
        Log.logd('loginInit: auto login failed (' + error +
          '), will try visitor login.')
        visitorLogin(function () {
          // Visitor login success, involve the callback.
          Log.logd('loginInit: visitor login done after auto login failed.')
          if (done) {
            done(mUserSessionData.loginState, mUserSessionData.userState)
          }
        }, function () {
          // Visitor login failed, involve the callback.
          Log.loge('loginInit: [Fatal error] visitor login also failed after auto login failed.')
          if (failure) {
            failure()
          }
        })
      })
    } else {
      console.log('不可进行自动登录,即将游客登录')
      // 不可进行自动登录
      // No auto login id, try visitor login.
      Log.logi('loginInit: No auto login, try visitor login.')
      visitorLogin(function () {
        console.log('游客登录成功')
        // Visitor login success, involve the callback.
        Log.logi('loginInit: No auto login, visitor login done.')
        console.log(mUserSessionData.loginState)
        if (done) {
          done(mUserSessionData.loginState, mUserSessionData.UserState)
        }
      }, function () {
        // Visitor login failed, involve the callback.
        Log.loge('loginInit: [Fatal Error] No auto login, visitor login failed.')
        if (failure) {
          failure()
        }
      })
    }
  } else {
    // Already logged in, involve the callback.
    Log.logi('loginInit: Same session, already logged in')
    if (done) {
      done(mUserSessionData.loginState, mUserSessionData.userState)
    }
  }
}
// 正常登录
export function login(data, done, failure) {
  var url = USER_URL_BASE+ 'user/login'
  Request.directlyReq(url, data, function(data) {
        console.log(data)
        Log.logd('User login data: ' + JSON.stringify(data))
    if (mUserData.lastUser !== data.master_user_id) {
      // User changed. Clear all the local data of the last user.
      Cache.removeStorageData(StorageKey.USERDATA)
      mUserData.lastUser = data.master_user_id
      mUserData.lastUserInfo = data
    }
    mUserData.autoLoginId = data.medal
    Cache.setStorageData(StorageKey.USERDATA, mUserData)
    // Session data.
    mUserSessionData.loginState = LoginState.USER
    mUserSessionData.token = data.data.token
    console.log(data)
    // mUserSessionData.tokenExpire = parseInt(data.data.token_expire)
    // mUserSessionData.tokenExpireAtTime =
    //         Math.floor(new Date().getTime() / 1000) + mUserSessionData.tokenExpire
    // mUserSessionData.userState = parseInt(data.data.state)
    Cache.setStorageData(StorageKey.SESSIONDATA, mUserSessionData)
    startTokenRefresher()
    // 首次加载数据
    loadPageData()
    if (done) {
        done()
    }
  }, failure);
}
// 自动登录
export function autoLogin(done, failure) {
  console.log('执行了自动登录')
  var data = mUserData.lastUserInfo
  Log.logd('User autoLogin().')
  login(data, done, failure)
  // Request.directlyReq(USER_URL_BASE, 'user/login', param, function (data) {
  //   Log.logd('Auto login data: ' + JSON.stringify(data))
  //   mUserSessionData.loginState = LoginState.USER
  //   mUserSessionData.token = data.data.token
  //   mUserSessionData.tokenExpire = parseInt(data.data.token_expire)
  //   mUserSessionData.tokenExpireAtTime =
  //     Math.floor(new Date().getTime() / 1000) + mUserSessionData.tokenExpire
  //   mUserSessionData.userState = parseInt(data.data.state)
  //   Cache.setSessionData(StorageKey.SESSIONDATA, mUserSessionData)
  //   startTokenRefresher()
  //   if (done) {
  //     done()
  //   }
  // }, 
  // function (error) {
  //   switch (error) {
  //     case 20112: // Auto login token expired.
  //       mUserData.autoLoginId = ''
  //       Cache.setUserData(StorageKey.USERDATA, mUserData)
  //       break
  //     case 20104:
  //     default:
  //       break
  //   }
  //   if (failure) {
  //     failure(error)
  //   }
  // })
}
// 游客注册
export function visitorRegister(done, failure, final) {
  Log.logd('User visitorLogin().')
  var data = {
    device_id: mUserData.device_id,
    device_type: 2,
    version_code: 3
  }
  var url = USER_URL_BASE + 'visitor/register'
  console.log('visitorRegister开始')
  console.log(Request)
  Request.directlyReq(url, data, function (data) {
    console.log(data)
    console.log('游客注册成功')
    Log.logi('Visitor register data: ' + JSON.stringify(data))
    mUserSessionData.loginState = LoginState.NONE
    // mUserSessionData.userState = UserState.ERR
    mUserSessionData.token = data.data.result.token
    mUserSessionData.tokenExpire = parseInt(data.data.result.token_expire)
    mUserSessionData.visitor_id = parseInt(data.data.result.visitor_id)
    mUserSessionData.tokenExpireAtTime =
      Math.floor(new Date() / 1000) + mUserSessionData.tokenExpire
    Cache.setStorageData(StorageKey.SESSIONDATA, mUserSessionData)
    // 注册成功登陆
    visitorId = mUserSessionData.visitor_id
    visitorLogin(done, failure, final)
    startTokenRefresher()
    if (done) {
      done()
    }
    if (final) {
      final()
    }
  }, function (error) {
    console.log('游客注册失败')
    Log.logi('Error: Visitor register failed (' + error + ')')
    if (failure) {
      failure()
    }
    if (final) {
      final()
    }
  })
}
// 游客登录
var visitorId = ''
export function visitorLogin(done, failure, final) {
  // visitorId有效，进行游客登录
  console.log(visitorId)
  if (visitorId) {
    console.log('有visitorId 直接游客登录')
    // 有visitorId 直接游客登录
    Log.logd('User visitorLogin().')
    var data = { 'visitor_id': visitorId }
    var url = USER_URL_BASE + 'visitor/login'

    Request.directlyReq(url, data, function (data) {
      console.log('当前游客登录成功')
      Log.logi('Visitor login data: ' + JSON.stringify(data))
      mUserSessionData.loginState = LoginState.VISITOR
      mUserSessionData.userState = UserState.ERR
      mUserSessionData.token = data.data.result.token
      mUserSessionData.tokenExpire = parseInt(data.data.result.token_expire)
      mUserSessionData.visitor_id = parseInt(data.data.result.visitor_id)
      mUserSessionData.tokenExpireAtTime =
        Math.floor(new Date() / 1000) + mUserSessionData.tokenExpire
      Cache.setStorageData(StorageKey.SESSIONDATA, mUserSessionData)
      startTokenRefresher()
      // 首次加载数据
      console.log('首次加载数据')
      loadPageData()
      if (done) {
        done(mUserSessionData.loginState, mUserSessionData.userState)
      }
      if (final) {
        final()
      }
    }, function (error) {
      console.log('游客登录失败')      
      Log.logi('Error: Visitor login failed (' + error + ')')
      if (failure) {
        failure()
      }
      if (final) {
        final()
      }
    })
  } else {
    console.log()
    console.log('visitorId没有或者失效，进行(重新)游客注册')
    // visitorId没有或者失效，进行(重新)游客注册
    visitorRegister(done, failure, final)
  }
}
// token过期
export function notifyTokenExpired() {
  Log.logd('Notify token expired.')
  if (mUserSessionData.loginState === LoginState.USER) {
    autoLogin(null, function (errorCode) {
      Log.logd('Notify token expired, auto login failed(' + errorCode + ')')
      visitorLogin(null, null, function () {
        // final.
        if (errorCode === 20104 || errorCode === 20112) { // Already logged in on other device.// Auto login model expired.
          // TODO:
          let params = router.currentRoute.params
          params['history'] = router.currentRoute.name
          params['scene'] = 1 // 1: 被迫登出
          router.push({ name: 'login', params: params })
        }
      })
    })
  } else {
    visitorLogin(null, null)
  }
}
// 读取用户信息
export function loadUserData() {
  Log.logi('User loadUserData().')
  mUserData = Cache.getStorageData(StorageKey.USERDATA)
  if (!mUserData) {
    Log.logd('No user data found, will create one.')
    // var visitor_id = ''
    var device_id = ''
    try {
      Log.logd('Get device id.')
      device_id = wx.getSystemInfo.model + new Date().getTime()
    } catch (e) {
      Log.loge('Get device id got error: ' + e)
      device_id = 'mini' + new Date().getTime()
    }
    mUserData = {
      device_id: device_id,
      lastUser: '',
      autoLoginId: 0,
      isAutoLogin: 1,
    }
  }
  mUserSessionData = Cache.getStorageData(StorageKey.SESSIONDATA)
  if (!mUserSessionData) { // App start first involve User.js.
    Log.logd('Creating user session data.')
    mUserSessionData = {
      loginState: LoginState.NONE,
      token: '',
      tokenExpire: 0, // Token will be expired at this time.
      tokenExpireAtTime: 0,
      userState: UserState.ERR
    }
  }
  Log.logi('loadUserData: UserData = ' + JSON.stringify(mUserData))
  Log.logi('loadUserData: UserSEssionData = ' + JSON.stringify(mUserSessionData))
}
// 读取首页数据
export function loadPageData() {
  console.log('加载首页数据被调用')
  // 检测本地是否有首页数据，有则返回 无则加载
  // banner
  var bannerData = Cache.getStorageData(StorageKey.BANNERDATA)
  console.log(bannerData)
  if (!bannerData) {
    console.log('检测本地没有首页数据')
    Epg.getBanner(function(data){
      console.log(data)
    }, function(err){
      console.log(err)      
    })
  }
  // card
  var cardData = Cache.getStorageData(StorageKey.CARDDATA)
  console.log(cardData)
  if (!cardData) {
    console.error('检测本地没有首页card数据')
    Epg.getCard(function (data) {
      console.log(data)
    }, function (err) {
      console.log(err)
    })
  }
}
var mTokenRefreshTimer
export function startTokenRefresher() {
  var now = Math.floor(new Date() / 1000)
  var expireAt = mUserSessionData.tokenExpireAtTime - TOKEN_EXPIRE_THRESHOLD
  var interval = expireAt - now
  Log.logd('Start token refresher, now=' + now + ', interval=' + interval)
  if (interval > 0) {
    if (mTokenRefreshTimer) {
      clearTimeout(mTokenRefreshTimer)
    }
    mTokenRefreshTimer = setTimeout(function () {
      refreshTokenIfNeeded()
      mTokenRefreshTimer = null
    }, interval * 1000)
  } else {
    refreshTokenIfNeeded()
  }
}

export function stopTokenRefresher() {
  if (mTokenRefreshTimer) {
    Log.logd('Stop token refresher.')
    clearTimeout(mTokenRefreshTimer)
    mTokenRefreshTimer = null
  }
}

export function refreshTokenIfNeeded() {
  if (mUserSessionData && mUserSessionData.loginState !== LoginState.NONE) {
    var now = Math.floor(new Date() / 1000)
    if (now + TOKEN_EXPIRE_THRESHOLD >= mUserSessionData.tokenExpireAtTime) {
      Log.logd('Refresh token, now=' + now)
      if (mUserSessionData.loginState === LoginState.USER) {
        // The mUserData.isAutoLogin flag maybe not set, but we can
        // still use autologin to refresh token within the session.
        Log.logd('Refresh token user login.')
        autoLogin(null, function (errorCode) {
          Log.loge('[Fatal Error] Refresh token user login failed, will try visitor login.')
          visitorLogin(null, null)
        })
      } else {
        Log.logd('Refresh token visitor login.')
        visitorLogin(null, null)
      }
    }
  }
}
export function getToken() {
  return (mUserSessionData && mUserSessionData.token) ? mUserSessionData.token : ''
}
// module.exports = {
//   login: login,
//   loginInit: loginInit,
//   notifyTokenExpired: notifyTokenExpired,
//   getToken: getToken,
//   StorageKey: StorageKey
// };