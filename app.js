var util = require('/utils/util.js')

App({
  onLaunch: function() {
    util.getAuth()
  },

  onShow: function(){
    this._getIndexVMData()
  },

  _getIndexVMData: function() {
    console.log('-> getIndexVMData')
    wx.showLoading()
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
      },
      complete: function () {
        wx.hideLoading()
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