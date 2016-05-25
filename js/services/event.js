'use strict';


angular.module('chafangbao.services')

.service('kfEvent', function(kfConfig, $interval, $http){
	var 版本节点ID = '113923';
	var 配置节点ID = '113748';
	var 检测间隔 = 30 * 1000;
	var 事件树;
	var 版本;
	//版本 = localStorage.getItem('eventversion');
console.log("event")
	function 默认执行函数(全局作用域,参数){
		console.log('[执行函数]=======>' + 参数.name);
		var i;
		for(i in 参数.child)
		{
			参数.child[i].fn(全局作用域, 参数.child[i]);
		}
	}
	
	function 获取参数(设置项){
		var i;
		for(i in this.item){
			if(this.item[i].key == 设置项)
				return this.item[i].value;
		}
		return null;
	}
	
	function 设置参数(设置项, 设置值){
		var i;
		for(i in this.item){
			if(this.item[i].key == 设置项)
			{
				this.item[i].value = 设置值;
				return;
			}
		}
		this.item.push({key:设置项,value:设置值});
	}
	
	function _获取服务器配置(树ID, 回调函数){
		var tid = "id_" + 树ID;
		scp = document.getElementById(tid);
		if(scp)
			scp.parentNode.removeChild(scp);
		var str = "window.load" + 树ID + "=" + 回调函数.toString();
		eval(str);
		var scp = document.createElement("script");
		scp.id = tid;
		document.body.appendChild(scp);
		var now = new Date();
		scp.src="http://www.kf580.com/jbase/upload/tree/" + 树ID + ".js?ts=" + now.getTime();
	}
	
	function _挂载节点(父节点, 节点){
		if(节点.pid == 父节点.id){
			父节点.child.push(节点);
		}
		else{
			var i;
			for(i in 父节点.child)
				_挂载节点(父节点.child[i], 节点);
		}
	}
	
	//遍历树,将对象转化成我们想要的结构
	function _将获取的数据转换成事件树(树, 项){
		var 节点 = new Object();
		//console.log(项.value);
		var value;
		try{
			value = eval('(' + 项.value + ')');
		} catch(e) {
			value = new Object();
			value.rs = [];
			value.fn = '';
		}
		节点.id = 项.id;
		if(项.id == 配置节点ID)
			节点.pid = 0;
		else if(!项.pid)
			节点.pid = 配置节点ID;
		else
			节点.pid = 项.pid;
		节点.name = 项.name;
		节点.get = 获取参数;
		节点.set = 设置参数;
		节点.item = value.rs;
		节点.fnStr = value.fn;
		//节点.fnStr = value.fn.replace('\n','\\n');
		try{
			节点.fn = eval('(' + 节点.fnStr + ')');
		} catch(e) {
			console.log('生成执行函数失败:' + 节点.name);
			节点.fn = 默认执行函数;
		}
		节点.child = [];
		//console.log(节点);
		_挂载节点(树, 节点);
	}

	function 生成函数(节点){
		try{
			节点.fn = eval('(' + 节点.fnStr + ')');
		} catch(e) {
			//console.log('生成执行函数失败:' + 节点.name);
			节点.fn = 默认执行函数;	
		}
		节点.get = 获取参数;
		节点.set = 设置参数;
		var i;
		for(i in 节点.child){
			生成函数(节点.child[i]);
		}
	}
	
	function _将本地存储转化成事件(){
		var 字符串 = localStorage.getItem('eventtree');
		var 树;
		try{
			树 = JSON.parse(字符串);
			生成函数(树);
			console.log('我是一棵从本地拿出来的树');
			console.log(树);
		} catch(e) {
			树 = undefined;
		}
		return 树;
	}
	
	function 更新配置(){
		//检查版本
		_获取服务器配置(版本节点ID, function(verObj){
			var obj = eval('(' + verObj.T[0].value + ')');
			var i;
			for(i in obj.rs)
			{
				if(obj.rs[i].key == '版本')
				{
					//版本不一致,更新
					//if(obj.rs[i].value != 版本)
					if(obj.rs[i].value != 版本)
					{
						console.log('版本不一致,我要更新了');
						localStorage.setItem('eventversion', obj.rs[i].value);
						版本 = obj.rs[i].value;
						_获取服务器配置(配置节点ID, function (data) {
							//更新配置树
							var i;
							var 树 = {id:0, child:[]};
							//console.log(data);
							for(i in data.T)
								_将获取的数据转换成事件树(树, data.T[i]);
							console.log('我是一棵更新了的树');
							//至此树已生成
							事件树 = 树.child[0];
							console.log(事件树);
							localStorage.setItem('eventtree', JSON.stringify(事件树));
							//测试
							事件树.fn(kfConfig, 事件树);
						});
					}
				}
			}
		});
	}

	function 事件循环(){
		if(!事件树)
			事件树 = _将本地存储转化成事件();
		
		//测试
		//更新配置();
		/*
		console.log('[事件循环启动]');
		更新配置();
		if(事件树)
			事件树.fn(kfConfig.全局作用域, 事件树);
		*/
		
		更新配置();
		$interval(function(){
			console.log('[事件循环启动]');
			更新配置();
			if(事件树)
				事件树.fn(kfConfig, 事件树);
		}, 检测间隔);
		
	}

	事件循环();

	return {
		getTree: function(){
			return 事件树;
		}
	}
});


