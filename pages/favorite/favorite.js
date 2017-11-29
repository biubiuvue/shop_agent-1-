// favorite.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
let util=require('../../utils/util')
Page({
  data: {
    psize:10,
    favoriteArr:[],
    orderShow:true,
      // selectedArr:[],
      selectAllStatus:false,
      //被选中的收藏下标集合
      idArr:[],
      indexArr:[],
      scroll_time:2,
      loadding: false,
      loaded: false,
      loadMoreData:'',
      windowHeight:'',
      runFav:'',
      hideBottom: false
  },
    //上拉刷新
    lower:function (e) {
      console.log(1111)
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
        let scroll_time = _this.data.scroll_time;
        let favoriteArr = _this.data.favoriteArr;
        let psize=_this.data.psize
        console.log(scroll_time)
        let data = {
            page: scroll_time,
            psize: psize
        };
        esTools.fn.setSession().signData(data).setMethod('get').setExtraUrl('favorite').products(function (res) {
            if (res.statusCode === 1) {
                if (res.data.length === 0 || res.data.length < data.psize) {
                    _this.setData({
                        loaded: true,
                    });
                    wx.hideToast();
                    _this.setData({
                        hideBottom: true,
                        loadMoreData: '加载完毕，已经没有更多收藏!'
                    });
                }

                if (res.data.length !== 0) {
                    scroll_time++;
                    for (let i = 0; i < res.data.length; i++) {
                        favoriteArr.push(res.data[i])
                    }
                    _this.setData({
                        scroll_time: scroll_time,
                        favoriteArr: favoriteArr,
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
    },
    //点击去看看
    goLook: function () {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    //点击选择符号
    select:function (e) {
        const index = e.currentTarget.dataset.index;
        const id = e.currentTarget.dataset.id;
        let favoriteArr = this.data.favoriteArr;
        let idArr=this.data.idArr;
        let indexArr=this.data.indexArr;
        let selectAllStatus = this.data.selectAllStatus;
        const selected = favoriteArr[index].selected;
        favoriteArr[index].selected = !selected;
        if(favoriteArr[index].selected){
            if(idArr.length==0){
                idArr.push(id)
                indexArr.push(index)
                console.log(111)
            }else{
                for(let i=0;i<idArr.length;i++){
                    if(idArr[i]!=favoriteArr[index].id){
                        console.log(222)
                    }
                }
                idArr.push(id)
                indexArr.push(index)
            }
            console.log(indexArr)
        }else{
            idArr.pop(id);
            indexArr.pop(index)
        }
        console.log(idArr)

        if (idArr.length == favoriteArr.length) {
            selectAllStatus = true;
        } else {
            selectAllStatus = false;
        }

        this.setData({
            favoriteArr: favoriteArr,
            selectAllStatus: selectAllStatus,
            idArr:idArr,
            indexArr:indexArr
        })
        console.log(indexArr)
    },
    //点击删除
    cancel:function (e) {
      let _this=this;
      let idArr=this.data.idArr;
      let indexArr=this.data.indexArr;
      let favoriteArr=this.data.favoriteArr;
      let selectAllStatus=this.data.selectAllStatus;
      if(idArr.length==0){
          wx.showModal({
              title:'提示',
              content:'请选择您要删除的收藏商品',
              duration: 2000
          })
      }else{
      let goodsid=this.data.idArr.join()
        if(selectAllStatus){
            let data={
                goodsid:goodsid,
                clearall:0
            }
            esTools.fn.setEmpty().setSession().signData(data).setMethod('delete').setExtraUrl('favorite').products(function (res) {
                if (app.globalData.debug === true) {
                    console.log('favorite.js products delete res');
                    console.log(res);
                }
                if(res.statusCode==1){
                    wx.showToast({
                        title:res.data,
                        icon: 'success',
                        duration: 2000
                    })
                    _this.setData({
                        favoriteArr:favoriteArr,
                        idArr:[],
                        indexArr:[],
                        selectAllStatus:false
                    })
                    let data={
                        page:1,
                        psize:_this.data.psize,
                        fields: 'id,thumb,title,marketprice'
                    }
                    esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('favorite').products(function (res) {
                        console.log(res.data)
                        if(res.statusCode==1){
                            let favoriteArr=res.data;
                            favoriteArr.map((item, index, input) => {
                                item.selected = false;
                            })
                            _this.setData({
                                favoriteArr:favoriteArr
                            })
                            if(favoriteArr.length==0){
                                _this.setData({
                                    favoriteArr:favoriteArr,
                                    orderShow:false,
                                    idArr:[],
                                    indexArr:[],
                                })
                            }
                        }else{
                            console.log('获取收藏列表失败：'+res.data)
                        }
                    })
                }else{
                    console.log('删除收藏失败：'+res.data)
                }
            })
        }else{
            let data={
                goodsid:goodsid,
                clearall:0
            }
            esTools.fn.setEmpty().setSession().signData(data).setMethod('delete').setExtraUrl('favorite').products(function (res) {
                if (app.globalData.debug === true) {
                    console.log('favorite.js products delete res');
                    console.log(res);
                }
                if(res.statusCode==1){
                    wx.showToast({
                        title:res.data,
                        icon: 'success',
                        duration: 2000
                    })
                    _this.setData({
                        indexArr:[],
                        idArr:[]
                    })
                    let data={
                        page:1,
                        psize:_this.data.psize,
                        fields: 'id,thumb,title,marketprice'
                    }
                    esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('favorite').products(function (res) {
                        console.log(res.data)
                        if(res.statusCode==1){
                            let favoriteArr=res.data;
                            favoriteArr.map((item, index, input) => {
                                item.selected = false;
                            })
                            _this.setData({
                                favoriteArr:favoriteArr
                            })
                            if(favoriteArr.length==0){
                                _this.setData({
                                    favoriteArr:favoriteArr,
                                    orderShow:false,
                                    idArr:[],
                                    indexArr:[],
                                })
                            }
                        }else{
                            console.log('获取收藏列表失败：'+res.data)
                        }
                    })


                    // favoriteArr=res.data
                    // util.listNum(indexArr);
                    // console.log(favoriteArr)
                    // console.log(indexArr);
                    // favoriteArr.map((item, index, input) => {
                    //     item.selected = false;
                    // })
                    // _this.setData({
                    //     favoriteArr:favoriteArr,
                    //     indexArr:[],
                    //     idArr:[]
                    // })
                }else{
                    console.log('删除收藏失败：'+res.data)
                }
            })
        }
      }
    },
    selectAll:function(e) {
      //全选事件
      let favoriteArr = this.data.favoriteArr;
      let selectAllStatus = this.data.selectAllStatus;
      let idArr=this.data.idArr;
      let indexArr=this.data.indexArr;
      selectAllStatus = !selectAllStatus;
      if(selectAllStatus){
          for (let i = 0; i < favoriteArr.length; i++) {
            favoriteArr[i].selected = selectAllStatus;
                idArr[i]=favoriteArr[i].id
              indexArr[i]=i
          }
      }else{
          for (let i = 0; i < favoriteArr.length; i++) {
              favoriteArr[i].selected = selectAllStatus;
              idArr=[];
              indexArr=[]
          }
      }
      // for (let i = 0; i < favoriteArr.length; i++) {
      //   favoriteArr[i].selected = selectAllStatus;
      //       idArr.push(favoriteArr[i].id)
      // }
      this.setData({
        favoriteArr: favoriteArr,
        selectAllStatus: selectAllStatus,
          idArr:idArr,
          indexArr:indexArr
      })
    },
    //点击商品信息跳转到详情
    goPro:function (e) {
        let id= e.currentTarget.dataset.id;
        wx.redirectTo({
            url:'/pages/pro_detail/pro_detail?id='+id
        })
    },
  onLoad: function (options) {
      let _this=this;
      let data={
          page:1,
          psize:_this.data.psize,
          fields: 'id,thumb,title,marketprice'
      }
        esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('favorite').products(function (res) {
            if (app.globalData.debug === true) {
                console.log('facorite.js products getfavorite res');
                console.log(res);
            }
            console.log(res.data)
            if(res.statusCode==1){
                let favoriteArr=res.data;
                favoriteArr.map((item, index, input) => {
                    item.selected = false;
                })
                _this.setData({
                    favoriteArr:favoriteArr
                })
                if(favoriteArr.length==0){
                    _this.setData({
                        favoriteArr:favoriteArr,
                        orderShow:false
                    })
                }
            }else{
                console.log('获取收藏列表失败：'+res.data)
            }
        })
  },

  onShow: function () {
      let _this=this
    wx.getSystemInfo({
        success:(res)=>{
            let height="height:"+(res.windowHeight-50)+"px";
            _this.setData({
                windowHeight:height
            })
        }
    })
  },

 
})