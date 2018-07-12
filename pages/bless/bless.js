// pages/bless/bless.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanNum: 0,
    zanLog: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBlessings()
  },

  getBlessings: function() {
    console.log('-> getBlessings')
    var that = this
    var indexVMUrl = app.globalData.apiBaseUrl + "/v1/index/blessing"
    wx.request({
      url: indexVMUrl,
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        console.log(res.data)
        that.parseBlessList(res.data)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  parseBlessList: function(blessList) {
    var bList = []
    blessList.forEach(function(data) {
      var item = {
        'face': data['avatar_url'],
        'blessing_count': data['blessing_count']
      }
      bList.push(item)
    })

    this.setData({
      'zanNum': blessList.length,
      'zanLog': bList
    })
  },

  bless: function() {
    console.log('-> getBlessings')
    var that = this
    var indexVMUrl = app.globalData.apiBaseUrl + "/v1/index/blessing"
    var token = 'Bearer ' + app.globalData.g_token
    wx.request({
      url: indexVMUrl,
      method: 'POST',
      header: {
        "content-type": "application/json",
        "Authorization": token
      },
      success: function(res) {
        console.log(res.data)
        that.parseBless(res.data)
      },
      fail: function(error) {
        console.log('error', error)
      }
    })
  },

  parseBless: function(data) {
    var item = {
      'face': data['avatar_url'],
      'blessing_count': data['blessing_count']
    }

    this.data.zanLog.push(item)
    this.setData({
      'zanNum': this.data.zanLog.length,
      'zanLog': this.data.zanLog
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})