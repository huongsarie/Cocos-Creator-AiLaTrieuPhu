"use strict";
cc._RFpush(module, '03470yVKQ9DXKBva4tt64xD', 'ListLevelMoney');
// scripts\ui\ListLevelMoney.js

var DataLevel = require('DataLevel').datalevel;
var array = [];
var ListLevelMoney = cc.Class({
    'extends': cc.Component,

    properties: {

        scrollview: {
            'default': null,
            type: cc.ScrollView
        },
        prefabItem: {
            'default': null,
            type: cc.Prefab
        },
        current: 4
    },

    // use this for initialization
    onLoad: function onLoad() {},
    initGame: function initGame(level) {
        //level 0-> 14
        var content = this.scrollview.content;

        var newComp = array[level].getComponent('ItemLevel').setCurrent();

        var oldComp = array[level - 1].getComponent('ItemLevel').setNormal();
    },
    initFirst: function initFirst() {
        var content = this.scrollview.content;
        array = [];
        for (var i = 0; i <= 14; i++) {

            var data = DataLevel[i];
            var item = cc.instantiate(this.prefabItem);

            var component = item.getComponent('ItemLevel');
            component.init(data, 0);
            // this.prefabItem.active=true;
            content.addChild(item);
            item.active = true;
            array.push(item);
            // var demo=cc.callFunc(function(){
            //     cc.log("this is test runaction");
            // })
            // cc.log("start");
            // var se=cc.sequence(delay,demo);
            // this.node.runAction(se);
        }
        var delay = cc.delayTime(1.5);
        var firstLevel = cc.callFunc(function () {
            array[0].getComponent('ItemLevel').setCurrent();
        }, this);
        var sequence = cc.sequence(delay, firstLevel);
        this.node.runAction(sequence);
    }
});
module.exports = ListLevelMoney;

cc._RFpop();