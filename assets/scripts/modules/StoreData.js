const UserInforKey=require('UserInforKey');
var UserKey=UserInforKey.UserInforKey;
var ArchireKey=UserInforKey.ArchireKey;
var HistoryKey= UserInforKey.HistoryKey;
var storage=cc.sys.localStorage;
var UserData={
    ID:""
    ,LEVEL:""
    ,EXPERIENCE:0
    ,NAME:"noname"
    ,PLAYTIMES:50
    ,ARCHIRE:{
        COMPLETE:0
    }
    ,TOTAL:0
};
module.exports={
    UserDate:UserData,
    storeData:function(data){
        storage.setItem(UserKey.ID,data.ID);
        storage.setItem(UserKey.LEVEL,data.LEVEL);
        storage.setItem(UserKey.EXPERIENCE,data.EXPERIENCE);
        storage.setItem(UserKey.NAME,data.NAME);
        storage.setItem(UserKey.PLAYTIMES,data.PLAYTIMES);
        storage.setItem(UserKey.TOTAL,data.TOTAL);
    }
    ,saveDataByKey:function(key,data){
        storage.setItem(key,data);
    }
    ,getDataObject:function(key){
        
    }
    ,getData:function(key){
        return storage.getItem(key);
    }
    ,isNumber:function(obj){
       return /^-?[\d.]+(?:e-?\d+)?$/.test(obj);
    }
    ,getMillion:function(money){
        var result=money;
        if(money===0) return 0;
        if(money/1000000>=1){
            result=(money/1000000)+" tr";
        }
        else{
            result=(money/1000)+" ng";
        }
        return result;
    }
    ,getObject:function(key){
        
    }
    
    //archivemetn
    
    
    
};