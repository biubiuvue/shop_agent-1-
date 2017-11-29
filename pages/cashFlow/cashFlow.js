/**
 * 2017.9.1
 * 孙秀明
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    ok: '0',  //可提现金额
    onLoaded:true
  },
  withdrawals() {
    let _this = this;

    wx.showModal({
      title: '确认提现?',
      success: function (res) {
        if (res.confirm) {
          let signData = {
            type:'2'
          }
          esTools.fn.setEmpty().setSession().signData(signData).setMethod('POST').setExtraUrl('withdrawals').commissions(function (res) {
            if (res.statusCode === 1) {
              console.log(res)
              wx.showToast({
                title: '提现成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showModal({
                title: '温馨提醒',
                content: res.data,
                confirmText: '立即完善',
                confirmColor: '#ec5151',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../userInfo/userInfo'
                    })
                  }
                }
              })
              console.log('cashFlow.js onLoad commissions/recordStatistics 接口错误' + res.data);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onLoad(options) {
    let _this = this;
    let signData = {
      type: ''
    }
    esTools.fn.setEmpty().setSession().signData(signData).setMethod('GET').setExtraUrl('recordStatistics').commissions(function (res) {
      console.log(res);
      if (res.statusCode === 1) {
        _this.setData({
          ok: res.data.ok.c_money_sum || 0,  //可提现金额
          onLoaded:false
        })

      } else {
        console.log('cashFlow.js onLoad commissions/recordStatistics 接口错误' + res.data);
      }
    })
  }
})