// distributionOrder.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        c_money_sum: 0.00,//推广费
        // teamsStatistics: {
        all: '0',  //总人数
        purchased: '0',  //已购买人数
        no_purchased: '0',  //未购买人数
        // },
        // orderStatistics: {
        total: '0',//全部
        lock: '0',//未结算
        refund: '0',//已退款
        ok: '0', //已结算
        // },
        // memberInfo: {
        nickname: '',//昵称
        id: '',//会员id
        level: '',//会员等级
        avatar: '',
        from: '',  //推荐人
        onLoaded: true,
        defaultImg: 'http://img5.imgtn.bdimg.com/it/u=1502397120,2400659771&fm=23&gp=0.jpg',
        // },
    },
    //下拉刷新
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        console.log(333)
        this.onLoad()
        setTimeout(wx.hideNavigationBarLoading, 1000)
        //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        //         this.onLoad()
        //         console.log(444)
        //
        //         console.log(555)
        // console.log(1111)
    },

    //跳转我的二维码
    goQrcode: function (e) {
        // wx.showModal({
        //     title: '提示',
        //     content: '暂未开通，敬请期待',
        // })
        wx.navigateTo({ url: '/pages/QRCode/QRCode' });
    },
    //点击进伙伴列表
    partnerInfoTap: function (e) {
        let status = e.currentTarget.dataset.status;
        wx.navigateTo({ url: '/pages/partner/partner?status=' + status })
    },
    //点击进推广订单列表
    distributionOrderInfo: function (e) {
        let status = e.currentTarget.dataset.status;
        wx.navigateTo({ url: '/pages/distributionOrder/distributionOrder?status=' + status })
    },
    goUserinfo() {
        wx.navigateTo({ url: '/pages/userInfo/userInfo' });
    },
    goWithdrawals() {
        wx.navigateTo({ url: '/pages/withdrawals/withdrawals' })
    },
    onLoad: function (options) {
        let _this = this;
        wx.getUserInfo({
            success: function (res) {
                let nicknames = _this.data.nickname;
                let avatar=_this.data.avatar;
                let defaultImg=_this.data.defaultImg;
                res.userInfo.nickName != '' ? nicknames = res.userInfo.nickName : nicknames = '匿名用户';
                console.log(res)
                res.userInfo.avatarUrl!=''?avatar= res.userInfo.avatarUrl:avatar=defaultImg;
                _this.setData({
                    nickname: nicknames,
                    avatar:avatar
                })
            },
            fail: function (res) {
                // console.log('userInfo.js onLoad getUserInfo 接口错误' + res.data);
            }
        })
        function runrecordStatistics() {
            let data = {
                // type:'total'
            }
            esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('recordStatistics').commissions(function (res) {
                if (app.globalData.debug === true) {
                    console.log('distributionCenter.js get recordStatistics money res');
                    console.log(res);
                }
                if (res.statusCode === 1) {
                    if (res.data.length !== 0) {
                        _this.setData({
                            c_money_sum: res.data.total.c_money_sum
                        })
                    }
                } else {
                  // console.log('获取推广费失败' + JSON.stringify(res))
                }
            })
        }
        runrecordStatistics();
        function runteamsStatistics() {
            let data = {}
            esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('teamsStatistics').commissions(function (res) {
                if (app.globalData.debug === true) {
                    console.log('distributionCenter.js get teamsStatistics partner res');
                    console.log(res);
                }
                if (res.statusCode === 1) {

                    _this.setData({
                        all: res.data.all || 0,//这里是所有小伙伴
                        purchased: res.data.purchased || 0,
                        no_purchased: res.data.no_purchased || 0,
                    })
                } else {
                  // console.log('获取推广订单数量失败' + JSON.stringify(res))
                }
            })
        }
        runteamsStatistics();
        function runorderStatistics() {
            let data = {}
            esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('orderStatistics').commissions(function (res) {
                if (app.globalData.debug === true) {
                    console.log('distributionCenter.js get orderStatistics order res');
                    console.log(res);
                }
                if (res.statusCode === 1) {
                    if (res.data.length !== 0) {
                        _this.setData({
                            total: res.data.total.order_count || 0,
                            lock: res.data.lock.order_count || 0,
                            refund: res.data.refund.order_count || 0,
                            ok: res.data.ok.order_count || 0
                        })
                    }
                } else {
                  // console.log('获取伙伴数量失败' + JSON.stringify(res))
                }
            })
        }
        runorderStatistics()
    },
    onShow: function () {
        let _this = this;
        function runmemberInfo() {
            let data = {
            }
            esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('memberInfo').members(function (res) {
                if (app.globalData.debug === true) {
                    console.log('distributionCenter.js get memberInfo res');
                    console.log(res);
                }
                if (res.statusCode === 1) {
                    let from='';
                    res.data.parent_name==null||res.data.parent_name==false?from='总店':from=res.data.parent_name
                    _this.setData({
                        // nickname : res.data.nickname,
                        id: res.data.id,
                        // avatar: res.data.avatar,
                        from,
                        level: res.data.agentleveldetail.levelname,
                        onLoaded: false
                    })
                } else {
                  // console.log('获取用户信息失败' + JSON.stringify(res))
                }
            })
        }
        runmemberInfo();
    }
})
