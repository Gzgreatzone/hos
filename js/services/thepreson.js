'use strict';

angular.module('chafangbao.factories')
.factory('ThePerson',function(){
    //初始化的人的信息。
    var thePerson = {
        name:"",
        sex:"",
        beInHospital:"",
        bedNumber:"" ,
        address: "",
        age:"",
        number:"",
        height:"",
        weight:"",
        area:"",
        editDate:"",
        beginDate:"",
        endDate:""
    };
    var reportList = [];        //报告列表
    var para = [];              //报告参数
    var co2Add = [];
    var reportName = "";        //报告名
    var isReport = true;        //快速检测是不可以有报告和信息的
    var isCharge = true;        //
    return {
    	get:function(){
    	   return thePerson;    //返回人的信息
        },
        setPeople:function(vName){
        	thePerson = vName;   //设置人的信息

        },
        clear:function(){        //清除
          thePerson = {
		     name:"",
		     sex:"",
		     beInHospital:"",
		     bedNumber:"" ,
		     address: "",
		     age:"",
		     number:"",
             height:"",
             weight:"",
		     area:"",
             editDate:"",
		     beginDate:"",
		     endDate:""
        	}
        },
        setTure:function(){         //不可用
            isReport = true;
            isCharge = true;
        },
        setFalse:function(){    //可用
            
            isReport = false;
            isCharge = false;
        },
        saveCo2List : function(x){  //报告里面添加的ph等内容
            co2Add = x;
        },
        getCo2List : function(){    
            return co2Add;
        },
        setReportName:function(x){  //报告名字
            reportName = x;
        },
        returnReportName:function(){
            return reportName;
        },
        returnIsReport:function(){
            return isReport;
        },
        returnIsCharge:function(){
            return isCharge;
        },
        decline:function(obj){          //生成用于二维码生成的明文段，等待加密
            var word = "@kf580@";
            for(var i in obj){
                var word =  word  + obj[i] +"#";
            }
             console.log(word);
             return word
        },
        createNumber:function(){            //创建一个人的编号。编号必须独一无二
            var peopleSt = 安卓用键获取值("peoples");
            var ran = Math.round(10000*Math.random());
            var random = ran.toString();
            if(peopleSt.indexOf(random)!=-1){
                this.createNumber();
            }else{
                return random;
            }
        },
        qrcod:function(obj){                //用base64加密，然后生成二维码
             if (obj.number) { //假如存在，
             var baseqrcord = new Base64();
             var baseWord = baseqrcord.encode(this.decline(obj));
             $("#takephoto").qrcode({ 
                width: 300,
                height:300, 
                text: baseWord
              });
           } else {
             obj.number = this.createNumber();//生成编号
             var baseqrcord = new Base64();
             var baseWord = baseqrcord.encode(this.decline(obj));
             $("#takephoto").qrcode({ 
                width: 300,  
                height:300, 
                text: baseWord
              }); 
           }
        },
        restore:function(obj,str){          //拿到还原后的数据。还原二维码数据
            if (str.indexOf("@kf580@")!= -1) {
              var baseW = str.replace(/@kf580@/, "");
              console.log(baseW);
              var baseWord = baseW.split("#");
              console.log(baseWord);
              var j = 0;
              for(var i in obj){                //按照顺序把信息给数组
                obj[i] = baseWord[j];
                j++;
              }
              console.log(obj);
              return obj;
            } else {alert("无用二维码！");return false;}
        },
        backqrcord:function(str){   //解码
            var clearword = new Base64();
            var clearWord = clearword.decode(str);
            return clearWord;
        },
        saveReportList:function(obj){
            reportList = angular.copy(obj);
        },
        getReportList:function(){
            return reportList;
        },
        savePara:function(obj){
            para = obj;
        },
        getPara:function(){
            return para;
        }

    };
    
});