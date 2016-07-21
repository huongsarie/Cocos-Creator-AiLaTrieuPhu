const AudioCtr= require('AudioController');
var AudioController=AudioCtr.AudioController;

var AnswerState= require('State').AnswerState;
var Game=require('Game').Game;
var HelpMenu=require('Game_HelpMenu');
var AnswerButtonController=cc.Class({
    extends: cc.Component,

    properties: {
        nodeParent:{
            default:null,
            type:cc.Node
        }
        ,buttonA:{
            default:null,
            type:cc.Button,
        },
        buttonB:{
            default:null,
            type: cc.Button,
        },
        buttonC:{
            default:null,
            type: cc.Button,
        },
        buttonD:{
            default:null,
            type: cc.Button,
        }
        ,labelA:{
            default:null,
            type: cc.Label
        }
        ,labelB:{
            default:null,
            type: cc.Label
        }
        ,labelC:{
            default:null,
            type: cc.Label
        }
        ,labelD:{
            default:null,
            type: cc.Label
        }
        ,helps:{
            default:null,
            type: cc.Component
        }
        ,txtA:"A: "
        ,txtB:"B: "
        ,txtC:"C: "
        ,txtD:"D: "
        ,animA:cc.Animation
        ,animB:cc.Animation
        ,animC:cc.Animation
        ,animD:cc.Animation
        ,numButtonClicked:cc.Enum
        ,game:cc.Component
    },

    // use this for initialization
    onLoad: function () {
        this.game=this.nodeParent.getComponent("Game");
    },
    init: function(){
        this.numButtonClicked=AnswerState.EMPTY;
        
        this.buttonA.node.active=true;
        this.buttonB.node.active=true;
        this.buttonC.node.active=true;
        this.buttonD.node.active=true;
        
        this.animA=this.buttonA.getComponent(cc.Animation);
        this.animB=this.buttonB.getComponent(cc.Animation);
        this.animC=this.buttonC.getComponent(cc.Animation);
        this.animD=this.buttonD.getComponent(cc.Animation);
        
        // this.setClickButton(this.animA,AnswerState.ANSWER_A);
        // this.setClickButton(this.animB,AnswerState.ANSWER_B);
        // this.setClickButton(this.animC,AnswerState.ANSWER_C);
        // this.setClickButton(this.animD,AnswerState.ANSWER_D);
    }
    ,refresh:function(){
        this.init();
        this.resetEventListener();
        this.numButtonClicked=AnswerState.EMPTY;
    }
    ,setTextForButton:function(texta,textb,textc,textd){
        this.txtAnA=this.txtA+texta;
        this.txtAnB=this.txtB+textb;
        this.txtAnC=this.txtC+textc;
        this.txtAnD=this.txtD+textd;
        
        this.labelA.string=this.txtAnA;
        this.labelB.string=this.txtAnB;
        this.labelC.string=this.txtAnC;
        this.labelD.string=this.txtAnD;
    }
    ,clickA:function(){
        this.onClick(this.buttonA,AnswerState.ANSWER_A);
    }
    ,clickB:function(){
        this.onClick(this.buttonB,AnswerState.ANSWER_B);
    }
    ,clickC:function(){
        this.onClick(this.buttonC,AnswerState.ANSWER_C);
    }
    ,clickD:function(){
        this.onClick(this.buttonD,AnswerState.ANSWER_D);
    }
    ,resetEventListener:function(){
        this.numButtonClicked=AnswerState.EMPTY;
        
        cc.eventManager.resumeTarget(this.buttonA.node);
        cc.eventManager.resumeTarget(this.buttonB.node);
        cc.eventManager.resumeTarget(this.buttonC.node);
        cc.eventManager.resumeTarget(this.buttonD.node);
        this.animA.play();
        this.animB.play();
        this.animC.play();
        this.animD.play();
    }
    ,removeEventListener:function(){
        cc.eventManager.pauseTarget(this.buttonA.node,true);
        cc.eventManager.pauseTarget(this.buttonB.node,true);
        cc.eventManager.pauseTarget(this.buttonC.node,true);
        cc.eventManager.pauseTarget(this.buttonD.node,true);
    }
    ,onClick:function(button,numberbutton){
        var playAudioFst=cc.callFunc(function(){
            AudioController.stopAll();
            AudioController.playBackgroundAfterAnswer();
            AudioController.playClickSound();
            AudioController.playAnswerChoose(numberbutton);
        },this);
        var playAudioWait=cc.callFunc(function(){
            AudioController.playAudio('ans_now1.mp3',false);
        },this);
        let delay=cc.delayTime(2.1);
        var funcFst=cc.callFunc(function(){
            this.numButtonClicked=numberbutton;
            var animButton= button.getComponent(cc.Animation);
            animButton.play('anim_nhapnhay_choose');
            this.helps.doDisallowClickedAllHelp();
            this.removeEventListener();
            this.game.stopGame();
        },this);
        var funcLst=cc.callFunc(function(){
            this.game.finish();
        },this);
        this.node.runAction(cc.sequence(playAudioFst,funcFst,delay,playAudioWait,delay,funcLst,cc.delayTime(3.4)));
  
    }
    
    ,getNumberButtonClicked: function(){
        return this.numButtonClicked; 
    }
    ,setTrueResult: function(){
        AudioController.playAnswer(this.numButtonClicked,true);
        var anim=this.getButtonAnimFromNumber(this.numButtonClicked);
        anim.stop('anim_nhapnhay_choose');
        anim.play('anim_nhapnhay_true');
        this.numButtonClicked=AnswerState.EMPTY;
    }
    ,setFalseResult: function(numberAnsTrue){
        AudioController.playAnswer(numberAnsTrue,false);
        var uibuttonTrue=this.getButtonAnimFromNumber(numberAnsTrue);
        var uibuttonFalse=this.getButtonAnimFromNumber(this.numButtonClicked);
        if(this.numButtonClicked===AnswerState.EMPTY) {
            uibuttonTrue.play('anim_nhapnhay_true');
            return;
        }else{
        uibuttonFalse.stop('anim_nhapnhay_choose');
        uibuttonFalse.play('anim_nhapnhay_false');
        // this.setFalseButton(uibuttonFalse);
        uibuttonTrue.play('anim_nhapnhay_true');
        }
    }
     ,getButtonAnimFromNumber:function(numberButton){
        var animation=cc.Animation;
        switch (numberButton) {
            case AnswerState.ANSWER_A:
                animation=this.animA;
                break;
            case AnswerState.ANSWER_B:
                animation=this.animB;
                break;
            case AnswerState.ANSWER_C:
                animation=this.animC;
                break;
            case AnswerState.ANSWER_D:
                animation=this.animD;
                break;
        }
        return animation;
    }
    ,deactiveButton5050:function(number){
        switch (number) {
            case AnswerState.ANSWER_A:
                this.buttonA.node.active=false;
                break;
            case AnswerState.ANSWER_B:
                this.buttonB.node.active=false;
                break;
            case AnswerState.ANSWER_C:
                this.buttonC.node.active=false;
                break;
            case AnswerState.ANSWER_D:
                this.buttonD.node.active=false;
                break;
        }
    }
});
module.exports={
    AnswerButtonController: AnswerButtonController
};
