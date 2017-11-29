// logistics.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticArr:[],
    isShow:true,
    orderlist:'',
    logisticSn:'',
    onLoaded:true
  },
  backuptap:function(e){
    wx.navigateBack(1)
  },
    proTap(e) {
        //点击图片跳转到详情页
        let pro_id = e.target.dataset.id;
        wx.navigateTo({ url: '/pages/pro_detail/pro_detail?id=' + pro_id });
    },
  onLoad: function (options) {
      console.log(options)
    let _this=this;
    let orderid=options.orderid;
    let express = options.express;
    let expresssn = options.expresssn;
    _this.setData({
        logisticSn:expresssn
    })
    function runlogistics(){
      let logistic={
        express: express,
        expresssn: expresssn
      }
      esTools.fn.setEmpty().setSession().signData(logistic).setMethod('get').expresses(function (res) {
        if (app.globalData.debug === true) {
          console.log('logistics.js expresses res');
          console.log(res);
        }
        //物流修改
        if (res.statusCode == 1) {
          _this.setData({
            logisticArr: res.data,
            onLoaded:false,
            isShow:false
          })
        }else{
          _this.setData({
              isShow:true
          })
        }
      }); 
    }
    function runorder() {
        let data={
            orderid:orderid
        }
        esTools.fn.setEmpty().setSession().signData(data).setMethod('get').orders(function (res) {
            if (app.globalData.debug === true) {
                console.log('logistics.js orders res');
                console.log(res);
            }
            if (res.statusCode == 1) {
                _this.setData({
                    orderlist: res.data.goods,
                    onLoaded:false
                })
            }
        });
    }
      runlogistics();
      runorder()
  },  
})