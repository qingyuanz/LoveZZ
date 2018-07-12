// pages/chat/chat.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chatNum: 0,
    chatList: [],
    inputValue: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  onShow:function(){
    this.getMsgList()
    if (!util.isGetToken()) {
      util.getToken()
    }
  },
  
  getMsgList: function() {
    console.log('-> getMsgList')
    var that = this
    var msgUrl = app.globalData.apiBaseUrl + "/v1/index/message"
    wx.request({
      url: msgUrl,
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        console.log(res.data)
        that.parseMsgList(res.data)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  parseMsgList: function(msgList) {
    var mList = []
    msgList.forEach(function(data) {
      var item = {
        'face': data['user']['avatar_url'],
        'nickname': data['user']['nickname'],
        'time': data['msg']['created_at'],
        'words': data['msg']['content']
      }
      mList.push(item)
    })

    this.setData({
      'chatNum': mList.length,
      'chatList': mList
    })
  },

  blessMsg: function() {
    console.log('-> blessMsg')
    var that = this
    var msgUrl = app.globalData.apiBaseUrl + "/v1/index/message"
    var token = 'Bearer ' + app.globalData.g_token

    if (that.data.inputValue) {
      var words = that.data.inputValue
      wx.request({
        url: msgUrl,
        method: 'POST',
        header: {
          "content-type": "application/json",
          "Authorization": token
        },
        data: {
          words: words
        },
        success: function(res) {
          console.log(res.data)
          if (res.statusCode != 200) {
            if (res.statusCode == 401) {
              wx.removeStorageSync('token')
            }
            return
          }

          that.parseBlessMsg(res.data)
        },
        fail: function(error) {
          console.log('error', error)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您还没有填写内容',
        showCancel: false
      })
    }

    that.setData({
      inputValue: '' //将data的inputValue清空
    })
  },

  parseBlessMsg: function(data) {
    var item = {
      'face': data['user']['avatar_url'],
      'nickname': data['user']['nickname'],
      'time': data['user']['created_at'],
      'words': data['msg']['content']
    }

    this.data.chatList.unshift(item)
    this.setData({
      'chatNum': this.data.chatList.length,
      'chatList': this.data.chatList
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})