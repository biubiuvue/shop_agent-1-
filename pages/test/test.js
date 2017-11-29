let app = getApp();
Page({
  data: {
    windowHeight: 0,  //显示屏高度
    windowWidth: 0,  //显示屏宽度
    animationData: {}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    // 获取显示屏宽高
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    let animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    this.animation = animation

    animation.scale(1, 1).step();

    this.setData({
      animationData: animation.export()
    })

    setTimeout(function () {
      animation.opacity(0).step()
      this.setData({
        animationData: animation.export()
      })
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
         wx.hideLoading();
        wx.switchTab({ url: '/pages/index/index' });
      }, 2000)
    }.bind(this), 2500)
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})