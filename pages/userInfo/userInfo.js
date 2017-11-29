/**
 * 2017.9.4
 * 孙秀明
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
    windowHeight: '',  //显示屏高度
    nickname: '',  //昵称
    realname: '',  //真实姓名
    alipay_name: '',  //支付宝真实姓名
    alipay_account: '',  //支付宝账号
    mobile: '',  //电话号码
    province: '',  //省份
    city: '',  //市
    area: '',  //区
    userCity: '',  //省市区
    weixin: '',  //微信号
    birth: '',  //出生年月日
    gsbirth: '',  //格式化年月日
    avatar: '',  //头像地址
    startYear: '1906-01-01',  //开始年份
    endYear: '',  //结束年份
    defaultName: '匿名用户',
    onLoaded: true
  },
  getUserTel(e) {
    //获取用户手机号码
    let _this = this;
    _this.setData({
      mobile: e.detail.value
    })
  },
  getWeixin(e) {
    //获取微信号
    let _this = this;
    _this.setData({
      weixin: e.detail.value
    })
  },
  getRealName(e) {
    //获取用户真实姓名
    let _this = this;
    _this.setData({
      realname: e.detail.value
    })
  },
  getAlipayName(e) {
    //支付宝真实姓名
    let _this = this;
    _this.setData({
      alipay_name: e.detail.value
    })
  },
  getAlipayAccount(e) {
    //支付宝账号
    let _this = this;
    _this.setData({
      alipay_account: e.detail.value
    })
  },
  getCity(e) {
    //获取城市
    let _this = this;
    _this.setData({
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
      userCity: `${e.detail.value[0]} ${e.detail.value[1]} ${e.detail.value[2]}`
    })
  },
  getBirth(e) {
    //获取出生年月日
    let _this = this;
    let $date = e.detail.value.split('-');
    _this.setData({
      birth: `${$date[0]}年 ${$date[1]}月 ${$date[2]}日`,
      gsbirth: e.detail.value
    })
  },
  alipay_name: '',  //支付宝真实姓名
  alipay_account: '',  //支付宝账号
  sendUserInfo() {
    //保存用户信息
    let _this = this;
    let warn = '';
    let realname = _this.data.realname;  //真实姓名
    let alipay_name = _this.data.alipay_name;  //支付宝真实姓名
    let alipay_account = _this.data.alipay_account;  //支付宝账号
    let mobile = _this.data.mobile;  //电话
    let province = _this.data.province;  //省
    let city = _this.data.city;  //市
    let area = _this.data.area;  //区
    let weixin = _this.data.weixin;  //微信
    let birth = _this.data.gsbirth;  //格式化出生年月日
    let userCity = _this.data.userCity;  //省市区
    if (mobile == '') {
      warn = '请填写手机号!';
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
      warn = '手机号码格式不正确!';
    } 
    alipay_name==null||alipay_name==false?alipay_name='':alipay_name=_this.data.alipay_name;
    alipay_account==null||alipay_account==false?alipay_account='':alipay_account=_this.data.alipay_account;

    if (weixin == '') {
      warn = '请填写微信号!';
    } else if (realname == '') {
      warn = '请填写姓名';
    } else if (!(/^([\u4E00-\u9FFF]|\w){2,11}$/).test(realname)) {
      warn = '姓名格式不正确!';
    } else if (userCity == '') {
      warn = '请选择所在城市!';
    } else if (birth == '') {
      warn = '请选择出生日期!';
    }


    // else if (alipay_name == '') {
    //   warn = '请填写支付宝姓名';
    // } else if (!(/^([\u4E00-\u9FFF]|\w){2,11}$/).test(alipay_name)) {
    //   warn = '支付宝姓名格式不正确!';
    // } else if (alipay_account == '') {
    //   warn = '请填写支付宝账号';
    // } 

    if (warn) {
      wx.showToast({
        title: warn,
        mask: true,
        image: '../../public/images/errorss.png',
        duration: 1500
      })
    } else {
      let signData = {
        realname,
        alipay_name,
        alipay_account,
        province,
        city,
        area,
        mobile,
        weixin,
        birth
      }
      esTools.fn.setEmpty().setSession().signData(signData).setMethod('put').members(function (res) {
        if (res.statusCode === 1) {
          wx.showToast({
            title: '保存成功!',
            icon: 'success',
            duration: 1500
          })
          // wx.redirectTo({url:'/pages/distributionCenter/distributionCenter'});
          wx.navigateBack();
        } else {
          console.log('userInfo.js sendUserInfo members 接口错误' + res.data)
        }
      })
    }
  },
  onLoad(options) {
    //获取昵称和头像
    let _this = this;
    wx.getUserInfo({
      success: function (res) {
        let nicknames = _this.data.nickname;
        res.userInfo.nickName != '' ? nicknames = res.userInfo.nickName : nicknames = '匿名用户';
        _this.setData({
          nickname: nicknames
        })
      },
      fail: function (res) {
        console.log('userInfo.js onLoad getUserInfo 接口错误' + res.data);
      }
    })
  },
  onShow() {
    // 获取显示屏宽高
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        let height = "height:" + res.windowHeight + 'px;';
        _this.setData({
          windowHeight: height,
        })
      }
    });
    //设置当前年份
    let $date = new Date();
    let y = '';
    let m = '';
    let d = '';
    $date.getFullYear() < 10 ? y = `0${$date.getFullYear()}` : y = $date.getFullYear();
    $date.getMonth() + 1 < 10 ? m = `0${$date.getMonth() + 1}` : m = $date.getMonth() + 1;
    $date.getDate() < 10 ? d = `0${$date.getDate()}` : d = $date.getDate();
    _this.setData({
      endYear: `${y}-${m}-${d}`
    })

    let signData = {}
    esTools.fn.setEmpty().setSession().signData(signData).setMethod('GET').setExtraUrl('memberInfo').members(function (res) {
      if (res.statusCode === 1) {
        let mobile = res.data.mobile;  //手机号
        let weixin = res.data.weixin;  //微信号
        let realname = res.data.realname;  //真实姓名
        let alipay_name = res.data.alipay_name;  //支付宝真实姓名
        let alipay_account = res.data.alipay_account;  //支付宝账号
        let province = res.data.province;//省
        let city = res.data.city;  //市
        let area = res.data.area;  //区
        let birthyear = res.data.birthyear;  //出生年份
        let birthmonth = res.data.birthmonth;  //出生月份
        let birthday = res.data.birthday;  //出生日期
        let birth = '';
        let userCity = '';
        let gsbirth = `${birthyear}-${birthmonth}-${birthday}`;
        (/^[A-Za-z]+$/).test(res.data.province) == true || res.data.province == '' ? province = '' : province = res.data.province;
        (province && city && area) != false ? userCity = `${province} ${city} ${area}` : userCity = '';
        (birthyear && birthmonth && birthday) != false ? birth = `${birthyear} 年 ${birthmonth} 月 ${birthday} 日` : birth = '';
        _this.setData({
          mobile,
          alipay_name,
          alipay_account,
          weixin,
          province,
          city,
          area,
          realname,
          userCity,
          birth,
          gsbirth,
          onLoaded: false
        })
      } else {
        console.log('userInfo.js onShow memberInfo 接口错误' + res.data);
      }

    })
  }
})