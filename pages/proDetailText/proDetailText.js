var app = getApp();
let util = require('../../utils/util');
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
let WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    text: "Page proDetailText",
    pro_info: '',
    onLoaded:true
  },
  proTap: function (event) {
    var pro_id = event.target.dataset.id;
    wx.redirectTo({ url: '/pages/pro_detail/pro_detail?id=' + pro_id })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var _this = this;

    function runprode() {
            // wx.showToast({
            //     title: '加载中',
            //     icon: 'loading',
            //     duration: 1000000
            // })
      let good={
        id:options.id
      }
        esTools.fn.setEmpty().setSession().signData(good).setMethod('get').setExtraUrl().products(function (res) {
            if (app.globalData.debug === true) {
                console.log('proDetailText.js products res');
                console.log(res);
            }
            if (res.statusCode === 1) {
                _this.setData({
                    pro_info: res.data.goods,
                    onLoaded:false
                });
                WxParse.wxParse('article', 'html', res.data.goods.content, _this,10 );
                wx.hideToast();
            }
        })
    }
    runprode()
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