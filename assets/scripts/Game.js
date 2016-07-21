const AudioCtr= require('AudioController');
var AudioController=AudioCtr.AudioController;

const LoadGame=require('LoadGame_Login');
var LoadGame_Login=LoadGame.LoadGame_Login;
var Game_HelpMenu= require('Game_HelpMenu').Game_HelpMenu;
var AnswerController=require('AnswerButtonController').AnswerButtonController;
var stringinformation="string infor";
var AnswerState= require('State').AnswerState;
const MoneyInGame=require('MoneyInGame');
const ListLevelMoney=require('ListLevelMoney');
const GameOver=require('GameOver');
const GOver=GameOver.GameOver;
// var ListLevelMoney= List.ListLevelMoney;
var  currentQuestion=0;
var Game=cc.Class({
    extends: cc.Component,

    properties: {
        moneyItem:{
            default: null,
            type: MoneyInGame
        }
        ,helpnode:{
            default:null,
            type: cc.Node,
        },
        listNode:{
            default:null,
            type: cc.Node
        }
        ,contentMainNode:{
            default:null,
            type:cc.Node
        }
        
        ,labelContentQuestion:{
            default:null,
            type: cc.Label
        }
        ,labelTitleQuestion:{
            default:null,
            type: cc.Label
        }
        ,ansController:{
            default:null,
            type:AnswerController
        }
        ,oppotunities:{
            default: null,
            type: cc.Node
        }
        ,timeBar:{
            default:null,
            type: cc.Node
        }
        ,choose: cc.Enum,
        trueAnswer:cc.Enum,
        labelTimer:cc.Label,
        time:0,
        speedTimerBar:0,
        timeOnceLevel:30, //30seconds per level
        isStart:Boolean(false) //
        ,isNext:Boolean(false)
        ,isPlay:Boolean(false)
        ,txtQuestion: "Content question"
        ,txtQuesTitle: "Câu "
        ,anim_list:cc.Animation
        ,anim_main:cc.Animation
        ,helps:cc.Component
        ,timeStart:0
        ,timePause:0
        ,timeEnd:0
        ,totalTime:0
        ,memtimer:0
        ,dialogConfirm:cc.Prefab
    },
    

    // use this for initialization
    onLoad: function () {
        let winSize=cc.director.getWinSize();
        // if(cc.sys.isMobile){
        //     cc.view.setDesignResolutionSize(winSize.width,winSize.height,cc.ResolutionPolicy.SHOW_ALL);
        //     this.timerbar.totalLength=winSize.width;
        // }
        let sizeCanvas =cc.view.getCanvasSize();
        this.isStart=false;
        // this.speedTimerBar=(this.timerbar.width/this.timeOnceLevel)/60;
        stringinformation=LoadGame.getStringJson();
        this.init();
        
    }
    
    ,nextTimeBar:function(speedTimerBar){
        
        if(speedTimerBar>0){
            this.timeBar.width=this.timeBar.width-speedTimerBar;
        }
        else{
            this.timeBar.width=this.timeBar.width-10;
        }
        if(this.timeBar.width===0){
                    this.stopGame();
                    this.finish();
                }
    }

    ,getStringJson:function(){
        return stringinformation;
    }
    
    ,init:function(){
        this.choose=AnswerState.EMPTY;
        currentQuestion=0;
        this.isStart=false;
        // this.ansController.removeEventListener();
        this.anim_list=this.listNode.getComponent(cc.Animation);
        this.anim_main=this.contentMainNode.getComponent(cc.Animation);
        this.initPre();
    }
    ,initPre: function(){
        this.helps.doAllowClickedAllHelp();
        this.labelTimer.string=this.timeOnceLevel;
        // this.timerbar.progress=1;
        this.setMoney(currentQuestion);
        this.speedTimerBar=cc.director.getWinSize().width/30/40;
        this.timeBar.width=cc.director.getWinSize().width;
        this.memtimer=this.timeBar;
        var listComponent=this.listNode.getComponent('ListLevelMoney');
        if(currentQuestion===0 && this.isStart===false){
            listComponent.initFirst();
        }else{
            listComponent.initGame(currentQuestion);
        }
        AudioController.stopAll();
        this.anim_list.play('anim_transition_list_in');
        this.anim_main.play('anim_transition_question_out');
      
    }
    ,clickListLevelMoney:function(){
        if(this.isStart===false){
            AudioController.playBackgroundMusic(true);
            AudioController.playClickSound();
            this.anim_list.play('anim_transition_list_out');
            this.anim_main.play('anim_transition_question_in');
            this.ansController.init();
            this.ansController.resetEventListener();
            GameOver.setCurrentLevel(currentQuestion);
            this.isStart=true;
            this.isPlay=true;
            this.timeStart=new Date().getTime();
            this.totalTime=0;
            if(this.isNext===false){
                this.initStartGame();
            }else{
                this.initNext();
            }
            var callBack= cc.callFunc(this.showDialog,this,"Bạn có chắc chắn muốn dừng cuộc chơi?");
            var keyboardlistener=cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:  function(keyCode, event){
                    if(keyCode === cc.KEY.back || keyCode=== cc.KEY.backspace){
                        callBack;
                    }else if(keyCode === cc.KEY.home){
                       cc.director.end();
                        }
                    }
                });
            cc.eventManager.addListener(keyboardlistener,this);
        }
       
    }
    ,setTextForAnswer:function(questionjson){
        this.txtQuestion=questionjson.question;
        this.ansController.setTextForButton(questionjson.answer_a
                                            ,questionjson.answer_b
                                            ,questionjson.answer_c
                                            ,questionjson.answer_d);
        this.trueAnswer = questionjson.answer_true;
        this.labelContentQuestion.string=this.txtQuestion;
        this.labelTitleQuestion.string=this.txtQuesTitle+ questionjson.level;
        
        this.helps.setTrueAnswer(this.trueAnswer);
    }
  
    ,initStartGame: function(){
        // this.ansController.init();
        this.isStart=true;
        this.isNext=false;
        //load data to this nodes
        var jsoncontent=JSON.parse(stringinformation);
        var questionjson=jsoncontent.questionkits[currentQuestion];
        this.setTextForAnswer(questionjson);
        
    }
    ,initNext:function(){
        this.isNext=false;
        this.ansController.refresh();
        var jsoncontent=JSON.parse(stringinformation);
        var questionjson=jsoncontent.questionkits[currentQuestion];
        this.setTextForAnswer(questionjson);
        this.isStart=true;
    }
    
    ,update:function(dt){
        
        if(this.isStart===true){
            if(this.isPlay===true){
                let now =new Date().getTime();
                let timer=this.timeOnceLevel-this.totalTime-((now-this.timeStart)/1000);
                this.labelTimer.string=Math.round(timer)<=0?0:Math.round(timer);
                if((timer*this.speedTimerBar*40-this.speedTimerBar)===this.memtimer){
                    this.timeBar.width=this.timeBar.width-this.speedTimerBar;
                }else{
                    this.timeBar.width=timer*this.speedTimerBar*40-this.speedTimerBar;
                    this.memtimer=this.timeBar.width;
                }
                if( this.timeBar.width<=0 || (this.totalTime+Math.floor((now-this.timeStart)/1000)>=this.timeOnceLevel) || this.labelTimer.string==='0'){
                    AudioController.stopAll();
                    AudioController.playMusic('out_of_time.mp3',false);
                    this.stopGame();
                    this.showConfirm("Thông báo","Đồng ý", "Hết giờ");
                }
            }
        }
    }
    ,finish:function(){
        this.checkResult(this.ansController.getNumberButtonClicked(), this.trueAnswer);
    }
    ,stopGame(){
        this.isStart=false;
        this.isPlay=false;
    }

    ,checkResult:function(numButtonChoose,numButtonTrue){
        this.ansController.removeEventListener();
        let delay=cc.delayTime(3);
        if(numButtonChoose===numButtonTrue){
            let funcTrueRe=cc.callFunc(function(){
                this.ansController.setTrueResult(currentQuestion);
            },this);
            let afterT=cc.callFunc(function(){
                
                currentQuestion+=1;
                if(currentQuestion <15){
                    this.isNext=true;
                    this.initPre();
                }
                else{
                    this.stopGame();
                }
                
            },this);
            // let sequenceT=cc.sequence(funcTrueRe,delay,afterT);
            this.node.runAction(cc.sequence(funcTrueRe,delay,afterT));
        }else{
            let funcFalseRe=cc.callFunc(function(){
                this.ansController.setFalseResult(numButtonTrue);
            },this);
            let afterF=cc.callFunc(function(){
                this.gameOver(false);
            },this);
            let sequenceF=cc.sequence(funcFalseRe,delay,afterF);
            this.node.runAction(sequenceF);
            
            //gameover
        }
    }
    ,setMoney:function(numberquestion){
        this.moneyItem.setLabelMoney(currentQuestion-1);
    }
    ,restart:function(){
        this.node.stopAllActions();
        cc.director.loadScene('GameScene');
    }
    ,getCurrentQuestion:function(){
        return currentQuestion;
    }
    ,gameOver:function(isStopHelp){
        GameOver.setInit(isStopHelp);
        this.node.stopAllActions();
        cc.director.loadScene('GameOverScene');
    }
    ,disableMainContent:function(){
        this.ansController.removeEventListener();
        this.helps.doDisallowClickedAllHelp();
    }
    ,enableMainContent:function(){
        this.ansController.resetEventListener();
        this.helps.doAllowClickedAllHelp();
    }
    ,setIsStart:function(isSt){
        this.isPlay=isSt;
        if(this.isStart===true){
            if(isSt===false){
                this.timeEnd=new Date().getTime();  
                this.totalTime=this.totalTime+Math.floor((this.timeEnd-this.timeStart)/1000);
                // cc.log(Math.floor((this.timeEnd-this.timeStart)/1000) +" "+this.totalTime);  
            }
            if(isSt===true){
                this.timeStart=new Date().getTime();
                
            }
    }
    }
    ,showDialog:function(contentDialog){
        this.disableMainContent();
        var dialog=cc.instantiate(this.dialogConfirm);
        dialog.setPosition=(cc.p(1080,640));
        dialog.active=true;
        this.node.addChild(dialog);
        var comp=dialog.getComponent('ConfirmDialogPrefab');
        comp.init(contentDialog,this.node.getComponent('Game'));
        // this.node.addChild(dialog);
        this.isPlay=false;
    }
    
    ,onClickOKDialog:function(){
        AudioController.stopAll();
        AudioController.playAudio('lose.mp3',false);
        if(this.isStart===true){
            this.gameOver(true);
        }else
            if(this.isStart===false){
                this.stopGame();
                this.gameOver(false);
            }
    }
    ,onClickCancelDialog:function(){
        if(this.isPlay===false){
            this.enableMainContent();
            this.isPlay=true;
            cc.log("click cancel");
        }
    }
    ,showConfirm:function(title,nameBtnConfirm,content){
        this.disableMainContent();
        var dialog=cc.instantiate(this.dialogConfirm);
        dialog.setPosition=(cc.p(1080,640));
        dialog.active=true;
        this.node.addChild(dialog);
        var comp=dialog.getComponent('ConfirmDialogPrefab');
        comp.initConfirm(title,nameBtnConfirm,content,this.node.getComponent('Game'));
        // this.node.addChild(dialog);
        this.isPlay=false;
    }
});
module.exports={
    Game:Game
    ,getLastLevel:function(){
        return currentQuestion;
    }
}