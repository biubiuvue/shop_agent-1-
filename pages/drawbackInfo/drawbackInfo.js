// drawbackInfo.js
var app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        refundInfo: {},
        refundid: '',
        onLoaded:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    backuptap: function (e) {
        wx.navigateBack(1)
    },
    cancelRefund: function (e) {
        let orderid = this.data.orderid
        let data = {
            orderid: orderid,
            type: 'canlreful'
        }
        esTools.fn.setEmpty().setSession().signData(data).setMethod('put').setExtraUrl('operationOrder').orders(function (res) {
            if (app.globalData.debug === true) {
                console.log('drawbackInfo.js orders canlreful res');
                console.log(res);
            }
            if (res.statusCode == 1) {
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 1500
                })
                wx.switchTab({
                    url: '/pages/center/center'
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '取消退款失败：' + 'res.data'
                })
            }
        })

    },
    onLoad: function (options) {
        console.log(options)
        let _this = this;
        let refundid = options.refundid;
        console.log(refundid)
        _this.setData({
            refundid: refundid,
        })
        let data = {
            refundid: refundid
        }
        esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('refund').orders(function (res) {
            if (app.globalData.debug === true) {
                console.log('drawbackInfo.js orders refund res');
                console.log(res);
            }
            if (res.statusCode == 1) {
                _this.setData({
                    refundInfo: res.data,
                    orderid: res.data.orderid,
                    onLoaded:false
                })
            } else {
                console.log('获取订单信息失败' + res.data)
            }
        })
    },
})