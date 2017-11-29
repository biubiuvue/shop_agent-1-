/**
 * 孙秀明
 * 2017.8.14
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    defaultAddress: {},  //默认地址
    orderGoods: [],      //订单商品列表
    memberDiscount: {},  //订单消费明细
    addressLists: [],    //地址列表
    dispatches: [],      //配送方式列表
    dispatche: '',        //配送方式
    dispatcheId: '',     //配送ID
    addressId: '',       //收货地址ID
    dispatcheMoney: 0,  //运费
    screenWidth: 0,
    screenHeight: 0,
    onLoaded: true,    //是否请求完毕
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false
  },
  godeliveryList(e) {
    //去配送方式
    app.globalData.dispatcheCont = e.currentTarget.dataset.dispatche;
    wx.redirectTo({ url: `/pages/deliveryList/deliveryList` });
  },
  addressList(e) {
    //当前地址列表是否为空，首次为空去设置新地址，否则去地址列表
    let _this = this;
    if (_this.data.addressLists.length > 0) {
      app.globalData.addindex = e.currentTarget.dataset.addindex;
      wx.navigateTo({ url: `/pages/addressList/addressList` });
    } else {
      let delShow = false;
      wx.navigateTo({ url: `/pages/editAddress/editAddress?delShow=${delShow}&state=1` });
    }
  },
  gopay() {
    //确认订单和支付
    let _this = this;
    let cartids = app.globalData.orderData.cartids;
    let dispatchid = _this.data.dispatcheId;
    let addressid = _this.data.addressId;
    let remark = '';
    let goods = '';
    let orderGoods = _this.data.orderGoods;
    if (!addressid) {
      wx.showToast({
        title: "请选择收货地址",
        mask: true,
        image: '../../public/images/errorss.png',
        duration: 1500
      })
      return
    }
    if (orderGoods.length == 1) {
      goods = orderGoods[0].goodsid + ',' + orderGoods[0].optionid + ',' + orderGoods[0].total;
    } else if (orderGoods.length > 1) {
      for (let i = 0; i < orderGoods.length; i++) {
        goods += orderGoods[i].goodsid + ',' + orderGoods[i].optionid + ',' + orderGoods[i].total + '|';
      }
      let goodsLen = goods.length;
      goods = goods.slice(0, goodsLen - 1);
    }
    let signData = {
      cartids,
      dispatchid,
      addressid,
      remark,
      goods
    }

    esTools.fn.setEmpty().setSession().signData(signData).setMethod('post').setExtraUrl('confirm').orders(function (res) {
      if (res.statusCode === 1) {
        let payment = {
          ordersn: res.data.ordersn
        };
        esTools.fn.setEmpty().setSession().signData(payment).setMethod('get').setExtraUrl('payment').orders(function (paymentRes) {
          if (paymentRes.statusCode === 1) {
            let canPay = false;
            let paymentLists = paymentRes.data.payment;
            for (let payList in paymentLists) {
              if (payList === 'wechatapp' && paymentLists[payList].switch === true) {
                canPay = true;
                break;
              }
            }
            if (canPay) {
              payment.type = 'wechatapp';
              esTools.fn.setEmpty().setSession().signData(payment).setMethod('post').setExtraUrl('payment').orders(function (paymentParams) {
                _this.setData({
                  disabled: true,
                  loading: true
                })
                if (paymentParams.statusCode === 1) {
                  let payParams = paymentParams.data;
                  let obj = {
                    'timeStamp': payParams.timeStamp,
                    'nonceStr': payParams.nonceStr,
                    'package': "" + payParams.package + "",
                    'signType': 'MD5',
                    'paySign': payParams.paySign,
                    'success': function (res) {
                      _this.setData({
                        disabled: false,
                        loading: false
                      })
                      wx.redirectTo({ url: '/pages/orderStatus/orderStatus' });
                    },
                    'fail': function (res) {
                      console.log('payment fail res :');
                      console.log(res);
                      _this.setData({
                        disabled: false,
                        loading: false
                      })
                      wx.redirectTo({ url: '/pages/orderStatus/orderStatus' });
                    }
                  };
                  console.log(obj);
                  wx.requestPayment(obj);
                } else {
                  wx.showToast({
                    title: '后台未配置支付参数!',
                    mask: true,
                    image: '../../public/images/errorss.png',
                    duration: 1500
                  })
                  setTimeout(function () {
                    _this.setData({
                      disabled: false,
                      loading: false
                    })
                    wx.redirectTo({ url: '/pages/orderStatus/orderStatus' });
                  }, 1500)
                }
              });
            } else {
              console.log('payment switch close.');
            }
          } else {
            wx.showToast({
              title: `${res.data}`,
              mask: true,
              image: '../../public/images/errorss.png',
              duration: 1500
            })
          }
        });
      } else {
        wx.showToast({
          title: res.data,
          mask: true,
          image: '../../public/images/errorss.png',
          duration: 1500
        })
      }
    })

  },
  onShow() {
    //默认地址、订单商品列表、配送方式、订单消费明细、配送ID、收货地址ID
    let _this = this;
    let signData = app.globalData.orderData;
    esTools.fn.setEmpty().setSession().signData(signData).setMethod('get').setExtraUrl('confirm').orders(function (res) {
      if (res.statusCode == 1) {
        let addressLists = res.data.addressLists; //地址列表
        let defaultAddress = ''; //默认地址
        res.data.defaultAddress !== false && res.data.defaultAddress !== '' ? defaultAddress = res.data.defaultAddress : defaultAddress = '';
        let orderGoods = res.data.orderGoods; //商品列表
        let goodsId = []; //商品id
        let memberDiscount = res.data.memberDiscount;  //订单消费明细
        let dispatches = res.data.dispatches;  //配送方式列表
        let dispatche = res.data.dispatches[0];  //默认配送方式 
        let addressId = '';  //当前选择地址id
        res.data.defaultAddress.id !== undefined && res.data.defaultAddress.id !== '' ? addressId = res.data.defaultAddress.id : addressId = '';
        let dispatcheId = res.data.dispatches[0].id;  //当前配送方式id 
        let dispatcheMoney = _this.data.dispatcheMoney; //运费

        //循环商品列表获得goodsid
        for (let i = 0; i < orderGoods.length; i++) {
          goodsId.push(orderGoods[i].goodsid);
        }
        //默认收货地址和地址ID
        if (addressLists.length > 0) {
          defaultAddress = addressLists[0];
          addressId = addressLists[0].id;
        }
        //修改默认地址和地址ID
        if (app.globalData.addressData.address !== undefined) {
          defaultAddress = app.globalData.addressData;
          addressId = app.globalData.addressData.id;
        }
        //默认配送方式和配送id和运费
        if (dispatches.length > 0) {
          dispatche = dispatches[0].dispatchname;
          dispatcheId = dispatches[0].id;
          dispatcheMoney = dispatches[0].price;
        }
        //修改运费
        if (app.globalData.dispatcheIndex !== '') {
          let i = app.globalData.dispatcheIndex;
          dispatcheMoney = dispatches[i].price;
        }

        //修改默认配送方式和配送ID
        if (app.globalData.dispatche.dispatchname !== undefined) {
          dispatche = app.globalData.dispatche.dispatchname;
          dispatcheId = app.globalData.dispatche.id;
        }

        //默认地址、订单商品列表、配送方式、订单消费明细、配送ID、收货地址ID
        _this.setData({
          defaultAddress,
          orderGoods,
          memberDiscount,
          dispatches,
          dispatche,
          addressLists,
          addressId,
          dispatcheId,
          dispatcheMoney,
          onLoaded: false
        })
      } else {
        wx.showToast({
          title: `${res.data}`,
          mask: true,
          image: '../../public/images/errorss.png',
          duration: 1500
        })
      }
    })
  }
})