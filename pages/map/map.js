// pages/map/map.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  markertap(e) {
    console.log('markertap', e)

    var lng = this.data.mainInfo.longitude
    var lat = this.data.mainInfo.latitude

    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      scale: 18,
      name: this.data.mainInfo.hotel,
      address: this.data.mainInfo.address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('map onLoad')
    var that = this
    if (app.globalData.g_vmData) {
      that._setData(app.globalData.g_vmData)
    } else {
      app.vmDataCallback = vmData => {
        if (vmData != null) {
          that._setData(vmData)
        }
      }
    }
  },

  _setData: function(vmData) {
    var that = this
    var longitude = vmData.main_info.longitude
    var latitude = vmData.main_info.latitude

    that.setData({
      mainInfo: vmData.main_info,
      lng: longitude,
      lat: latitude,
      markers: [{
        iconPath: "/images/nav.png",
        id: 0,
        latitude: latitude,
        longitude: longitude,
        width: 40,
        height: 40
      }]
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})