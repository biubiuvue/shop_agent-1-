let app = getApp();

let cfg = require('../config');
let wsTools = require('../wshoto');

let esCfg = require('./cfg');

let fn = {

  'tempHeader': esCfg.header,

  'tempData': {
    'data': {},
    'method': 'GET',
    'extraUrl': ''
  },

  /**
   * 由于闭包问题，上一次设置的数据被保留。
   * 所以，增加此方法，用于清空之前数据。
   **/
  'setEmpty': function () {
    fn.tempData = {
      'data': {},
      'method': 'GET',
      'extraUrl': ''
    }

    return this;
  },

  // 按照逻辑顺序，应是先使用setSession,再使用signData。
  // 否则会出现sessionkey未加入签名算法的BUG。
  'setSession': function () {
    if (typeof fn.tempData.data.sessionkey === 'undefined' || fn.tempData.data.sessionkey === '') {
      let sessionKey = fn.getSessionSync();
      fn.tempData.data = Object.assign(fn.tempData.data, { 'sessionkey': sessionKey.sessionkey });
    }
    return this;
  },

  'signData': function (data) {
    data = Object.assign(fn.tempData.data, data);
    fn.tempData.data = wsTools.fn.getSign(data);
    return this;
  },

  'setMethod': function (method) {
    fn.tempData.method = method.toUpperCase();
    return this;
  },

  'setExtraUrl': function (url) {
    if (url) {
      fn.tempData.extraUrl = '/' + url;
    } else {
      fn.tempData.extraUrl = '';
    }
    return this;
  },


  // 用户登陆检查
  // 具备自动更换sessionkey功能。
  // 自动跳转登陆功能。
  // 'getSession': function (cb) {
  //     let localSession = wx.getStorageSync('sessionKey') || {};
  //
  //     if (app.globalData.debug === true) {
  //         console.log('eshop tools.js getSession localSession');
  //         console.log(localSession);
  //         // console.log(Object.getOwnPropertyNames(localSession).length);
  //     }
  //
  //     if (typeof localSession === 'object' && typeof localSession.sessionkey !== 'undefined' && localSession.timestamp > wsTools.fn.getTime()) {
  //
  //         app.callback(wsTools.fn.setData(localSession, 1), cb);
  //
  //     } else if (typeof localSession === 'object' && typeof localSession.sessionkey != 'undefined') {
  //
  //         if (localSession.timestamp <= wsTools.fn.getTime()) {
  //             fn.replaceKey(localSession.sessionkey, function (res) {
  //                 if (res.statusCode === 1) {
  //                     wx.setStorageSync('sessionKey', res.data);
  //                     app.callback(res, cb);
  //                 } else {
  //
  //                     wx.showModal({
  //                         title: '登陆失败',
  //                         content: '很抱歉，登陆可能已经过期或失效，需要您重新登录。',
  //                         showCancel: false,
  //                         success: function () {
  //                             wx.redirectTo({
  //                                 url: '../login/login'
  //                             });
  //                         }
  //                     });
  //
  //                     // wx.redirectTo({
  //                     //     url: '../login/login'
  //                     // });
  //                 }
  //             });
  //         }
  //
  //     } else {
  //         wx.redirectTo({
  //             url: '../login/login'
  //         });
  //     }
  // },
  'setHeader': function (header) {
    if (header) {
      fn.tempHeader = header;
    } else {
      fn.tempHeader = esCfg.header;
    }

    return this;
  },

  'getSession': function (cb) {
    let localSession = wx.getStorageSync('sessionKey') || {};

    if (app.globalData.debug === true) {
      console.log('eshop tools.js getSession localSession');
      console.log(localSession);
      // console.log(Object.getOwnPropertyNames(localSession).length);
    }

    if (typeof localSession === 'object' && typeof localSession.sessionkey !== 'undefined' && localSession.timestamp > wsTools.fn.getTime()) {

      app.callback(wsTools.fn.setData(localSession, 1), cb);

    } else if (typeof localSession === 'object' && typeof localSession.sessionkey != 'undefined') {

      //新增
      wx.removeStorageSync('sessionKey');
      if (localSession.timestamp <= wsTools.fn.getTime()) {
        fn.replaceKey(localSession.sessionkey, function (res) {
          if (res.statusCode === 1) {
            wx.setStorageSync('sessionKey', res.data);
            app.callback(res, cb);
          } else {

            if (cfg.loginType === 1) {
              wx.redirectTo({
                url: '../wxlogin/wxlogin'
              });
            } else {
              wx.showModal({
                title: '登陆失败',
                content: '很抱歉，登陆可能已经过期或失效，需要您重新登录。',
                showCancel: false,
                success: function () {
                  wx.redirectTo({
                    url: '../login/login'
                  });
                }
              });
            }
          }
        });
      }

    } else {
      if (cfg.loginType === 1) {
        wx.redirectTo({
          url: '../wxlogin/wxlogin'
        });
      } else {
        wx.redirectTo({
          url: '../login/login'
        });
      }
    }
  },

  'getSessionSync': function () {
    return wx.getStorageSync('sessionKey') || {};
  },

  'replaceKey': function (sessionkey, cb) {

    let data = { 'sessionkey': sessionkey };
    data = wsTools.fn.getSign(data);

    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.replaceKey, 'PUT', data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js getSession replaceKey');
        console.log(res);
      }

      app.callback(res, cb);
    });

  },

  'sendCode': function (cb) {

    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.sendCode, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.sendCode');
        console.log(res);
      }

      app.callback(res, cb);
    });

  },

  'login': function (cb) {
    let url = cfg.baseUri + esCfg.listsUri.login + fn.tempData.extraUrl;
    let header = fn.tempHeader;

    wsTools.fn.request(url, fn.tempData.method, fn.tempData.data, header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.login');
        console.log(res);
      }
      fn.setHeader(esCfg.header);
      app.callback(res, cb);
    });
  },
  'shops': function (cb) {
    let url = cfg.baseUri + esCfg.listsUri.shops + fn.tempData.extraUrl;
    let header = fn.tempHeader;

    wsTools.fn.request(url, fn.tempData.method, fn.tempData.data, header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.login');
        console.log(res);
      }
      fn.setHeader(esCfg.header);
      app.callback(res, cb);
    });
  },

  'products': function (cb) {

    let url = cfg.baseUri + esCfg.listsUri.products + fn.tempData.extraUrl;

    wsTools.fn.request(url, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.getProducts');
        console.log(res);
      }

      app.callback(res, cb);
    });
  },

  'slides': function (cb) {
    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.slides, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.getSlides');
        console.log(res);
      }

      app.callback(res, cb);
    });
  },

  'categories': function (cb) {
    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.categories, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.categories');
        console.log(res);
      }

      app.callback(res, cb);
    });
  },
  'carts': function (cb) {
    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.carts, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.carts');
        console.log(res);
      }
      app.callback(res, cb);
    });
  },
  'orders': function (cb) {
    let url = cfg.baseUri + esCfg.listsUri.orders + fn.tempData.extraUrl;
    wsTools.fn.request(url, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.orders');
        console.log(res);
      }
      app.callback(res, cb);
    });
  },
  'members': function (cb) {
    let url = cfg.baseUri + esCfg.listsUri.members + fn.tempData.extraUrl;
    wsTools.fn.request(url, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.members');
        console.log(res);
      }
      app.callback(res, cb);
    });
  },
  'expresses': function (cb) {
    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.expresses, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.expresses');
        console.log(res);
      }
      app.callback(res, cb);
    });
  },
  'addresses': function (cb) {
    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.addresses + fn.tempData.extraUrl, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.addresses');
        console.log(res);
      }
      app.callback(res, cb);
    });
  },

  'wxappadvs': function (cb) {
    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.wxappadvs + fn.tempData.extraUrl, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.wxappadvs');
        console.log(res);
      }
      app.callback(res, cb);
    });
  },

  'topics': function (cb) {
    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.topics + fn.tempData.extraUrl, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.topics');
        console.log(res);
      }
      app.callback(res, cb);
    });
  },
  'commissions': function (cb) {
    let url = cfg.baseUri + esCfg.listsUri.commissions + fn.tempData.extraUrl;
    wsTools.fn.request(url, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.commissions');
        console.log(res);
      }
      app.callback(res, cb);
    });
  },
  'qrimgs': function (cb) {
    wsTools.fn.request(cfg.baseUri + esCfg.listsUri.qrimgs + fn.tempData.extraUrl, fn.tempData.method, fn.tempData.data, esCfg.header, function (res) {
      if (app.globalData.debug === true) {
        console.log('eshop tools.js fn.qrimgs');
        console.log(res);
      }
      app.callback(res, cb);
    });
  }
};

module.exports.fn = fn;