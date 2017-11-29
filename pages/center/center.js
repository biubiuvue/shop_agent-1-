//center.js
let app = getApp();
let util = require('../../utils/util');
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
let config = require('../../utils/config');
Page({
  data: {
    text: "Page center",
    avatar: '',
    nickname: '',
    level: '',
    status0Num: 0,
    status1Num: 0,
    status2Num: 0,
    status3Num: 0,
    defaultImg: 'http://img5.imgtn.bdimg.com/it/u=1502397120,2400659771&fm=23&gp=0.jpg',
    yue: 0.00,
    jifen: 0,
    userInfo: '',
    default: false,
    defaultName: '匿名用户',
    windowHeight: 0,
    copyright:{}
  },
  setupTap: function (e) {
    wx.navigateTo({ url: '/pages/setup/setup' })
  },
  //点击充值
  depositTap: function () {
    wx.navigateTo({
      url: '/pages/deposit/deposit',
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let _this = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        _this.setData({
          userInfo: res.userInfo
        })
      },
      fail: function (res) {
        console.log(res);
        _this.setData({
          default: true
        })
      }
    });
    function runcenter() {
      let member = {
      };
      esTools.fn.setEmpty().setSession().signData(member).setMethod('get').setExtraUrl('memberInfo').members(function (res) {
        if (app.globalData.debug === true) {
          console.log('cneter.js members res');
          console.log(res);
        }
        if (res.statusCode === 1) {
          _this.setData({
            // avatar: res.data.avatar,
            // nickname: res.data.nickname,
            level: res.data.leveldetail.levelname,
            yue: res.data.credit2,
            jifen: res.data.credit1
          });
        } else {
          // console.log('请求接口数据失败：' + res)
        }
      })
    };
    runcenter()

  },
  orderTap: function (e) {
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({ url: '/pages/orderStatus/orderStatus?status=' + status })
  },
  //点击收藏
  enterSCtap: function (event) {
    wx.navigateTo({
      url: '/pages/favorite/favorite'
    })
  },
  //点击足迹
  enterGZtap: function (event) {
    wx.navigateTo({
      url: '/pages/history/history'
    })
  },
  goDistributionCenter() {
    wx.navigateTo({ url: '/pages/distributionCenter/distributionCenter' });
  },
  //我的二维码
  myCode: function () {
    wx.navigateTo({
      url: '/pages/QRCode/QRCode'
    })
  },
  //  我的优惠券
    goCoupon:function () {
        wx.navigateTo({
            url:'/pages/coupon/coupon'
        })
    },
  myshareTap: function (event) {
    wx.showModal({
      title: '提示',
      content: '暂未开通，敬请期待',
    })
  },
  weichouTap: function (event) {
    wx.showModal({
      title: '提示',
      content: '暂未开通，敬请期待',
    })
  },
  helpTap: function (event) {
    wx.showModal({
      title: '提示',
      content: '暂未开通，敬请期待',
    })
  },
  //aboutUS
  aboutUs: function (e) {
    let identification = 'aboutUs';
    wx.navigateTo({
      url: '/pages/topic/topic?identification=' + identification
    })
  },
  onShow: function () {
    let _this = this;
    let data = {};
    let  copyright=config.copyright
    _this.setData({
      copyright
    })
    wx.getSystemInfo({
      success: function (res) {
        let windowHieght = `height:${res.windowHeight}px`;
        _this.setData({
          windowHeight: windowHieght
        })
      }
    })
    esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('statistics').orders(function (res) {
      if (res.statusCode == 1) {
        _this.setData({
          status0Num: res.data.o_status_0_count,
          status1Num: res.data.o_status_1_count,
          status2Num: res.data.o_status_2_count,
          status3Num: res.data.o_status_3_count,
        })
      }
    })
  }

})