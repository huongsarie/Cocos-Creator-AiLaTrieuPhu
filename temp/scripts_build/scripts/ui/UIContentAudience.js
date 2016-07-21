"use strict";
cc._RFpush(module, '9403forN6FEdKIxcaXavr1M', 'UIContentAudience');
// scripts\ui\UIContentAudience.js

var AnswerState = require('State').AnswerState;
var Item = {
    answer: cc.Enum,
    percent: 0
};
var UIContentAudience = cc.Class({
    "extends": cc.Component,

    properties: {
        barA: {
            "default": null,
            type: cc.Sprite
        },
        barB: {
            "default": null,
            type: cc.Sprite
        },
        barC: {
            "default": null,
            type: cc.Sprite
        },
        barD: {
            "default": null,
            type: cc.Sprite
        },
        lbPercentA: {
            "default": null,
            type: cc.Label
        },
        lbPercentB: {
            "default": null,
            type: cc.Label
        },
        lbPercentC: {
            "default": null,
            type: cc.Label
        }, lbPercentD: {
            "default": null,
            type: cc.Label
        },
        maxhei: 215,
        minhei: 0,
        trueanswer: AnswerState.EMPTY,
        space: 0,
        isStart: cc.Boolean,
        arr: [],
        is2Option: cc.Boolean,
        option1: cc.Enum,
        option2: cc.Enum
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.barA.node.height = 0;
        this.barB.node.height = 0;
        this.barC.node.height = 0;
        this.barD.node.height = 0;
        this.lbPercentA.string = "0 %";
        this.lbPercentB.string = "0 %";
        this.lbPercentC.string = "0 %";
        this.lbPercentD.string = "0 %";
        this.maxhei = 205;
        this.is2Option = false;
        this.arr = [];
        this.option1 = AnswerState.EMPTY;
        this.option2 = AnswerState.EMPTY;
    },

    init: function init(answerTrue, isOps) {
        this.node.runAction(cc.sequence(cc.delayTime(3.5), cc.callFunc(function () {
            this.isStart = true;
            this.is2Option = isOps;
            this.trueanswer = this.lucky(answerTrue);
            this.arr = this.arrRandom(this.is2Option);
        }, this)));
    },
    setTwoOptions: function setTwoOptions(ans1, ans2) {
        //ans1===true
        this.is2Option = true;
        this.option1 = ans1;
        this.option2 = ans2;
    },

    update: function update(data) {
        if (this.isStart === true) {
            var speed = this.space;
            this.effect(this.barA, this.lbPercentA, this.arr[AnswerState.ANSWER_A - 1].percent, speed);
            this.effect(this.barB, this.lbPercentB, this.arr[AnswerState.ANSWER_B - 1].percent, speed);
            this.effect(this.barC, this.lbPercentC, this.arr[AnswerState.ANSWER_C - 1].percent, speed);
            this.effect(this.barD, this.lbPercentD, this.arr[AnswerState.ANSWER_D - 1].percent, speed);
        }
    },
    effect: function effect(sprite, label, percent, speed) {
        if (percent === -1) {
            sprite.node.active = false;
            label.node.active = false;
        } else if (sprite.node.height + speed <= percent * this.space) {
            this.changWithPercent(sprite, label, speed);
        }
    },
    changWithPercent: function changWithPercent(sprite, label, speed) {
        sprite.node.setContentSize(cc.size(sprite.node.width, sprite.node.height + speed));
        label.node.position = new cc.Vec2(label.node.position.x, label.node.position.y + speed);
        label.string = Math.round(sprite.node.height / this.space) + " %";
        if (this.getBarOfTrueAnswer(this.trueanswer).node.height === this.arr[this.trueanswer - 1].percent * this.space) {
            this.isStart = false;
        }
    },

    arrRandom: function arrRandom(is2Ops) {
        var arrItem = [];
        var arrRand = [];
        var arrAnswer = [];
        if (is2Ops === true) {
            for (var ii = 0; ii < 4; ii++) {
                arrRand.push(-1);
            }
        }
        for (var j = 1; j <= 4; j++) {
            arrAnswer.push(j);
        }
        // cc.log(arrAnswer+ " __arrAnswer after pushing");
        var trueposition = AnswerState.EMPTY;
        for (var i = 0; i < 4; i++) {
            if (arrAnswer[i] === this.trueanswer) {
                trueposition = i;
                break;
            }
        }
        // cc.log(arrAnswer+ " __arrAnswer after change the first and true");
        // cc.log("init arrRand: "+arrRand);
        var max = 100;
        if (is2Ops === false) {
            for (var t = 0; t < 4; t++) {
                var ran = Math.round(Math.random() * max);
                arrRand.push(ran);
                max = max - ran;
                if (arrRand.length === 3) {
                    arrRand.push(max);
                    break;
                }
            }
        } else {
            var rand = Math.round(Math.random() * max);
            var conlai = max - rand;
            arrRand[this.option1 - 1] = rand > conlai ? rand : conlai;
            arrRand[this.option2 - 1] = max - arrRand[this.option1 - 1];
        }
        // cc.log(arrRand+ " __arrRand after push random");
        if (is2Ops === false) {
            var maxArrRand = 0;
            for (var iii = 0; iii < arrRand.length; iii++) {
                if (arrRand[iii] > arrRand[maxArrRand]) {
                    maxArrRand = iii;
                }
            }
            if (trueposition !== maxArrRand) {
                var tg = arrRand[trueposition];
                arrRand[trueposition] = arrRand[maxArrRand];
                arrRand[maxArrRand] = tg;
            }
        }

        this.space = Math.round(this.maxhei / arrRand[trueposition]);

        // cc.log(arrRand+" ____arrRand");

        for (var tt = 0; tt < 4; tt++) {
            var obj = new Object({});
            obj.answer = arrAnswer[tt];
            obj.percent = arrRand[tt];
            arrItem.push(obj);
        }
        return arrItem;
    },
    getBarOfTrueAnswer: function getBarOfTrueAnswer(number) {
        var bar = null;
        switch (number) {
            case AnswerState.ANSWER_A:
                bar = this.barA;
                break;
            case AnswerState.ANSWER_B:
                bar = this.barB;
                break;
            case AnswerState.ANSWER_C:
                bar = this.barC;
                break;
            case AnswerState.ANSWER_D:
                bar = this.barD;
                break;
        }
        return bar;
    },
    lucky: function lucky(trueANswer) {
        var other = AnswerState.EMPTY;
        var lucky = Math.round(Math.random() * 6000);
        if (lucky > 1000 && lucky < 1200) {
            while (other === AnswerState.EMPTY || other > 4) {
                other = Math.round(Math.random() * 4);
                // cc.log("other: "+other);
            }
        } else {
                return trueANswer;
            }
        return other;
    }

});

cc._RFpop();