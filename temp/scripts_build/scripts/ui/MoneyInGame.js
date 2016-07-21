"use strict";
cc._RFpush(module, '4f81fUFaRJPhqR/B1tYxoYw', 'MoneyInGame');
// scripts\ui\MoneyInGame.js

var DataLevel = require('DataLevel').datalevel;
var MoneyInGame = cc.Class({
    'extends': cc.Component,

    properties: {
        labelMoney: {
            'default': null,
            type: cc.Label
        },
        begin: 0,
        money: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},
    setLabelMoney: function setLabelMoney(numberquestion) {
        //0 -> 14
        if (numberquestion < 0) {
            this.setTextLabel(this.begin);
            this.money = 0;
        } else {
            var data = DataLevel[numberquestion];
            this.money = data.money;
            this.setTextLabel(data.name);
        }
    },
    setTextLabel: function setTextLabel(textmoney) {
        this.labelMoney.string = textmoney;
    },
    getMoney: function getMoney() {
        return this.money;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
module.exports = MoneyInGame;

cc._RFpop();