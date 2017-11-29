/**
 * 孙秀明
 * 2017.8.15
 */
let app = getApp();
Page({
    data: {
        windowHeight: 0,
        windowWidth: 0,
        addressList: []
    },
    goBack:function(){
        wx.navigateBack(-1);
    },
    goEditAddress:function(e){
        //获得当前地址
        let _this=this;
        let myaddress=e.currentTarget.dataset.myaddress;
        wx.navigateTo({url:'/pages/editAddress/editAddress?myaddress='+JSON.stringify(myaddress)});     
    },
    delAddress: function (e) {
        let _this=this;
        let addressList=_this.data.addressList;
        let index=e.currentTarget.dataset.index;
        addressList.splice(index,1);
        wx.showModal({
            title: '确认要删除该地址吗?',
            confirmColor: '#EC5151',
            success: function (res) {
                if (res.confirm) {
                    _this.setData({
                        addressList:addressList
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
    },
    onShow: function () {
        // 获取显示屏宽高
        let _this = this;
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            }
        });
        let addressList = _this.data.addressList;
        addressList = [
            {
                "id": "33998",
                "uniacid": "2",
                "openid": "ombk8whtL8ZboOYxDGJFO-K4jUsg",
                "realname": "邓先生",
                "mobile": "13921959550",
                "province": "江苏省",
                "city": "无锡市",
                "area": "滨湖区",
                "address": "山水科教产业园，3幢10楼，江苏微盛，技术部，邓山水科教产业园，3幢10楼，江苏微盛，技术部，邓",
                "isdefault": "0",
                "zipcode": "",
                "deleted": "0"
            },
            {
                "id": "9871",
                "uniacid": "2",
                "openid": "ombk8whtL8ZboOYxDGJFO-K4jUsg",
                "realname": "dddd",
                "mobile": "13921959550",
                "province": "江苏省",
                "city": "无锡市",
                "area": "南长区",
                "address": "测试",
                "isdefault": "1",
                "zipcode": "",
                "deleted": "0"
            }

        ];

        _this.setData({
            addressList:addressList
        })
    }
})