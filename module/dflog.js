const LOG_LEVEL_D = 0
const LOG_LEVEL_I = 1
const LOG_LEVEL_E = 2

var logLevel = LOG_LEVEL_D

/* debug information */
function logd(str) {
  if (LOG_LEVEL_D >= logLevel) {
    console.debug('[iTalkTV-D] ' + str)
  }
}

/* public information */
function logi(str) {
  if (LOG_LEVEL_I >= logLevel) {
    console.info('[iTalkTV-I] ' + str)
  }
}

/* errors */
function loge(str) {
  if (LOG_LEVEL_E >= logLevel) {
    console.error('[iTalkTV-E] ' + str)
  }
}
module.exports = {
  logd: logd,
  logi: logi,
  loge: loge
}