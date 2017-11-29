let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    windowHeight: 0,  //显示屏高度
    windowWidth: 0,  //显示屏宽度
    animationData: {}
  },
  loginState: function () {
    // wx.setStorageSync('apiToken', null);
    // wx.setStorageSync('sessionKey', null);

    // 登陆页面，自动获取token。
    // 其他页面，根据自行考虑是否执行。
    wsTools.fn.getApiToken(function (res) {
      if (app.globalData.debug === true) {
        console.log('strap.js onLoad getApiToken');
        console.log(res);
      }
      console.log('strap getApiToken');
      console.log(res);
      if (res.statusCode === 1) {
        esTools.fn.getSession(function (rex) {
          console.log('strap getSession');
          console.log(rex);
          wx.hideLoading();
          if (rex.statusCode === 1) {

            //修改2017-11-23 
            // 由于之前的关系绑定在用户信息更新中。
            // 用户信息又会被sessionkey的更新时间所影响。
            // 所以将关系绑定额外添加至此。
            // 本来计划是做hook的方式，用于挂载，时间关系，先临时处理。
            // 在此处可能会印象整体的页面展示速度。
            let shareUser = wx.getStorageSync('es_commission');
            console.log('es_commission');
            console.log(shareUser);
            if (typeof shareUser !== 'undefined' && typeof shareUser.shareUser !== 'undefined' && shareUser.shareUser !== '') {
              let data = {
                'shareUser': shareUser.shareUser
              };
              esTools.fn.setEmpty().setSession().signData(data).setMethod('post').setExtraUrl('Agents').commissions(function (res) {
                if (app.globalData.debug === true) {
                  console.log('postAgents Res');
                  console.log(res);
                }
              })
            }

            wx.switchTab({
              url: '../index/index'
            });
          } else {
            wx.redirectTo({
              url: '../login/login'
            });
          }
        });
      } else {
        wx.showModal({
          title: '异常提醒',
          content: '系统异常，请彻底关闭小程序后进行重试（或彻底关闭微信）。',
          showCancel: false
        })
      }
    })
  },
  onLoad() {
    console.log('strap.js onLoad ');
    this.loginState();

  },
  onShow() {
    this.loginState();
    // 获取显示屏宽高
    /*let _this = this;
    // 获取显示屏宽高
    wx.getSystemInfo({
      success: function (res) {
        let height = `height:${res.windowHeight}px;`;
        let width = `width:${res.windowWidth}px;`
        _this.setData({
          windowHeight: height,
          windowWidth: width
        })
      }
    });
    let animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    _this.animation = animation

    animation.scale(1, 1).step();

    _this.setData({
      animationData: animation.export()
    })
  
    setTimeout(function () {
      animation.opacity(0).step();
      _this.setData({
        animationData: animation.export()
      })
      wx.showLoading({
        title: '加载中',
      })
      let that = this;
      setTimeout(function () {
        wx.hideLoading();
        that.loginState();
      }, 2000)
    }.bind(this), 3500)*/
  }
})