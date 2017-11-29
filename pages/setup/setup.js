// setup.js
var app = getApp()
var wshoto = require('../../utils/wshoto.js')

Page({
  data: {
    text: "Page setup"
  },
  backuptap:function(){
    wx.navigateBack(1)
  },
  addeditTap: function (e) {
    var edit = e.target.dataset.edit;
    wx.redirectTo({ url: '/pages/addressEdit/addressEdit?edit=' + edit })
  },
  scanTap: function (e) {
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})