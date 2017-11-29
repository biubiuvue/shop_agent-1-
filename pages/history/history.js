// history.js
let app = getApp();
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
let util=require('../../utils/util')
Page({
    data: {
        psize:10,
        historyArr:[],
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
        hideBottom: false,
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
        let historyArr = _this.data.historyArr;
        let psize=_this.data.psize
        console.log(scroll_time)
        let data = {
            page: scroll_time,
            psize: psize
        };
        esTools.fn.setSession().signData(data).setMethod('get').setExtraUrl('history').products(function (res) {
            if (res.statusCode === 1) {
                if (res.data.length === 0 || res.data.length < data.psize) {
                    _this.setData({
                        loaded: true,
                    });
                    wx.hideToast();
                    _this.setData({
                        hideBottom: true,
                        loadMoreData: '加载完毕，已经没有更多足迹!'
                    });
                }

                if (res.data.length !== 0) {
                    scroll_time++;
                    for (let i = 0; i < res.data.length; i++) {
                        historyArr.push(res.data[i])
                    }
                    _this.setData({
                        scroll_time: scroll_time,
                        historyArr: historyArr,
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
        let historyArr = this.data.historyArr;
        let idArr=this.data.idArr;
        let indexArr=this.data.indexArr;
        let selectAllStatus = this.data.selectAllStatus;
        const selected = historyArr[index].selected;
        historyArr[index].selected = !selected;
        if(historyArr[index].selected){
            if(idArr.length==0){
                idArr.push(id)
                indexArr.push(index)
                console.log(111)
            }else{
                for(let i=0;i<idArr.length;i++){
                    if(idArr[i]!=historyArr[index].id){
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

        if (idArr.length == historyArr.length) {
            selectAllStatus = true;
        } else {
            selectAllStatus = false;
        }

        this.setData({
            historyArr: historyArr,
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
        let historyArr=this.data.historyArr;
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
                esTools.fn.setEmpty().setSession().signData(data).setMethod('delete').setExtraUrl('history').products(function (res) {
                    if (app.globalData.debug === true) {
                        console.log('history.js products delete res');
                        console.log(res);
                    }
                    if(res.statusCode==1){
                        wx.showToast({
                            title:res.data,
                            icon: 'success',
                            duration: 2000
                        })

                        let data={
                            page:1,
                            psize:_this.data.psize,
                            fields: 'id,thumb,title,marketprice'
                        }
                        esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('history').products(function (res) {
                            console.log(res.data)
                            if(res.statusCode==1){
                                let historyArr=res.data;
                                historyArr.map((item, index, input) => {
                                    item.selected = false;
                                })
                                _this.setData({
                                    historyArr:historyArr,
                                    idArr:[],
                                    indexArr:[],
                                    selectAllStatus:false
                                })
                                if(historyArr.length==0){
                                    _this.setData({
                                        historyArr:historyArr,
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
                esTools.fn.setEmpty().setSession().signData(data).setMethod('delete').setExtraUrl('history').products(function (res) {
                    if (app.globalData.debug === true) {
                        console.log('history.js products delete res');
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
                        esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('history').products(function (res) {
                            console.log(res.data)
                            if(res.statusCode==1){
                                let historyArr=res.data;
                                historyArr.map((item, index, input) => {
                                    item.selected = false;
                                })
                                _this.setData({
                                    historyArr:historyArr
                                })
                                if(historyArr.length==0){
                                    _this.setData({
                                        historyArr:historyArr,
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
            }
        }
    },
    selectAll:function(e) {
        //全选事件
        let historyArr = this.data.historyArr;
        let selectAllStatus = this.data.selectAllStatus;
        let idArr=this.data.idArr;
        let indexArr=this.data.indexArr;
        selectAllStatus = !selectAllStatus;
        if(selectAllStatus){
            for (let i = 0; i < historyArr.length; i++) {
                historyArr[i].selected = selectAllStatus;
                idArr[i]=historyArr[i].id;
                indexArr[i]=i
            }
        }else{
            for (let i = 0; i < historyArr.length; i++) {
                historyArr[i].selected = selectAllStatus;
                idArr=[];
                indexArr=[]
            }
        }
        // for (let i = 0; i < historyArr.length; i++) {
        //   historyArr[i].selected = selectAllStatus;
        //       idArr.push(historyArr[i].id)
        // }
        this.setData({
            historyArr: historyArr,
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
        esTools.fn.setEmpty().setSession().signData(data).setMethod('get').setExtraUrl('history').products(function (res) {
            if (app.globalData.debug === true) {
                console.log('facorite.js products gethistory res');
                console.log(res);
            }
            console.log(res.data)
            if(res.statusCode==1){
                let historyArr=res.data;
                historyArr.map((item, index, input) => {
                    item.selected = false;
                })
                _this.setData({
                    historyArr:historyArr
                })
                if(historyArr.length==0){
                    _this.setData({
                        historyArr:historyArr,
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