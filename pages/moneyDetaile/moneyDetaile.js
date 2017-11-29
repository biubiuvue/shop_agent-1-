/**
 * 2017.9.1
 * 孙秀明
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    windowHeight: '',
    moneylist: [],
    scroll_time: 2,
    load_time: 0,
    loaded: false,
    loadding: false,
    onLoaded:true
  },
  pullUpLoad(e) {
    let _this = this;
    if (_this.data.loaded === true || _this.data.loadding === true) {
      return false;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    _this.setData({
      loadding: true,
    });
    let scroll_time = _this.data.scroll_time;
    let moneylist = _this.data.moneylist;

    let signData = {
      type: 'all',
      page: scroll_time,
      psize: 6
    };
    esTools.fn.setEmpty().setSession().signData(signData).setMethod('GET').setExtraUrl('withdrawals').commissions(function (res) {
      if (res.statusCode === 1) {
        if (res.data.length === 0 || res.data.length < signData.psize) {
          _this.setData({
            loaded: true,
          });
          wx.hideToast();
          _this.setData({
            loadMoreData: '加载完毕，已经没有更多商品!'
          });
        }

        if (res.data.length !== 0) {
          scroll_time++;
          for (let i = 0; i < res.data.length; i++) {
            moneylist.push(res.data[i])
          }
          _this.setData({
            scroll_time: scroll_time,
            moneylist: moneylist,
            loadding: false
          });
          wx.hideToast();
        }
      } else {
        _this.setData({
          loaded: true,
        });
        wx.hideToast();
        wx.showModal({
          title: '加载失败',
          content: res.data,
          showCancel: false,
        });
      }
    });
  },
  onLoad() {
    let _this = this;
    let signData = {
      type: 'all',
      page: 1,
      psize: 6
    }
    esTools.fn.setEmpty().setSession().signData(signData).setMethod('GET').setExtraUrl('withdrawals').commissions(function (res) {
      console.log(res);
      if (res.statusCode === 1) {
        _this.setData({
          moneylist:res.data.all,
          onLoaded:false
        })
      } else {
        console.log('moneyDetaile.js onLoad commissions/withdrawals 接口错误' + res.data);
      }
    })
  },
  onShow() {
    // 获取显示屏宽高
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        let height = "height:" + res.windowHeight + 'px;';
        _this.setData({
          windowHeight: height,
        })
      }
    });
  },
})