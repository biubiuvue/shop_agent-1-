let app = getApp();
let util = require('../../utils/util');
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
let WxParse = require('../../wxParse/wxParse.js');

// topic.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        windowHeight:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.debug === true) {
            console.log('topic.js onLoad running. options:');
            console.log(options);
        }

        if(typeof options.identification === 'undefined' || options.identification === ''){
            wx.navigateBack();
        }else{
            this.loadHtml(options.identification);
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                var height = "height:" + res.windowHeight + 'px;';
                _this.setData({
                    windowHeight: height,
                })
            }
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    loadHtml : function(identification){
        let _this = this;

        let topic = {
            identification : identification
        };

        esTools.fn.setEmpty().signData(topic).setMethod('get').topics(function (res) {
            if (app.globalData.debug === true) {
                console.log('topic.js loadHtml res');
                console.log(res);
            }
            if (res.statusCode === 1) {
                /*_this.setData({
                    pro_info: res.data.content,
                    onLoaded:false
                });*/
                WxParse.wxParse('article', 'html', res.data.content, _this,10 );
                // wx.hideToast();
            }
        })

    }

})