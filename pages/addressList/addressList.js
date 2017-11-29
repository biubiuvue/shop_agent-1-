/**
 * 孙秀明
 * 2017.8.15
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        addressList: [] //地址列表
    },
    goEditAddress(e) {
        //编辑地址
        wx.navigateTo({ url: `/pages/editAddress/editAddress?itemads=${JSON.stringify(e.currentTarget.dataset.itemads)}&state=2` });
    },
    goOrderConfirm(e) {
        //去订单确认页面
        let _this = this;
        let myAddressData = {
            realname:e.currentTarget.dataset.itemads.realname,
            address: e.currentTarget.dataset.itemads.address,
            id:e.currentTarget.dataset.itemads.id,
            area:e.currentTarget.dataset.itemads.area,
            city:e.currentTarget.dataset.itemads.city,
            province:e.currentTarget.dataset.itemads.province,
            mobile: e.currentTarget.dataset.itemads.mobile
        };
        app.globalData.addressData = myAddressData;
        wx.navigateBack();
    },
    addAddress() {
        //去新增收货地址页面
        let delShow = false;
        wx.navigateTo({ url: `/pages/editAddress/editAddress?delShow=${delShow}&state=1` });
    },
    onShow() {
        let _this = this;
        let signData = {};
        esTools.fn.setEmpty().setSession().signData(signData).setMethod('get').addresses(function (res) {
            if (res.statusCode === 1) {
                let addressList = res.data.list;
                if (app.globalData.addindex !== undefined) {
                    let addindex = app.globalData.addindex;
                    for (let i = 0; i < addressList.length; i++) {
                        addressList[i].selected = false;
                        if (addressList[i].id == addindex) {
                            addressList[i].selected = true;
                        }
                    }
                }
                _this.setData({
                    addressList
                })

            }
        })
    }
})