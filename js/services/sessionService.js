angular.module('chafangbao.services',[])
.service('SessionService', ['$rootScope', function ($rootScope, $timeout) {
	//会话的定时器	
	var timer;
	var validTime = 3600;
	
	function timeoutCallback(){
		$rootScope.islogin = false;
		location.reload();
	}
	
	return {
		//重置会话时间
		reset: function(){
			if(!timer)
				return;
			$timeout.cancel(timer);
			timer = null;
			timer = $timeout(function() {
				timeoutCallback();
			}, validTime * 1000);
		},
		//设置会话时间
		set: function(validtime){
			validTime = validtime;
			if(timer)
			{
				$timeout.cancel(timer);
				timer = null;
			}
			timer = $timeout(function() {
				timeoutCallback();
			}, validTime * 1000);
		},
		//查询是否会话失效
		query: function(){
			if(!$rootScope.islogin)
				location.reload();
		}
	}
}
