// drawback.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array:['卖家缺货','不买了','拍错了'],
    index: 0,
    refundMoney:0,
    content:'',
    orderid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  makeContent:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  backuptap:function(e){
    wx.navigateBack(1)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //点击确认
  confirmRefund:function(e){
    let _this=this;
    let orderid=_this.data.orderid
      console.log(_this.data.index)
    console.log(_this.data.array[_this.data.index])
    let data={
      orderid:orderid,
        type:'reful',
        reason:_this.data.array[_this.data.index],
        content:_this.data.content
    }
      esTools.fn.setEmpty().setSession().signData(data).setMethod('put').setExtraUrl('operationOrder').orders(function (res) {
          if (app.globalData.debug === true) {
              console.log('drawback.js orders refu res');
              console.log(res);
          }
          if(res.statusCode==1){
              // wx.redirectTo({
              //     url: '/pages/orderDetail/orderDetail?orderid=' + orderid,
              // })
              wx.switchTab({
                  url:'/pages/center/center'
              })
          }else{
              wx.showModal({
                  title:'提示',
                  content: '申请退款失败'+res.data
              })
          }
      })

  },
  onLoad: function (options) {
    this.setData({
      refundMoney:options.price,
        orderid:options.orderid
    })
  }

})