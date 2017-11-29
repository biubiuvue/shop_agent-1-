/**
 * 2017.9.1
 * 孙秀明
 */
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        ok: '0',  //可提现业绩  可提现金额
        default: '0',  //累积销售收益
        manage: '0',  //累积管理收益
        o_status_3: '0',  //已收货业绩
        pay: '0',  //已提现业绩  已提现金额
        invalid: '0', //被驳回的业绩
        apply: '0', //申请中业绩
        check: '0', //待打款业绩
        onLoaded:true
    },
    goMoneyDetaile() {
        wx.navigateTo({ url: '/pages/moneyDetaile/moneyDetaile' });
    },
    goCashFlow() {
        wx.navigateTo({ url: '/pages/cashFlow/cashFlow' });
    },
    onLoad(options) {
        let _this = this;
        let signData = {
            type: ''
        }
        esTools.fn.setEmpty().setSession().signData(signData).setMethod('GET').setExtraUrl('recordStatistics').commissions(function (res) {
            console.log(res);
            if (res.statusCode === 1) {
                _this.setData({
                    default: res.data.default.c_money_sum,  //累积销售收益
                    manage: res.data.manage.c_money_sum,  //累积管理收益
                    o_status_3: res.data.o_status_3.c_money_sum || 0,  //已收货业绩
                    pay: res.data.pay.c_money_sum || 0,  //已提现业绩 可提现金额
                    ok: res.data.ok.c_money_sum || 0,  //可提现业绩 可提现金额
                    invalid: res.data.invalid.cg_money_sum || 0,  //被驳回业绩
                    apply: res.data.apply.c_money_sum,  //申请中业绩
                    check: res.data.check.c_money_sum || 0,  //待打款业绩
                    onLoaded:false
                })

            } else {
                console.log('withdrawals.js onLoad commissions/recordStatistics 接口错误' + res.data);
            }
        })
    }
})