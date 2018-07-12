App({
  onLaunch: function() {
    var _token = wx.getStorageSync('token')
    if(!_token || _token==''){
      wx.clearStorageSync()
      this._login()
    }
    this.globalData.g_token = _token
    console.log(_token)
    this._getIndexVMData()
  },

  _login: function() {
    var that = this
    wx.login({
      success: function(res) {
        console.log('wx login success', res.code)
        if (res.code) {
          var code = res.code

          // 调用 getUserInfo 获取 encryptedData 和 iv
          wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
              console.log('wx getUserInfo success', res)
              that.globalData.userInfo = res.userInfo
              var encryptedData = res.encryptedData || 'encry'
              var iv = res.iv || 'iv'
              that._getToken(code, iv, encryptedData)
            },
            fail: function(error) {
              wx.showModal({
                title: '注意',
                showCancel: false,
                confirmText: '好去授权',
                content: '为了您更好的体验,请先同意授权',
                success: function(res) {
                  wx.navigateTo({
                    url: '/pages/auth/auth'
                  })
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  _getToken: function (code, iv, encryptedData) {
    console.log('-> getToken')
    var that = this
    var getTokenUrl = this.globalData.apiBaseUrl + "/v1/user/token"
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
      success: function(res) {
       console.log(res)
       var token = res.data.token
       wx.setStorageSync('token', token)
       that.globalData.g_token = token
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  _getIndexVMData: function() {
    console.log('-> getIndexVMData')
    var indexVMUrl = this.globalData.apiBaseUrl + "/v1/index/vm"
    var that = this
    wx.request({
      url: indexVMUrl,
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        console.log(res.data)
        that.globalData.g_vmData = res.data

        if (that.vmDataCallback) {
          that.vmDataCallback(res.data);
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  globalData: {
    g_isPlayingMusic: true,
    apiBaseUrl: "https://wx.thomasx.top",
    g_token: null,
    g_vmData: null,
  }
})