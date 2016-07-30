'use strict';

angular.module('chafangbao.factories')
.factory('ThePerson',function(){
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
        beginDate:"",
        endDate:""
    };
    var reportList = [];
    var para = [];
    var co2Add = [];
    var reportName = "";
    var isReport = true;
    var isCharge = true;
    return {
    	get:function(){
    	   return thePerson;
        },
        setPeople:function(vName){
        	thePerson = vName;


        },
        clear:function(){
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
		     beginDate:"",
		     endDate:""
        	}
        },
        setTure:function(){
            isReport = true;
            isCharge = true;
        },
        setFalse:function(){
            
            isReport = false;
            isCharge = false;
        },
        saveCo2List : function(x){
            co2Add = x;
        },
        getCo2List : function(){
            return co2Add;
        },
        setReportName:function(x){
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
        decline:function(obj){
            var word = "@kf580@";
            for(var i in obj){
                var word =  word  + obj[i] +"#";
            }
             console.log(word);
             return word
        },
        createNumber:function(){
            var peopleSt = 安卓用键获取值("peoples");
            var ran = Math.round(10000*Math.random());
            var random = ran.toString();
            if(peopleSt.indexOf(random)!=-1){
                this.createNumber();
            }else{
                return random;
            }
        },
        qrcod:function(obj){
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
        restore:function(obj,str){
            if (str.indexOf("@kf580@")!= -1) {
              var baseW = str.replace(/@kf580@/, "");
              console.log(baseW);
              var baseWord = baseW.split("#");
              console.log(baseWord);
              var j = 0;
              for(var i in obj){
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