const AnswerSt= require('State');
const GameHelp= require('Game_HelpMenu');
var AudioController=require('AudioController');
var AnswerState=AnswerSt.AnswerState;
cc.Class({
    extends: cc.Component,

    properties: {
        game:{
            default: null,
            type: GameHelp
        },
        nodeParent:{
            default: null,
            type: cc.Node
        }
        
        ,nodeHelps:{
            default:null,
            type:cc.Node
        }
        ,nodeCall:{
            default: null,
            type: cc.Node
        }
        ,nodeAnswerCall:{
            default:null,
            type: cc.Node
        }
        ,nodeAudience:{
            default: null,
            type: cc.Node
        }
        ,buttonTeacher:{
            default: null,
            type: cc.Button
        }
        ,buttonDoctor:{
            default: null,
            type: cc.Button
        }
        ,buttonEngineer:{
            default: null,
            type: cc.Button
        }
        ,buttonReporter:{
            default: null,
            type: cc.Button
        }
        ,iconAnswer:{
            default:null,
            type: cc.Sprite
        }
        ,labelNameCall:{
            default:null,
            type: cc.Label
        }
        ,labelAnswerCall:{
            default:null,
            type: cc.Label
        }
        ,buttonCloseAnswerCall:{
            default: null,
            type: cc.Button
        }
        ,answer:cc.Enum
        ,gameComponent:cc.Component
        ,other5050:cc.Enum
    },

    // use this for initialization
    onLoad: function () {
        this.gameComponent=this.nodeParent.getComponent('Game');
        this.other5050=AnswerState.EMPTY;
    },
    setAnswer:function(trueanswer){
        this.answer=trueanswer;
    }
    ,clickAudience:function(is2op){
        this.gameComponent.setIsStart(false);
        this.nodeCall.active=false;
        this.nodeAnswerCall.active= false;
        this.nodeAudience.active=true;
        // var allowClicked= this.nodeHelps.getComponent('Game_HelpMenu');
        // allowClicked.doDisallowClickedAllHelp();
        this.gameComponent.disableMainContent();
        var AudComponent=this.nodeAudience.getComponent('UIContentAudience');
        if(is2op===true){
            AudComponent.setTwoOptions(this.answer,this.other5050);
        }
        AudComponent.init(this.answer,is2op);
    }
    ,set5050forAudience:function(option2){
        this.other5050=option2;
    }
    
    ,clickCallPanel: function(){
        this.gameComponent.setIsStart(false);
        // this.nodeAudience.node.active=false;
        this.nodeCall.active=true;
        this.nodeAnswerCall.active= false;
        this.nodeAudience.active=false;
        
        this.gameComponent.disableMainContent();
        // var allowClicked= this.nodeHelps.getComponent('Game_HelpMenu');
        // allowClicked.doDisallowClickedAllHelp();
    }
    ,showAnswerCall:function(num){
        var url=null;
        var texture=null;
        // varAudioController.playAudio('help_callb');
        this.nodeAnswerCall.active=true;
        this.nodeCall.active=false;
        switch (num) {
            case 1:
                this.labelNameCall.string="Bác sĩ";
                url= cc.url.raw('resources/textures/oppotunities/atp__activity_player_layout_help_call_01.png');
                texture= cc.textureCache.addImage(url);
                this.iconAnswer.spriteFrame.setTexture(texture);
                break;
            case 2:
                this.labelNameCall.string="Giáo viên";
                url= cc.url.raw('resources/textures/oppotunities/atp__activity_player_layout_help_call_02.png');
                texture= cc.textureCache.addImage(url);
                this.iconAnswer.spriteFrame.setTexture(texture);
                break;
            case 3:
                this.labelNameCall.string="Kỹ sư";
                url= cc.url.raw('resources/textures/oppotunities/atp__activity_player_layout_help_call_03.png');
                texture= cc.textureCache.addImage(url);
                this.iconAnswer.spriteFrame.setTexture(texture);
                break;
            case 4:
                this.labelNameCall.string="Phóng viên";
                url= cc.url.raw('resources/textures/oppotunities/atp__activity_player_layout_help_call_04.png');
                texture= cc.textureCache.addImage(url);
                this.iconAnswer.spriteFrame.setTexture(texture);
                break;            
        }
        this.labelAnswerCall.string="Theo tôi đáp án đúng là "+AnswerSt.getNameAnswer(this.answer);
        // this.node.runAction(cc.sequence(cc.delayTime(1),function(){
            
        // },this));
    }
    ,clickDoctor:function(){
        // setTimeout(this.showAnswerCall(1), 1000);
        this.showAnswerCall(1);
    }
    ,clickTeacher:function(){
        this.showAnswerCall(2);
    }
    ,clickEngineer:function(){
        this.showAnswerCall(3);
    }
    ,clickReporter:function(){
        this.showAnswerCall(4);
    }
    ,clickButtonClose:function(){
        this.game.setOppotunitiesClickable(false);
        this.nodeParent.opacity=255;
        var anim= this.node.getComponent(cc.Animation);
        anim.play('anim_help_transition_out');
        // var allowClicked= this.nodeHelps.getComponent('Game_HelpMenu');
        // allowClicked.doAllowClickedAllHelp();
        
        this.gameComponent.enableMainContent();
        this.gameComponent.setIsStart(true);
    }
    
});
