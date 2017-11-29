let app = getApp();
let util = require('../../utils/util');
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    curNav: 1,
    curIndex: 0,
    defVal: '',
    onLoaded:true
  },
  searchTap(e) {
    let search_info = e.detail.value.searchBox
    if (search_info == '') {
      wx.showModal({
        title: '注意',
        content: '请输入您想要搜索的商品名称！',
      })
    } else {
      wx.navigateTo({ url: '/pages/product/product?keyword=' + search_info })
      this.setData({
        defVal: ''
      })
    }

  },
  onLoad(options) {
    console.log(options)
    let _this=this;
    let parms = {}
    esTools.fn.setEmpty().setSession().signData(parms).setMethod('get').
    categories(function (res) {
      console.log(res)
      let defalt = res.data
      if (res.statusCode === 1) {
        _this.setData({
          navLeftItems: res.data,
          curNav: defalt[0].id
        })
        let params={
          pid: defalt[0].id
        };
        esTools.fn.setEmpty().setSession().signData(params).setMethod('get').
          categories(function (res) {
            console.log(res)
            if (res.statusCode === 1) {
              _this.setData({
                navRightItems: res.data
              })
            } else {
              wx.showModal({
                title: '温馨提示',
                content: '获取商品分类失败：' + res.data,
                success: ''
              });
            }
          });
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '获取商品分类失败：' + res.data,
          success: ''
        });
      }
    });
  },
  goodslistTap(e) {
    var pid = e.target.dataset.pid;
    var cid = e.target.dataset.id;
    wx.navigateTo({ url: '/pages/product/product?pid=' + pid + '&cid=' + cid });
    // wx.navigateTo({ url: '/pages/product/product/params?ccate=' + class_id })
  },
  //事件处理函数
  switchRightTab(e) {
    var _this = this;
    function runswitch() {
      // wx.showToast({
      //     title: '加载中',
      //     icon: 'loading',
      //     duration: 1000000
      // })
      let id = e.target.dataset.id,
        index = parseInt(e.target.dataset.index),
        params={
          pid: e.target.dataset.id
        }
      esTools.fn.setEmpty().setSession().signData(params).setMethod('get').
        categories(function (res) {
          console.log(res)
          if (res.statusCode === 1) {
            _this.setData({
              navRightItems: res.data
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '获取商品分类失败：' + res.data,
              success: ''
            });
          }
        });
      _this.setData({
        curNav: id,
        curIndex: index
      })
    }
    runswitch()
  },
  onReady(){
    let _this=this;
    _this.setData({
      onLoaded:false
    })
  },
    onShow(){
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                var height = "height:" + res.windowHeight + 'px;';
                _this.setData({
                    windowHeight: height,
                })
                console.log(height)
            }

        });
    }
})