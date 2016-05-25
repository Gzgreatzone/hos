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
        returnIsReport:function(){
            return isReport;
        },
        returnIsCharge:function(){
            return isCharge;
        }
    };
    
});