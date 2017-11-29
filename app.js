//app.js
App({
    onLaunch: function (options) {
        //调用API从本地缓存中获取数据
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs);
        console.log('strap.js onLoad Options');
        console.log(options);

        // 增加分享机制处理
        if(typeof options !== 'undefined' && options !== null){
            let scene = options.scene / 1;
            
            if(scene === 1036 || scene === 1007 || scene === 1008){
                console.log('running scene');
                wx.removeStorageSync('es_commission');
                wx.setStorageSync('es_commission', options.query);
            }

            if(scene === 1011 || scene === 1012 || scene === 1013 || scene === 1047 || scene === 1048 || scene === 1049){
                console.log('running scan qr');
                wx.removeStorageSync('es_commission');
                let shareUser = {'shareUser' : options.query.scene};
                wx.setStorageSync('es_commission', shareUser);
            }
        }

    },
    getUserInfo : function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb === "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                    that.globalData.userInfo = res
                    typeof cb === "function" && cb(that.globalData.userInfo)
                },
                fail : function(res){
                    console.log('app.js getUserInfo fail.');
                    // that.globalData.userInfo = res
                    typeof cb === "function" && cb(res)
                }
            })
        }
    },
    authorize : function(type, cb){
        let that = this;
        // $scopeLists = ['scope.userInfo', 'scope.address', 'scope.userLocation'];

        wx.getSetting({
            success: (res) => {
                if(res.authSetting[type] === false){

                    wx.authorize({
                        scope: type,
                        success() {
                            that.callback({statusCode : 1, data: true}, cb)
                        },
                        fail(){
                            that.callback({statusCode : 0, data: false}, cb)
                        }
                    });

                }else{
                    that.callback({statusCode : 1, data: true}, cb)
                }
            }
        })

    },
    callback : function(res, cb){
        if (typeof cb === "object" || typeof cb === "function") {
            if (typeof cb === "function") {
                cb(res);
                return true;
            }

            if (res.statusCode === 1) {
                if (typeof cb.success === "function") {
                    cb.success(res);
                }
            } else {
                if (typeof cb.fail === "function") {
                    cb.fail(res);
                }
            }

            if (typeof cb.complete === 'function') {
                cb.complete(res);
            }
        }

        return res;
    },
    getWindowInfo:function () {
        var that=this;
        wx.getSystemInfo({
            success:(res)=>{
                let height="height:"+res.windowHeight+"px";
                let height2="height:"+(res.windowHeight/2)+"px";
                that.globalData.windowHeight=height;
                that.globalData.halfHeight=height2;
            }
        })
    },
    globalData: {
        userInfo: null,
        debug : false,
        windowHeight:'',
        orderData:{
            goodsid:'',
            optionid:'',
            cartids:'',
            total:''
        },
        addressData:{},
        dispatche:{},
        addindex:'',
        dispatcheCont:'',
        qrImg:'',
        dispatcheIndex:'',
        shareData:{},  //全局分享 (2017-10-21 17:51)
        shopData:{},  //全局title (2017-10-21 17:51)
    }
})
