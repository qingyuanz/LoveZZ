const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const _getToken = function (code, iv, encryptedData) {
  console.log('-> getToken')
  var that = this
  var app = getApp()
  var getTokenUrl = app.globalData.apiBaseUrl + "/v1/user/token"
  wx.request({
    url: getTokenUrl,
    method: 'POST',
    header: {
      "content-type": "application/json"
    },
    data: {
      code: code,
      iv: iv,
      encry: encryptedData
    },
    success: function (res) {
      console.log(res)
      wx.setStorageSync('token', res.data.token)
      app.globalData.g_token = res.data.token
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

const getToken = function() {
  var that = this
  var app = getApp()
  console.log('-> login')

  wx.login({
    success: function(res) {
      if (res.code) {
        var code = res.code
        // 调用 getUserInfo 获取 encryptedData 和 iv
        wx.getUserInfo({
          withCredentials: true,
          success: function(res) {
            console.log('wx.getUserInfo success', res)
            app.globalData.userInfo = res.userInfo
            var encryptedData = res.encryptedData || 'encry'
            var iv = res.iv || 'iv'
            _getToken(code, iv, encryptedData)
          },
          fail: function(error) {
            wx.showModal({
              title: '注意',
              showCancel: false,
              confirmText: '授权',
              content: '为了您更好的体验,请先同意授权',
              success: function(res) {
                wx.navigateTo({
                  url: '/pages/auth/auth'
                })
              }
            })
          },
          complete: function() {}
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    },
    complete: function() {}
  })
}

const getAuth = function() {
  var that = this
  var app = getApp()
  console.log('-> login')

  wx.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.userInfo']) {
        // 没有授权跳到授权页
        wx.navigateTo({
          url: '/pages/auth/auth'
        })
      }
    }
  })
}

const isGetToken = function() {
  var token = wx.getStorageSync('token')
  if (!token || token == '') {
    return false
  } else {
    return true
  }
}

module.exports = {
  formatTime: formatTime,
  isGetToken: isGetToken,
  getAuth: getAuth,
  getToken: getToken
}