const ReadWriteJson= require('ReadWriteJson');
const StoreData=require('StoreData');
var UserKey=require('UserInforKey').UserInforKey;
const AudioCtr= require('AudioController');
var AudioController=AudioCtr.AudioController;
var State=require('State');

var HomeScene_Login=cc.Class({
    extends: cc.Component,

    properties: {
        
        buttonSinglePlay:{
            default:null,
            type: cc.Button
        },
        buttonThachDau:{
            default:null,
            type: cc.Button
        }
        ,
        loadingPrefab:{
            default:null,
            type: cc.Prefab
        }
        ,containPrefab:{
            default:null,
            type: cc.Node
        }
        ,userPrefab:cc.Prefab
        ,bonusPrefab:cc.Prefab
        
    },

    // use this for initialization
    onLoad: function () {
        let winSize=cc.director.getWinSize();
        var designSize=cc.view.getFrameSize();
        if(cc.sys.isMobile){
            cc.view.setDesignResolutionSize(winSize.width,winSize.height,cc.ResolutionPolicy.SHOW_ALL );
        }
        cc.log("update 08-06-2016");
        var keyboardListenner=cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:  function(keyCode, event){
                    if(keyCode === cc.KEY.back || keyCode=== cc.KEY.backspace){
                        cc.log("stop game");
                        // cc.Game.onStop();
                        cc.screen.exitFullScreen();
                    }else if(keyCode === cc.KEY.home){
                        cc.log("clicking home");
                       cc.Game.pause();
                        }
                    }
                });
        cc.eventManager.addListener(keyboardListenner,this);
        this.init();
        AudioController.playBackgroundMusic(false);
    },
    init:function(){
        var username=StoreData.getData(UserKey.NAME);
        username=username===null?"Noname":username;
        var userPF=cc.instantiate(this.userPrefab);
        var userComp=userPF.getComponent('UserPrefab');
        userComp.setName(username);
        userComp.setType("Thí sinh");
        
        userPF.setPosition(-360,0);
        userPF.setContentSize(userPF.width,this.containPrefab.height);
        this.containPrefab.addChild(userPF);
        
        var money=StoreData.getData(UserKey.TOTAL);
        money=!StoreData.isNumber(money) || parseInt(money)<0?0:money;
        var bonusPF=cc.instantiate(this.bonusPrefab);
        var bonusComp=bonusPF.getComponent('BonusPrefab');
        bonusComp.setMoney(StoreData.getMillion(parseInt(money)));
        
        bonusPF.setPosition(100,0);
        this.containPrefab.addChild(bonusPF);
    },
    
    doLoadUserInformation: function(){
        ReadWriteJson.readFileJson('resources/UserInformation.json');
    },
    onClickButtonSinglePlay:function(){
        this.nextScene('LoadGameScene_Login');
    }
    ,onClickButtonThachDau:function(){
        console.log("Clicking button thachdau");
    }
    ,onClickArchivement:function(){
        this.nextScene('ArchivementScene');
    }
    
    ,onClickSetting:function(){
        this.nextScene('SettingScene');
    }
    ,nextScene:function(scene){
        cc.audioEngine.pauseAllEffects();
        AudioController.playClickSound();
        cc.director.loadScene(scene);
    }
    
    //ArchivementScene
    
    // ,initFirst:function(){
    //     var arrAr=[];
    //     var ls= cc.sys.localStorage;
    //     if(ls.getItem(State.ARCHIVEMENT_KEY)!==null){
    //         for(var i=0;i<27;i++){
    //             arrAr.push(-1);
    //         }
    //     ls.setItem(State.ARCHIVEMENT_KEY,JSON.stringify(arrAr));
    //     }
        
    // }
});

module.exports={
  HomeScene_Login:HomeScene_Login,
};
