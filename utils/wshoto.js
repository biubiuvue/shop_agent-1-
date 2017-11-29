let app = getApp();

let cfg = require('./config');
let md5 = require('./md5');


let fn = {
    /**
     * 获取临时令牌。
     * @returns {*|{data, statusCode}}
     */
    getApiToken: function (cb) {

        let apiToken = wx.getStorageSync('apiToken') || [];

        if (app.globalData.debug === true) {
            console.log('wshoto.js getApiToken getStorageSync localApiToken');
            console.log(apiToken);
        }

        if (typeof apiToken === 'object' && typeof apiToken.access_token !== 'undefined' && apiToken.timestamp > fn.getTime()) {

            app.callback(fn.setData(apiToken, 1), cb);

        } else {
            if (typeof apiToken.access_token === 'undefined') {
                apiToken = {};
                apiToken.token = '';
            }
            //新增
            wx.removeStorageSync('apiToken');
            fn.questApiToken(apiToken.access_token, function (res) {
                if (res.statusCode !== 1) {
                    wx.showModal({
                        title: '通讯失败',
                        content: '很抱歉，可能是服务端出现了错误，暂时无法使用。',
                        success: function () {
                            wx.redirectTo({
                                url: '../logs/logs'
                            });
                        }
                    });
                }

                wx.setStorageSync('apiToken', res.data);
                app.callback(res, cb);
            });
        }

    },

    getApiTokenSync: function () {
        return wx.getStorageSync('apiToken') || [];
    },

    /**
     * 登陆远程账号，获取token，用于后续通讯验证。
     * @param token
     * @param cb
     */
    questApiToken: function (token, cb) {

        let data = { 'apiname': cfg.passport.uname, 'apipass': cfg.passport.upass };

        if (token !== '') {
            data.access_token = token;
        }

        fn.request(cfg.listsUri.ApiLogin, 'GET', data, cfg.header, function (res) {
            if (app.globalData.debug === true) {
                console.log('wshoto.js questApiToken');
                console.log(res);
            }

            app.callback(res, cb);
        });
    },

    /**
     * 根据json格式的参数，获取对应的sign签名。
     * sign签名机制：https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=20_1
     * @param obj
     * @returns {*}
     */
    getSign: function (obj) {
        let apiToken = fn.getApiTokenSync();
        let arr = [];
        let str = '';


        obj.timestamp = fn.getTime();
        obj.access_token = apiToken.access_token;

        for (let arrk in obj) {
            if (obj[arrk] !== '' && arrk != 'sign' && arrk !== 'access_token') {
                arr.push(arrk);
            }
        }

        arr = arr.sort();

        for (let i = 0; i < arr.length; i++) {

            let key = arr[i];
            let val = obj[key];

            str += key + '=' + val + '&';
        }

        str += 'key=' + apiToken.auth_key;

        obj.sign = md5.md5(str);

        if (app.globalData.debug === true) {
            console.log('wshoto.js getSign getApiToken');
            console.log(apiToken);
            console.log('wshoto.js getSign signData');
            console.log(arr);
            console.log('wshoto.js getSign string');
            console.log(str);
            console.log('wshoto.js getSign obj');
            console.log(obj);
        }

        return obj;
    },

    getTime: function () {
        return Date.parse(new Date()) / 1000;
    },

    request: function (url, method, data, header, cb) {
        if (app.globalData.debug) {
            console.log('url :', url);
            console.log('method :', method);
            console.log('data :', data);
            console.log('header :', header);
        }
        wx.request({
            url: url,
            data: data,
            method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: header, // 设置请求的 header

            success: function (res) {
                res = res.data;

                if (app.globalData.debug === true) {
                    console.info('request success. res:');
                    console.info(res);
                }

                //修改2017-11-23 `此处由于接口返回数据格式问题为字符串，无法判断合格，导致白屏。`
                res.statusCode = res.statusCode / 1;
                if (res.statusCode === 10010 || res.statusCode === 10005) {
                    // wx.clearStorage();
                    wx.removeStorageSync('apiToken');
                    wx.removeStorageSync('sessionKey');
                    wx.reLaunch({
                        url: '/pages/strap/strap'
                    });
                }

                res = fn.setData(res.result, res.statusCode);
                console.log('url : ' + url);
                console.log('data : ' + JSON.stringify(data));
                console.log('method : ' + method);
                console.log('header : ' + JSON.stringify(header));
                console.log(res);
                if (app.callback(res, cb)) {
                    return true;
                }

                if (app.globalData.debug === true) {
                    console.error('request callcallback error log e.');
                }

                return false;
            },

            fail: function (res) {
                console.error('request fail. res:');
                console.error(res);
            },

            complete: function (res) {
                if (app.globalData.debug === true) {
                    console.info('request complete log');
                    console.info('request ' + url);
                    console.info(res);
                    console.info('request complete log e.');
                }
            }

        });
    },

    setData: function (data, code) {
        return { data: data, statusCode: code };
    }

};

// 对外提供使用。
module.exports.fn = fn;