/**
 * 孙秀明
 * 2017.8.15
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        windowHeight: 0,  //显示屏高度
        windowWidth: 0,  //显示屏宽度
        province: "",  //省
        city: "",  //市
        county: '',  //区
        userName: '',  //收件人姓名
        userTel: '',  //收件人电话
        userAddress: '',  //收件人地址
        userMoreAddress: '',  //收件人详细地址
        delShow: true, //删除地址按钮 是否显示
        addressid: '', //地址id
        state: ''  //1是增加  2是编辑
    },
    getUserName(e) {
        //获得收件人姓名
        let _this = this;
        let userName = e.detail.value;
        _this.setData({
            userName: userName
        })
    },
    getUserTel(e) {
        //获得收件人电话
        let _this = this;
        let userTel = e.detail.value;
        _this.setData({
            userTel: userTel
        })
    },
    getUserMoreAddress(e) {
        //获得收件人详细地址
        let _this = this;
        let userMoreAddress = e.detail.value;
        _this.setData({
            userMoreAddress: userMoreAddress
        })
    },
    getCity(e) {
        //获取城市
        let _this = this;
        _this.setData({
            province: e.detail.value[0],
            city: e.detail.value[1],
            county: e.detail.value[2],
            userAddress: `${e.detail.value[0]} ${e.detail.value[1]} ${e.detail.value[2]}`
        })
    },
    postAddress() {
        //保存地址
        let _this = this;
        let realname = _this.data.userName; //姓名
        let mobile = _this.data.userTel; //电话
        let userAddress = _this.data.userAddress; //拼接的地址
        let province = _this.data.province; //省
        let city = _this.data.city;  //市
        let area = _this.data.county;  //区
        let address = _this.data.userMoreAddress; //详细地址
        let warn = '';
        let state = _this.data.state;  //当前状态 1是增加  2是编辑
        let addressid = _this.data.addressid;  //addressid
        if (realname == '') {
            warn = '请填写收货人姓名!';
        } else if (realname.length < 2 || realname.length > 10) {
            warn = '姓名长度不正确!';
        } else if (mobile == '') {
            warn = '请填写收货人手机号!';
        } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
            warn = '手机号码格式不正确!';
        } else if (userAddress == '') {
            warn = '请选择收货地址!';
        } else if (address == '') {
            warn = '请填写详细收货地址!';
        }
        if (warn) {
            wx.showToast({
                title: warn,
                mask: true,
                image: '../../public/images/errorss.png',
                duration: 1500
            })
        } else {
            if (state == 1) {
                let signData = {
                    realname,
                    mobile,
                    province,
                    city,
                    area,
                    address
                }
                esTools.fn.setEmpty().setSession().signData(signData).setMethod('post').addresses(function (res) {
                    if (res.statusCode === 1) {
                        signData.id = res.data;
                        app.globalData.addindex = res.data;
                        app.globalData.addressData = signData;
                        console.log(res.data);
                        wx.showToast({
                            title: '新增成功',
                            icon: 'success',
                            duration: 1500
                        })
                        wx.navigateBack();
                    } else {
                        wx.showToast({
                            title: '新增失败',
                            image: '../../public/images/errorss.png',
                            duration: 1500
                        })
                    }
                })
            } else if (state == 2) {
                let signData = {
                    realname,
                    mobile,
                    province,
                    city,
                    area,
                    address,
                    addressid
                }
                console.log(signData);
                esTools.fn.setEmpty().setSession().signData(signData).setMethod('put').addresses(function (res) {
                    console.log(res);
                    if (res.statusCode === 1) {
                        signData.id = addressid;
                        app.globalData.addindex = addressid;
                        app.globalData.addressData = signData;
                        console.log(signData);
                        console.log( app.globalData.addressData);
                        wx.showToast({
                            title: '修改成功',
                            icon: 'success',
                            duration: 1500
                        })
                        wx.navigateBack();
                    } else {
                        wx.showToast({
                            title: '已添加该地址',
                            image: '../../public/images/errorss.png',
                            duration: 1500
                        })
                    }
                })
            }
        }
    },
    delAddress() {
        let _this = this;
        let addressid = _this.data.addressid;
        wx.showModal({
            title: '确认要删除该地址吗？',
            confirmColor: '#19AC15',
            success: function (res) {
                if (res.confirm) {
                    let signData = {
                        addressid: addressid
                    };
                    esTools.fn.setEmpty().setSession().signData(signData).setMethod('delete').addresses(function (res) {
                        if (res.statusCode === 1) {
                            if (app.globalData.debug === true) {
                                console.log('editAddress.js delAddress addresses res');
                            }
                            app.globalData.addressData = {};
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1500
                            })
                            wx.navigateBack();
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });
    },
    getWeixinAddress(){
      let _this = this;
      wx.chooseAddress({
        success: function (res) {
          _this.setData({
            province: res.provinceName,
            city: res.cityName,
            county: res.countyName,
            userAddress: `${res.provinceName} ${res.cityName} ${res.countyName}`,
            userName: res.userName,
            userTel: res.telNumber,
            userMoreAddress: res.detailInfo,
          })
        }
      })
    },
    onLoad(options) {
        let _this = this;
        //查询当前的设置 判断是否开启获取微信自带的地址
        esTools.fn.setEmpty().setSession().signData().setMethod('get').setExtraUrl('Sysset').orders(function (res) {
          if (_this.data.state == 1 && res.statusCode == 1 && res.data.shareaddress == 1){
              _this.getWeixinAddress()
            }
        })
        if (options.itemads != undefined) {
            let userName = JSON.parse(options.itemads).realname;
            let userTel = JSON.parse(options.itemads).mobile;
            let userMoreAddress = JSON.parse(options.itemads).address;
            let addressid = JSON.parse(options.itemads).id;
            let province=JSON.parse(options.itemads).province;
            let city=JSON.parse(options.itemads).city;
            let area=JSON.parse(options.itemads).area;
            let userAddress = `${JSON.parse(options.itemads).province} ${JSON.parse(options.itemads).city} ${JSON.parse(options.itemads).area}`;
            _this.setData({
                userName: userName,
                userTel: userTel,
                userAddress: userAddress,
                userMoreAddress: userMoreAddress,
                addressid: addressid,
                province:province,
                city:city,
                area:area,
            })
        }
        if (options.state) {
            _this.setData({
                state: options.state
            })
        }
        let lastDelShow = options.delShow === "false" ? false : true;
        _this.setData({
            delShow: lastDelShow
        })
    },
    onShow() {
        let _this = this;
        // 获取显示屏宽高
        wx.getSystemInfo({
            success: function (res) {
                let height = `height:${res.windowHeight}px;`;
                let width = `width:${res.windowWidth}px;`
                _this.setData({
                    windowHeight: height,
                    windowWidth: width
                })
            }
        });
    }
})