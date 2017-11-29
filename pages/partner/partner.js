// partner.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // searchShow:false,
      windowHeight:'',
      windowHeightAll:'',
      partnerTap:[
          { id: 0, title: "所有伙伴"},
          { id: 1, title: "已购买伙伴" },
          { id: 2, title: "未购买伙伴" },
      ],
      curNav:'',
      psizes: 10,
      personlist: [],
      //空页面显示判断
      orderShow: true,
      onLoaded: true,
      content:'',
      scroll_time: 2,
      loadding: false,
      loaded: false,
  },
    //列表加载方法
    runPartnerList:function(type) {
        let _this=this;
    let data={
        type:type,
        page:1,
        psize:this.data.psizes
    }
    esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('teamsLists').commissions(function (res) {
        if (app.globalData.debug === true) {
            console.log('partner.js geteamlist res');
            console.log(res);
        }
        if (res.statusCode == 1) {
            if (res.data.lists.length === 0) {
                _this.setData({
                    orderShow: false,
                    personlist: res.data.lists,
                    onLoaded: false,
                })
            }else {
                _this.setData({
                    orderShow: true,
                    // searchShow:true,
                    personlist: res.data.lists,
                    onLoaded: false,
                })
            }
        }else{
            console.log('获取团队列表失败'+res.data)
        }
    });
},
   //上拉加载
    lower:function (e) {
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
        var personlist = _this.data.personlist;
        var curNav = _this.data.curNav;
        switch (curNav) {

            case 0:
                scrollList('all');
                break;

            case 1:
                scrollList('agent');
                break;

            case 2:
                scrollList('fans');
                break;

        }
        function scrollList(type) {
            var data = {
                page: scroll_time,
                status: type,
                psize: _this.data.psizes
            }
            esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('teamsLists').commissions(function (res) {
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
                            personlist.push(res.data[i])
                        }
                        _this.setData({
                            scroll_time: scroll_time,
                            personlist: personlist,
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
    //获取搜索内容
    makeContent:function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    //搜索
    searchTap:function (e) {
        let _this=this
      let con=this.data.content;
      console.log(con)
      if(con.length===11){
          var reg = /^1[3|4|5|7|8][0-9]{9}$/;
          if(reg.test(con)){
              var data={
                  mobile:con
              }
              search(data)
          }else{
              wx.showModal({
                  title:'提示',
                  content:'请输入正确的会员手机号',
                  showCancel: false,
                  duration:2000
              })
          }
      }else{
          var data={
              id:con
          }
          search(data)
      }
      function search(data) {

          esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('teams').commissions(function (res) {
              if (app.globalData.debug === true) {
                  console.log('partner.js getteams res');
                  console.log(res);
              }
              if (res.statusCode == 1) {
                  _this.setData({
                      personlist:res.data.lists
                  })
              }else{
                  console.log('获取失败'+res.data)
                  wx.showToast({
                      title:res.data,
                      icon:'loading'
                  })
              }
          });
      }
    },
  //切换tabbar
  switchRightTab:function (e) {
    console.log(e)
    var　_this=this,
        id=e.currentTarget.dataset.id;
    _this.setData({
        curNav: id,
        defVal:'',
        personlist: [],
    })
      switch (id){
          case 0:

              this.runPartnerList('all');
              break;

          case 1:
              this.runPartnerList('agent');
              break;

          case 2:
              this.runPartnerList('fans');
              break;
      }


    // function runPartnerList(type) {
    //     let data={
    //       type:type,
    //         page:1,
    //         psize:_this.data.psizes
    //     }
    //     esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('teamsLists').commissions(function (res) {
    //         if (app.globalData.debug === true) {
    //             console.log('partner.js geteamlist res');
    //             console.log(res);
    //         }
    //         if (res.statusCode == 1) {
    //             _this.setData({
    //                 personlist: res.data.lists,
    //             })
    //             if (res.data.lists.length === 0) {
    //                 _this.setData({
    //                     orderShow: true
    //                 })
    //             }
    //         }else{
    //           console.log('获取团队列表失败'+res.data)
    //         }
    //     });
    // }
  },
    //查看伙伴详情
  detailTap:function (e) {
        let openid=e.currentTarget.dataset.openid;
        wx.navigateTo({
            url:'/pages/partnerInfo/partnerInfo?openid='+openid
        })
    },
  onLoad: function (options) {
      var　_this=this,
          status=parseInt(options.status);
      _this.setData({
          curNav: status,
          personlist: [],
      });
      switch (status){
          case 0:
              this.runPartnerList('all');
              break;

          case 1:
              this.runPartnerList('agent');
              break;

          case 2:
              this.runPartnerList('fans');
              break;
      }
    // this.setData({
    //     personlist:[
    //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',id:2014,createtime:'2014-12-20'},
    //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',id:2014,createtime:'2014-12-20'},
    //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',id:2014,createtime:'2014-12-20'},
    //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',id:2014,createtime:'2014-12-20'},
    //         {avatar:'http://ws7.wshoto.com/attachment/images/2/2017/01/r6fXH8vGlLsxVSbx6wVg5cX6XZc9zG.jpg',nickname:'张三',id:2014,createtime:'2014-12-20'},
    //     ],
    //     // searchShow:true
    // })
  },
  onShow: function () {
      let _this=this
      wx.getSystemInfo({
          success:(res)=>{
              let heihgtAll="height:"+(res.windowHeight)+"px";
              let height="height:"+(res.windowHeight-102)+"px";
              _this.setData({
                  windowHeight:height,
                  windowHeightAll:heihgtAll
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