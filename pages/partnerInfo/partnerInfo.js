// partnerInfo.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
  data: {
      teamsinfo:'',
      levelname:'',
      agentlevel:'',
      c_money_sum:'',
      cg_money_sum:'',
      o_status_1_price:'',
      o_status_2_price:'',
      o_status_3_price:'',
      o_status_r1_price:'',
      windowHeight:''
  },

  onLoad: function (options) {
      console.log(options.openid)
    let _this=this;
    let data={
      openid:options.openid
    }
      esTools.fn.setSession().signData(data).setMethod('get').setExtraUrl('teams').commissions(function (res) {
        if(app.globalData.debug===true){
            console.log('partnerInfo.js commissions detail res');
            console.log(res);
        }
        if(res.statusCode===1){
          _this.setData({
            teamsinfo : res.data,
            levelname:res.data.level.levelname,
            agentlevel:res.data. agentlevel.levelname,
            cg_money_sum:res.data.recordStatistics.cg_money_sum,
            c_money_sum:res.data.recordStatistics.c_money_sum,
            o_status_1_price:res.data.orderStatistics.o_status_1_price,
            o_status_2_price:res.data.orderStatistics.o_status_2_price,
            o_status_3_price:res.data.orderStatistics.o_status_3_price,
            o_status_r1_price:res.data.orderStatistics.o_status_r1_price
          })
        }else{
          console.log('会员信息请求出错'+res.data)
        }
      })
    // this.setData({
    //     teamsinfo:{
    //         nickname:'cxl',
    //         id:200,
    //         mobile:13400000000,
    //         avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg'
    //     }
    // })
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
      app.getWindowInfo()
      this.setData({
          windowHeight:app.globalData.windowHeight
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