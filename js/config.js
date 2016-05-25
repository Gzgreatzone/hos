/**
 * 默认程序设置 会被写如localStorage
 */
var SETTING = {
	version: '0.1.1',
	avatar: {
		enabled: true,
		hd: false
	},
	image: {
		enabled: true,
		hd: false
	},
	tail: '\n----------\n来自 - 粤Jobs',
	reset: false // 重大版本更新，需要重置客户端设置
};

var STATIC = {
	AVATAR: 'img/avatar.png',
	HOLDER: 'img/holder.png',
};

var ERROR = {
	WRONG_ACCESSTOKEN: 'wrong accessToken',
	HEHE_YOU_CANNOT: '呵呵，不能帮自己点赞。',
	IS_NOT_EXISTS: 'is not exists',
	TIME_OUT: 5000
};

var API_HOST = 'http://djm.randomdoor.cn/';
//以下为接口
var API = {
	API_LOGIN:API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Uni/login',
	API_GET_JOBFAIR:API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Uni/getJobfair',
	API_GET_QRCODE:API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Uni/makeQrcode',
	API_GET_QUEUE:API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Uni/getQueue',
	API_GET_QUEUERESUME: API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Uni/getQueueResume',
	API_GET_CREDIT: API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Uni/getCredit',
	API_POST_CERDIT:API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Uni/postCredit',
	API_PASS_QUEUE:API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Uni/passQueue'
	/* lfx */
	// API_GET_RESUME: API_HOST+'jobsfast/weiphp/index.php?s=/addon/Jobsfast/Jobsfast/getResume'
};
String.prototype.formatParam = function(){
	var string = this + '';
	for ( var i = 0 ; i < arguments.length ; i++ ) {
		string = string.replace(/{(:\w+)}/, arguments[i]);
	}
	return string;
};