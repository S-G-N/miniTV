/* epg interface */
var EPG_URL_BASE = 'http://epg20.italkmobiletv.colnv.com/df200/'
var Request = require('./request.js')
var User = require('./user.js')
var Cache = require('./cache.js')
console.log(User)
console.log(Request)
export function getBanner(done, failure) {
  console.log(User)
  console.log(User.StorageKey)
  var url = EPG_URL_BASE + 'content/banner'
  var SESSIONDATA = Cache.getStorageData(User.StorageKey.SESSIONDATA)
  console.log(SESSIONDATA.token)
  var params = {
    'token': SESSIONDATA.token,
    'updatetime': 0,
    'root_id': 1
  }
  console.log('即将请求banner，接下来调用cachableReq')  
  Request.cachableReq(url, params, done, failure)
}
export function getCard(done, failure) {
  console.log(User)
  console.log(User.StorageKey)
  var url = EPG_URL_BASE + 'content/card'
  var SESSIONDATA = Cache.getStorageData(User.StorageKey.SESSIONDATA)
  console.log(SESSIONDATA.token)
  var params = {
    'token': SESSIONDATA.token,
    'updatetime': 0,
    'root_id': 1,
    'page': 1
  }
  console.log('即将请求card，接下来调用cachableReq')
  Request.cachableReq(url, params, done, failure)
}
// module.exports = {
//   getBanner: getBanner
// };