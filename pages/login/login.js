//index.js
//获取应用实例
let app = getApp();
let util = require('../../utils/util');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {

        motto: 'Hello World',
        userInfo: {},
        loginMobile : '',
        sendCodeText : '发送验证码',
        sendCodeDisabled : 'disabled',
        reduceWaitTime : 10,
        waitTime : 10,
        kapKey: '',
        loginDisabled : 'disabled',
        loginLoading : false

    },

    loginMobileBind : function(e){

      if(util.getStrLength(e.detail.value) === 11){

          if(util.checkMobile(e.detail.value)){
              this.setData({
                loginMobile: e.detail.value,
                sendCodeDisabled : '',
              });
              
              return ;
          }

          wx.showToast({
            title: '很抱歉，手机号格式不正确',
            icon: 'loading',
            duration: 1200,
            mask : true
          });

      }

      this.setData({
        loginMobile: '',
        sendCodeDisabled : 'disabled'
      });

    },

    sendCode : function(){

        if(app.globalData.debug === true){
            console.log('index.js sendCode.');
            console.log(this.data.loginMobile);
        }
        
        let _this = this;

        _this.setData({
          sendCodeDisabled : 'disabled'
        });
        esTools.fn.signData({'mobile' : this.data.loginMobile}).setMethod('post').sendCode(function(res){
            if(res.statusCode !== 1){
                wx.showModal({
                  title: '短信发送失败',
                  content: '失败原因：' + res.data,
                  showCancel : false,
                  success: function(res) {
                    if (res.confirm) {
                        _this.setData({
                          sendCodeDisabled : '',
                          loginDisabled : 'disabled'
                        });
                    }
                  }
                })

                return false;
            }

            _this.setData({
              sendCodeDisabled : 'disabled',
            });

            // 执行倒计时
            _this.reduceTime();

        });

    },

    kapKeyBind : function(e){

        if(util.getStrLength(e.detail.value) === 6){

            let reg=/^[0-9]\d{1,6}$/i;

            if(reg.test(e.detail.value)){
                this.setData({
                  kapKey: e.detail.value,
                  loginDisabled : ''
                });
                return ;
            }

            wx.showToast({
              title: '验证码有误',
              icon: 'loading',
              duration: 1000,
              mask : true
            });

        }

        this.setData({
          kapKey: '',
        });

    },

    sendLogin : function(){
        
        let _this = this;

        if(util.checkMobile(_this.data.loginMobile) != true){
            wx.showToast({
              title: '很抱歉，手机号格式不正确',
              icon: 'loading',
              duration: 1200,
              mask : true
            });

            return false;
        }

        let reg=/^[0-9]\d{1,6}$/i;

        if(reg.test(_this.data.kapKey) != true){
            wx.showToast({
              title: '验证码有误',
              icon: 'loading',
              duration: 1000,
              mask : true
            });

            return false;
        }

        let sendData = {'mobile' : _this.data.loginMobile, 'kapkey' : _this.data.kapKey};

        _this.setData({
            loginDisabled : 'disabled'
        });
        console.log('5555')
        esTools.fn.signData(sendData).setMethod('post').login(function(res){
            if(res.statusCode !== 1){

                if(res.data === 'undefined'){
                    res.data = '未知错误，请联系管理员';
                }

                wx.showModal({
                  title: '登陆失败',
                  confirmColor: '#E64340',
                  content: '失败原因：' + res.data,
                  showCancel : false,
                  success: function(res) {
                    if (res.confirm) {
                        _this.setData({
                          loginDisabled : ''
                        });
                    }
                  }
                })

                return false;
            }

            // TODO JUMP.
            wx.setStorageSync('sessionKey', res.data);
            wx.switchTab({
                  url: '../index/index'
              });
        });

    },

    reduceTime : function(){

        let _this = this;

        if (_this.data.reduceWaitTime === 0) {

            _this.setData({
              reduceWaitTime: _this.data.waitTime,
              sendCodeDisabled : '',
              sendCodeText : '发送验证码'
            });

        } else {

            // 需保证页面渲染。
            // 非渲染数据，无需使用setData进行操作。
            _this.setData({
              sendCodeText : _this.data.reduceWaitTime+'s'
            });

            _this.data.reduceWaitTime--;

            setTimeout(function () {
                _this.reduceTime();
            }, 1000);

        }

    },

    onLoad: function () {
        if(app.globalData.debug === true){
            console.log('login.js onLoad run.');
        }

        
        
    }
});
