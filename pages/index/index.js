
/**
 * 孙秀明
 * 2017.8.13
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    hideBottom: false, //底部加载
    loadMoreData: '',
    SwiperimgUrls: [],  //轮播图片
    indicatorDots: true,  //是否显示面板指示点
    nav_g_array: [],  //所有小图标
    bannerPicUrl: 'http://ws7.wshoto.com/attachment/images/2/2017/09/xX03S0cKWXljCTykCjQm1zhYSNdtCD.jpg',  //中间广告图
    bannerTittle: '最新推荐',  //广告标题
    bannerContent: '精品商品尽收眼底赶快行动吧',  //广告宣传语
    windowHeight: 0, // 获取显示屏高
    windowWidth: 0,  // 获取显示屏宽
    pro_list_arr: [],  //滚动图片列表
    scroll_time: 2,
    load_time: 0,
    loadding: false,
    loaded: false,
    defVal: '',
    hotPrds: [], //热销商品
    newPrds: [],  //最新商品
    onLoaded: true,
    logo: ''
  },
  pullUpLoad(e) {
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
    let scroll_time = _this.data.scroll_time;
    let pro_list_arr = _this.data.pro_list_arr;

    let products = {
      attributes: 'isrecommand:1',
      page: scroll_time,
      psize: 4
    };
    esTools.fn.setSession().signData(products).setMethod('get').setExtraUrl('attributes').products(function (res) {
      if (res.statusCode === 1) {
        if (res.data.length === 0 || res.data.length < products.psize) {
          _this.setData({
            loaded: true,
          });
          wx.hideToast();
          _this.setData({
            hideBottom: true,
            loadMoreData: '加载完毕，已经没有更多商品!'
          });
        }

        if (res.data.length !== 0) {
          scroll_time++;
          for (let i = 0; i < res.data.length; i++) {
            pro_list_arr.push(res.data[i])
          }
          _this.setData({
            scroll_time: scroll_time,
            pro_list_arr: pro_list_arr,
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
  },
  goProduct(e) {
    //去商品列表页
    let attributes = e.currentTarget.dataset.attributes;
    wx.navigateTo({ url: `/pages/product/product?attributes=${attributes}` })
  },
  proTap(e) {
    //点击滚动商品跳转
    let pro_id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/pro_detail/pro_detail?id=' + pro_id });
  },
  prolistTap(e) {
    //点击小图标跳转
    let index = e.currentTarget.dataset.index;
    if (index == 9) {
      wx.switchTab({ url: '/pages/classify/classify' });
    } else {
      let pid = e.target.dataset.id;
      wx.navigateTo({ url: '/pages/product/product?pid=' + pid });
    }
  },
  searchProducts(e) {
    //搜索产品
    let search_info = e.detail.value.searchBox;
    if (search_info == '') {
      wx.showModal({
        title: '注意',
        content: '请输入您想要搜索的商品名称！',
      })
    } else {
      wx.navigateTo({ url: '/pages/product/product?keyword=' + search_info });
      this.setData({
        defVal: ''
      })
    }
  },
  runPage() {
    console.log('index.js runPage run');
    let _this = this;
    // 轮播图
    let signData = {};
    esTools.fn.signData(signData).setMethod('get').slides(function (res) {
      if (app.globalData.debug === true) {
        console.log('index.js getSlides res');
        console.log(res);
      }
      if (res.statusCode == 1) {
        _this.setData({
          SwiperimgUrls: res.data
        });
      }
    });

    //小图标
    let category = {
      'pid': 0,
      'page': 1,
      'psize': 10
    };
    esTools.fn.setEmpty().setSession().signData(category).setMethod('get').categories(function (res) {
      if (res.statusCode === 1) {
        console.log(res.data.length);
        if (res.data.length >= category.psize) {
          res.data.pop();
          res.data.push({
            "id": "0",
            "name": "全部分类",
            "thumb": false,
            "parentid": "0",
            "isrecommand": "0",
            "description": "",
            "displayorder": "0",
            "enabled": "1",
            "ishome": "0",
            "advimg": "http://ws7.wshoto.com/attachment/images/2/2017/01/qbfl2.png",// 缺少一个图标
            "advurl": "",
            "level": "1",
          });
        }
        _this.setData({
          nav_g_array: res.data,
          onLoaded: false
        });
      }
    });

    //广告位
    let advs = {
      'identification': 'index'
    };
    esTools.fn.setEmpty().signData(advs).setMethod('get').wxappadvs(function (res) {
      if (res.statusCode === 1) {
        _this.setData({
          bannerPicUrl: res.data.thumb
        });
      }
    });

    //推荐商品
    let products = {
      attributes: 'isrecommand:1',
      page: 1,
      psize: 4,
    };
    esTools.fn.setEmpty().setSession().signData(products).setMethod('get').setExtraUrl('attributes').products({
      success: function (res) {
        _this.setData({
          pro_list_arr: res.data
        });
        if (app.globalData.debug === true) {
          console.log('index.js products isrecommand res');
          console.log(res);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });

    //热销商品
    let hotProduct = {
      attributes: "ishot:1",
      page: 1,
      psize: 6
    };
    esTools.fn.setEmpty().setSession().signData(hotProduct).setMethod('get').setExtraUrl('attributes').products({
      success: function (res) {
        _this.setData({
          hotPrds: res.data
        });
        if (app.globalData.debug === true) {
          console.log('index.js products isnew res');
          console.log(res);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });

    //最新商品
    let newProduct = {
      attributes: "isnew:1",
      page: 1,
      psize: 6
    };
    esTools.fn.setEmpty().setSession().signData(newProduct).setMethod('get').setExtraUrl('attributes').products({
      success: function (res) {
        _this.setData({
          newPrds: res.data
        });
        if (app.globalData.debug === true) {
          console.log('index.js products isnew res');
          console.log(res);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  setShare() {  //全局分享 (2017-10-21 17:51)
    let params = {
      type: 'share'
    }
    esTools.fn.setEmpty().setSession().signData(params).setMethod('get').shops({
      success: function (res) {
        console.log(res)
        app.globalData.shareData = res.data;
      },
      fail: function (res) {
        console.log('index setShare' + res.data);
      }
    })
  },
  setShop() {  //设置全局title、logo (2017-10-21 17:51)
    let _this = this;
    let params = {
      type: 'shop'
    }
    esTools.fn.setEmpty().setSession().signData(params).setMethod('get').shops({
      success: function (res) {
        app.globalData.shopData = res.data;  //存入全局
        _this.setData({  //设置logo
          logo: res.data.logo
        })
        if (res.data.name){
          wx.setNavigationBarTitle({  //设置首页title
            title: res.data.name,
          })
        }
      },
      fail: function (res) {
        console.log('index setShop' + res.data);
      }
    })
  },
  onLoad(options) {
    this.runPage();
  },
  onShow() {
    console.log('index.js onShow');
    let _this = this;
    this.runPage();
    // 获取显示屏宽高
    wx.getSystemInfo({
      success: function (res) {
        let height = "height:" + res.windowHeight + 'px;';
        _this.setData({
          windowHeight: height,
        })
      }
    });
    _this.setShare();
    _this.setShop();
  },
  //右上角用户分享 (2017-10-21 17:51)
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    let title = '';
    let imageUrl = '';
    if (app.globalData.shareData.title !== undefined) {
      title = app.globalData.shareData.title;
      imageUrl = app.globalData.shareData.icon;
      console.log(title, imageUrl);
    }
    return {
      title,
      imageUrl,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});
