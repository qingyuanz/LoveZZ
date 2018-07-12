// pages/bless/bless.js
var util = require('../../utils/util.js')
var app = getApp()
var ctx = null;
var timer = null; // 循环定时器
var timer_interval = 20
var ani_t_end = 1.15
var factor = {
  speed: .02, // 运动速度，值越小越慢
  t: 0 //  贝塞尔函数系数
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanNum: 0,
    all_count: 0,
    list: [],
    style_img: '',
    bubbling: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    ctx = wx.createCanvasContext('canvas_wi')
  },

  onShow: function(){
    this.getBlessings()
    if (!util.isGetToken()) {
      util.getToken()
    }
  },

  onUnload: function() {
    if (timer != null) {
      clearInterval(timer);
    }
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
        var all_bless = that.calAllBless(res.data)

        that.setData({
          list: res.data,
          zanNum: res.data.length,
          all_count: all_bless
        })
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  calAllBless: function(list) {
    var all_bless = 0
    list.forEach(function(data) {
      all_bless += data['blessing_count']
    })
    return all_bless
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
        if (res.statusCode != 200) {
          if (res.statusCode == 401) {
            wx.removeStorageSync('token')
            wx.showToast({
              icon: 'none',
              title: '抱歉！祝福失败！请重新打开小程序授权'
            })
          }
          return
        }

        const list = that.data.list.map(item => item);

        function getIndex(openid) {
          for (let i = 0; i < list.length; i += 1) {
            if (list[i].openid === openid) {
              return i
            }
          }
          return -1
        }
        const index = getIndex(res.data.openid)
        if (index >= 0) {
          list.splice(index, 1)
          list.unshift(res.data)
        } else {
          list.unshift(res.data)
        }

        var all_bless = that.calAllBless(list)
        that.setData({
          list,
          all_count: all_bless
        })

        wx.showToast({
          icon: 'none',
          title: '谢谢祝福！'
        })
      },
      fail: function(error) {
        console.log('error', error)
      }
    })
  },

  drawImage: function(data) {

    var that = this
    var p10 = data[0][0]; // 三阶贝塞尔曲线起点坐标值
    var p11 = data[0][1]; // 三阶贝塞尔曲线第一个控制点坐标值
    var p12 = data[0][2]; // 三阶贝塞尔曲线第二个控制点坐标值
    var p13 = data[0][3]; // 三阶贝塞尔曲线终点坐标值

    var p20 = data[1][0];
    var p21 = data[1][1];
    var p22 = data[1][2];
    var p23 = data[1][3];

    var p30 = data[2][0];
    var p31 = data[2][1];
    var p32 = data[2][2];
    var p33 = data[2][3];

    var t = factor.t;

    /*计算多项式系数 （下同）*/
    var cx1 = 3 * (p11.x - p10.x);
    var bx1 = 3 * (p12.x - p11.x) - cx1;
    var ax1 = p13.x - p10.x - cx1 - bx1;
    var cy1 = 3 * (p11.y - p10.y);
    var by1 = 3 * (p12.y - p11.y) - cy1;
    var ay1 = p13.y - p10.y - cy1 - by1;
    var xt1 = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p10.x;
    var yt1 = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p10.y;
    var cx2 = 3 * (p21.x - p20.x);
    var bx2 = 3 * (p22.x - p21.x) - cx2;
    var ax2 = p23.x - p20.x - cx2 - bx2;
    var cy2 = 3 * (p21.y - p20.y);
    var by2 = 3 * (p22.y - p21.y) - cy2;
    var ay2 = p23.y - p20.y - cy2 - by2;
    var xt2 = ax2 * (t * t * t) + bx2 * (t * t) + cx2 * t + p20.x;
    var yt2 = ay2 * (t * t * t) + by2 * (t * t) + cy2 * t + p20.y;
    var cx3 = 3 * (p31.x - p30.x);
    var bx3 = 3 * (p32.x - p31.x) - cx3;
    var ax3 = p33.x - p30.x - cx3 - bx3;
    var cy3 = 3 * (p31.y - p30.y);
    var by3 = 3 * (p32.y - p31.y) - cy3;
    var ay3 = p33.y - p30.y - cy3 - by3;

    /*计算xt yt的值 */
    var xt3 = ax3 * (t * t * t) + bx3 * (t * t) + cx3 * t + p30.x;
    var yt3 = ay3 * (t * t * t) + by3 * (t * t) + cy3 * t + p30.y;
    factor.t += factor.speed;

    ctx.drawImage("/images/heart1.png", xt1, yt1, 30, 30);
    ctx.drawImage("/images/heart2.png", xt2, yt2, 30, 30);
    ctx.drawImage("/images/heart3.png", xt3, yt3, 30, 30);
    ctx.draw()
    if (factor.t > ani_t_end) {
      factor.t = 0
      clearInterval(timer)
      that.setData({
        'bubbling': false
      })
    } else {
      clearInterval(timer)
      timer = setInterval(function() {
        that.drawImage([
          [{
            x: 30,
            y: 400
          }, {
            x: 70,
            y: 300
          }, {
            x: -50,
            y: 150
          }, {
            x: 30,
            y: 0
          }],
          [{
            x: 30,
            y: 400
          }, {
            x: 30,
            y: 300
          }, {
            x: 80,
            y: 150
          }, {
            x: 30,
            y: 0
          }],
          [{
            x: 30,
            y: 400
          }, {
            x: 0,
            y: 90
          }, {
            x: 80,
            y: 100
          }, {
            x: 30,
            y: 0
          }]
        ])
      }, timer_interval)
    }
  },

  onClickImage: function() {
    var that = this
    if (that.data.bubbling) {
      return
    }

    that.setData({
      'bubbling': true
    })

    that.setData({
      style_img: 'transform:scale(1.3);'
    })
    setTimeout(function() {
      that.setData({
        style_img: 'transform:scale(1);'
      })
    }, 500)

    that.bless()

    that.drawImage([
      [{
        x: 30,
        y: 400
      }, {
        x: 70,
        y: 300
      }, {
        x: -50,
        y: 150
      }, {
        x: 30,
        y: 0
      }],
      [{
        x: 30,
        y: 400
      }, {
        x: 30,
        y: 300
      }, {
        x: 80,
        y: 150
      }, {
        x: 30,
        y: 0
      }],
      [{
        x: 30,
        y: 400
      }, {
        x: 0,
        y: 90
      }, {
        x: 80,
        y: 100
      }, {
        x: 30,
        y: 0
      }]
    ])
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})