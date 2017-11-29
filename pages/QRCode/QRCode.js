// QRCode.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
let util = require('../../utils/util');
Page({
    data: {
        windowHeight: '',
        halfHeight: '',
        qrImg: '',
        qrShow: '',
        qrData: '',
        shareId: '',
        onLoaded: true,
        imgalist: [],
    },
    clickQrcodeItem() {
        let _this = this;

        let qrImg = _this.data.qrImg;
        if (!qrImg) {
            wx.showModal({
                title: '异常提醒',
                content: '暂时无法生成二维码，可能是您的权限不够或系统暂未设置。',
                showCancel: false,
            });
            return false;
        }
        let current = qrImg;
        _this.data.imgalist.push(current);
        wx.previewImage({
            current: current,
            urls: _this.data.imgalist
        })
    },
    onLoad: function (options) {
        let _this = this;
        let data = {
            type: 'wxapp'
        }
        esTools.fn.setEmpty().setSession().signData(data).setMethod('get').qrimgs(function (res) {
            if (app.globalData.debug === true) {
                console.log('QRCode.js get qrimgs res');
                console.log(res);
            }
            if (res.statusCode == 1) {
                _this.data.imgalist.push(res.data.qrImg);

                if (res.data.qrImg.errno) {
                    _this.setData({
                        qrShow: false,
                        onLoaded: false,
                        qrData: res.data
                    })
                } else {
                    _this.setData({
                        qrImg: res.data.qrImg,
                        shareId: res.data.shareId,
                        qrShow: true,
                        onLoaded: false
                    })
                }
            } else {
                _this.setData({
                    qrShow: false,
                    qrData: res.data,
                    onLoaded: false
                })
                if (res.statusCode == -3) {
                  wx.showModal({
                    title: '温馨提醒',
                    content: res.data,
                    confirmText:'立即完善',
                    confirmColor:'#ec5151',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../userInfo/userInfo'
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
            }
        })
    },
    onShow: function () {
        app.getWindowInfo();
        this.setData({
            windowHeight: app.globalData.windowHeight,
            halfHeight: app.globalData.halfHeight
        })
    },
    //分享 (2017-10-21 17:51)
    onShareAppMessage: function (res) {
        let _this = this;
        let shareId = _this.data.shareId;
        let title = '';
        let imageUrl = '';
        if (app.globalData.shareData.title !== undefined) {
            title = app.globalData.shareData.title;
            imageUrl = app.globalData.shareData.icon;
            console.log(title, imageUrl);
        }
        if (res.from === 'button') {  //点击btn
            return {
                title,
                imageUrl,
                path: '/pages/strap/strap?shareUser=' + shareId,
                success: function (res) {
                    // 转发成功
                    console.log('转发成功!');
                    console.log(res);
                    console.log('/pages/strap/strap?shareUser=' + shareId)
                },
                fail: function (res) {
                    // 转发失败
                    console.log('转发失败!');
                    console.log(res);
                }
            }
        }
        return {
            title,
            imageUrl,
            path: '/pages/strap/strap?shareUser=' + shareId,
            success: function (res) {
                // 转发成功
                console.log('转发成功!');
                console.log(res);
                console.log('/pages/strap/strap?shareUser=' + shareId)
            },
            fail: function (res) {
                // 转发失败
                console.log('转发失败!');
                console.log(res);
            }

        }

    }
})