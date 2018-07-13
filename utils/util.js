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
  console.log('-> getToken')

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
            console.log(error)
            // wx.showModal({
            //   title: '注意',
            //   showCancel: false,
            //   confirmText: '授权',
            //   content: '为了您更好的体验,请先同意授权',
            //   success: function(res) {
            //     wx.navigateTo({
            //       url: '/pages/auth/auth'
            //     })
            //   }
            // })
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
  console.log('-> getAuth')

  wx.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.userInfo']) {
        console.log('navigate to auth page')
        // 没有授权跳到授权页
        wx.navigateTo({
          url: '/pages/auth/auth'
        })
      }
    },
    fail: (error)=>{
      console.log(error)
    }
  })
}

const isGetToken = function() {
  var token = wx.getStorageSync('token')
  if (!token || token == '') {
    console.log('not have token')
    return false
  } else {
    console.log('already have token')
    console.log(token)
    return true
  }
}

const shareApp = function(){
  var that = this
  var app = getApp()
  console.log('share app')
  return {
    title: app.globalData.g_vmData.main_info.share,
    imageUrl: app.globalData.g_vmData.main_info.thumb,
    path: 'pages/index/index',
    success: function (res) {
      wx.showToast({
        title: '分享成功',
      })
    },
    fail: function (res) {
      // 转发失败
      wx.showToast({
        title: '分享取消',
      })
    }
  }
}

module.exports = {
  formatTime: formatTime,
  isGetToken: isGetToken,
  getAuth: getAuth,
  getToken: getToken,
  shareApp: shareApp
}