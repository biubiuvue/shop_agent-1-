let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');

Page({
  data: {
    curNav: '',
    curIndex: 0,
    orderTitArr: [
      { id: 0, title: "全部订单", type: "8" },
      { id: 1, title: "待付款", type: "0" },
      { id: 2, title: "已付款", type: "1" },
      { id: 3, title: "待收货", type: "2" },
      { id: 4, title: "已完成", type: "3" },
    ],
    orderType: 8,
    orderArr: [],
    hideBottom: false,
    loadMoreData: '',
    orderShow: true,
    scroll_time: 2,
    load_time: 0,
    loadding: false,
    loaded: false,
    windowHeight: '',
    psize: 10,
    onLoaded: true,
    hidden: true,
    ordersn: '',
    pricePay: 0.00,
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false
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
  goLook: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  orderDetailTap: function (e) {
    var orderid = e.target.dataset.orderid;
    wx.navigateTo({ url: '/pages/orderDetail/orderDetail?orderid=' + orderid })
  },
  //切换tab请求不同状态订单
  switchRightTab: function (e) {
    var id = e.target.dataset.id,
      ordertype = e.target.dataset.type,
      index = parseInt(e.target.dataset.idx),
      title = e.target.dataset.title,
      _this = this;

    _this.setData({
      curNav: id,
      curIndex: index,
      orderType: ordertype,
    })
    switch (id) {
      case 0:
        switchrunlist();
        break;

      case 1:
        switchrunlist(0);
        break;

      case 2:
        switchrunlist(1);
        break;

      case 3:
        switchrunlist(2);
        break;

      case 4:
        switchrunlist(3);
        break;
    }
    function switchrunlist(sta) {
      _this.setData({
        orderArr: []
      })
      if (arguments.length === 1) {
        var data = {
          page: 1,
          status: sta,
        }
      } else {
        var data = {
          page: 1,
          status: ''
        }
      }
      esTools.fn.setEmpty().setSession().signData(data).setMethod('get').orders(function (res) {
        console.log(res)
        if (app.globalData.debug === true) {
          console.log('center.js getorderlist res');
          console.log(res);
        }
        if (res.statusCode == 1) {
          _this.setData({
            orderArr: res.data,
            orderShow: true,
            hideBottom: false,
          })
          if (res.data.length === 0) {
            _this.setData({
              orderShow: false
            })
          }
        }
      });
    }
  },
  lower: function (e) {
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
    var scroll_time = _this.data.scroll_time;
    var orderArr = _this.data.orderArr;
    var curNav = _this.data.curNav;
    switch (curNav) {

      case 0:
        scrollrunlist();
        break;

      case 1:
        scrollrunlist(0);
        break;

      case 2:
        scrollrunlist(1);
        break;

      case 3:
        scrollrunlist(2);
        break;

      case 4:
        scrollrunlist(3);
        break;
    }
    function scrollrunlist(sta) {
      if (arguments.length === 1) {
        var data = {
          page: scroll_time,
          status: sta,
          psize: _this.data.psize
        }
      } else {
        var data = {
          page: scroll_time,
          status: '',
          psize: _this.data.psize
        }
      }
      esTools.fn.setEmpty().setSession().signData(data).setMethod('get').orders(function (res) {
        if (res.statusCode == 1) {
          if (res.data.length === 0 || res.data.length < data.psize) {
            _this.setData({
              loaded: true,
            });
            wx.hideToast();
            _this.setData({
              hideBottom: true,
              loadMoreData: '加载完毕，已经没有更多订单!'
            });
          }
          if (res.data.length !== 0) {
            scroll_time++;
            for (let i = 0; i < res.data.length; i++) {
              orderArr.push(res.data[i])
            }
            _this.setData({
              scroll_time: scroll_time,
              orderArr: orderArr,
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
    }
  },
  //点击取消订单
  cancelOrdertap: function (e) {
    let _this = this;
    let orderId = e.target.dataset.orderid;
    let orderArr = _this.data.orderArr;
    console.log(e)
    console.log(e.target.dataset.orderid)
    console.log(orderArr)
    wx.showModal({
      title: '温馨提示',
      content: '确定要取消订单？',
      success: function (res) {
        if (res.confirm) {
          let data = {
            orderid: orderId,
            type: 'canl'
          }
          esTools.fn.setEmpty().setSession().signData(data).setMethod('put').setExtraUrl('operationOrder').orders(function (res) {
            if (app.globalData.debug === true) {
              console.log('orderStatus.js orders canl res');
              console.log(res);
            }
            if (res.statusCode == 1) {
              for (let i = 0; i < _this.data.orderArr.length; i++) {
                if (orderArr[i].id === orderId) {
                  console.log('ssss')
                  orderArr.splice(i, 1)
                  _this.setData({
                    orderArr: orderArr
                  })
                }
                wx.showToast({
                  title: '取消订单成功',
                  icon: 'success',
                  duration: 1500
                })
              }
            } else {
              wx.showModal({
                title: '提示',
                content: '删除订单失败:' + res.data
              })
            }
          })
        } else if (res.cancel) {//表示点击了取消
        }
      },
    })

  },
  //点击确认支付按钮
  confirmPay: function (e) {
    let _this = this
    let ordersn = e.target.dataset.ordersn;
    let pricePay = e.target.dataset.pricepay;
    _this.setData({
      hidden: false,
      ordersn: ordersn,
      pricePay: pricePay
    })
  },
  //点击微信支付
  payTap: function () {
    // let data = {
    //   ordersn: this.data.ordersn,
    //   type: '1'
    // }
    // esTools.fn.setEmpty().setSession().signData(data).setMethod('post').setExtraUrl('payment').orders(function (res) {
    //   if (app.globalData.debug === true) {
    //     console.log('orderStatus.js orders/payment res');
    //     console.log(res);
    //   }
    //   if (res.statusCode == 1) {
    //     wx.showToast({
    //       title: '支付成功',
    //       icon: success,
    //       duration: 2000
    //     })
    //     wx.switchTab({
    //       url: '/pages/center/center'
    //     })
    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: res.data,
    //       duration: 2000
    //     })
    //   }
    // })
    let _this=this;
    let payment = {
      ordersn: _this.data.ordersn
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
  },
  //点击申请退款
  drawback: function (e) {
    let orderid = e.target.dataset.orderid;
    let goodsPrice = e.target.dataset.price;
    wx.navigateTo({
      url: '/pages/drawback/drawback?orderid=' + orderid + '&price=' + goodsPrice,
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
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderid=' + orderid,
    })
  },
  //去评价
    goComment:function (e) {
    // 携带什么数据过去评价页面
        let orderid = e.target.dataset.orderid;
        wx.navigateTo({
            url: '/pages/comment/comment?orderid=' + orderid,
        })
    },
  //点击查看物流
  lookTrace: function (e) {
    let orderid = e.target.dataset.orderid;
    let express = e.target.dataset.express;
    let expresssn = e.target.dataset.expresssn;
    wx.navigateTo({
      url: '/pages/logistics/logistics?orderid=' + orderid + '&express=' + express + '&expresssn=' + expresssn,
    })
    // wx.redirectTo({
    //   url: '/pages/logistics/logistics?orderid=' + orderid,
    // })
  },
  onLoad: function (options) {
    console.log(options)
    let _this = this;
    let sta = parseInt(options.status);
    switch (sta) {
      case 0:
        _this.setData({
          curNav: 1
        });
        runlist(0);
        break;

      case 1:
        _this.setData({
          curNav: 2
        });
        runlist(1);
        break;
      case 2:
        _this.setData({
          curNav: 3
        });
        runlist(2);
        break;

      case 3:
        _this.setData({
          curNav: 4
        });
        runlist(3);
        break;

      default:
        _this.setData({
          curNav: 0
        });
        runlist();

    }
    function runlist(sta) {
      console.log(arguments.length)
      if (arguments.length === 1) {
        var data = {
          page: 1,
          status: sta,
          psize: _this.data.psize
        }
      } else {
        var data = {
          page: 1,
          status: '',
          psize: _this.data.psize
        }
      }
      esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl().orders(function (res) {
        if (app.globalData.debug === true) {
          console.log('orderStatus.js orders res');
          console.log(res);
        }

        if (res.statusCode == 1) {
          _this.setData({
            orderArr: res.data,
            onLoaded: false
          })
          if (res.data.length === 0) {
            _this.setData({
              orderShow: false,
              onLoaded: false
            })
          }
        }
      });
    }

  },
  onShow: function () {
    // 页面显示
    wx.getSystemInfo({
      success: (res) => {
        let height = "height:" + res.windowHeight + 'px;';
        this.setData({
          windowHeight: height
        })
      }
    })

  },
  onHide: function () {
    // 页面隐藏
  },
})