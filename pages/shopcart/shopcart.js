/**
 * 孙秀明
 * 2017.8.13
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        carts: [],               // 购物车列表
        totalPrice: 0,           // 总价，初始为0
        selectAllStatus: true,    // 全选状态默认为true
    },
    goProdetail(e) {
        //跳转商品详情
        let goodId = e.currentTarget.dataset.id;
        wx.navigateTo({ url: '/pages/pro_detail/pro_detail?id=' + goodId });
    },
    getTotalPrice() {
        //计算总价
        let carts = this.data.carts;
        let total = 0;
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].selected) {
                total += carts[i].total * carts[i].marketprice;
            }
        }
        this.setData({
            carts: carts,
            totalPrice: total.toFixed(2)
        })
    },
    selectList(e) {
        //选择事件
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let selectAllStatus = this.data.selectAllStatus;
        const selected = carts[index].selected;
        carts[index].selected = !selected;
        let selectedArr = [];
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].selected) {
                selectedArr.push(carts[i]);
            } else {
                selectedArr.pop(carts[i]);
            }
        }
        if (selectedArr.length == carts.length) {
            selectAllStatus = true;
        } else {
            selectAllStatus = false;
        }
        this.setData({
            carts: carts,
            selectAllStatus: selectAllStatus
        })
        this.getTotalPrice();
    },
    selectAll(e) {
        //全选事件
        let carts = this.data.carts;
        let selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        for (let i = 0; i < carts.length; i++) {
            carts[i].selected = selectAllStatus;
        }
        this.setData({
            carts: carts,
            selectAllStatus: selectAllStatus
        })
        this.getTotalPrice();
    },
    addCount(e) {
        //增加数量
        wx.showLoading({
            title: '加载中',
            mask:true
        })
        let _this = this;
        const index = e.currentTarget.dataset.index;
        const cartid = e.currentTarget.dataset.cartid;
        let carts = this.data.carts;
        let signDatas = {
            cartid: cartid,
            type: '1'
        };
        esTools.fn.setEmpty().setSession().signData(signDatas).setMethod('put').carts(function (res) {
            if (app.globalData.debug === true) {
                console.log('shopcart.js addCount carts res');
                console.log(res);
            }
            if (res.statusCode == 1) {
                carts[index].total++;
                _this.setData({
                    carts
                })
                _this.getTotalPrice();
                wx.hideLoading();
            } else {
                console.log('shopcart.js addCount carts 接口请求失败');
                console.log(res)
            }
        })
    },
    minusCount(e) {
        //减少数量
        wx.showLoading({
            title: '加载中',
            mask:true
        })
        let _this = this;
        const index = e.currentTarget.dataset.index;
        const carts = this.data.carts;
        let cartid = e.currentTarget.dataset.cartid;
        let signDatas = {
            cartid: cartid,
            type: '1'
        };
        esTools.fn.setEmpty().setSession().signData(signDatas).setMethod('put').carts(function (res) {
            if (app.globalData.debug === true) {
                console.log('shopcart.js minusCount cart res');
                console.log(res);
            }
            if (res.statusCode == 1) {
                if (carts[index].total > 1) {
                    carts[index].total--;
                }
                _this.setData({
                    carts: carts
                })
                _this.getTotalPrice();
                wx.hideLoading();
            } else {
                console.log('shopcart.js minusCount cart 接口请求失败');
                console.log(res)
            }
        })
    },
    deleteList(e) {
        //删除商品
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let cartid = e.currentTarget.dataset.cartid;
        let signDatas = {
            cartid: cartid
        }
        let _this = this;
        wx.showModal({
            title: '确认要删除此商品吗？',
            confirmColor: '#E64340',
            success: function (tes) {
                if (tes.confirm) {
                    esTools.fn.setEmpty().setSession().signData(signDatas).setMethod('DELETE').carts(function (res) {
                        if (app.globalData.debug === true) {
                            console.log('shopcart.js deleteList carts res');
                            console.log(res);
                        }
                        if (res.statusCode == 1) {
                            carts.splice(index, 1);
                            _this.setData({
                                carts: carts
                            });
                            _this.getTotalPrice();
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1500
                            })
                        }
                    })
                } else if (tes.cancel) {
                    console.log('用户点击取消')
                }
            }
        });
    },
    settlement() {
        //结算购物车
        let _this = this;
        let totalPrice = _this.data.totalPrice;
        let carts = _this.data.carts;
        let cartIds = [];
        if (_this.data.carts.length> 0) {
            wx.showModal({
                title: '确认要结算购物车吗？',
                confirmColor: '#E64340',
                success: function (res) {
                    if (res.confirm) {
                        for (let i = 0; i < carts.length; i++) {
                            if (carts[i].selected) {
                                cartIds.push(carts[i].id);
                            }
                        }
                        app.globalData.orderData.goodsid = '';
                        app.globalData.orderData.optionid = '';
                        app.globalData.orderData.total = '';
                        app.globalData.orderData.cartids = cartIds.join(',');
                        console.log(cartIds);
                        wx.navigateTo({ url: '/pages/orderConfirm/orderConfirm' });
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            });
        } else {
            wx.showToast({
                title: '请选择物品!',
                mask: true,
                image: '../../public/images/errorss.png',
                duration: 1000
            })
        }
    },
    onShow() {
        this.getTotalPrice();
        let _this = this;
        let carts = _this.data.carts;
        let signDatas = {};
        esTools.fn.setEmpty().setSession().signData(signDatas).setMethod('get').carts(function (res) {
            if (app.globalData.debug === true) {
                console.log('shopcart.js onShow carts res');
                console.log(res);
            }
            if (res.statusCode == 1) {
                let carts = res.data.list;
                let totalprice = res.data.totalprice;
                carts.map((item, index, input) => {
                    item.selected = true;
                })
                _this.setData({
                    carts,
                    totalPrice: totalprice,
                    selectAllStatus:true
                })
            } else {
                console.log('shopcart.js carts 接口请求失败');
                console.log(res);
            }
        });
    }
})