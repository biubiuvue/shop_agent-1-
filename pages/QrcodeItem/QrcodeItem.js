// QRCode.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    windowHeight: '',
    qrImg: '',
    onLoaded: true,
    imgalist: []
  },
  // openSettings() {
  //   let _this = this;
  //   wx.openSetting({
  //     success: (res) => {
  //       _this.saveImage();
  //     }
  //   })
  // },
  // saveImage() {
  //   let _this = this;
  //   let qrImg = _this.data.qrImg;
  //   wx.showModal({
  //     content: '是否保存图片?',
  //     success: function (res) {
  //       if (res.confirm) {
  //         var imgSrc = qrImg;
  //         wx.downloadFile({
  //           url: imgSrc,
  //           success: function (res) {
  //             wx.saveImageToPhotosAlbum({
  //               filePath: res.tempFilePath,
  //               success: function (data) {
  //                 wx.showToast({
  //                   title: '图片保存成功!',
  //                   icon: 'success',
  //                   duration: 2000
  //                 })
  //               },
  //               fail: function (err) {
  //                 wx.showModal({
  //                   title: '授权提醒',
  //                   content: '为更好的提供服务，需要您为我们授权部分功能，保证软件运行友好。',
  //                   showCancel: false,
  //                   success() {
  //                     _this.openSettings();
  //                   }
  //                 })
  //               }
  //             })
  //           }
  //         })
  //       } else if (res.cancel) {
  //         wx.hideLoading();
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
  previewImage: function (e) {
    let _this = this;
    var current = e.currentTarget.dataset.src;
    _this.data.imgalist.push(current);
    wx.previewImage({
      current: current,
      urls: this.data.imgalist
    })
  },
  onLoad: function (options) {
    let _this = this;
    let qrImg = app.globalData.qrImg;
    _this.setData({
      qrImg,
      onLoaded: false
    })
  },
  onShow: function () {
    app.getWindowInfo();
    this.setData({
      windowHeight: app.globalData.windowHeight
    })
  }
})