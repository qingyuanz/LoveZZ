// pages/bless/bless.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanNum: 0,
    zanLog: [],
    list: [],
    ani: false
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
        that.setData({
          list: res.data
        })
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
        'openid': data['openid'],
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

    that.setData({ ani: true })

    wx.request({
      url: indexVMUrl,
      method: 'POST',
      header: {
        "content-type": "application/json",
        "Authorization": token
      },
      success: function(res) {
        const list = that.data.list.map(item => item);
        function getIndex(openid) {
          for (let i = 0; i < list.length; i += 1) {
            if (list[i].openid === openid) {
              return i;
            }
          }
          return -1;
        }
        const index = getIndex(res.data.openid);
        if (index > 0) {
          list[index] = res.data;
        } else {
          list.push(res.data);
        }
        that.setData({ list });
      },
      fail: function(error) {
        console.log('error', error)
      }
    })
  },

  setList: function(data) {
    var item = {
      'openid': data['openid'],
      'face': data['avatar_url'],
      'blessing_count': data['blessing_count']
    }
    const list = this.data.zanLog;
    list.every(function () {

    });
    this.setData({
      'zanNum': this.data.zanLog.length,
      'zanLog': this.data.zanLog
    })
  },

  parseBless: function(data) {
    this.setList(data)
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