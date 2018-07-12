// pages/index/index.js
var util = require('../../utils/util.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: true,
    slideList: [],
    isAutoPlayMusic: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('index onLoad')
    var that = this
    if (app.globalData.g_vmData != null) {
      var vmData = app.globalData.g_vmData
      that._setData(vmData)
    } else {
      app.vmDataCallback = vmData => {
        if (vmData != null) {
          that._setData(vmData)
        }
      }
    }
  },

  onShow: function() {
    console.log('index onShow')
  },

  _setData: function(vmData) {
    this.setData({
      mainInfo: vmData.main_info,
      slideList: vmData.slide_list,
      musicUrl: vmData.music_url,
      isAutoPlayMusic: vmData.main_info.is_auto_play_music || 0,
      isPlayingMusic: vmData.main_info.is_auto_play_music || 0
    })

    // 播放音乐
    if (this.data.isAutoPlayMusic == 1) {
      wx.playBackgroundAudio({
        dataUrl: this.data.musicUrl,
        title: '',
        coverImgUrl: ''
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    //console.log(that.data);
    return {
      title: that.data.mainInfo.share,
      imageUrl: that.data.mainInfo.thumb,
      path: 'pages/index/index',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },
  play: function(event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.musicUrl,
        title: '',
        coverImgUrl: ''
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
})