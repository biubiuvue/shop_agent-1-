		/**
		* 配置文件
		* 存放路径为：\utils\config.js
		* config.baseUri : 接口域名
		* config.header : 默认头部
		* config.passport : 交互通讯账号、密码
		* listsUri : 交互地址池
		*/
	   let config = {
		   /**
			* 所使用域名
			*/
       		   'baseUri': 'https://ws7xcx-test.wshoto.com/',
		   /**
			* 登陆账号信息
			*/
		   'passport' : {
			 'uname': 'ws7xcx-test_2_ewei_shop',
			 'upass': 'e2017ff95c8cfd73e5253aaf2a7c6681'
		   },
		   /**
			* 登陆类型1，小程序自动登录。
			* 登陆类型2，手机号码登陆。
			* 需要修改的话，手动改一下下面的值。
			*/
		   'loginType' : 1,
		   'header' : {
			   'content-type': 'application/json'
		   },
	   };
	   let listsUri = {
		   'ApiLogin' : config.baseUri + 'login/ApiLogin',
	   };
	   let copyright={
			cotitle1:'微盛网络技术支持',
			cotitle2:'wshoto.com',
			cotitle3:'v.3.7',
			isShow:true
		}
	   // 对外提供使用。
	   module.exports.baseUri = config.baseUri;
	   module.exports.header = config.header;
	   module.exports.passport = config.passport;
	   module.exports.loginType = config.loginType;
	   module.exports.listsUri = listsUri;
	   module.exports.copyright = copyright;