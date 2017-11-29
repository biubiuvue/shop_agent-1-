let app = getApp();
let util = require('../../utils/util');
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');


Page({
  data: {
    indicatorDots: 'true',
    autoplay: true,
    interval: 4000,
    duration: 500,
    pro_info_arr: [],
    freight: '0.00',
    swiper_img_url: [],
    shop_count: '',
    curNav: 0,
    curIndex: 0,
    discount: 0,
    goodsCount: 1,
    goods_initial_price: 0,
    goods_market_price: 0,
    goods_marketsum_price: 0,
    goods_total: 0,
    specs_id: 0,
    hidden: true,
    hiddenToast: true,
    selected: '',
    specs_arr: [],
    specs_id_arr: [],
    standardArr: [],
    standarditemsArr: [],
    modalHidden: true,
    selected_id: '',
    options: '',
    total: '',
    weight: '',
    stock: '',
    parameters: '',
    commentArr: [],
    parametersShow: true,
    active: ['active', ''],
    //选中项规格id
    optionid: '',
    onLoaded: true,
    isFavorite: ''
  },
  listenerButton: function () {
    this.setData({
      hiddenToast: !this.data.hiddenToast
    })
  },
  //点击收藏
  favoriteTap: function (e) {
    let _this = this;
    let goodsid = e.currentTarget.dataset.goodsid;
    let data = {
      goodsid: goodsid
    }
    esTools.fn.setEmpty().setSession().signData(data).setMethod('post').setExtraUrl('favorite').products(function (res) {
      if (app.globalData.debug === true) {
        console.log('pro_detail.js products favorite res');
        console.log(res);
      }
      if (res.statusCode == 1) {
        _this.setData({
          isFavorite: true
        })
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: res.data,
          duration: 1800
        })
        console.log('加入收藏失败：' + res.data)
      }
    })
  },
  //取消收藏
  favoriteCancelTap: function (e) {
    let _this = this;
    let goodsid = e.currentTarget.dataset.goodsid;
    let data = {
      goodsid: goodsid
    }
    esTools.fn.setEmpty().setSession().signData(data).setMethod('delete').setExtraUrl('favorite').products(function (res) {
      if (app.globalData.debug === true) {
        console.log('pro_detail.js products favorite res');
        console.log(res);
      }
      if (res.statusCode == 1) {
        _this.setData({
          isFavorite: false
        })
        wx.showToast({
          title: '取消收藏成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        console.log('加入收藏失败：' + res.data)
      }
    })
  },
  //点击详情跳转到proDetailText页面
  proDetailTap: function (event) {
    var pro_id = event.target.dataset.id;
    // wx.navigateTo({ url: '/pages/proDetailText/proDetailText?id=' + pro_id })
    wx.redirectTo({ url: '/pages/proDetailText/proDetailText?id=' + pro_id })
  },
  toastHidden: function () {
    this.setData({
      hiddenToast: true
    })
  },
  //点击购物车图标进入购物车
  shopCartTap: function (event) {
    let pro_id = event.currentTarget.id;

    wx.switchTab({
      url: '/pages/shopcart/shopcart'
    })
  },
  //点击立即购买跳转到确认订单页面
  orderConfirmTap: function (event) {
    let _this = this
    console.log(event)
    function runpro() {
      let specs_arr = _this.data.selected
      let specslength = specs_arr.length
      let standardArrlength = _this.data.standardArr.length
      let options = _this.data.options
      if (_this.data.hidden === true) {
        _this.setData({
          hidden: false
        })
      } else {
        if (_this.data.selected_id.length === 0 && options != '') {
          wx.showModal({
            title: '温馨提示',
            content: '请选择商品规格',
            success: '',
          })
        } else {
          if (options != '') {
            let goodsid = event.currentTarget.dataset.goodsid;
            let standardinfo = (_this.data.selected_id).join("_");
            console.log(standardinfo)

            if (standardArrlength === specslength) {

              let new_arr = [];
              for (let i = 0; i < specs_arr.length; i++) {
                if (specs_arr[i] != undefined) {
                  new_arr.push(specs_arr[i])
                }
              }
              if (new_arr.length === standardArrlength) {
                if (_this.data.stock === 0) {
                  wx.showModal({
                    title: '温馨提示',
                    content: '商品库存不足！',
                    success: '',
                  })
                } else {
                  let weight_total = 0;
                  weight_total = _this.data.goodsCount * _this.data.weight;
                  app.globalData.orderData.total = event.currentTarget.dataset.goodscount;
                  wx.navigateTo({
                    url: '/pages/orderConfirm/orderConfirm'
                  });
                }
              } else {
                wx.showModal({
                  title: '温馨提示',
                  content: '请选择商品规格',
                  success: '',
                })
              }
            } else {
              wx.showModal({
                title: '温馨提示',
                content: '请选择商品规格',
                success: '',
              })
            }
          } else if (options == '') {
            let goodsid = event.target.dataset.goodsid;
            console.log()
            app.globalData.orderData.total = event.target.dataset.goodscount;
            let weight_total = 0;
            weight_total = _this.data.goodsCount * _this.data.weight
            // wx.navigateTo({ url: '/pages/orderConfirm/orderConfirm' })

            //修改2017-11-23  
            //主要解决路径层级过深，导致无法打开问题
            wx.redirectTo({ url: '/pages/orderConfirm/orderConfirm' })
          }
        }
      }
    }
    runpro();
  },
  //点击已选弹出规格详情
  standardShow: function () {
    this.setData({
      hidden: false
    })

  },
  hideStandard: function () {
    this.setData({
      hidden: true
    })

  },
  //选择商品规格
  switchRightTab: function (e) {
    // console.log(e)
    //id为规格类里的不同选项id，index为规格类的下标，key为规格类里面不同选项的下标，
    //title为不同选项的名称，specs_arr封装不同选项的名称，specs_id_arr封装不同选项的id
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index),
      key = parseInt(e.target.dataset.selfidx),
      title = e.target.dataset.title,
      specs_arr = this.data.specs_arr,
      specs_id_arr = this.data.specs_id_arr,
      _this = this;
    // console.log(id, index, key, title, specs_arr, specs_id_arr)
    specs_arr[index] = title;
    specs_id_arr[index] = id;
    let standardArr = _this.data.standardArr
    let standardItem = standardArr[index].items
    //standardItem当前选中的规格类选项集
    for (let i = 0; i < standardItem.length; i++) {
      standardItem[i].displayorder = 1
      console.log(standardItem[i].displayorder)
    }
    let active = 'active'
    //设置不同选项为选中状态
    standardItem[key].displayorder = active
    console.log(standardItem[key].displayorder)
    _this.setData({
      curNav: id,
      curIndex: index,
      selected: specs_arr,
      selected_id: specs_id_arr,
      standardArr: standardArr
    })
    //规格类
    let item = _this.data.standardArr[index];
    //new_arr封装规格类里面选项的title
    let new_arr = [];
    for (let i = 0; i < specs_arr.length; i++) {
      if (specs_arr[i] != undefined) {
        new_arr.push(specs_arr[i])
      }
    }
    if (new_arr.length == _this.data.standardArr.length) {
      let optionAll = (_this.data.selected_id).join("_");
      let options = _this.data.options;
      let changeOptions = {};
      for (let o in options) {
        if (options[o].specs === optionAll) {
          changeOptions = options[o]
          _this.setData({
            goods_market_price: changeOptions.marketprice,
            total: changeOptions.stock,
            stock: changeOptions.stock,
            goods_marketsum_price: changeOptions.marketprice,
            goodsCount: 1,

          })
          app.globalData.orderData.optionid = changeOptions.id;
          break;
        }
      }
    }

  },
  //输入购买数量
  inputCount: function (e) {
    this.setData({
      goodsCount: parseInt(e.detail.value)
    })
  },
  //购买数量减
  minusAction: function (e) {
    if (this.data.goodsCount > 1) {
      if (this.data.options == 0) {
        this.setData({
          goodsCount: this.data.goodsCount = this.data.goodsCount - 1,
          goods_market_price: (this.data.goodsCount * this.data.goods_initial_price).toFixed(2)
        })
      } else {
        this.setData({
          goodsCount: this.data.goodsCount = this.data.goodsCount - 1,
          goods_market_price: (this.data.goodsCount * this.data.goods_marketsum_price).toFixed(2)
        })
      }
    }
  },
  //购买数量加
  plusAction: function (e) {
    console.log(this.data.goodsCount, this.data.stock)
    if (this.data.options != 0 && this.data.curNav == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '请选择规格哦',
        success: '',
      })
    } else if (this.data.options != 0 && this.data.goodsCount >= 0 && this.data.goodsCount < this.data.stock) {
      this.setData({
        goodsCount: this.data.goodsCount = this.data.goodsCount + 1,
        goods_market_price: (this.data.goodsCount * this.data.goods_marketsum_price).toFixed(2)
      })
    }
    else if (this.data.options == 0 && this.data.goodsCount >= 0 && this.data.goodsCount < this.data.pro_info_arr.total) {
      this.setData({
        goodsCount: this.data.goodsCount = this.data.goodsCount + 1,
        goods_market_price: (this.data.goodsCount * this.data.goods_initial_price).toFixed(2)
      })
    }
    else {
      wx.showModal({
        title: '温馨提示',
        content: '库存不足哦！',
        success: '',
      })
    }

  },
  //点击加入购物车添加商品到购物车
  addCart: function () {

    let _this = this;

    function runaddcart() {
      let specs_arr = _this.data.selected
      let specslength = specs_arr.length
      let standardArrlength = _this.data.standardArr.length
      let options = _this.data.options
      console.log(options)
      if (_this.data.hidden == true) {
        _this.setData({
          hidden: false
        })
      } else {
        if (_this.data.selected_id.length === 0 && options.length > 0) {
          wx.showModal({
            title: '温馨提示',
            content: '请选择商品规格',
            success: '',
          })
        } else {
          let goods = {
            goodsid: _this.data.pro_info_arr.id,
            optionid: '',
            marketprice: _this.data.pro_info_arr.marketprice,
            total: _this.data.goodsCount,
            weight: _this.data.weight
          };
          if (options.length > 0) {
            let optionidtmp = (_this.data.selected_id).join("_");
            let selectedOptions = {};
            for (let o in options) {
              if (options[o].specs === optionidtmp) {
                selectedOptions = options[o]
                break;
              }
            }
            if (util.isEmptyObject(selectedOptions)) {
              wx.showModal({
                title: '温馨提示',
                content: '请选择完整的商品信息。',
                success: '',
              })
              return false;
            }
            if (selectedOptions.stock / 1 <= 0) {
              wx.showModal({
                title: '温馨提示',
                content: '很抱歉，库存不足，无法加入购物车。',
                success: ''
              });
              return false;
            }
            goods.optionid = selectedOptions.id;
          }
          console.log('post carts running.');
          console.log(goods);

          /**
           * 添加后，成功判定用statusCode。
           * 返回结果为最新的购物车数量。
           * 若失败，则statusCode为-1
           * 返回结果为报错内容。
           */
          esTools.fn.setEmpty().setSession().signData(goods).setMethod('post').carts(function (res) {
            console.log(res)
            if (res.statusCode === 1) {
              _this.setData({
                shop_count: res.data,
                hidden: true
              })

              wx.showToast({
                title: '加入购物车成功',
                icon: 'success',
                duration: 2000
              });
            } else {
              wx.showModal({
                title: '温馨提示',
                content: '添加购物车失败：' + res.data,
                success: ''
              });
            }
          });
        }
      }
    }
    runaddcart();
  },
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },
  onLoad: function (options) {
    let _this = this;
    let pro_id = options.id;

    console.log(options)
    function runprodetail() {
      let detail = {
        id: pro_id
      }
      //esTools.fn.setEmpty();由于闭包导致的老数据问题，执行空内容时，做清空操作。
      esTools.fn.setEmpty().setSession().signData(detail).setMethod('get').setExtraUrl().products(function (res) {
        if (app.globalData.debug) {
          console.log('pro_detail.js products res.')
          console.log(res)
        }
        if (res.statusCode === 1) {
          console.log(res)
          _this.setData({
            pro_info_arr: res.data.goods,
            swiper_img_url: res.data.pics,
            standardArr: res.data.specs,
            goods_market_price: res.data.goods.marketprice,
            goods_initial_price: res.data.goods.marketprice,
            goods_total: res.data.goods.total,
            options: res.data.options,
            shop_count: res.data.cartcount,
            total: res.data.goods.total,
            parameters: res.data.params,
            parametersShow: res.data.params.length,
            onLoaded: false,
            isFavorite: res.data.isfavorite
          });
          wx.hideToast();
          app.globalData.orderData.goodsid = res.data.goods.id;
        }
      })
    }
    runprodetail();
  },
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage(res) {
    let data = util.defShareAppMessage(res);
    return data;
  }
})