// pages/auth/auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})