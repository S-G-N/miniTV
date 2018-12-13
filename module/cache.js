/**
 * Cache manage for local storage.
 */
var Log = require("./dflog.js");
export function setStorageData(key, value) {
  try {
    console.log('正在缓存UserData')
    wx.setStorageSync( key, value)
  } catch (e) {
    Log.loge('setUserData key=' + key + ' failed.')
  }
}

export function getStorageData(key) {
  console.log(key)
  try {
    var value = wx.getStorageSync(key)
    if (value) {
      // Do something with return value
      return value
    } else {
      return null
    }
  } catch (e) {
    // Do something when catch error
    return null
  }
}

export function removeStorageData(key) {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    Log.loge('移除失败')
  }
}

export function setNormalData(key, value) {
  wx.setStorage({
    key: key,
    data: value
  })
}

export function getNormalData(key, done, fail) {
  console.log(key)
  wx.getStorage({
    key: key,
    success(res) {
      console.log(res.data)
      return res.data
    },
    fail(err) {
      console.log(err)
    }
  })
}

export function removeNormalData(key) {
  if (key) {
    removeStorage(key)
  } else {
    var len = localStorage.length
    for (var i = len - 1; i >= 0; i--) {
      var itrKey = localStorage.key(i)
      if (itrKey && itrKey.slice(0, LSKEY_PREFIX_USER.length) !==
        LSKEY_PREFIX_USER) {
        localStorage.removeItem(itrKey)
      }
    }
  }
}

// module.exports = {
//   setStorageData: setStorageData,
//   getStorageDat: getStorageDat,
//   removeStorageData: removeStorageData,
//   setNormalData: setNormalData,
//   getNormalDat: getNormalDat,
//   removeNormalData: removeNormalData
// };
