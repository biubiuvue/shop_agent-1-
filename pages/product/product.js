//product.js
let app = getApp();
let util = require('../../utils/util');
let wsTools = require('../../utils/wshoto');
let esTools = require('../../utils/eshop/tools');
Page({
    data: {
        pro_list_arr: [],
        iconSize: [20, 30, 40, 50, 60, 70],
        scroll_time: 2,
        load_time: 0,
        loadding: false,
        loaded: false,
        keyword: '',
        defVal: '',
        pcate: '',
        ccate: '',
        windowHeight: '',
        myattributes: '',
        onLoaded: true,
        _num: '',
        _snum: '',
        isTrue: true,
        mySate: '',
        isShow: true,
        hasTop: false,
        isFales: false
    },
    //上拉刷新
    pullUpLoad: function (e) {
        let _this = this;
        let runprolist = () => {
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
            let pro_list_arr = _this.data.pro_list_arr;

            let products = {
                keywords: _this.data.keyword,
                page: scroll_time,
                psize: 6,
                fields: ''
            };
            esTools.fn.setEmpty().setSession().signData(products).setMethod('get')
                .setExtraUrl('search').products(function (res) {
                    if (res.statusCode === 1) {
                        if (res.data.length === 0 || res.data.length < products.psize) {
                            _this.setData({
                                loaded: true,
                            });
                            wx.hideToast();
                            _this.setData({
                                hideBottom: true,
                                loadMoreData: '加载完毕，已经没有更多商品!'
                            });
                        }

                        if (res.data.length !== 0) {
                            scroll_time++;
                            for (let i = 0; i < res.data.length; i++) {
                                pro_list_arr.push(res.data[i])
                            }
                            _this.setData({
                                scroll_time: scroll_time,
                                pro_list_arr: pro_list_arr,
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
        let runprolistcategory = () => {
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
            let pro_list_arr = _this.data.pro_list_arr;
            let mySate = _this.data.mySate;
            let products = {
                pcate: _this.data.pcate,
                ccate: _this.data.ccate,
                page: scroll_time,
                psize: 6,
                fields: '',
                sorttype: mySate
            };
            esTools.fn.setEmpty().setSession().signData(products).setMethod('get')
                .setExtraUrl('categories').products(function (res) {
                    if (res.statusCode === 1) {
                        if (res.data.length === 0 || res.data.length < products.psize) {
                            _this.setData({
                                loaded: true,
                            });
                            wx.hideToast();
                            _this.setData({
                                hideBottom: true,
                                loadMoreData: '加载完毕，已经没有更多商品!'
                            });
                        }

                        if (res.data.length !== 0) {
                            scroll_time++;
                            for (let i = 0; i < res.data.length; i++) {
                                pro_list_arr.push(res.data[i])
                            }
                            _this.setData({
                                scroll_time: scroll_time,
                                pro_list_arr: pro_list_arr,
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
        let runprolistattr = () => { //指定属性的商品
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
            let pro_list_arr = _this.data.pro_list_arr;
            let mySate = _this.data.mySate;
            let products = {
                attributes: _this.data.myattributes,
                page: scroll_time,
                psize: 6,
                sorttype: mySate
            }
            esTools.fn.setEmpty().setSession().signData(products).setMethod('get')
                .setExtraUrl('attributes').products(function (res) {
                    if (res.statusCode === 1) {
                        if (res.data.length === 0 || res.data.length < products.psize) {
                            _this.setData({
                                loaded: true,
                            });
                            wx.hideToast();
                            _this.setData({
                                hideBottom: true,
                                loadMoreData: '加载完毕，已经没有更多商品!'
                            });
                        }

                        if (res.data.length !== 0) {
                            scroll_time++;
                            for (let i = 0; i < res.data.length; i++) {
                                console.log('刷新了!');
                                console.log(res.data[i]);
                                pro_list_arr.push(res.data[i])
                            }
                            _this.setData({
                                scroll_time: scroll_time,
                                pro_list_arr: pro_list_arr,
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
                })
        }
        if (_this.data.keyword != undefined) {
            runprolist();
        } else if (_this.data.myattributes != undefined) {
            runprolistattr();
        } else {
            runprolistcategory();
        }
    },
    //本页面的搜索请求
    // searchTap: function (e) {
    //   let search_info = e.detail.value.searchBox;
    //   let _this = this;
    //   if (search_info==''){
    //     wx.showModal({
    //       title: '注意',
    //       content: '请输入您想要搜索的商品名称！',
    //     })
    //   }else{
    //     wx.showToast({
    //         title: '加载中',
    //         icon: 'loading',
    //         duration: 1000000
    //     });
    //     function runpro() {

    //       let products = {
    //         keywords: search_info,
    //         page: 1,
    //         psize: 6,
    //         fields: ''
    //       };
    //       esTools.fn.setEmpty().setSession().signData(products).setMethod('get')
    //         .setExtraUrl('search').products({
    //           success: function (res) {
    //             if (app.globalData.debug === true) {
    //               console.log('product.js products res');
    //               console.log(res);
    //             }
    //             _this.setData({
    //               pro_list_arr: res.data,
    //               defVal:'',
    //               keyword:products.keywords
    //             });
    //             wx.hideToast();
    //           },
    //           fail: function (res) {
    //             console.log(res);
    //             wx.hideToast();
    //           }             
    //         });
    //     }
    //     runpro()
    //   }
    // },
    menuClick(e) {
        let _this = this;
        let _num = e.currentTarget.dataset.num;
        let _snum1 = _this.data._snum;
        let _snum2 = _this.data._snum;
        let isTrue = _this.data.isTrue;
        let mySate = '';

        _this.setData({
            pro_list_arr: []
        })
        switch (_num) {
            case '1':
                _this.categorys('marketprice');
                break;
            case '2':
                _this.categorys('sales');
                mySate = 'sales';
                break;
            case '3':
                _this.categorys('new');
                mySate = 'new';
                break;
            case '4':
                if (isTrue) {
                    _snum1 = false;
                    _snum2 = true;
                    isTrue = false;
                    _this.categorys('price_desc');
                    mySate = 'price_desc';
                } else if (isTrue == false) {
                    _snum1 = true;
                    _snum2 = false;
                    isTrue = true;
                    _this.categorys('price_asc');
                    mySate = 'price_asc';
                } else {
                    isTrue = false
                }
                break
        }
        _this.setData({
            _num,
            _snum1,
            _snum2,
            isTrue,
            mySate,
            scroll_time: 2,
            loaded: false,
            loadding: false
        })


    },
    categorys(stp) {
        let _this = this;
        let pcate = _this.data.pcate;
        let ccate = _this.data.ccate;
        let myattributes = _this.data.myattributes;
        wx.showLoading({
            title: '加载中',
        })
        if (myattributes) {
            let products = {
                attributes: myattributes,
                page: 1,
                psize: 6,
                sorttype: stp
            }
            esTools.fn.setEmpty().setSession().signData(products).setMethod('get').products({
                success: function (res) {
                    if (app.globalData.debug === true) {
                        console.log('product.js runprolistattr res');
                        console.log(res);
                    }
                    let pro_list_arr = res.data
                    _this.setData({
                        pro_list_arr: pro_list_arr,
                        onLoaded: false
                    });
                    if (pro_list_arr.length === 0) {
                        _this.setData({
                            isFales: true
                        })
                    }
                    wx.hideLoading();
                },
                fail: function (res) {
                    console.log(res);
                }
            })
        } else {
            let signDatas = {
                pcate,
                ccate,
                page: 1,
                psize: 6,
                sorttype: stp,
                fields: ''
            };
            let that = _this;
            esTools.fn.setEmpty().setSession().signData(signDatas).setMethod('get').setExtraUrl('categories').products(function (res) {
                if (res.statusCode === 1) {
                    let pro_list_arr = res.data
                    that.setData({
                        pro_list_arr: pro_list_arr,
                        onLoaded: false
                    });
                    if (pro_list_arr.length === 0) {
                        that.setData({
                            isFales: true
                        })
                    }
                    wx.hideLoading();
                }
            })
        }
    },
    proListTap: function (event) {
        var pro_id = event.currentTarget.id;
        wx.navigateTo({ url: '/pages/pro_detail/pro_detail?id=' + pro_id })
    },
    backuptap: function () {
        wx.navigateBack(1)
    },
    onLoad: function (options) {
        let _this = this;
        _this.setData({
            keyword: options.keyword,
            pcate: options.pid,
            ccate: options.cid || '',
            myattributes: options.attributes
        })
        let runprolist = () => { //搜索
            let products = {
                keywords: options.keyword,
                page: 1,
                psize: 6,
                fields: ''
            };
            esTools.fn.setEmpty().setSession().signData(products).setMethod('get')
                .setExtraUrl('search').products({
                    success: function (res) {
                        if (app.globalData.debug === true) {
                            console.log('product.js products res');
                            console.log(res);
                        }
                        let pro_list_arr = res.data
                        _this.setData({
                            pro_list_arr: res.data,
                            onLoaded: false
                        });
                        if (pro_list_arr.length === 0) {
                            _this.setData({
                                isFales: true
                            })
                        }
                    },
                    fail: function (res) {
                        console.log(res);
                        _this.setData({
                            pro_list_arr: res.data,
                        });
                    }
                });
        }

        let runprolistcategory = () => {
            let products = {
                pcate: options.pid,
                ccate: options.cid || '',
                page: 1,
                psize: 6,
                fields: ''
            };
            console.log(products)
            esTools.fn.setEmpty().setSession().signData(products).setMethod('get')
                .setExtraUrl('categories').products({
                    success: function (res) {
                        if (app.globalData.debug === true) {
                            console.log('product.js products res');
                            console.log(res);
                        }
                        let pro_list_arr = res.data
                        _this.setData({
                            pro_list_arr: pro_list_arr,
                            onLoaded: false
                        });
                        if (pro_list_arr.length === 0) {
                            _this.setData({
                                isFales: true
                            })
                        }
                    },
                    fail: function (res) {
                        console.log(res);
                    }
                });
        }

        let runprolistattr = () => { //指定属性的商品
            let products = {
                attributes: options.attributes,
                page: 1,
                psize: 6
            }
            esTools.fn.setEmpty().setSession().signData(products).setMethod('get').setExtraUrl('attributes').products({
                success: function (res) {
                    if (app.globalData.debug === true) {
                        console.log('product.js runprolistattr res');
                        console.log(res);
                    }
                    let pro_list_arr = res.data
                    _this.setData({
                        pro_list_arr: pro_list_arr,
                        onLoaded: false
                    });
                    if (pro_list_arr.length === 0) {
                        _this.setData({
                            isFales: true
                        })
                    }
                },
                fail: function (res) {
                    console.log(res);
                }
            })
        }

        // if (options.keyword === undefined) {
        //     runprolistcategory()
        // } else {
        //     runprolist()
        // }

        if (options.keyword != undefined) {
            _this.setData({
                isShow: false,
                hasTop: true
            })
            runprolist();
        } else if (options.attributes != undefined) {
            runprolistattr();
        } else {
            runprolistcategory();
        }
        // var that = this;
        // console.log(options);
        // app.getSessionKey(function (res) {
        //     if (res.statusCode == 0) {
        //         runprolist();
        //     } else {
        //         console.error('App: getSessionSync fail.');
        //         console.error(res);
        //     }
        // });
        // function runprolist() {
        //     var keyword = options.keyword;

        //     var pid = options.pid;
        //     var cid = options.cid;

        //     if (!isNaN(keyword) || (!isNaN(parseInt(pid)) && !isNaN(parseInt(cid))) ) {
        //         var cate_url_r = {};

        //         if(!isNaN(keyword)){
        //             cate_url_r = {
        //                 url: 'params?params=pcate:' + keyword,
        //             };
        //         }else{
        //             cate_url_r = {
        //                 url: 'params?params=pcate:' + pid+',ccate:'+cid,
        //             };
        //         }

        //         util.func.getProducts(cate_url_r, function (res) {
        //             console.log(res.data.msg);
        //             console.log(res);
        //             that.setData({
        //                 pro_list_arr: res.data.msg
        //             });
        //             wx.hideToast()
        //         });
        //     } else {
        //         var x = {
        //             url: 'search/' + keyword,
        //         };
        //         util.func.getProducts(x, function (res) {
        //             console.log(res);
        //             that.setData({
        //                 pro_list_arr: res.data.msg
        //             })
        //         });
        //     }
        // }

    },
    onShow: function (options) {
        // 获取显示屏宽高
        let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                var height = "height:" + res.windowHeight + 'px;';
                _this.setData({
                    windowHeight: height,
                })
            }
        });
    }
});