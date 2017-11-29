// orderInfo.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({

  data: {
      ordernum: {},
      ordercom: [],
      windowHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.ordersn)
    let _this=this
    let data={
      ordersn:options.ordersn
    }
    esTools.fn.setSession().signData(data).setMethod('get').setExtraUrl('orders').commissions(function (res) {
      if(app.globalData.debug===true){
          console.log('orderInfo.js commissions orders res');
          console.log(res);
      }
      if(res.statusCode===1){
        _this.setData({
          ordernum :res.data.order,
          ordercom : res.data.commssion
        })
      }else{
        console.log('订单信息请求出错'+res.data)
      }
    })
    // this.setData({
    //     ordernum:{price:100,status:111,nickname:'zhangsn',id:1314,ordersn:1232323232,paytime:'2014-12-22'},
    //     ordercom:[{c_rank:'212',nickname:'zhagn',c_money:3000,id:23242,c_rate:2}]
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      app.getWindowInfo()
      this.setData({
          windowHeight:app.globalData.windowHeight
      })
      console.log(app.globalData.windowHeight)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})