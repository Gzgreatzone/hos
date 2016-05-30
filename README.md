# 疑问:
1. index.html的模板不能独立出来?

# 以下文件借用了周翰的代码:
1. js/services/manage_index_service.js
2. template/check.html
3. css/main.css
4. index/html中的modal
5. app.js中的Fn
6. js/services/config.js

# 目前存在问题
1. 登录之后才能编辑系统设置         //解决
2. 患者信息页面编辑后按保存没有反应
3. 患者信息新增页面能编辑但是不能保存



保存，添加病者的逻辑：
   编号不可以编辑。二维码扫描添加时必须会携带编号
   
   检索编号 检索方式-安卓获取，数组化peoples，for peolpes[1][number] ==$scope.people.number;
   	 （1）存在--替换angular.copy
   	  (2) 不存在--字符串+字符串化的$scope.people;


