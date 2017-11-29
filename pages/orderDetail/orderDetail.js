var app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    goodsArr: '',
    addressArr: '',
    dispatchArr: '',
    orderArr: '',
    dispatchid: '',
      detail:'',
      hidden:true,
      ordersn:'',
      pricePay:0.00
  },
  backuptap: function () {
    wx.navigateBack(1)
  },
  //点击弹出框右上角清除
  hideStandard: function () {
        this.setData({
            hidden: true
        })
    },
    //点击确认支付按钮
  confirmPay: function (e) {
        this.setData({
            hidden: false,
        })
    },
    //点击微信支付
  payTap:function () {
      console.log(111)
        let data={
            ordersn:this.data.ordersn,
            type:'1'
        }
        esTools.fn.setEmpty().setSession().signData(data).setMethod('post').setExtraUrl('payment').orders(function (res) {
            if (app.globalData.debug === true) {
                console.log('orderStatus.js orders/payment res');
                console.log(res);
            }
            if(res.statusCode==1){
                wx.showToast({
                    title:'支付成功',
                    icon:success,
                    duration:2000
                })
                wx.switchTab({
                    url:'/pages/center/center'
                })
            }else{
                wx.showModal({
                    title:'提示',
                    content:res.data,
                    duration:2000
                })
            }
        })
    },
  proTap(e) {
        //点击图片跳转详情
        let pro_id = e.target.dataset.id;
        wx.navigateTo({ url: '/pages/pro_detail/pro_detail?id=' + pro_id });
    },
  //点击确认支付按钮跳转到支付
  // payTap: function (e) {
  //   var orderid = e.target.dataset.id;
  //   var ordersn = e.target.dataset.ordersn;
  //   var price = e.target.dataset.price;
  //   wx.navigateTo({ url: '/pages/orderConfirm/orderConfirm?orderid=' + orderid + '&ordersn=' + ordersn + '&price=' + price })
  // },
  cancelOrdertap: function (e) {
    var _this = this;
    var orderId = parseInt(e.target.dataset.orderid);
      wx.showModal({
          title: '温馨提示',
          content: '确定要取消订单？',
          success: function (res) {
              if (res.confirm) {
                  let data={
                      orderid:orderId,
                      type:'canl'
                  }
                  esTools.fn.setEmpty().setSession().signData(data).setMethod('put').setExtraUrl('operationOrder').orders(function (res) {
                      if (app.globalData.debug === true) {
                          console.log('orderStatus.js orders canl res');
                          console.log(res);
                      }
                      if(res.statusCode==1){
                          wx.switchTab({
                              url:'/pages/center/center'
                          })
                      }else{
                          wx.showModal({
                              title:'提示',
                              content: '取消订单失败:'+res.data
                          })
                      }
                  })
              } else if (res.cancel) {//表示点击了取消
              }
          },
      })


  },
  //点击申请退款
  drawback: function (e) {
    let orderid = e.target.dataset.orderid;
      let goodsPrice = e.target.dataset.price;
    wx.navigateTo({
      url: '/pages/drawback/drawback?orderid=' + orderid+ '&price=' + goodsPrice,
    })
  },
  //点击退款申请中
  drawbackInfo: function (e) {
    let refundid = e.target.dataset.refundid;

    wx.navigateTo({
      url: '/pages/drawbackInfo/drawbackInfo?refundid=' + refundid,
    })
  },
  //点击确认收货
   confirmMark: function (e) {
    let orderid = e.target.dataset.orderid;
    wx.showModal({
        title:'提示',
        content:'请确认是否到货，否则会钱财两空哦',
        success:function (res) {
            if(res.confirm){
              let data={
                orderid:orderid,
                  type:'comf'
              }
                esTools.fn.setEmpty().setSession().signData(data).setMethod('put').setExtraUrl('operationOrder').orders(function (res) {
                    if (app.globalData.debug === true) {
                        console.log('orderDetail.js orders comf res');
                        console.log(res);
                    }
                    if(res.statusCode==1){
                        wx.switchTab({
                            url: '/pages/center/center'
                        })
                    }else{
                        wx.showModal({
                            title:'提示',
                            content: '确认收货失败:'+res.data
                        })
                    }
                })
            } else if (res.cancel) {
              //表示点击了取消
              }
        }
    })
  },
  //点击查看物流
  lookTrace: function (e) {
    let orderid = e.target.dataset.orderid;
    let express=e.target.dataset.express;
    let expresssn=e.target.dataset.expresssn;
    wx.navigateTo({
      url: '/pages/logistics/logistics?orderid=' + orderid+'&express='+express+'&expresssn='+expresssn,
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let _this = this;
    let orderid=options.orderid;
    console.log(orderid)
    let order={
      orderid:orderid
    }
    esTools.fn.setEmpty().setSession().signData(order).setMethod('get').orders(function (res) {
      if (app.globalData.debug === true) {
        console.log('orderDetail.js getorderDetail res');
        console.log(res);
        console.log(res.data)
      }
      if (res.statusCode == 1) {
        _this.setData({
            addressArr:res.data.address,
            goodsArr: res.data.goods,
            orderArr:res.data,
            dispatchArr:res.data.dispatch.dispatchname,
            detail:res.data,
            ordersn:res.data.ordersn
        })
      }
    }); 
    
    // _this.setData({
    //   goodsArr:[
    //     { thumb: '../../public/images/banner-02.jpg', title: '自行车', price: '199',
    //      total: '1', optiontitle:'mememma'},
    //       { thumb: '../../public/images/banner-02.jpg', title: '自行车', price: '199',
    //           total: '1', optiontitle:'mememma'}
    //   ],
    //   addressArr:{realname:'张三',mobile:'13014001400',province:'江苏省',city:'无锡',area:'滨湖区',
    //   address:'科教园'},
    //   dispatchArr:'商家配送',
    //   orderArr: { goodsprice: 199, status: 1, id: 3578, ordersn: 'xd393948x', canrefund: true, refundid:0}
    // })
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
})