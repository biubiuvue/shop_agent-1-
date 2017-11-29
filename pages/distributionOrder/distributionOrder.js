// distributionOrder.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        searchShow: false,
        windowHeight: '',
        windowHeightAll: '',
        partnerTap: [
            { id: 0, title: "全部" },
            { id: 1, title: "未结算" },
            { id: 2, title: "已退款" },
            { id: 3, title: "已结算" },
        ],
        curNav: '',
        psizes: 10,
        orderLists: [],
        //空页面显示判断
        orderShow: true,
        onLoaded: true,
        content: '',
        scroll_time: 2,
        loadding: false,
        loaded: false,
    },
    //列表加载方法
    runPartnerList: function (type) {
        let _this = this;
        let psize = _this.data.psizes
        console.log(psize)
        this.setData({
            orderLists: []
        })
        let data = {
            type: type,
            page: 1,
            psize: psize
        }
        esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('orderLists').commissions(function (res) {
            if (app.globalData.debug === true) {
                console.log('partner.js getorderlist res');
                console.log(res);
            }
            if (res.statusCode == 1) {
                if (res.data == null || res.data.length === 0) {
                    _this.setData({
                        orderShow: false,
                        // orderLists: res.data.lists,
                        orderLists: [],
                        onLoaded: false,
                    })
                } else {
                    _this.setData({
                        orderShow: true,
                        // searchShow:true,
                        orderLists: res.data,
                        onLoaded: false,
                    })
                }
            } else {
                console.log('获取订单列表失败' + res.data)
            }
        });
    },
    //上拉加载
    lower: function (e) {
        console.log('ttt')
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
        var orderLists = _this.data.orderLists;
        var curNav = _this.data.curNav;
        var psize = _this.data.psizes
        switch (curNav) {

            // case 0:
            //     this.scrollList('total');
            //     break;

            case 1:
                scrollList('lock');
                break;

            case 2:
                scrollList('refund');
                break;
            case 3:
                scrollList('ok');
                break;
            default:
                scrollList('total');
        }
        function scrollList(type) {
            var data = {
                page: scroll_time,
                status: type,
                psize: psize
            }
            esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('orderLists').commissions(function (res) {
                if (res.statusCode == 1) {
                    if (res.data.length === 0 || res.data.length < data.psize) {
                        _this.setData({
                            loaded: true,
                        });
                        wx.hideToast();
                        _this.setData({
                            hideBottom: true,
                            loadMoreData: '加载完毕，已经没有更多伙伴信息!'
                        });
                    }
                    if (res.data.length !== 0) {
                        scroll_time++;
                        for (let i = 0; i < res.data.length; i++) {
                            orderLists.push(res.data[i])
                        }
                        _this.setData({
                            scroll_time: scroll_time,
                            orderLists: orderLists,
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
    //推广订单详情
    detailTap: function (e) {
        let ordersn = e.currentTarget.dataset.ordersn;
        wx.navigateTo({
            url: 'pages/orderInfo/orderInfo?ordersn=' + ordersn
        })
    },
    //获取搜索内容
    makeContent: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    //搜索
    searchTap: function (e) {
        let _this = this
        let con = this.data.content;
        if (con.length === 0) {
            wx.showModal({
                title: '提示',
                content: '请输入订单号或会员ID',
                showCancel: false,
            })
        } else if (con.length === 20) {
            var data = {
                ordersn: this.data.con
            }
            search(data)
        } else {
            var data = {
                mid: this.data.con
            }
            search(data)
        }
        function search(data) {

            esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('orders').commissions(function (res) {
                if (app.globalData.debug === true) {
                    console.log('distribution.js getorders res');
                    console.log(res);
                }
                if (res.statusCode == 1) {
                    if (res.data.order.length != 0) {
                        _this.setData({
                            orderLists: res.data.order
                        })
                    } else {
                        wx.showToast({
                            title: '搜索的订单不存在',
                            icon: 'loading'
                        })
                    }
                } else {
                    console.log('获取失败' + res.data)
                    wx.showToast({
                        title: res.data,
                        icon: 'loading'
                    })
                }
            });
        }
    },
    //切换tabbar
    switchRightTab: function (e) {
        console.log(e)
        var 　_this = this,
            id = e.currentTarget.dataset.id;
        _this.setData({
            curNav: id,
            defVal: '',
            orderLists: [],
        })
        switch (id) {
            case 0:

                this.runPartnerList('total');
                break;

            case 1:
                this.runPartnerList('lock');
                break;

            case 2:
                this.runPartnerList('refund');
                break;
            case 3:
                this.runPartnerList('ok');
                break;
        }



    },
    onLoad: function (options) {
        var 　_this = this,
            status = parseInt(options.status);
        _this.setData({
            curNav: status,
            // orderLists: [],
        });
        switch (status) {
            case 0:
                this.runPartnerList('total');
                break;

            case 1:
                this.runPartnerList('lock');
                break;

            case 2:
                this.runPartnerList('refund');
                break;
            case 3:
                this.runPartnerList('ok');
            // default:
            //     this.runPartnerList('total');
        }

        // this.setData({
        //     orderLists:[
        //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',mid:2014,createtime:'2014-12-20',status:'3',price:'100'},
        //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',mid:2014,createtime:'2014-12-20',status:'4',price:'200'},
        //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',mid:2014,createtime:'2014-12-20',status:'5',price:'200'},
        //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',mid:2014,createtime:'2014-12-20',status:'1',price:'399'},
        //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',mid:2014,createtime:'2014-12-20',status:'2',price:'499'},
        //     ],

        // })
    },
    onShow: function () {
        let _this = this
        wx.getSystemInfo({
            success: (res) => {
                let heihgtAll = "height:" + (res.windowHeight) + "px";
                let height = "height:" + (res.windowHeight - 102) + "px";
                _this.setData({
                    windowHeight: height,
                    windowHeightAll: heihgtAll
                })
            }
        })
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
    }
})