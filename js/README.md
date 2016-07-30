# 目录文件介绍:

## datatime.js 为日期选择插件
## app.js 为js入口文件
## config.js 为废弃文件

## factories/theperson.js 为页面间传递患者信息的封装

## services/android.js 为模拟Android原生接口的文件
## services/config.js 为仪器的抽象配置文件
## services/jquery.qrcode.min.js 为生成二维码的JQ插件
## services/base64.js 为base64编码解码文件
## services/devices.js 仪器获取结果回调的注册和结果的分发
## services/login.js Oauth2鉴权接口,此处不使用
## services/setting.js 患者配置和仪器配置等配置操作文件
## services/BaseService.js 无用
## services/event.js 事件抽象(此处无用)
## services/manage_index_service.js 仪器测量逻辑
## services/storage.js 浏览器localStorage的封装

## controller/AddPersonControllers.js 
## controller/CheckSetController.js 
## controller/SettingController.js 
## controller/CheckController.js 
## controller/IndexController.js 
## controller/CheckReportController.js 
## controller/LoginController.js 



2016.6.2更新
 将安卓键值/取值全部替换为Android。setcfg或者Android.getcfg。浏览器端暂时可用


