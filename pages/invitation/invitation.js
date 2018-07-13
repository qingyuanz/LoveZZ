// pages/invitation/invitation.js
var util = require('../../utils/util.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('invitation onLoad')
    if (app.globalData.g_vmData) {
      this.setData({
        mainInfo: app.globalData.g_vmData.main_info
      })
    } else {
      app.vmDataCallback = vmData => {
        if (vmData != null) {
          this.setData({
            mainInfo: vmData.main_info,
            slideList: vmData.slide_list
          })
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    if (!util.isGetToken()) {
      util.getToken()
    }
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    util.shareApp()
  },

  callhe: function (event) {
    wx.makePhoneCall({
      phoneNumber: this.data.mainInfo.he_tel
    })
  },

  callshe: function (event) {
    wx.makePhoneCall({
      phoneNumber: this.data.mainInfo.she_tel
    })
  }
})