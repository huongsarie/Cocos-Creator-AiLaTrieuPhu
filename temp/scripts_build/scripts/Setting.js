"use strict";
cc._RFpush(module, '32759VrJYVPvLFqsJWVAtCs', 'Setting');
// scripts\Setting.js

var storage = cc.sys.localStorage;
var GameState = require('State').GameState;

var AudioCtr = require('AudioController');
var AudioController = AudioCtr.AudioController;
cc.Class({
    'extends': cc.Component,

    properties: {
        soundOn: cc.Sprite,
        soundOff: cc.Sprite,
        musicOn: cc.Sprite,
        musicOff: cc.Sprite,
        btnSound: cc.Button,
        btnMusic: cc.Button,
        soundmode: Boolean(false),
        musicmode: Boolean(false)
    },

    // use this for initialization
    onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.SHOW_ALL);
        }
        var keyboardListenner = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                if (keyCode === cc.KEY.back || keyCode === cc.KEY.backspace) {
                    cc.director.loadScene('HomeScene_Login');
                } else if (keyCode === cc.KEY.home) {
                    cc.director.end();
                }
            }
        });
        cc.eventManager.addListener(keyboardListenner, this);
        this.init();
        this.changesoundmode(this.soundmode);
        this.changemusicmode(this.musicmode);
        cc.log('>>> 1current m n s mode: ' + storage.getItem(GameState.MUSIC_MODE) + " " + storage.getItem(GameState.SOUND_MODE));
        cc.log('>>> 2current m n s mode: ' + this.getMusicMode() + " " + this.getSoundMode());
    },
    init: function init() {
        this.soundmode = this.getSoundMode();
        this.musicmode = this.getMusicMode();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    clickSoundMode: function clickSoundMode() {
        cc.log(">>>>>>>>>click sound");
        AudioController.playClickSound();

        this.soundmode = !this.soundmode;
        this.changesoundmode(this.soundmode);
        storage.setItem(GameState.SOUND_MODE, this.soundmode);
        if (this.soundmode === false) {
            AudioController.stopAll();
        }
        cc.log(">>> after: " + this.soundmode + " " + storage.getItem(GameState.SOUND_MODE));
    },
    clickMusicMode: function clickMusicMode() {
        cc.log(">>>>>>>>>click sound");
        AudioController.playClickSound();
        this.musicmode = !this.musicmode;
        this.changemusicmode(this.musicmode);
        storage.setItem(GameState.MUSIC_MODE, this.musicmode);
        if (this.musicmode === false) {
            AudioController.stopAll();
        }
    },

    clickBack: function clickBack() {
        AudioController.playClickSound();
        cc.director.loadScene('HomeScene_Login');
    },

    changesoundmode: function changesoundmode(mode) {
        if (mode === true) {
            this.soundOn.node.active = true;
            this.soundOff.node.active = false;
        } else if (mode === false) {
            this.soundOn.node.active = false;
            this.soundOff.node.active = true;
        }
    },

    changemusicmode: function changemusicmode(mode) {
        if (mode === true) {
            this.musicOn.node.active = true;
            this.musicOff.node.active = false;
        } else if (mode === false) {
            this.musicOn.node.active = false;
            this.musicOff.node.active = true;
        }
    },
    getSoundMode: function getSoundMode() {
        var mode = storage.getItem(GameState.SOUND_MODE);
        if (Boolean(mode)) {
            return mode === "true";
        } else {
            return true;
        }
    },
    getMusicMode: function getMusicMode() {
        var mode = storage.getItem(GameState.MUSIC_MODE);
        if (Boolean(mode)) {
            return mode === "true";
        } else {
            return true;
        }
    }
});

cc._RFpop();