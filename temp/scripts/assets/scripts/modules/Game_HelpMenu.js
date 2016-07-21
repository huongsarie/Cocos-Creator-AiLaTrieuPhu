"use strict";
cc._RFpush(module, '32de33BG0ZO+Kpu7WwGER3g', 'Game_HelpMenu');
// scripts\modules\Game_HelpMenu.js

var AudioCtr = require('AudioController');
var AudioController = AudioCtr.AudioController;

var GameOver = require('GameOver');
var AnswerState = require('State').AnswerState;
var HelpState = require('State').HelpState;
var Game_HelpMenu = cc.Class({
    'extends': cc.Component,

    properties: {
        btnStop: {
            'default': null,
            type: cc.Button,
            state: true,
            isGameOver: Boolean(false)
        },
        btnChange: {
            'default': null,
            type: cc.Button,
            state: true
        },
        btn5050: {
            'default': null,
            type: cc.Button,
            state: true,
            phuthuoc: cc.Enum
        },
        btnCall: {
            'default': null,
            type: cc.Button,
            state: true
        },
        btnAudience: {
            'default': null,
            type: cc.Button,
            state: true
        },
        groupBtnAns: {
            'default': null,
            type: cc.Component
        },
        press: 0,
        player_answer: cc.Enum,
        panelHelp: {
            'default': null,
            type: cc.Node
        },
        cparent: {
            'default': null,
            type: cc.Node
        },
        panelOppoAudience: {
            'default': null,
            type: cc.Node
        },
        nodeParent: {
            'default': null,
            type: cc.Node
        },
        spriteChange: cc.Sprite,
        sprite5050: cc.Sprite,
        spriteAudience: cc.Sprite,
        spriteCall: cc.Sprite,

        isClick: false,
        help_component: cc.Component,
        panelOpComp: cc.Component,
        gameComponent: cc.Component
    },
    onLoad: function onLoad() {
        this.press = 0;
        this.help_component = this.panelHelp.getComponent('PanelOppotunity');
        this.panelOpComp = this.panelOppoAudience.getComponent("UIContentAudience");
        this.player_answer = cc.Enum(0);
        // player_answer=0;
        this.btnStop.state = true;
        this.btnCall.state = true;
        this.btnChange.state = true;
        this.btnAudience.state = true;
        this.btn5050.state = true;
        this.btnStop.isGameOver = false;
        this.gameComponent = this.nodeParent.getComponent('Game');

        this.spriteChange.node.active = false;
        this.sprite5050.node.active = false;
        this.spriteAudience.node.active = false;
        this.spriteCall.node.active = false;
        this.btn5050.phuthuoc = -1;
    },
    setTrueAnswer: function setTrueAnswer(answer) {
        this.player_answer = answer;
    },

    clickButtonStop: function clickButtonStop() {
        this.clickButton(this.btnStop, HelpState.STOP);
    },
    clickButtonChange: function clickButtonChange() {
        this.clickButton(this.btnChange, HelpState.CHANGE);
    },
    clickButton5050: function clickButton5050() {
        this.clickButton(this.btn5050, HelpState.N5050);
    },
    clickButtonCall: function clickButtonCall() {
        this.clickButton(this.btnCall, HelpState.CALL);
    },
    clickButtonAudience: function clickButtonAudience() {
        this.clickButton(this.btnAudience, HelpState.AUDIENCE);
    },
    clickButton: function clickButton(button, numberButton) {
        // this.gameComponent.setIsStart(false);
        AudioController.playClickSound();
        AudioController.playHelpClick(numberButton);
        button.node.getComponent(cc.Sprite).spriteFrame = button.disabledSprite;
        // cc.log(button.node.getComponent(cc.Sprite).spriteFrame);
        switch (numberButton) {
            case HelpState.STOP:
                if (this.btnStop.state === true) {
                    // this.btnStop.isGameOver=true;
                    this.isClick = true;
                    this.gameComponent.setIsStart(false);
                    this.gameComponent.showDialog("Bạn có chắc chắn muốn dừng cuộc chơi?");
                    // this.gameover();
                }
                break;
            case HelpState.CHANGE:
                // code
                if (this.btnChange.state === true) {
                    // this.btnChange.disabledSprite=true;

                    console.log("do anything");
                    this.spriteChange.node.active = true;
                }
                break;
            case HelpState.N5050:
                if (this.btn5050.state === true) {
                    this.gameComponent.setIsStart(false);
                    var playaudio = cc.callFunc(function () {
                        AudioController.playHelpClick(HelpState.N5050);
                    }, this);
                    this.btn5050.phuthuoc = this.gameComponent.getCurrentQuestion();
                    var doit = cc.callFunc(function () {
                        this.do5050();
                        this.btn5050.state = false;
                        this.sprite5050.node.active = true;
                    }, this);
                    var delay = cc.delayTime(3.1);
                    this.node.runAction(cc.sequence(playaudio, delay, doit));
                }
                break;
            case HelpState.CALL:
                if (this.btnCall.state === true) {
                    this.isClick = true;
                    this.btnCall.state = false;
                    this.doShowPanelOppotunities(true);
                    this.spriteCall.node.active = true;
                }
                break;
            case HelpState.AUDIENCE:
                // code
                if (this.btnAudience.state === true) {
                    this.isClick = true;
                    this.btnAudience.state = false;
                    this.doShowPanelOppotunities(false);
                    this.spriteAudience.node.active = true;
                }
                break;
        }
        cc.eventManager.pauseTarget(button.node, true);
    },
    do5050: function do5050() {
        var ans1 = AnswerState.EMPTY;
        var ans2 = AnswerState.EMPTY;
        while (ans2 === this.player_answer || ans1 === this.player_answer || ans1 === ans2 || ans1 === AnswerState.EMPTY || ans2 === AnswerState.EMPTY) {
            ans2 = this.getOtherAnswer5050();
            ans1 = this.getOtherAnswer5050();
        }
        this.groupBtnAns.deactiveButton5050(ans1);
        this.groupBtnAns.deactiveButton5050(ans2);
        if (this.btnAudience.state === true) {
            this.help_component.set5050forAudience(1 + 2 + 3 + 4 - this.player_answer - ans1 - ans2);
        }
        this.gameComponent.setIsStart(true);
    },
    doShowPanelOppotunities: function doShowPanelOppotunities(isCall) {
        this.cparent.opacity = 100;
        this.panelHelp.opacity = 255;

        this.help_component.setAnswer(this.player_answer);
        if (isCall === true) {
            this.node.runAction(cc.sequence(cc.callFunc(function () {
                AudioController.playAudio("help_call.mp3", false);
                cc.delayTime(1);
            }, this), cc.callFunc(function () {
                this.help_component.clickCallPanel();
                var anim = this.panelHelp.getComponent(cc.Animation);
                anim.play('anim_help_transition_in');
            }, this)));
        } else {
            var cFunc = cc.callFunc(function () {
                if (this.gameComponent.getCurrentQuestion() === this.btn5050.phuthuoc) this.help_component.clickAudience(true);else this.help_component.clickAudience(false);

                var anim = this.panelHelp.getComponent(cc.Animation);
                anim.play('anim_help_transition_in');
            }, this);
            var delay = cc.delayTime(2);
            this.node.runAction(cc.sequence(delay, cFunc));
        }
    },
    // ,showAudienceAfter5050:function(){

    // }
    getOtherAnswer5050: function getOtherAnswer5050() {
        var ran = Math.random() * 100;
        var re = AnswerState.EMPTY;
        if (ran <= 25) {
            re = AnswerState.ANSWER_A;
        }
        if (ran > 25 && ran <= 50) {
            re = AnswerState.ANSWER_B;
        }
        if (ran > 50 && ran <= 75) {
            re = AnswerState.ANSWER_C;
        }
        if (ran > 75 && ran <= 100) {
            re = AnswerState.ANSWER_D;
        }
        return re;
    },

    isOppotunitiesClickable: function isOppotunitiesClickable() {
        return this.isClick;
    },
    setOppotunitiesClickable: function setOppotunitiesClickable(isClick) {
        this.isClick = isClick;
    },
    doDisallowClickedAllHelp: function doDisallowClickedAllHelp() {
        cc.eventManager.pauseTarget(this.btnStop.node, true);
        cc.eventManager.pauseTarget(this.btnChange.node, true);
        cc.eventManager.pauseTarget(this.btnCall.node, true);
        cc.eventManager.pauseTarget(this.btnAudience.node, true);
        cc.eventManager.pauseTarget(this.btn5050.node, true);
    },
    doAllowClickedAllHelp: function doAllowClickedAllHelp() {
        cc.eventManager.resumeTarget(this.btnStop.node);
        cc.eventManager.resumeTarget(this.btnChange.node);
        cc.eventManager.resumeTarget(this.btnCall.node);
        cc.eventManager.resumeTarget(this.btnAudience.node);
        cc.eventManager.resumeTarget(this.btn5050.node);
    }
    // ,gameover:function(){
    //     GameOver.setInit(true);
    //     cc.director.loadScene('GameOverScene');
    // }

});
module.reports = {
    Game_HelpMenu: Game_HelpMenu
};

cc._RFpop();