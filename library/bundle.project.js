require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AnswerButtonController":[function(require,module,exports){
"use strict";
cc._RFpush(module, '905839YrH9PwKrn65192MSg', 'AnswerButtonController');
// scripts\ui\AnswerButtonController.js

var AudioCtr = require('AudioController');
var AudioController = AudioCtr.AudioController;

var AnswerState = require('State').AnswerState;
var Game = require('Game').Game;
var HelpMenu = require('Game_HelpMenu');
var AnswerButtonController = cc.Class({
    'extends': cc.Component,

    properties: {
        nodeParent: {
            'default': null,
            type: cc.Node
        },
        buttonA: {
            'default': null,
            type: cc.Button
        },
        buttonB: {
            'default': null,
            type: cc.Button
        },
        buttonC: {
            'default': null,
            type: cc.Button
        },
        buttonD: {
            'default': null,
            type: cc.Button
        },
        labelA: {
            'default': null,
            type: cc.Label
        },
        labelB: {
            'default': null,
            type: cc.Label
        },
        labelC: {
            'default': null,
            type: cc.Label
        },
        labelD: {
            'default': null,
            type: cc.Label
        },
        helps: {
            'default': null,
            type: cc.Component
        },
        txtA: "A: ",
        txtB: "B: ",
        txtC: "C: ",
        txtD: "D: ",
        animA: cc.Animation,
        animB: cc.Animation,
        animC: cc.Animation,
        animD: cc.Animation,
        numButtonClicked: cc.Enum,
        game: cc.Component
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.game = this.nodeParent.getComponent("Game");
    },
    init: function init() {
        this.numButtonClicked = AnswerState.EMPTY;

        this.buttonA.node.active = true;
        this.buttonB.node.active = true;
        this.buttonC.node.active = true;
        this.buttonD.node.active = true;

        this.animA = this.buttonA.getComponent(cc.Animation);
        this.animB = this.buttonB.getComponent(cc.Animation);
        this.animC = this.buttonC.getComponent(cc.Animation);
        this.animD = this.buttonD.getComponent(cc.Animation);

        // this.setClickButton(this.animA,AnswerState.ANSWER_A);
        // this.setClickButton(this.animB,AnswerState.ANSWER_B);
        // this.setClickButton(this.animC,AnswerState.ANSWER_C);
        // this.setClickButton(this.animD,AnswerState.ANSWER_D);
    },
    refresh: function refresh() {
        this.init();
        this.resetEventListener();
        this.numButtonClicked = AnswerState.EMPTY;
    },
    setTextForButton: function setTextForButton(texta, textb, textc, textd) {
        this.txtAnA = this.txtA + texta;
        this.txtAnB = this.txtB + textb;
        this.txtAnC = this.txtC + textc;
        this.txtAnD = this.txtD + textd;

        this.labelA.string = this.txtAnA;
        this.labelB.string = this.txtAnB;
        this.labelC.string = this.txtAnC;
        this.labelD.string = this.txtAnD;
    },
    clickA: function clickA() {
        this.onClick(this.buttonA, AnswerState.ANSWER_A);
    },
    clickB: function clickB() {
        this.onClick(this.buttonB, AnswerState.ANSWER_B);
    },
    clickC: function clickC() {
        this.onClick(this.buttonC, AnswerState.ANSWER_C);
    },
    clickD: function clickD() {
        this.onClick(this.buttonD, AnswerState.ANSWER_D);
    },
    resetEventListener: function resetEventListener() {
        this.numButtonClicked = AnswerState.EMPTY;

        cc.eventManager.resumeTarget(this.buttonA.node);
        cc.eventManager.resumeTarget(this.buttonB.node);
        cc.eventManager.resumeTarget(this.buttonC.node);
        cc.eventManager.resumeTarget(this.buttonD.node);
        this.animA.play();
        this.animB.play();
        this.animC.play();
        this.animD.play();
    },
    removeEventListener: function removeEventListener() {
        cc.eventManager.pauseTarget(this.buttonA.node, true);
        cc.eventManager.pauseTarget(this.buttonB.node, true);
        cc.eventManager.pauseTarget(this.buttonC.node, true);
        cc.eventManager.pauseTarget(this.buttonD.node, true);
    },
    onClick: function onClick(button, numberbutton) {
        var playAudioFst = cc.callFunc(function () {
            AudioController.stopAll();
            AudioController.playBackgroundAfterAnswer();
            AudioController.playClickSound();
            AudioController.playAnswerChoose(numberbutton);
        }, this);
        var playAudioWait = cc.callFunc(function () {
            AudioController.playAudio('ans_now1.mp3', false);
        }, this);
        var delay = cc.delayTime(2.1);
        var funcFst = cc.callFunc(function () {
            this.numButtonClicked = numberbutton;
            var animButton = button.getComponent(cc.Animation);
            animButton.play('anim_nhapnhay_choose');
            this.helps.doDisallowClickedAllHelp();
            this.removeEventListener();
            this.game.stopGame();
        }, this);
        var funcLst = cc.callFunc(function () {
            this.game.finish();
        }, this);
        this.node.runAction(cc.sequence(playAudioFst, funcFst, delay, playAudioWait, delay, funcLst, cc.delayTime(3.4)));
    },

    getNumberButtonClicked: function getNumberButtonClicked() {
        return this.numButtonClicked;
    },
    setTrueResult: function setTrueResult() {
        AudioController.playAnswer(this.numButtonClicked, true);
        var anim = this.getButtonAnimFromNumber(this.numButtonClicked);
        anim.stop('anim_nhapnhay_choose');
        anim.play('anim_nhapnhay_true');
        this.numButtonClicked = AnswerState.EMPTY;
    },
    setFalseResult: function setFalseResult(numberAnsTrue) {
        AudioController.playAnswer(numberAnsTrue, false);
        var uibuttonTrue = this.getButtonAnimFromNumber(numberAnsTrue);
        var uibuttonFalse = this.getButtonAnimFromNumber(this.numButtonClicked);
        if (this.numButtonClicked === AnswerState.EMPTY) {
            uibuttonTrue.play('anim_nhapnhay_true');
            return;
        } else {
            uibuttonFalse.stop('anim_nhapnhay_choose');
            uibuttonFalse.play('anim_nhapnhay_false');
            // this.setFalseButton(uibuttonFalse);
            uibuttonTrue.play('anim_nhapnhay_true');
        }
    },
    getButtonAnimFromNumber: function getButtonAnimFromNumber(numberButton) {
        var animation = cc.Animation;
        switch (numberButton) {
            case AnswerState.ANSWER_A:
                animation = this.animA;
                break;
            case AnswerState.ANSWER_B:
                animation = this.animB;
                break;
            case AnswerState.ANSWER_C:
                animation = this.animC;
                break;
            case AnswerState.ANSWER_D:
                animation = this.animD;
                break;
        }
        return animation;
    },
    deactiveButton5050: function deactiveButton5050(number) {
        switch (number) {
            case AnswerState.ANSWER_A:
                this.buttonA.node.active = false;
                break;
            case AnswerState.ANSWER_B:
                this.buttonB.node.active = false;
                break;
            case AnswerState.ANSWER_C:
                this.buttonC.node.active = false;
                break;
            case AnswerState.ANSWER_D:
                this.buttonD.node.active = false;
                break;
        }
    }
});
module.exports = {
    AnswerButtonController: AnswerButtonController
};

cc._RFpop();
},{"AudioController":"AudioController","Game":"Game","Game_HelpMenu":"Game_HelpMenu","State":"State"}],"ArchivementPrefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, '62690iuyTFFwrdnczzupR7l', 'ArchivementPrefab');
// scripts\ui\ArchivementPrefab.js

var ArchivementName = [{ name: 'bai khong nan',
    des: 'Nhà hiền triết'
}, { name: 'Bạn là triệu phú', des: "Trả lời đúng hết 15 câu hỏi. Bạn chính là Triệu Phú mà chúng tôi tìm kiếm lâu nay."
}, { name: 'bat kha chien bai', des: 'Nhà hiền triết'
}, { name: 'Bắt nhịp chiến thắng', des: "Cần 5 chiến thắng để mở danh hiệu này. Tập trung và bạn sẽ làm được."
}, { name: 'Bứt tốc vượt lên', des: "Vượt qua mốc 10 câu hỏi của chương trình. Bạn bắt nhịp rất nhanh."
}, { name: 'Chạm tay chiến thắng', des: "Dừng bước khi chỉ còn cách chiến thắng 1 câu thật không vui vẻ gì nhưng đây là cách duy nhất để nhận danh hiệu này."
}, { name: 'Chiến thắng mở hàng', des: "Lần đầu tiên luôn thú vị, nhất là khi chiến thắng. Danh hiệu này để ghi nhận chiến thắng đầu tiên của bạn."
}, { name: 'dai kien tuong', des: 'Nhà hiền triết'
}, { name: 'doc co cau bai', des: 'Nhà hiền triết'
}, { name: 'everest', des: 'Nhà hiền triết'
}, { name: 'fansipan', des: 'Nhà hiền triết'
}, { name: 'hat trick', des: 'Nhà hiền triết'
}, { name: 'huyen thoai', des: 'Nhà hiền triết'
}, { name: 'keo ngot', des: 'Nhà hiền triết'
}, { name: 'Khởi đầu mạnh mẽ', des: "Vượt qua mốc 5 câu hỏi của chương trình. Nghe vậy chứ không dễ đâu."
}, { name: 'khoi dong thanh cong', des: 'Nhà hiền triết'
}, { name: 'kho bau kien thuc', des: 'Nhà hiền triết'
}, { name: 'kien tuong', des: 'Nhà hiền triết'
}, { name: 'ky phung dich thu', des: 'Nhà hiền triết'
}, { name: 'Nhà hiền triết', des: "Người có học vấn, có hiểu biết sâu rộng, được người đời tôn sùng."
}, { name: 'olympus', des: 'Nhà hiền triết'
}, { name: 'Thần rùa', des: "Rùa khởi đầu chậm nhưng quan trọng là vẫn giành được chiến thắng với 1 câu trả lời đúng."
}, { name: 'than toc tao bao', des: 'Nhà hiền triết'
}, { name: 'thap toan thap my', des: 'Nhà hiền triết'
}, { name: 'tho san chien thang', des: 'Nhà hiền triết'
}, { name: 'vua cam hoa', des: 'Nhà hiền triết'
}, { name: 'Yêu hòa bình', des: "Hòa 20 trận thách đấu. Bạn có thể mang lại hòa bình cho thế giới."
}];
var State = require('State');
var ArchivementKey = ['BAIKHONGNAN', 'BANLATRIEUPHU', 'BATKHACHIENBAI', 'BATNHIPCHIENTHANG', 'BUCTOCVUOTLEN', 'CHAMTAYCHIENTHANG', 'CHIENTHANGMOHANG', 'DAIKIENTUONG', 'DOCCOCAUBAI', 'EVEREST', 'FANSIPAN', 'HATTRICK', 'HUYENTHOAI', 'ITEMDEFAULT', 'KEONGOT', 'KHOIDAUMANHME', 'KHOIDONGTHANHCONG', 'KHOBAUKIENTHUC', 'KIENTUONG', 'KYPHUNGDICHTHU', 'NHAHIENTRIET', 'OLYMPUS', 'THANRUA', 'THANTOCTAOBAO', 'THAPTOANTHAPMY', 'THOSANCHIENTHANG', 'VUACAMHOA', 'YEUHOABINH'];
var ArchivementNumber = cc.Enum({
    BAIKHONGNAN: 0,
    BANLATRIEUPHU: 1,
    BATKHACHIENBAI: 2,
    BATNHIPCHIENTHANG: 3,
    BUCTOCVUOTLEN: 4,
    CHAMTAYCHIENTHANG: 5,
    CHIENTHANGMOHANG: 6,
    DAIKIENTUONG: 7,
    DOCCOCAUBAI: 8,
    EVEREST: 9,
    FANSIPAN: 10,
    HATTRICK: 11,
    HUYENTHOAI: 12,
    KEONGOT: 13,
    KHOIDAUMANHME: 14,
    KHOIDONGTHANHCONG: 15,
    KHOBAUKIENTHUC: 16,
    KIENTUONG: 17,
    KYPHUNGDICHTHU: 18,
    NHAHIENTRIET: 19,
    OLYMPUS: 20,
    THANRUA: 21,
    THANTOCTAOBAO: 22,
    THAPTOANTHAPMY: 23,
    THOSANCHIENTHANG: 24,
    VUACAMHOA: 25,
    YEUHOABINH: 26,
    DEFAULT: 27
});
//resources/textures/archivement/
var ArchivementPath = ['atp__achievement_bai_khong_nan.png', 'atp__achievement_ban_la_trieu_phu.png', 'atp__achievement_bat_kha_chien_bai.png', 'atp__achievement_bat_nhip_chien_thang.png', 'atp__achievement_buc_toc_vuot_len.png', 'atp__achievement_cham_tay_chien_thang.png', 'atp__achievement_chien_thang_mo_hang.png', 'atp__achievement_dai_kien_tuong.png', 'atp__achievement_doc_co_cau_bai.png', 'atp__achievement_everest.png', 'atp__achievement_fansipan.png', 'atp__achievement_hat_trick.png', 'atp__achievement_huyen_thoai.png', 'atp__achievement_keo_ngot.png', 'atp__achievement_khoi_dau_manh_me.png', 'atp__achievement_khoi_dong_thanh_cong.png', 'atp__achievement_kho_bau_kien_thuc.png', 'atp__achievement_kien_tuong.png', 'atp__achievement_ky_phung_dich_thu.png', 'atp__achievement_nha_hien_triet.png', 'atp__achievement_olympus.png', 'atp__achievement_than_rua.png', 'atp__achievement_than_toc_tao_bao.png', 'atp__achievement_thap_toan_thap_my.png', 'atp__achievement_tho_san_chien_thang.png', 'atp__achievement_vua_cam_hoa.png', 'atp__achievement_yeu_hoa_binh.png', 'atp__achievement_item_default.png'];

var ArchivementMax = {
    BAIKHONGNAN: 10, //thua 10lần <mốc 5
    BANLATRIEUPHU: 1, // đạt đc triệu phú
    BATKHACHIENBAI: 10, //10 lần liên tiếp trả lời đc >= mốc 10
    BATNHIPCHIENTHANG: 10, // 10 lần trả lời >=mốc 10 (k cần liên tiếp)
    BUCTOCVUOTLEN: true, // câu hỏi min , nếu đạt khoảng cách 5 câu hỏi ngay sau lần chơi min
    CHAMTAYCHIENTHANG: true, // thua hoặc dừng lại ở câu hỏi số 15 (k trả lừi đc)
    CHIENTHANGMOHANG: true, // vượt qua mốc 10 lần đầu tiên
    DAIKIENTUONG: 5, //5 lần là triệu phú
    DOCCOCAUBAI: 10, // 10 lần triệu phú
    EVEREST: 15, // câu hỏi cao nhất từng trả lời đc, từ 1->15
    FANSIPAN: 8, // câu hỏi cao nhât từng đạt được, 1->8
    HATTRICK: 3, //3 lần liên tiếp đạt mốc >=10
    HUYENTHOAI: 50, //50 lần đạt mốc >=12
    KEONGOT: 20, // 20 lần kết thúc ở mốc >=5 và mốc <10
    KHOIDAUMANHME: true, // lần đầu đạt đến mốc >=5
    KHOIDONGTHANHCONG: true, //lần đầu đạt đến mốc >=10
    KHOBAUKIENTHUC: 15, //15 lần đạt >=8
    KIENTUONG: 20, //20 lần đạt mốc >=10
    KYPHUNGDICHTHU: 10, //thách đấu: hòa hoặc thắng 20
    NHAHIENTRIET: 30, // 30 lần đạt mốc >=10
    OLYMPUS: 10, //câu hỏi cao nhât từng đạt được, 1->10
    THANRUA: 20, // 20 lần thua <mốc 5
    THANTOCTAOBAO: 20, // 20 lần trả lời >=mốc 5 và <=mốc 10
    THAPTOANTHAPMY: 10, // 10 lần k trả lời đc hoặc dừng lại ở câu hỏi số 11
    THOSANCHIENTHANG: 30, // 30 lần >= mốc 10
    VUACAMHOA: 10, // thách đấu: hòa 10 lần
    YEUHOABINH: 20 // thách đấu, hòa 20 lần
};
var ls = cc.sys.localStorage;
var P_PATH = 'resources/textures/archivement/';
var ArchivementPrefab = cc.Class({
    'extends': cc.Component,

    properties: {
        archiveIcon: cc.Sprite,
        lbName: cc.Label,
        progress: cc.ProgressBar,
        dialog: cc.Prefab
    },
    onLoad: function onLoad() {},
    init: function init(number, properties, data) {
        var str = ArchivementName[number].name;
        if (str.length > 15) str = str.substring(0, 15) + "...";
        this.lbName.string = str;
        if (data === true || data === false) {
            if (data === true) {
                this.changeSprite(number);
            } else {
                this.changeSprite(27);
                this.progress.progress = 0;
            }
        } else {
            var progress = data / ArchivementMax[properties];
            if (progress === 1) {
                this.changeSprite(number);
            } else {
                this.progress.progress = progress;
                this.changeSprite(27);
            }
        }
        // if(type===false){ //default
        //     this.changeSprite(27);
        // }else{// what type, what number
        //     this.changeSprite(number);
        // }
    },
    changeSprite: function changeSprite(number) {
        var path = P_PATH + ArchivementPath[number];
        var url = cc.url.raw(path);
        var texture = cc.textureCache.addImage(url);
        var rect = this.archiveIcon.spriteFrame.getRect();
        if (cc.sys.isNative) {
            this.archiveIcon.spriteFrame = cc.SpriteFrame(texture);
        } else {
            this.archiveIcon.spriteFrame = new cc.SpriteFrame(texture);
        }
        // this.archiveIcon.spriteFrame= new cc.SpriteFrame(texture,rect);
        // this.archiveIcon.spriteFrame.setTexture(texture);
    }

    /*
    
    item: NUMBER,NAME,PATH,COUNT,MAX
    */

});
//load json đối tượng lưu trữ của archivement
module.exports = {
    ArchivementNumber: ArchivementNumber,
    ArchivementKey: ArchivementKey,
    ArchivementName: ArchivementName,
    ArchivementPath: ArchivementPath,
    ArchivementPrefab: ArchivementPrefab,
    ArchivementMax: ArchivementMax
};

cc._RFpop();
},{"State":"State"}],"Archivement":[function(require,module,exports){
"use strict";
cc._RFpush(module, '893c1QDtYRAYJCEzjsHjHNy', 'Archivement');
// scripts\Archivement.js

var ArchivementPrefab = require('ArchivementPrefab');
var ArKey = ArchivementPrefab.ArchivementKey;
var ArNum = ArchivementPrefab.ArchivementNumber;
var ArName = ArchivementPrefab.ArchivementName;
var ArMax = ArchivementPrefab.ArchivementMax;
var ls = cc.sys.localStorage;
var State = require('State');
cc.Class({
    'extends': cc.Component,

    properties: {
        contentNode: cc.ScrollView,
        itemPrefab: cc.Prefab,
        dialog: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        var designSize = cc.view.getFrameSize();
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
        if (ls.getItem(State.ARCHIVEMENT_KEY) !== null) {
            this.initfirst();
        }
        this.init();
    },

    init: function init() {
        var content = this.contentNode.content;
        this.initfirst();
        var arr = JSON.parse(ls.getItem(State.ARCHIVEMENT_KEY));
        cc.log(arr);
        var array = [];
        for (var i = 0; i < 27; i++) {
            var properties = ArKey[i];
            var data = arr[properties];
            var item = cc.instantiate(this.itemPrefab);
            var component = item.getComponent('ArchivementPrefab');
            component.init(i, properties, data);
            // add other code

            array.push(item);
            content.addChild(item);
        }
    },
    showDialog: function showDialog(title, content) {
        cc.log(data);
    },
    onclickBack: function onclickBack() {
        cc.director.loadScene('HomeScene_Login');
    },

    //    ,updateState:function(realLevel){
    //        var objArr=ls.getItem(State.ARCHIVEMENT_KEY);
    //         if(ls.getItem(State.ARCHIVEMENT_KEY)!==null){
    //             this.initfirst();
    //         }
    //        var arr=JSON.parse(objArr);
    //        if(realLevel<5){
    //            arr.BAIKHONGNAN= arr.BAIKHONGNAN>=ArMax.BAIKHONGNAN?ArMax.BAIKHONGNAN:arr.BAIKHONGNAN++;
    //            arr.BUCTOCVUOTLEN= arr.BUCTOCVUOTLEN>=ArMax.BUCTOCVUOTLEN?ArMax.BUCTOCVUOTLEN:arr.BUCTOCVUOTLEN;
    //            arr.THANRUA= arr.THANRUA>=ArMax.THANRUA?ArMax.THANRUA:arr.THANRUA++;
    //            arr.EVEREST= arr.EVEREST>=ArMax.EVEREST?arr.EVEREST:ArMax.EVEREST;
    //            arr.OLYMPUS= arr.OLYMPUS>=ArMax.OLYMPUS?arr.OLYMPUS:ArMax.OLYMPUS;
    //            arr.FANSIPAN= arr.FANSIPAN>=ArMax.FANSIPAN?arr.FANSIPAN:ArMax.FANSIPAN;
    //        }
    //        if(realLevel===15){
    //            arr.EVEREST=15;
    //            arr.BANLATRIEUPHU=1;
    //            arr.DAIKIENTUONG=arr.DAIKIENTUONG++;
    //            arr.BATKHACHIENBAI=arr.BATKHACHIENBAI++;
    //            arr.BATNHIPCHIENTHANG=arr.BATNHIPCHIENTHANG++;
    //            arr.KHOIDAUMANHME=true;
    //        }   
    //        this.saveArchivement(arr);
    //    }

    saveArchivement: function saveArchivement(arr) {
        ls.setItem(State.ArchivementKey, arr);
        cc.log("save complete");
    },

    getArchivement: function getArchivement() {
        return JSON.parse(ls.getItem(State.ARCHIVEMENT_KEY));
    },

    //
    initfirst: function initfirst() {
        if (JSON.parse(ls.getItem(State.ARCHIVEMENT_KEY)) === null) {
            var ArState = {
                BAIKHONGNAN: 0, //thua 10lần <mốc 5
                BANLATRIEUPHU: 0, // đạt đc triệu phú
                BATKHACHIENBAI: 0, //10 lần liên tiếp trả lời đc >= mốc 10
                BATNHIPCHIENTHANG: 0, // 10 lần trả lời >=mốc 10 (k cần liên tiếp)
                BUCTOCVUOTLEN: false, // câu hỏi min , nếu đạt khoảng cách 7 câu hỏi ngay sau lần chơi min
                CHAMTAYCHIENTHANG: false, // thua hoặc dừng lại ở câu hỏi số 15 (k trả lừi đc)
                CHIENTHANGMOHANG: false, // vượt qua mốc 10 lần đầu tiên
                DAIKIENTUONG: 0, //5 lần là triệu phú
                DOCCOCAUBAI: 0, // 10 lần triệu phú
                EVEREST: 0, // câu hỏi cao nhất từng trả lời đc, từ 1->15
                FANSIPAN: 0, // câu hỏi cao nhât từng đạt được, 1->8
                HATTRICK: 0, //3 lần liên tiếp đạt mốc >=10
                HUYENTHOAI: 0, //50 lần đạt mốc >=12
                KEONGOT: 0, // 20 lần kết thúc ở mốc >=5 và mốc <10
                KHOIDAUMANHME: false, // lần đầu đạt đến mốc >=5
                KHOIDONGTHANHCONG: false, //lần đầu đạt đến mốc >=10
                KHOBAUKIENTHUC: 0, //15 lần đạt >=8
                KIENTUONG: 0, //20 lần đạt mốc >=10
                KYPHUNGDICHTHU: 0, //thách đấu: hòa hoặc thắng 20
                NHAHIENTRIET: 0, // 30 lần đạt mốc >=10
                OLYMPUS: 0, //câu hỏi cao nhât từng đạt được, 1->10
                THANRUA: 0, // 20 lần thua <mốc 5
                THANTOCTAOBAO: 0, // 20 lần trả lời >=mốc 5 và <=mốc 10
                THAPTOANTHAPMY: 0, // 10 lần k trả lời đc hoặc dừng lại ở câu hỏi số 11
                THOSANCHIENTHANG: 0, // 30 lần >= mốc 10
                VUACAMHOA: 0, // thách đấu: hòa 10 lần
                YEUHOABINH: 0 // thách đấu, hòa 20 lần
            };

            ls.setItem(State.ARCHIVEMENT_KEY, JSON.stringify(ArState));
        }
    }
});

cc._RFpop();
},{"ArchivementPrefab":"ArchivementPrefab","State":"State"}],"AudioController":[function(require,module,exports){
"use strict";
cc._RFpush(module, '71d57X1TztINq5R0Cdp1okA', 'AudioController');
// scripts\modules\AudioController.js

var localst = cc.sys.localStorage;
var State = require('State');
var GameSTATE = State.GameState;
var HelpState = State.HelpState;
var AnswerState = State.AnswerState;

var AudioController = {
    setSoundMode: function setSoundMode(soundMode) {
        //soundMode = true/false
        localst.setItem(GameSTATE.SOUND_MODE, soundMode);
    },
    setMusicMode: function setMusicMode(musicMode) {
        localst.setItem(GameSTATE.MUSIC_MODE, musicMode);
    },
    getSoundMode: function getSoundMode() {
        var mode = localst.getItem(GameSTATE.SOUND_MODE);
        if (Boolean(mode)) {
            return mode === "true";
        } else {
            return true;
        }
    },
    getMusicMode: function getMusicMode() {
        var mode = localst.getItem(GameSTATE.MUSIC_MODE);
        if (Boolean(mode)) {
            return mode === "true";
        } else {
            return true;
        }
    },
    playAudio: function playAudio(name, loop) {
        var audioID = null;
        if (this.getSoundMode() === true) {
            var url = cc.url.raw(P_PATH + name);
            audioID = cc.audioEngine.playEffect(url, loop);
            // cc.log("duration:"+ cc.AudioClip(url).duration);
        } else {
                return;
            }
        return audioID;
    },
    playMusic: function playMusic(name, loop) {
        if (this.getSoundMode() === true) {
            var url = cc.url.raw(P_PATH + name);
            cc.audioEngine.playMusic(url, loop);
            // cc.log("duration:"+ cc.AudioClip(url).duration);
        } else {
                return;
            }
    },
    playBackgroundAudio: function playBackgroundAudio(name, loop) {
        if (this.getMusicMode() === true) {
            var url = cc.url.raw(P_PATH + name);
            cc.audioEngine.playEffect(url, loop);
        }
    },
    playBackgroundMusic: function playBackgroundMusic(isGame) {
        if (isGame === false) {
            this.playBackgroundAudio('bgmusic.mp3', true);
        }if (isGame === true) {
            if (this.getMusicMode() === true) this.playBackgroundAudio('background_music.mp3', true);
        }
    },
    playBackgroundAfterAnswer: function playBackgroundAfterAnswer() {
        if (this.getMusicMode() === true) this.playBackgroundAudio('background_music_c.mp3', true);
    },
    playClickSound: function playClickSound() {
        this.playAudio('touch_sound.mp3', false);
    },
    playAnswerChoose: function playAnswerChoose(numberAns) {
        var nameaudio1 = 'ans_a.mp3';
        switch (numberAns) {
            case AnswerState.ANSWER_A:
                nameaudio1 = 'ans_a.mp3';
                break;
            case AnswerState.ANSWER_B:
                nameaudio1 = 'ans_b.mp3';
                break;
            case AnswerState.ANSWER_C:
                nameaudio1 = 'ans_c.mp3';
                break;
            case AnswerState.ANSWER_D:
                nameaudio1 = 'ans_d.mp3';
                break;
        }
        this.playAudio(nameaudio1, false);
    },
    playAnswer: function playAnswer(numberTrue, isTrue) {
        var nameaudio = 'touch_sound.mp3';
        switch (numberTrue) {
            case AnswerState.ANSWER_A:
                if (isTrue === true) {
                    nameaudio = 'true_a.mp3';
                } else {
                    nameaudio = 'lose_a.mp3';
                }
                break;
            case AnswerState.ANSWER_B:
                if (isTrue === true) {
                    nameaudio = 'true_b.mp3';
                } else {
                    nameaudio = 'lose_b.mp3';
                }
                break;
            case AnswerState.ANSWER_C:
                if (isTrue === true) {
                    nameaudio = 'true_c.mp3';
                } else {
                    nameaudio = 'lose_c.mp3';
                }
                break;
            case AnswerState.ANSWER_D:
                if (isTrue === true) {
                    nameaudio = 'true_d2.mp3';
                } else {
                    nameaudio = 'lose_d.mp3';
                }
                break;
        }
        this.playAudio(nameaudio, false);
    },

    playReadQuestion: function playReadQuestion(numberQuestion) {},
    playHelpClick: function playHelpClick(numberHelp) {
        var nameaudio = '';
        switch (numberHelp) {
            case HelpState.N5050:
                nameaudio = 'sound5050_2.mp3';
                break;
            case HelpState.AUDIENCE:
                nameaudio = 'khan_gia.mp3';
                break;
            case HelpState.CALL:
                nameaudio = 'hoi_y_kien_chuyen_gia_01b.mp3';
                break;
            case HelpState.CHANGE:
                //
                break;
            case HelpState.STOP:
                //
                break;
        }
        if (nameaudio !== '') {
            this.playAudio(nameaudio, false);
        }
    },
    playLoseGame: function playLoseGame() {
        var delay = cc.callFunc(function () {
            cc.delayTime(3);
        }, this);
        var playlose = cc.callFunc(function () {
            this.playMusic('lose.mp3', false);
        }, this);
        this.node.runAction(cc.sequence(playlose, delay));
        cc.log("here");
    },
    playRuler: function playRuler() {},
    stopAll: function stopAll() {
        cc.audioEngine.stopAllEffects();
    },

    endAll: function endAll() {
        cc.audioEngine.end();
    },
    pauseAll: function pauseAll() {
        cc.audioEngine.pauseAllEffects();
    }

};
var P_PATH = 'resources/raw/';
module.exports = {
    AudioController: AudioController

};

cc._RFpop();
},{"State":"State"}],"BonusPrefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, '42ed6j55ChKFaFSNGOdy/Wg', 'BonusPrefab');
// scripts\ui\BonusPrefab.js

var BonusPrefab = cc.Class({
    "extends": cc.Component,

    properties: {
        labMoney: {
            "default": null,
            type: cc.Label
        },
        labArchire: {
            "default": null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},
    setMoney: function setMoney(tmoney) {
        this.labMoney.string = tmoney;
    },
    setArchire: function setArchire(tarchire) {
        this.labArchire.string = tarchire;
    }

});
module.exports = {
    BonusPrefab: BonusPrefab

};

cc._RFpop();
},{}],"ConfirmDialogPrefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, '83abcBPnRpHKqoMg3AWQFmO', 'ConfirmDialogPrefab');
// scripts\modules\ConfirmDialogPrefab.js


cc.Class({
    'extends': cc.Component,

    properties: {
        lbTitle: cc.Label,
        lbContent: {
            'default': null,
            type: cc.Label
        },
        btnOK: {
            'default': null,
            type: cc.Button
        },
        btnCancel: {
            'default': null,
            type: cc.Button
        },
        lbBtnOK: cc.Label,
        lbBtnCancel: cc.Label,
        animDialog: cc.Animation,
        parentComponent: cc.Component
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.animDialog = this.node.getComponent(cc.Animation);
    },

    init: function init(contentStr, parentComponent) {

        this.lbContent.string = contentStr;
        this.parentComponent = parentComponent;
        this.animDialog.play('anim_transition_question_in');
        cc.log("anim_anim");
    },
    initConfirm: function initConfirm(title, nameBtnConfirm, content, parentComponent) {
        this.lbTitle.string = title;
        this.lbBtnOK.string = nameBtnConfirm;
        this.lbContent.string = content;
        this.btnCancel.node.active = false;
        this.btnOK.node.setPosition(cc.p(0, -150));
        this.btnOK.node.width = 200;
        this.parentComponent = parentComponent;
        this.animDialog.play('anim_transition_question_in');
    },

    clickOK: function clickOK() {
        this.parentComponent.onClickOKDialog();
    },
    clickCancel: function clickCancel() {
        this.parentComponent.onClickCancelDialog();
        this.animDialog.play('anim_transition_question_out');
    }
});

cc._RFpop();
},{}],"DataLevel":[function(require,module,exports){
"use strict";
cc._RFpush(module, '961a9auvoZCTa0yhD43fxgK', 'DataLevel');
// scripts\data\DataLevel.js

var datalevel = [{
    level: "01",
    name: "200.000",
    money: 200000
}, {
    level: "02",
    name: "400.000",
    money: 400000
}, { level: "03",
    name: "600.000",
    money: 600000
}, { level: "04",
    name: "1.000.000",
    money: 1000000
}, { level: "05",
    name: "2.000.000",
    money: 2000000
}, { level: "06",
    name: "3.000.000",
    money: 3000000
}, { level: "07",
    name: "6.000.000",
    money: 6000000
}, { level: "08",
    name: "10.000.000",
    money: 10000000
}, { level: "09",
    name: "14.000.000",
    money: 14000000
}, { level: "10",
    name: "22.000.000",
    money: 22000000
}, { level: "11",
    name: "30.000.000",
    money: 30000000
}, { level: "12",
    name: "40.000.000",
    money: 40000000
}, { level: "13",
    name: "60.000.000",
    money: 60000000
}, { level: "14",
    name: "85.000.000",
    money: 85000000
}, { level: "15",
    name: "150.000.000",
    money: 150000000
}];
module.exports = {
    datalevel: datalevel
};

cc._RFpop();
},{}],"GameOver":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9d555bAFW9GNbapcQpbkGDI', 'GameOver');
// scripts\GameOver.js

var AudioCtr = require('AudioController');
var AudioController = AudioCtr.AudioController;

var DataLevel = require('DataLevel').datalevel;
var StoreData = require('StoreData');
var UserData = StoreData.UserData;
var UserKey = require('UserInforKey').UserInforKey;
var lastLevel = -1;
var isStopHelp = false;
var ls = cc.sys.localStorage;
var State = require('State');
var ArMax = require('ArchivementPrefab').ArchivementMax;

var CongSentence = {
    WHENSTOP: "BẠN ĐÃ DỪNG CUỘC CHƠI TẠI CÂU HỎI SỐ ",
    LOST1: "BẠN ĐÃ VƯỢT QUA CÂU HỎI SỐ ",
    LOST2: "BẠN ĐÃ XUẤT SẮC VƯỢT QUA CÂU HỎI SỐ ",
    LOST3: "TUYỆT VỜI! BẠN ĐÃ XUẤT SẮC VƯỢT QUA CÂU HỎI SỐ "
};
var GameOver = cc.Class({
    'extends': cc.Component,

    properties: {
        userName: {
            'default': null,
            type: cc.Label
        },
        usertype: {
            'default': null,
            type: cc.Label
        },
        userIcon: {
            'default': null,
            type: cc.Sprite
        },
        labelLastLevel: {
            'default': null,
            type: cc.Label
        },
        moneyBonus: {
            'default': null,
            type: cc.Label
        },
        congratulation: {
            'default': null,
            type: cc.Label
        },
        totalmoney: 0,
        mbonus: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.SHOW_ALL);
        }
        this.init(lastLevel, isStopHelp);
    },
    init: function init(lastlevel, isStopHelp) {
        this.labelLastLevel.string = "";
        if (isStopHelp === true) {
            // giu nguyên tiền thưởng đối vs lastlevel-1
            // this.labelLastLevel.string=lastlevel+1;

            if (lastlevel === 0) {
                this.moneyBonus.string = "0 VND";
                this.congratulation.string = CongSentence.WHENSTOP + "1";
            } else {
                this.moneyBonus.string = DataLevel[lastlevel - 1].name + " VND";
                this.congratulation.string = CongSentence.WHENSTOP + (lastlevel + 1);
                this.doSaveMoney(DataLevel[lastlevel - 1].money);
            }
        } else {
            // tiền thưởng trở về mốc thấp gần nhất
            // this.labelLastLevel.string=lastlevel;
            if (lastlevel === 0) {
                this.congratulation.string = CongSentence.WHENSTOP + "1";
                this.moneyBonus.string = "0 VND";
            }
            if (lastlevel <= 4 && lastlevel > 0) {
                this.congratulation.string = CongSentence.LOST1 + lastlevel;
                this.moneyBonus.string = "0 VND";
            }
            if (lastlevel > 4 && lastlevel <= 9) {
                this.congratulation.string = CongSentence.LOST2 + lastlevel;
                this.moneyBonus.string = DataLevel[4].name + " VND";
                this.doSaveMoney(DataLevel[4].money);
            }
            if (lastlevel > 9 && lastlevel <= 14) {
                this.congratulation.string = CongSentence.LOST3 + lastlevel;
                this.moneyBonus.string = DataLevel[9].name + " VND";
                this.doSaveMoney(DataLevel[9].money);
            }
            if (lastlevel > 14) {
                this.completeGame();
            }
        }
        cc.log(lastlevel);
        this.updateState(lastlevel);
    },

    completeGame: function completeGame() {
        cc.log("dowin");
        this.congratulation.string = CongSentence.LOST3 + lastlevel;
        this.moneyBonus.string = DataLevel[14].name + " VND";
        this.doSaveMoney(DataLevel[14].money);

        this.updateState(15);
    },

    doSaveMoney: function doSaveMoney(moneybonus) {
        var total = StoreData.getData(UserKey.TOTAL);
        total = StoreData.isNumber(total) ? total : 0;
        this.totalmoney = parseInt(total) + parseInt(moneybonus);
        StoreData.saveDataByKey(UserKey.TOTAL, this.totalmoney);
        // StoreData.saveDataByKey(UserKey.TOTAL,0); //use to reset data
        cc.log("saving : " + StoreData.getData(UserKey.TOTAL));
    },

    clickCancel: function clickCancel() {
        cc.director.loadScene('HomeScene_Login');
    },
    clickBtnSingle: function clickBtnSingle() {
        cc.director.loadScene('LoadGameScene_Login');
    },
    clickBtnThachDau: function clickBtnThachDau() {
        cc.log("thach dau mode");
    },
    clickBtnShare: function clickBtnShare() {}
    //share code

    // game over đếm và thêm sửa đối vs archivêment
    , initfirst: function initfirst() {
        if (JSON.parse(ls.getItem(State.ARCHIVEMENT_KEY)) === null) {
            var ArState = {
                BAIKHONGNAN: 0, //thua 10lần <mốc 5
                BANLATRIEUPHU: 0, // đạt đc triệu phú
                BATKHACHIENBAI: 0, //10 lần liên tiếp trả lời đc >= mốc 10
                BATNHIPCHIENTHANG: 0, // 10 lần trả lời >=mốc 10 (k cần liên tiếp)
                BUCTOCVUOTLEN: 0, // câu hỏi min , nếu đạt khoảng cách 7 câu hỏi ngay sau lần chơi min
                CHAMTAYCHIENTHANG: false, // thua hoặc dừng lại ở câu hỏi số 15 (k trả lừi đc)
                CHIENTHANGMOHANG: false, // vượt qua mốc 10 lần đầu tiên
                DAIKIENTUONG: 0, //5 lần là triệu phú
                DOCCOCAUBAI: 0, // 10 lần triệu phú
                EVEREST: 0, // câu hỏi cao nhất từng trả lời đc, từ 1->15
                FANSIPAN: 0, // câu hỏi cao nhât từng đạt được, 1->8
                HATTRICK: 0, //3 lần liên tiếp đạt mốc >=10
                HUYENTHOAI: 0, //50 lần đạt mốc >=12
                KEONGOT: 0, // 20 lần kết thúc ở mốc >=5 và mốc <10
                KHOIDAUMANHME: false, // lần đầu đạt đến mốc >=5
                KHOIDONGTHANHCONG: false, //lần đầu đạt đến mốc >=10
                KHOBAUKIENTHUC: 0, //15 lần đạt >=8
                KIENTUONG: 0, //20 lần đạt mốc >=10
                KYPHUNGDICHTHU: 0, //thách đấu: hòa hoặc thắng 20
                NHAHIENTRIET: 0, // 30 lần đạt mốc >=10
                OLYMPUS: 0, //câu hỏi cao nhât từng đạt được, 1->10
                THANRUA: 0, // 20 lần thua <mốc 5
                THANTOCTAOBAO: 0, // 20 lần trả lời >=mốc 5 và <=mốc 10
                THAPTOANTHAPMY: 0, // 10 lần k trả lời đc hoặc dừng lại ở câu hỏi số 11
                THOSANCHIENTHANG: 0, // 30 lần >= mốc 10
                VUACAMHOA: 0, // thách đấu: hòa 10 lần
                YEUHOABINH: 0 // thách đấu, hòa 20 lần
            };

            ls.setItem(State.ARCHIVEMENT_KEY, JSON.stringify(ArState));
        }
    },
    updateState: function updateState(realLevel) {
        var arr = JSON.parse(ls.getItem(State.ARCHIVEMENT_KEY));
        if (arr === null) {
            this.initfirst();
            arr = JSON.parse(ls.getItem(State.ARCHIVEMENT_KEY));
        }

        arr.EVEREST = arr.EVEREST <= lastLevel ? lastLevel : arr.EVEREST;
        arr.OLYMPUS = arr.OLYMPUS <= lastLevel ? lastLevel : arr.OLYMPUS;
        arr.FANSIPAN = arr.FANSIPAN <= lastLevel ? lastLevel : arr.FANSIPAN;

        if (realLevel < 5) {
            arr.BAIKHONGNAN = arr.BAIKHONGNAN === ArMax.BAIKHONGNAN ? ArMax.BAIKHONGNAN : arr.BAIKHONGNAN + 1;
            arr.THANRUA = arr.THANRUA === ArMax.THANRUA ? ArMax.THANRUA : arr.THANRUA + 1;
            arr.HATTRICK = arr.HATTRICK === ArMax.HATTRICK ? ArMax.HATTRICK : 0;
        }
        if (realLevel >= 5 && realLevel < 10) {
            arr.KEONGOT = arr.KEONGOT === ArMax.KEONGOT ? ArMax.KEONGOT : arr.KEONGOT + 1;
            arr.KHOIDAUMANHME = true;
            arr.THANTOCTAOBAO = arr.THANTOCTAOBAO === ArMax.THANTOCTAOBAO ? ArMax.THANTOCTAOBAO : arr.THANTOCTAOBAO + 1;
            arr.HATTRICK = arr.HATTRICK === ArMax.HATTRICK ? ArMax.HATTRICK : 0;
        }
        if (realLevel === 14) arr.CHAMTAYCHIENTHANG = true;
        if (realLevel >= 10 && realLevel <= 15) {
            arr.CHIENTHANGMOHANG = true;
            arr.KHOIDONGTHANHCONG = true;
            arr.HATTRICK = arr.HATTRICK === ArMax.HATTRICK ? ArMax.HATTRICK : arr.HATTRICK + 1;
            arr.BATKHACHIENBAI = arr.BATKHACHIENBAI === ArMax.BATKHACHIENBAI ? ArMax.BATKHACHIENBAI : arr.BATKHACHIENBAI + 1;
            arr.BATNHIPCHIENTHANG = arr.BATNHIPCHIENTHANG === ArMax.BATNHIPCHIENTHANG ? ArMax.BATNHIPCHIENTHANG : arr.BATNHIPCHIENTHANG + 1;
            arr.NHAHIENTRIET = arr.NHAHIENTRIET === ArMax.NHAHIENTRIET ? ArMax.NHAHIENTRIET : arr.NHAHIENTRIET + 1;
            arr.KIENTUONG = arr.KIENTUONG === ArMax.KIENTUONG ? ArMax.KIENTUONG : arr.KIENTUONG + 1;
        }
        if (realLevel >= 8) {
            arr.BUCTOCVUOTLEN = true;
            arr.KHOBAUKIENTHUC = arr.KHOBAUKIENTHUC === ArMax.KHOBAUKIENTHUC ? ArMax.KHOBAUKIENTHUC : arr.KHOBAUKIENTHUC + 1;
        }
        if (realLevel === 15) {
            arr.EVEREST = 15;
            arr.BANLATRIEUPHU = 1;
            arr.DAIKIENTUONG = arr.DAIKIENTUONG === ArMax.DAIKIENTUONG ? ArMax.DAIKIENTUONG : arr.DAIKIENTUONG + 1;
            arr.KHOIDAUMANHME = true;
        }
        this.saveArchivement(arr);
    },

    saveArchivement: function saveArchivement(arr) {
        ls.setItem(State.ARCHIVEMENT_KEY, JSON.stringify(arr));

        cc.log(">>>>>>>save complete");
        cc.log(arr);
    }
});
module.exports = {
    GameOver: GameOver,
    setInit: function setInit(b) {
        isStopHelp = b;
    },
    setCurrentLevel: function setCurrentLevel(a) {
        lastLevel = a;
    }
};

cc._RFpop();
},{"ArchivementPrefab":"ArchivementPrefab","AudioController":"AudioController","DataLevel":"DataLevel","State":"State","StoreData":"StoreData","UserInforKey":"UserInforKey"}],"Game_HelpMenu":[function(require,module,exports){
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
},{"AudioController":"AudioController","GameOver":"GameOver","State":"State"}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '463a7QgH+NPqbaIcLd4Q+gQ', 'Game');
// scripts\Game.js

var AudioCtr = require('AudioController');
var AudioController = AudioCtr.AudioController;

var LoadGame = require('LoadGame_Login');
var LoadGame_Login = LoadGame.LoadGame_Login;
var Game_HelpMenu = require('Game_HelpMenu').Game_HelpMenu;
var AnswerController = require('AnswerButtonController').AnswerButtonController;
var stringinformation = "string infor";
var AnswerState = require('State').AnswerState;
var MoneyInGame = require('MoneyInGame');
var ListLevelMoney = require('ListLevelMoney');
var GameOver = require('GameOver');
var GOver = GameOver.GameOver;
// var ListLevelMoney= List.ListLevelMoney;
var currentQuestion = 0;
var Game = cc.Class({
    'extends': cc.Component,

    properties: {
        moneyItem: {
            'default': null,
            type: MoneyInGame
        },
        helpnode: {
            'default': null,
            type: cc.Node
        },
        listNode: {
            'default': null,
            type: cc.Node
        },
        contentMainNode: {
            'default': null,
            type: cc.Node
        },

        labelContentQuestion: {
            'default': null,
            type: cc.Label
        },
        labelTitleQuestion: {
            'default': null,
            type: cc.Label
        },
        ansController: {
            'default': null,
            type: AnswerController
        },
        oppotunities: {
            'default': null,
            type: cc.Node
        },
        timeBar: {
            'default': null,
            type: cc.Node
        },
        choose: cc.Enum,
        trueAnswer: cc.Enum,
        labelTimer: cc.Label,
        time: 0,
        speedTimerBar: 0,
        timeOnceLevel: 30, //30seconds per level
        isStart: Boolean(false), //
        isNext: Boolean(false),
        isPlay: Boolean(false),
        txtQuestion: "Content question",
        txtQuesTitle: "Câu ",
        anim_list: cc.Animation,
        anim_main: cc.Animation,
        helps: cc.Component,
        timeStart: 0,
        timePause: 0,
        timeEnd: 0,
        totalTime: 0,
        memtimer: 0,
        dialogConfirm: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        // if(cc.sys.isMobile){
        //     cc.view.setDesignResolutionSize(winSize.width,winSize.height,cc.ResolutionPolicy.SHOW_ALL);
        //     this.timerbar.totalLength=winSize.width;
        // }
        var sizeCanvas = cc.view.getCanvasSize();
        this.isStart = false;
        // this.speedTimerBar=(this.timerbar.width/this.timeOnceLevel)/60;
        stringinformation = LoadGame.getStringJson();
        this.init();
    },

    nextTimeBar: function nextTimeBar(speedTimerBar) {

        if (speedTimerBar > 0) {
            this.timeBar.width = this.timeBar.width - speedTimerBar;
        } else {
            this.timeBar.width = this.timeBar.width - 10;
        }
        if (this.timeBar.width === 0) {
            this.stopGame();
            this.finish();
        }
    },

    getStringJson: function getStringJson() {
        return stringinformation;
    },

    init: function init() {
        this.choose = AnswerState.EMPTY;
        currentQuestion = 0;
        this.isStart = false;
        // this.ansController.removeEventListener();
        this.anim_list = this.listNode.getComponent(cc.Animation);
        this.anim_main = this.contentMainNode.getComponent(cc.Animation);
        this.initPre();
    },
    initPre: function initPre() {
        this.helps.doAllowClickedAllHelp();
        this.labelTimer.string = this.timeOnceLevel;
        // this.timerbar.progress=1;
        this.setMoney(currentQuestion);
        this.speedTimerBar = cc.director.getWinSize().width / 30 / 40;
        this.timeBar.width = cc.director.getWinSize().width;
        this.memtimer = this.timeBar;
        var listComponent = this.listNode.getComponent('ListLevelMoney');
        if (currentQuestion === 0 && this.isStart === false) {
            listComponent.initFirst();
        } else {
            listComponent.initGame(currentQuestion);
        }
        AudioController.stopAll();
        this.anim_list.play('anim_transition_list_in');
        this.anim_main.play('anim_transition_question_out');
    },
    clickListLevelMoney: function clickListLevelMoney() {
        if (this.isStart === false) {
            AudioController.playBackgroundMusic(true);
            AudioController.playClickSound();
            this.anim_list.play('anim_transition_list_out');
            this.anim_main.play('anim_transition_question_in');
            this.ansController.init();
            this.ansController.resetEventListener();
            GameOver.setCurrentLevel(currentQuestion);
            this.isStart = true;
            this.isPlay = true;
            this.timeStart = new Date().getTime();
            this.totalTime = 0;
            if (this.isNext === false) {
                this.initStartGame();
            } else {
                this.initNext();
            }
            var callBack = cc.callFunc(this.showDialog, this, "Bạn có chắc chắn muốn dừng cuộc chơi?");
            var keyboardlistener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function onKeyPressed(keyCode, event) {
                    if (keyCode === cc.KEY.back || keyCode === cc.KEY.backspace) {
                        callBack;
                    } else if (keyCode === cc.KEY.home) {
                        cc.director.end();
                    }
                }
            });
            cc.eventManager.addListener(keyboardlistener, this);
        }
    },
    setTextForAnswer: function setTextForAnswer(questionjson) {
        this.txtQuestion = questionjson.question;
        this.ansController.setTextForButton(questionjson.answer_a, questionjson.answer_b, questionjson.answer_c, questionjson.answer_d);
        this.trueAnswer = questionjson.answer_true;
        this.labelContentQuestion.string = this.txtQuestion;
        this.labelTitleQuestion.string = this.txtQuesTitle + questionjson.level;

        this.helps.setTrueAnswer(this.trueAnswer);
    },

    initStartGame: function initStartGame() {
        // this.ansController.init();
        this.isStart = true;
        this.isNext = false;
        //load data to this nodes
        var jsoncontent = JSON.parse(stringinformation);
        var questionjson = jsoncontent.questionkits[currentQuestion];
        this.setTextForAnswer(questionjson);
    },
    initNext: function initNext() {
        this.isNext = false;
        this.ansController.refresh();
        var jsoncontent = JSON.parse(stringinformation);
        var questionjson = jsoncontent.questionkits[currentQuestion];
        this.setTextForAnswer(questionjson);
        this.isStart = true;
    },

    update: function update(dt) {

        if (this.isStart === true) {
            if (this.isPlay === true) {
                var now = new Date().getTime();
                var timer = this.timeOnceLevel - this.totalTime - (now - this.timeStart) / 1000;
                this.labelTimer.string = Math.round(timer) <= 0 ? 0 : Math.round(timer);
                if (timer * this.speedTimerBar * 40 - this.speedTimerBar === this.memtimer) {
                    this.timeBar.width = this.timeBar.width - this.speedTimerBar;
                } else {
                    this.timeBar.width = timer * this.speedTimerBar * 40 - this.speedTimerBar;
                    this.memtimer = this.timeBar.width;
                }
                if (this.timeBar.width <= 0 || this.totalTime + Math.floor((now - this.timeStart) / 1000) >= this.timeOnceLevel || this.labelTimer.string === '0') {
                    AudioController.stopAll();
                    AudioController.playMusic('out_of_time.mp3', false);
                    this.stopGame();
                    this.showConfirm("Thông báo", "Đồng ý", "Hết giờ");
                }
            }
        }
    },
    finish: function finish() {
        this.checkResult(this.ansController.getNumberButtonClicked(), this.trueAnswer);
    },
    stopGame: function stopGame() {
        this.isStart = false;
        this.isPlay = false;
    },

    checkResult: function checkResult(numButtonChoose, numButtonTrue) {
        this.ansController.removeEventListener();
        var delay = cc.delayTime(3);
        if (numButtonChoose === numButtonTrue) {
            var funcTrueRe = cc.callFunc(function () {
                this.ansController.setTrueResult(currentQuestion);
            }, this);
            var afterT = cc.callFunc(function () {

                currentQuestion += 1;
                if (currentQuestion < 15) {
                    this.isNext = true;
                    this.initPre();
                } else {
                    this.stopGame();
                }
            }, this);
            // let sequenceT=cc.sequence(funcTrueRe,delay,afterT);
            this.node.runAction(cc.sequence(funcTrueRe, delay, afterT));
        } else {
            var funcFalseRe = cc.callFunc(function () {
                this.ansController.setFalseResult(numButtonTrue);
            }, this);
            var afterF = cc.callFunc(function () {
                this.gameOver(false);
            }, this);
            var sequenceF = cc.sequence(funcFalseRe, delay, afterF);
            this.node.runAction(sequenceF);

            //gameover
        }
    },
    setMoney: function setMoney(numberquestion) {
        this.moneyItem.setLabelMoney(currentQuestion - 1);
    },
    restart: function restart() {
        this.node.stopAllActions();
        cc.director.loadScene('GameScene');
    },
    getCurrentQuestion: function getCurrentQuestion() {
        return currentQuestion;
    },
    gameOver: function gameOver(isStopHelp) {
        GameOver.setInit(isStopHelp);
        this.node.stopAllActions();
        cc.director.loadScene('GameOverScene');
    },
    disableMainContent: function disableMainContent() {
        this.ansController.removeEventListener();
        this.helps.doDisallowClickedAllHelp();
    },
    enableMainContent: function enableMainContent() {
        this.ansController.resetEventListener();
        this.helps.doAllowClickedAllHelp();
    },
    setIsStart: function setIsStart(isSt) {
        this.isPlay = isSt;
        if (this.isStart === true) {
            if (isSt === false) {
                this.timeEnd = new Date().getTime();
                this.totalTime = this.totalTime + Math.floor((this.timeEnd - this.timeStart) / 1000);
                // cc.log(Math.floor((this.timeEnd-this.timeStart)/1000) +" "+this.totalTime);
            }
            if (isSt === true) {
                this.timeStart = new Date().getTime();
            }
        }
    },
    showDialog: function showDialog(contentDialog) {
        this.disableMainContent();
        var dialog = cc.instantiate(this.dialogConfirm);
        dialog.setPosition = cc.p(1080, 640);
        dialog.active = true;
        this.node.addChild(dialog);
        var comp = dialog.getComponent('ConfirmDialogPrefab');
        comp.init(contentDialog, this.node.getComponent('Game'));
        // this.node.addChild(dialog);
        this.isPlay = false;
    },

    onClickOKDialog: function onClickOKDialog() {
        AudioController.stopAll();
        AudioController.playAudio('lose.mp3', false);
        if (this.isStart === true) {
            this.gameOver(true);
        } else if (this.isStart === false) {
            this.stopGame();
            this.gameOver(false);
        }
    },
    onClickCancelDialog: function onClickCancelDialog() {
        if (this.isPlay === false) {
            this.enableMainContent();
            this.isPlay = true;
            cc.log("click cancel");
        }
    },
    showConfirm: function showConfirm(title, nameBtnConfirm, content) {
        this.disableMainContent();
        var dialog = cc.instantiate(this.dialogConfirm);
        dialog.setPosition = cc.p(1080, 640);
        dialog.active = true;
        this.node.addChild(dialog);
        var comp = dialog.getComponent('ConfirmDialogPrefab');
        comp.initConfirm(title, nameBtnConfirm, content, this.node.getComponent('Game'));
        // this.node.addChild(dialog);
        this.isPlay = false;
    }
});
module.exports = {
    Game: Game,
    getLastLevel: function getLastLevel() {
        return currentQuestion;
    }
};

cc._RFpop();
},{"AnswerButtonController":"AnswerButtonController","AudioController":"AudioController","GameOver":"GameOver","Game_HelpMenu":"Game_HelpMenu","ListLevelMoney":"ListLevelMoney","LoadGame_Login":"LoadGame_Login","MoneyInGame":"MoneyInGame","State":"State"}],"HomeScene_Login":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3c60aFCj5BCxbDw8En7I3+b', 'HomeScene_Login');
// scripts\HomeScene_Login.js

var ReadWriteJson = require('ReadWriteJson');
var StoreData = require('StoreData');
var UserKey = require('UserInforKey').UserInforKey;
var AudioCtr = require('AudioController');
var AudioController = AudioCtr.AudioController;
var State = require('State');

var HomeScene_Login = cc.Class({
    'extends': cc.Component,

    properties: {

        buttonSinglePlay: {
            'default': null,
            type: cc.Button
        },
        buttonThachDau: {
            'default': null,
            type: cc.Button
        },

        loadingPrefab: {
            'default': null,
            type: cc.Prefab
        },
        containPrefab: {
            'default': null,
            type: cc.Node
        },
        userPrefab: cc.Prefab,
        bonusPrefab: cc.Prefab

    },

    // use this for initialization
    onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        var designSize = cc.view.getFrameSize();
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.SHOW_ALL);
        }
        cc.log("update 08-06-2016");
        var keyboardListenner = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                if (keyCode === cc.KEY.back || keyCode === cc.KEY.backspace) {
                    cc.log("stop game");
                    // cc.Game.onStop();
                    cc.screen.exitFullScreen();
                } else if (keyCode === cc.KEY.home) {
                    cc.log("clicking home");
                    cc.Game.pause();
                }
            }
        });
        cc.eventManager.addListener(keyboardListenner, this);
        this.init();
        AudioController.playBackgroundMusic(false);
    },
    init: function init() {
        var username = StoreData.getData(UserKey.NAME);
        username = username === null ? "Noname" : username;
        var userPF = cc.instantiate(this.userPrefab);
        var userComp = userPF.getComponent('UserPrefab');
        userComp.setName(username);
        userComp.setType("Thí sinh");

        userPF.setPosition(-360, 0);
        userPF.setContentSize(userPF.width, this.containPrefab.height);
        this.containPrefab.addChild(userPF);

        var money = StoreData.getData(UserKey.TOTAL);
        money = !StoreData.isNumber(money) || parseInt(money) < 0 ? 0 : money;
        var bonusPF = cc.instantiate(this.bonusPrefab);
        var bonusComp = bonusPF.getComponent('BonusPrefab');
        bonusComp.setMoney(StoreData.getMillion(parseInt(money)));

        bonusPF.setPosition(100, 0);
        this.containPrefab.addChild(bonusPF);
    },

    doLoadUserInformation: function doLoadUserInformation() {
        ReadWriteJson.readFileJson('resources/UserInformation.json');
    },
    onClickButtonSinglePlay: function onClickButtonSinglePlay() {
        this.nextScene('LoadGameScene_Login');
    },
    onClickButtonThachDau: function onClickButtonThachDau() {
        console.log("Clicking button thachdau");
    },
    onClickArchivement: function onClickArchivement() {
        this.nextScene('ArchivementScene');
    },

    onClickSetting: function onClickSetting() {
        this.nextScene('SettingScene');
    },
    nextScene: function nextScene(scene) {
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

module.exports = {
    HomeScene_Login: HomeScene_Login
};

cc._RFpop();
},{"AudioController":"AudioController","ReadWriteJson":"ReadWriteJson","State":"State","StoreData":"StoreData","UserInforKey":"UserInforKey"}],"ItemLevel":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e1caffUsAFEP6IjT2Zmvkih', 'ItemLevel');
// scripts\ui\ItemLevel.js

cc.Class({
    "extends": cc.Component,

    properties: {
        level: {
            "default": null,
            type: cc.Label
        },
        money: {
            "default": null,
            type: cc.Label
        },
        under: {
            "default": null,
            type: cc.Sprite
        }
    },

    // use this for initialization
    init: function init(datalevel, typeItem) {
        if (datalevel.level == 5 || datalevel.level == 10 || datalevel.level == 15) {
            this.level.node.color = new cc.Color(255, 210, 0);
            this.money.node.color = new cc.Color(255, 210, 0);
        }
        this.level.string = datalevel.level;
        this.money.string = datalevel.name;
        switch (typeItem) {
            case 0:
                //normal
                this.under.node.active = false;
                break;
            case 1:
                //current
                this.under.node.active = true;
                break;
            case 2:
                //done
                this.node.opacity = 100;
                this.under.node.active = false;
                break;
        }
    },
    setCurrent: function setCurrent() {
        this.under.node.active = true;
    },
    setDone: function setDone() {
        this.level.node.opacity = 100;
        this.money.node.opacity = 100;
    },
    setNormal: function setNormal() {
        this.under.node.active = false;
    },
    setData: function setData(datalevel) {
        this.level.string = datalevel.level;
        this.money.string = datalevel.name;
    }
});

cc._RFpop();
},{}],"ListLevelMoney":[function(require,module,exports){
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
},{"DataLevel":"DataLevel"}],"LoadGame_Login":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c17ffYsNm5KOrt+Z1XzGTip', 'LoadGame_Login');
// scripts\LoadGame_Login.js

var ListLevelMoney = require('ListLevelMoney').ListLevelMoney;
var StoreData = require('StoreData');
var UserKey = require('UserInforKey').UserInforKey;
var stringjson = "string json";
var LoadGame_Login = cc.Class({
    'extends': cc.Component,

    properties: {
        userPrefab: cc.Prefab,
        bonusPrefab: cc.Prefab,
        containPrefab: cc.Node,
        strjson: ""
    },

    // use this for initialization
    onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(winSize.width, winSize.height, cc.ResolutionPolicy.SHOW_ALL);
        }
        // if(cc.sys.os===cc.sys.OS_WINDOWS){
        //     cc.winSize=cc.w
        // }
        this.init();

        this.doLoadJson();
    },
    init: function init() {
        var username = StoreData.getData(UserKey.NAME);
        username = username === null ? "Noname" : username;
        var userPF = cc.instantiate(this.userPrefab);
        var userComp = userPF.getComponent('UserPrefab');
        userComp.setName(username);
        userComp.setType("Thí sinh");

        userPF.setPosition(-200, 20);
        userPF.setContentSize(userPF.width, this.containPrefab.height);
        this.containPrefab.addChild(userPF);

        var money = StoreData.getData(UserKey.TOTAL);
        money = !StoreData.isNumber(money) || parseInt(money) < 0 ? 0 : money;
        var bonusPF = cc.instantiate(this.bonusPrefab);
        var bonusComp = bonusPF.getComponent('BonusPrefab');
        bonusComp.setMoney(StoreData.getMillion(parseInt(money)));

        bonusPF.setPosition(-100, -50);
        this.containPrefab.addChild(bonusPF);
    },

    loadOtherScene: function loadOtherScene() {
        cc.director.loadScene('GameScene');
    },
    doLoadJson: function doLoadJson() {
        var url = cc.url.raw('resources/data/QuestionKit.json');
        cc.loader.load(url, function (err, res) {
            stringjson = JSON.stringify(res);
            this.strjson = stringjson;
            cc.director.loadScene('GameScene');
        });
    },
    getStrJson: function getStrJson() {
        return this.strjson;
    },

    setNamePlayer: function setNamePlayer(name) {
        this.nameplayer.string = name;
    },

    setMoney: function setMoney(money) {
        this.labelmoney.string = money;
    },

    setTypeLayer: function setTypeLayer(type) {
        this.typelayer.string = type;
    }

});
module.exports = {
    LoadGame_Login: LoadGame_Login,

    getStringJson: function getStringJson() {
        return stringjson;
    }
};

cc._RFpop();
},{"ListLevelMoney":"ListLevelMoney","StoreData":"StoreData","UserInforKey":"UserInforKey"}],"MoneyInGame":[function(require,module,exports){
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
},{"DataLevel":"DataLevel"}],"PanelOppotunity":[function(require,module,exports){
"use strict";
cc._RFpush(module, '07b2eWrOmtMgLf/0n4L2owN', 'PanelOppotunity');
// scripts\modules\PanelOppotunity.js

var AnswerSt = require('State');
var GameHelp = require('Game_HelpMenu');
var AudioController = require('AudioController');
var AnswerState = AnswerSt.AnswerState;
cc.Class({
    'extends': cc.Component,

    properties: {
        game: {
            'default': null,
            type: GameHelp
        },
        nodeParent: {
            'default': null,
            type: cc.Node
        },

        nodeHelps: {
            'default': null,
            type: cc.Node
        },
        nodeCall: {
            'default': null,
            type: cc.Node
        },
        nodeAnswerCall: {
            'default': null,
            type: cc.Node
        },
        nodeAudience: {
            'default': null,
            type: cc.Node
        },
        buttonTeacher: {
            'default': null,
            type: cc.Button
        },
        buttonDoctor: {
            'default': null,
            type: cc.Button
        },
        buttonEngineer: {
            'default': null,
            type: cc.Button
        },
        buttonReporter: {
            'default': null,
            type: cc.Button
        },
        iconAnswer: {
            'default': null,
            type: cc.Sprite
        },
        labelNameCall: {
            'default': null,
            type: cc.Label
        },
        labelAnswerCall: {
            'default': null,
            type: cc.Label
        },
        buttonCloseAnswerCall: {
            'default': null,
            type: cc.Button
        },
        answer: cc.Enum,
        gameComponent: cc.Component,
        other5050: cc.Enum
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.gameComponent = this.nodeParent.getComponent('Game');
        this.other5050 = AnswerState.EMPTY;
    },
    setAnswer: function setAnswer(trueanswer) {
        this.answer = trueanswer;
    },
    clickAudience: function clickAudience(is2op) {
        this.gameComponent.setIsStart(false);
        this.nodeCall.active = false;
        this.nodeAnswerCall.active = false;
        this.nodeAudience.active = true;
        // var allowClicked= this.nodeHelps.getComponent('Game_HelpMenu');
        // allowClicked.doDisallowClickedAllHelp();
        this.gameComponent.disableMainContent();
        var AudComponent = this.nodeAudience.getComponent('UIContentAudience');
        if (is2op === true) {
            AudComponent.setTwoOptions(this.answer, this.other5050);
        }
        AudComponent.init(this.answer, is2op);
    },
    set5050forAudience: function set5050forAudience(option2) {
        this.other5050 = option2;
    },

    clickCallPanel: function clickCallPanel() {
        this.gameComponent.setIsStart(false);
        // this.nodeAudience.node.active=false;
        this.nodeCall.active = true;
        this.nodeAnswerCall.active = false;
        this.nodeAudience.active = false;

        this.gameComponent.disableMainContent();
        // var allowClicked= this.nodeHelps.getComponent('Game_HelpMenu');
        // allowClicked.doDisallowClickedAllHelp();
    },
    showAnswerCall: function showAnswerCall(num) {
        var url = null;
        var texture = null;
        // varAudioController.playAudio('help_callb');
        this.nodeAnswerCall.active = true;
        this.nodeCall.active = false;
        switch (num) {
            case 1:
                this.labelNameCall.string = "Bác sĩ";
                url = cc.url.raw('resources/textures/oppotunities/atp__activity_player_layout_help_call_01.png');
                texture = cc.textureCache.addImage(url);
                this.iconAnswer.spriteFrame.setTexture(texture);
                break;
            case 2:
                this.labelNameCall.string = "Giáo viên";
                url = cc.url.raw('resources/textures/oppotunities/atp__activity_player_layout_help_call_02.png');
                texture = cc.textureCache.addImage(url);
                this.iconAnswer.spriteFrame.setTexture(texture);
                break;
            case 3:
                this.labelNameCall.string = "Kỹ sư";
                url = cc.url.raw('resources/textures/oppotunities/atp__activity_player_layout_help_call_03.png');
                texture = cc.textureCache.addImage(url);
                this.iconAnswer.spriteFrame.setTexture(texture);
                break;
            case 4:
                this.labelNameCall.string = "Phóng viên";
                url = cc.url.raw('resources/textures/oppotunities/atp__activity_player_layout_help_call_04.png');
                texture = cc.textureCache.addImage(url);
                this.iconAnswer.spriteFrame.setTexture(texture);
                break;
        }
        this.labelAnswerCall.string = "Theo tôi đáp án đúng là " + AnswerSt.getNameAnswer(this.answer);
        // this.node.runAction(cc.sequence(cc.delayTime(1),function(){

        // },this));
    },
    clickDoctor: function clickDoctor() {
        // setTimeout(this.showAnswerCall(1), 1000);
        this.showAnswerCall(1);
    },
    clickTeacher: function clickTeacher() {
        this.showAnswerCall(2);
    },
    clickEngineer: function clickEngineer() {
        this.showAnswerCall(3);
    },
    clickReporter: function clickReporter() {
        this.showAnswerCall(4);
    },
    clickButtonClose: function clickButtonClose() {
        this.game.setOppotunitiesClickable(false);
        this.nodeParent.opacity = 255;
        var anim = this.node.getComponent(cc.Animation);
        anim.play('anim_help_transition_out');
        // var allowClicked= this.nodeHelps.getComponent('Game_HelpMenu');
        // allowClicked.doAllowClickedAllHelp();

        this.gameComponent.enableMainContent();
        this.gameComponent.setIsStart(true);
    }

});

cc._RFpop();
},{"AudioController":"AudioController","Game_HelpMenu":"Game_HelpMenu","State":"State"}],"ReadWriteJson":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ed958Kz0flA1YtbYu6vLth0', 'ReadWriteJson');
// scripts\modules\ReadWriteJson.js

var ReadWriteJson = {};
module.exports = {
    ReadWriteJson: ReadWriteJson,
    readFileJson: function readFileJson(urljson) {
        var url = cc.url.raw(urljson);
        var stringcontent = "";
        cc.loader.load(url, function (err, res) {
            stringcontent = JSON.stringify(res);
            stringcontent = stringcontent.substring(1, stringcontent.lastIndexOf("]"));
            // console.log( 'load['+ url +'], err['+err+'] result: ' + JSON.stringify( res ) );
        });
        return stringcontent;
    }
};

cc._RFpop();
},{}],"Setting":[function(require,module,exports){
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
},{"AudioController":"AudioController","State":"State"}],"State":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'be5dfqXDExACKkvyR1wLuhy', 'State');
// scripts\data\State.js

var AnswerState = cc.Enum({
    EMPTY: 0,
    ANSWER_A: 1,
    ANSWER_B: 2,
    ANSWER_C: 3,
    ANSWER_D: 4
});
var HelpState = cc.Enum({
    EMPTY: 0,
    STOP: 1,
    CHANGE: 2,
    N5050: 3,
    CALL: 4,
    AUDIENCE: 5
});
var GameState = {
    SOUND_MODE: 'SOUND_MODE',
    MUSIC_MODE: 'MUSIC_MODE'
};
var State = {};
var ARCHIVEMENT_KEY = 'ARCHIVEMENT_KEY';
module.exports = {
    State: State,
    AnswerState: AnswerState,
    HelpState: HelpState,
    GameState: GameState,
    ARCHIVEMENT_KEY: 'ARCHIVEMENT_KEY',
    getNameAnswer: function getNameAnswer(number) {
        switch (number) {
            case AnswerState.ANSWER_A:
                return 'A';
            case AnswerState.ANSWER_B:
                return 'B';
            case AnswerState.ANSWER_C:
                return 'C';
            case AnswerState.ANSWER_D:
                return 'D';
        }
    }
};

cc._RFpop();
},{}],"StoreData":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cca3e05FbFJH5PIpgT3TQpE', 'StoreData');
// scripts\modules\StoreData.js

var UserInforKey = require('UserInforKey');
var UserKey = UserInforKey.UserInforKey;
var ArchireKey = UserInforKey.ArchireKey;
var HistoryKey = UserInforKey.HistoryKey;
var storage = cc.sys.localStorage;
var UserData = {
    ID: "",
    LEVEL: "",
    EXPERIENCE: 0,
    NAME: "noname",
    PLAYTIMES: 50,
    ARCHIRE: {
        COMPLETE: 0
    },
    TOTAL: 0
};
module.exports = {
    UserDate: UserData,
    storeData: function storeData(data) {
        storage.setItem(UserKey.ID, data.ID);
        storage.setItem(UserKey.LEVEL, data.LEVEL);
        storage.setItem(UserKey.EXPERIENCE, data.EXPERIENCE);
        storage.setItem(UserKey.NAME, data.NAME);
        storage.setItem(UserKey.PLAYTIMES, data.PLAYTIMES);
        storage.setItem(UserKey.TOTAL, data.TOTAL);
    },
    saveDataByKey: function saveDataByKey(key, data) {
        storage.setItem(key, data);
    },
    getDataObject: function getDataObject(key) {},
    getData: function getData(key) {
        return storage.getItem(key);
    },
    isNumber: function isNumber(obj) {
        return (/^-?[\d.]+(?:e-?\d+)?$/.test(obj)
        );
    },
    getMillion: function getMillion(money) {
        var result = money;
        if (money === 0) return 0;
        if (money / 1000000 >= 1) {
            result = money / 1000000 + " tr";
        } else {
            result = money / 1000 + " ng";
        }
        return result;
    },
    getObject: function getObject(key) {}

    //archivemetn

};

cc._RFpop();
},{"UserInforKey":"UserInforKey"}],"UIContentAudience":[function(require,module,exports){
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
},{"State":"State"}],"UserInforKey":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b4ff5JHcplBWrV7ZUH9fFwv', 'UserInforKey');
// scripts\data\UserInforKey.js

var UserInforKey = {
    ID: "id",
    LEVEL: "level",
    EXPERIENCE: "experience",
    NAME: "name",
    PLAYTIMES: "times",
    ARCHIRE: "archire",
    HISTORY: "history",
    TOTAL: "totalmoney"

};

var ArchivementKey = {
    COMPLETE: "complete"
};

var HistoryKey = {
    QUESTION: "question",
    TIME: "time"
};
module.exports = {
    UserInforKey: UserInforKey,
    ArchivementKey: ArchivementKey,
    HistoryKey: HistoryKey
};

cc._RFpop();
},{}],"UserPrefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, '704d6NTKLFAB4DGQ63RENfW', 'UserPrefab');
// scripts\ui\UserPrefab.js

var UserPrefab = cc.Class({
    "extends": cc.Component,

    properties: {
        icon: {
            "default": null,
            type: cc.Sprite
        },
        lbUserName: {
            "default": null,
            type: cc.Label
        },
        lbType: {
            "default": null,
            type: cc.Label
        }
    },

    setIcon: function setIcon(blob) {},
    setName: function setName(name) {
        this.lbUserName.string = name;
    },
    setType: function setType(type) {
        this.lbType.string = type;
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
module.exports = {
    UserPrefab: UserPrefab

};

cc._RFpop();
},{}]},{},["ListLevelMoney","HomeScene_Login","Game","BonusPrefab","MoneyInGame","ArchivementPrefab","Setting","Game_HelpMenu","ConfirmDialogPrefab","PanelOppotunity","AnswerButtonController","UserPrefab","Archivement","AudioController","UIContentAudience","State","LoadGame_Login","StoreData","DataLevel","ItemLevel","GameOver","UserInforKey","ReadWriteJson"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvTG9jYWwvQ29jb3NDcmVhdG9yL2FwcC0xLjEuMC9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHRzL3VpL0Fuc3dlckJ1dHRvbkNvbnRyb2xsZXIuanMiLCJhc3NldHMvc2NyaXB0cy91aS9BcmNoaXZlbWVudFByZWZhYi5qcyIsImFzc2V0cy9zY3JpcHRzL0FyY2hpdmVtZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9BdWRpb0NvbnRyb2xsZXIuanMiLCJhc3NldHMvc2NyaXB0cy91aS9Cb251c1ByZWZhYi5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQ29uZmlybURpYWxvZ1ByZWZhYi5qcyIsImFzc2V0cy9zY3JpcHRzL2RhdGEvRGF0YUxldmVsLmpzIiwiYXNzZXRzL3NjcmlwdHMvR2FtZU92ZXIuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0dhbWVfSGVscE1lbnUuanMiLCJhc3NldHMvc2NyaXB0cy9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdHMvSG9tZVNjZW5lX0xvZ2luLmpzIiwiYXNzZXRzL3NjcmlwdHMvdWkvSXRlbUxldmVsLmpzIiwiYXNzZXRzL3NjcmlwdHMvdWkvTGlzdExldmVsTW9uZXkuanMiLCJhc3NldHMvc2NyaXB0cy9Mb2FkR2FtZV9Mb2dpbi5qcyIsImFzc2V0cy9zY3JpcHRzL3VpL01vbmV5SW5HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9QYW5lbE9wcG90dW5pdHkuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL1JlYWRXcml0ZUpzb24uanMiLCJhc3NldHMvc2NyaXB0cy9TZXR0aW5nLmpzIiwiYXNzZXRzL3NjcmlwdHMvZGF0YS9TdGF0ZS5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvU3RvcmVEYXRhLmpzIiwiYXNzZXRzL3NjcmlwdHMvdWkvVUlDb250ZW50QXVkaWVuY2UuanMiLCJhc3NldHMvc2NyaXB0cy9kYXRhL1VzZXJJbmZvcktleS5qcyIsImFzc2V0cy9zY3JpcHRzL3VpL1VzZXJQcmVmYWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkwNTgzOVlySDlQd0tybjY1MTkyTVNnJywgJ0Fuc3dlckJ1dHRvbkNvbnRyb2xsZXInKTtcbi8vIHNjcmlwdHNcXHVpXFxBbnN3ZXJCdXR0b25Db250cm9sbGVyLmpzXG5cbnZhciBBdWRpb0N0ciA9IHJlcXVpcmUoJ0F1ZGlvQ29udHJvbGxlcicpO1xudmFyIEF1ZGlvQ29udHJvbGxlciA9IEF1ZGlvQ3RyLkF1ZGlvQ29udHJvbGxlcjtcblxudmFyIEFuc3dlclN0YXRlID0gcmVxdWlyZSgnU3RhdGUnKS5BbnN3ZXJTdGF0ZTtcbnZhciBHYW1lID0gcmVxdWlyZSgnR2FtZScpLkdhbWU7XG52YXIgSGVscE1lbnUgPSByZXF1aXJlKCdHYW1lX0hlbHBNZW51Jyk7XG52YXIgQW5zd2VyQnV0dG9uQ29udHJvbGxlciA9IGNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbm9kZVBhcmVudDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBidXR0b25BOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgYnV0dG9uQjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIGJ1dHRvbkM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBidXR0b25EOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgbGFiZWxBOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBsYWJlbEI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGxhYmVsQzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgbGFiZWxEOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBoZWxwczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQ29tcG9uZW50XG4gICAgICAgIH0sXG4gICAgICAgIHR4dEE6IFwiQTogXCIsXG4gICAgICAgIHR4dEI6IFwiQjogXCIsXG4gICAgICAgIHR4dEM6IFwiQzogXCIsXG4gICAgICAgIHR4dEQ6IFwiRDogXCIsXG4gICAgICAgIGFuaW1BOiBjYy5BbmltYXRpb24sXG4gICAgICAgIGFuaW1COiBjYy5BbmltYXRpb24sXG4gICAgICAgIGFuaW1DOiBjYy5BbmltYXRpb24sXG4gICAgICAgIGFuaW1EOiBjYy5BbmltYXRpb24sXG4gICAgICAgIG51bUJ1dHRvbkNsaWNrZWQ6IGNjLkVudW0sXG4gICAgICAgIGdhbWU6IGNjLkNvbXBvbmVudFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gdGhpcy5ub2RlUGFyZW50LmdldENvbXBvbmVudChcIkdhbWVcIik7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICB0aGlzLm51bUJ1dHRvbkNsaWNrZWQgPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcblxuICAgICAgICB0aGlzLmJ1dHRvbkEubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmJ1dHRvbkIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmJ1dHRvbkMubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmJ1dHRvbkQubm9kZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuYW5pbUEgPSB0aGlzLmJ1dHRvbkEuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIHRoaXMuYW5pbUIgPSB0aGlzLmJ1dHRvbkIuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIHRoaXMuYW5pbUMgPSB0aGlzLmJ1dHRvbkMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIHRoaXMuYW5pbUQgPSB0aGlzLmJ1dHRvbkQuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG5cbiAgICAgICAgLy8gdGhpcy5zZXRDbGlja0J1dHRvbih0aGlzLmFuaW1BLEFuc3dlclN0YXRlLkFOU1dFUl9BKTtcbiAgICAgICAgLy8gdGhpcy5zZXRDbGlja0J1dHRvbih0aGlzLmFuaW1CLEFuc3dlclN0YXRlLkFOU1dFUl9CKTtcbiAgICAgICAgLy8gdGhpcy5zZXRDbGlja0J1dHRvbih0aGlzLmFuaW1DLEFuc3dlclN0YXRlLkFOU1dFUl9DKTtcbiAgICAgICAgLy8gdGhpcy5zZXRDbGlja0J1dHRvbih0aGlzLmFuaW1ELEFuc3dlclN0YXRlLkFOU1dFUl9EKTtcbiAgICB9LFxuICAgIHJlZnJlc2g6IGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB0aGlzLnJlc2V0RXZlbnRMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLm51bUJ1dHRvbkNsaWNrZWQgPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcbiAgICB9LFxuICAgIHNldFRleHRGb3JCdXR0b246IGZ1bmN0aW9uIHNldFRleHRGb3JCdXR0b24odGV4dGEsIHRleHRiLCB0ZXh0YywgdGV4dGQpIHtcbiAgICAgICAgdGhpcy50eHRBbkEgPSB0aGlzLnR4dEEgKyB0ZXh0YTtcbiAgICAgICAgdGhpcy50eHRBbkIgPSB0aGlzLnR4dEIgKyB0ZXh0YjtcbiAgICAgICAgdGhpcy50eHRBbkMgPSB0aGlzLnR4dEMgKyB0ZXh0YztcbiAgICAgICAgdGhpcy50eHRBbkQgPSB0aGlzLnR4dEQgKyB0ZXh0ZDtcblxuICAgICAgICB0aGlzLmxhYmVsQS5zdHJpbmcgPSB0aGlzLnR4dEFuQTtcbiAgICAgICAgdGhpcy5sYWJlbEIuc3RyaW5nID0gdGhpcy50eHRBbkI7XG4gICAgICAgIHRoaXMubGFiZWxDLnN0cmluZyA9IHRoaXMudHh0QW5DO1xuICAgICAgICB0aGlzLmxhYmVsRC5zdHJpbmcgPSB0aGlzLnR4dEFuRDtcbiAgICB9LFxuICAgIGNsaWNrQTogZnVuY3Rpb24gY2xpY2tBKCkge1xuICAgICAgICB0aGlzLm9uQ2xpY2sodGhpcy5idXR0b25BLCBBbnN3ZXJTdGF0ZS5BTlNXRVJfQSk7XG4gICAgfSxcbiAgICBjbGlja0I6IGZ1bmN0aW9uIGNsaWNrQigpIHtcbiAgICAgICAgdGhpcy5vbkNsaWNrKHRoaXMuYnV0dG9uQiwgQW5zd2VyU3RhdGUuQU5TV0VSX0IpO1xuICAgIH0sXG4gICAgY2xpY2tDOiBmdW5jdGlvbiBjbGlja0MoKSB7XG4gICAgICAgIHRoaXMub25DbGljayh0aGlzLmJ1dHRvbkMsIEFuc3dlclN0YXRlLkFOU1dFUl9DKTtcbiAgICB9LFxuICAgIGNsaWNrRDogZnVuY3Rpb24gY2xpY2tEKCkge1xuICAgICAgICB0aGlzLm9uQ2xpY2sodGhpcy5idXR0b25ELCBBbnN3ZXJTdGF0ZS5BTlNXRVJfRCk7XG4gICAgfSxcbiAgICByZXNldEV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uIHJlc2V0RXZlbnRMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5udW1CdXR0b25DbGlja2VkID0gQW5zd2VyU3RhdGUuRU1QVFk7XG5cbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzLmJ1dHRvbkEubm9kZSk7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5yZXN1bWVUYXJnZXQodGhpcy5idXR0b25CLm5vZGUpO1xuICAgICAgICBjYy5ldmVudE1hbmFnZXIucmVzdW1lVGFyZ2V0KHRoaXMuYnV0dG9uQy5ub2RlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzLmJ1dHRvbkQubm9kZSk7XG4gICAgICAgIHRoaXMuYW5pbUEucGxheSgpO1xuICAgICAgICB0aGlzLmFuaW1CLnBsYXkoKTtcbiAgICAgICAgdGhpcy5hbmltQy5wbGF5KCk7XG4gICAgICAgIHRoaXMuYW5pbUQucGxheSgpO1xuICAgIH0sXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcigpIHtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMuYnV0dG9uQS5ub2RlLCB0cnVlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMuYnV0dG9uQi5ub2RlLCB0cnVlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMuYnV0dG9uQy5ub2RlLCB0cnVlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMuYnV0dG9uRC5ub2RlLCB0cnVlKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soYnV0dG9uLCBudW1iZXJidXR0b24pIHtcbiAgICAgICAgdmFyIHBsYXlBdWRpb0ZzdCA9IGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5zdG9wQWxsKCk7XG4gICAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUJhY2tncm91bmRBZnRlckFuc3dlcigpO1xuICAgICAgICAgICAgQXVkaW9Db250cm9sbGVyLnBsYXlDbGlja1NvdW5kKCk7XG4gICAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUFuc3dlckNob29zZShudW1iZXJidXR0b24pO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdmFyIHBsYXlBdWRpb1dhaXQgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUF1ZGlvKCdhbnNfbm93MS5tcDMnLCBmYWxzZSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB2YXIgZGVsYXkgPSBjYy5kZWxheVRpbWUoMi4xKTtcbiAgICAgICAgdmFyIGZ1bmNGc3QgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLm51bUJ1dHRvbkNsaWNrZWQgPSBudW1iZXJidXR0b247XG4gICAgICAgICAgICB2YXIgYW5pbUJ1dHRvbiA9IGJ1dHRvbi5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIGFuaW1CdXR0b24ucGxheSgnYW5pbV9uaGFwbmhheV9jaG9vc2UnKTtcbiAgICAgICAgICAgIHRoaXMuaGVscHMuZG9EaXNhbGxvd0NsaWNrZWRBbGxIZWxwKCk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zdG9wR2FtZSgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdmFyIGZ1bmNMc3QgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZmluaXNoKCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKHBsYXlBdWRpb0ZzdCwgZnVuY0ZzdCwgZGVsYXksIHBsYXlBdWRpb1dhaXQsIGRlbGF5LCBmdW5jTHN0LCBjYy5kZWxheVRpbWUoMy40KSkpO1xuICAgIH0sXG5cbiAgICBnZXROdW1iZXJCdXR0b25DbGlja2VkOiBmdW5jdGlvbiBnZXROdW1iZXJCdXR0b25DbGlja2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5udW1CdXR0b25DbGlja2VkO1xuICAgIH0sXG4gICAgc2V0VHJ1ZVJlc3VsdDogZnVuY3Rpb24gc2V0VHJ1ZVJlc3VsdCgpIHtcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLnBsYXlBbnN3ZXIodGhpcy5udW1CdXR0b25DbGlja2VkLCB0cnVlKTtcbiAgICAgICAgdmFyIGFuaW0gPSB0aGlzLmdldEJ1dHRvbkFuaW1Gcm9tTnVtYmVyKHRoaXMubnVtQnV0dG9uQ2xpY2tlZCk7XG4gICAgICAgIGFuaW0uc3RvcCgnYW5pbV9uaGFwbmhheV9jaG9vc2UnKTtcbiAgICAgICAgYW5pbS5wbGF5KCdhbmltX25oYXBuaGF5X3RydWUnKTtcbiAgICAgICAgdGhpcy5udW1CdXR0b25DbGlja2VkID0gQW5zd2VyU3RhdGUuRU1QVFk7XG4gICAgfSxcbiAgICBzZXRGYWxzZVJlc3VsdDogZnVuY3Rpb24gc2V0RmFsc2VSZXN1bHQobnVtYmVyQW5zVHJ1ZSkge1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUFuc3dlcihudW1iZXJBbnNUcnVlLCBmYWxzZSk7XG4gICAgICAgIHZhciB1aWJ1dHRvblRydWUgPSB0aGlzLmdldEJ1dHRvbkFuaW1Gcm9tTnVtYmVyKG51bWJlckFuc1RydWUpO1xuICAgICAgICB2YXIgdWlidXR0b25GYWxzZSA9IHRoaXMuZ2V0QnV0dG9uQW5pbUZyb21OdW1iZXIodGhpcy5udW1CdXR0b25DbGlja2VkKTtcbiAgICAgICAgaWYgKHRoaXMubnVtQnV0dG9uQ2xpY2tlZCA9PT0gQW5zd2VyU3RhdGUuRU1QVFkpIHtcbiAgICAgICAgICAgIHVpYnV0dG9uVHJ1ZS5wbGF5KCdhbmltX25oYXBuaGF5X3RydWUnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVpYnV0dG9uRmFsc2Uuc3RvcCgnYW5pbV9uaGFwbmhheV9jaG9vc2UnKTtcbiAgICAgICAgICAgIHVpYnV0dG9uRmFsc2UucGxheSgnYW5pbV9uaGFwbmhheV9mYWxzZScpO1xuICAgICAgICAgICAgLy8gdGhpcy5zZXRGYWxzZUJ1dHRvbih1aWJ1dHRvbkZhbHNlKTtcbiAgICAgICAgICAgIHVpYnV0dG9uVHJ1ZS5wbGF5KCdhbmltX25oYXBuaGF5X3RydWUnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QnV0dG9uQW5pbUZyb21OdW1iZXI6IGZ1bmN0aW9uIGdldEJ1dHRvbkFuaW1Gcm9tTnVtYmVyKG51bWJlckJ1dHRvbikge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gY2MuQW5pbWF0aW9uO1xuICAgICAgICBzd2l0Y2ggKG51bWJlckJ1dHRvbikge1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQTpcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSB0aGlzLmFuaW1BO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQjpcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSB0aGlzLmFuaW1CO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQzpcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSB0aGlzLmFuaW1DO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfRDpcbiAgICAgICAgICAgICAgICBhbmltYXRpb24gPSB0aGlzLmFuaW1EO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmltYXRpb247XG4gICAgfSxcbiAgICBkZWFjdGl2ZUJ1dHRvbjUwNTA6IGZ1bmN0aW9uIGRlYWN0aXZlQnV0dG9uNTA1MChudW1iZXIpIHtcbiAgICAgICAgc3dpdGNoIChudW1iZXIpIHtcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0E6XG4gICAgICAgICAgICAgICAgdGhpcy5idXR0b25BLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFuc3dlclN0YXRlLkFOU1dFUl9COlxuICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uQi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQzpcbiAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbkMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0Q6XG4gICAgICAgICAgICAgICAgdGhpcy5idXR0b25ELm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEFuc3dlckJ1dHRvbkNvbnRyb2xsZXI6IEFuc3dlckJ1dHRvbkNvbnRyb2xsZXJcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2MjY5MGl1eVRGRndyZG5jenp1cFI3bCcsICdBcmNoaXZlbWVudFByZWZhYicpO1xuLy8gc2NyaXB0c1xcdWlcXEFyY2hpdmVtZW50UHJlZmFiLmpzXG5cbnZhciBBcmNoaXZlbWVudE5hbWUgPSBbeyBuYW1lOiAnYmFpIGtob25nIG5hbicsXG4gICAgZGVzOiAnTmjDoCBoaeG7gW4gdHJp4bq/dCdcbn0sIHsgbmFtZTogJ0LhuqFuIGzDoCB0cmnhu4d1IHBow7onLCBkZXM6IFwiVHLhuqMgbOG7nWkgxJHDum5nIGjhur90IDE1IGPDonUgaOG7j2kuIELhuqFuIGNow61uaCBsw6AgVHJp4buHdSBQaMO6IG3DoCBjaMO6bmcgdMO0aSB0w6xtIGtp4bq/bSBsw6J1IG5heS5cIlxufSwgeyBuYW1lOiAnYmF0IGtoYSBjaGllbiBiYWknLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAnQuG6r3Qgbmjhu4twIGNoaeG6v24gdGjhuq9uZycsIGRlczogXCJD4bqnbiA1IGNoaeG6v24gdGjhuq9uZyDEkeG7gyBt4bufIGRhbmggaGnhu4d1IG7DoHkuIFThuq1wIHRydW5nIHbDoCBi4bqhbiBz4bq9IGzDoG0gxJHGsOG7o2MuXCJcbn0sIHsgbmFtZTogJ0Lhu6l0IHThu5FjIHbGsOG7o3QgbMOqbicsIGRlczogXCJWxrDhu6N0IHF1YSBt4buRYyAxMCBjw6J1IGjhu49pIGPhu6dhIGNoxrDGoW5nIHRyw6xuaC4gQuG6oW4gYuG6r3Qgbmjhu4twIHLhuqV0IG5oYW5oLlwiXG59LCB7IG5hbWU6ICdDaOG6oW0gdGF5IGNoaeG6v24gdGjhuq9uZycsIGRlczogXCJE4burbmcgYsaw4bubYyBraGkgY2jhu4kgY8OybiBjw6FjaCBjaGnhur9uIHRo4bqvbmcgMSBjw6J1IHRo4bqtdCBraMO0bmcgdnVpIHbhursgZ8OsIG5oxrBuZyDEkcOieSBsw6AgY8OhY2ggZHV5IG5o4bqldCDEkeG7gyBuaOG6rW4gZGFuaCBoaeG7h3UgbsOgeS5cIlxufSwgeyBuYW1lOiAnQ2hp4bq/biB0aOG6r25nIG3hu58gaMOgbmcnLCBkZXM6IFwiTOG6p24gxJHhuqd1IHRpw6puIGx1w7RuIHRow7ogduG7iywgbmjhuqV0IGzDoCBraGkgY2hp4bq/biB0aOG6r25nLiBEYW5oIGhp4buHdSBuw6B5IMSR4buDIGdoaSBuaOG6rW4gY2hp4bq/biB0aOG6r25nIMSR4bqndSB0acOqbiBj4bunYSBi4bqhbi5cIlxufSwgeyBuYW1lOiAnZGFpIGtpZW4gdHVvbmcnLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAnZG9jIGNvIGNhdSBiYWknLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAnZXZlcmVzdCcsIGRlczogJ05ow6AgaGnhu4FuIHRyaeG6v3QnXG59LCB7IG5hbWU6ICdmYW5zaXBhbicsIGRlczogJ05ow6AgaGnhu4FuIHRyaeG6v3QnXG59LCB7IG5hbWU6ICdoYXQgdHJpY2snLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAnaHV5ZW4gdGhvYWknLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAna2VvIG5nb3QnLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAnS2jhu59pIMSR4bqndSBt4bqhbmggbeG6vScsIGRlczogXCJWxrDhu6N0IHF1YSBt4buRYyA1IGPDonUgaOG7j2kgY+G7p2EgY2jGsMahbmcgdHLDrG5oLiBOZ2hlIHbhuq15IGNo4bupIGtow7RuZyBk4buFIMSRw6J1LlwiXG59LCB7IG5hbWU6ICdraG9pIGRvbmcgdGhhbmggY29uZycsIGRlczogJ05ow6AgaGnhu4FuIHRyaeG6v3QnXG59LCB7IG5hbWU6ICdraG8gYmF1IGtpZW4gdGh1YycsIGRlczogJ05ow6AgaGnhu4FuIHRyaeG6v3QnXG59LCB7IG5hbWU6ICdraWVuIHR1b25nJywgZGVzOiAnTmjDoCBoaeG7gW4gdHJp4bq/dCdcbn0sIHsgbmFtZTogJ2t5IHBodW5nIGRpY2ggdGh1JywgZGVzOiAnTmjDoCBoaeG7gW4gdHJp4bq/dCdcbn0sIHsgbmFtZTogJ05ow6AgaGnhu4FuIHRyaeG6v3QnLCBkZXM6IFwiTmfGsOG7nWkgY8OzIGjhu41jIHbhuqVuLCBjw7MgaGnhu4N1IGJp4bq/dCBzw6J1IHLhu5luZywgxJHGsOG7o2MgbmfGsOG7nWkgxJHhu51pIHTDtG4gc8O5bmcuXCJcbn0sIHsgbmFtZTogJ29seW1wdXMnLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAnVGjhuqduIHLDuWEnLCBkZXM6IFwiUsO5YSBraOG7n2kgxJHhuqd1IGNo4bqtbSBuaMawbmcgcXVhbiB0cuG7jW5nIGzDoCB24bqrbiBnacOgbmggxJHGsOG7o2MgY2hp4bq/biB0aOG6r25nIHbhu5tpIDEgY8OidSB0cuG6oyBs4budaSDEkcO6bmcuXCJcbn0sIHsgbmFtZTogJ3RoYW4gdG9jIHRhbyBiYW8nLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAndGhhcCB0b2FuIHRoYXAgbXknLCBkZXM6ICdOaMOgIGhp4buBbiB0cmnhur90J1xufSwgeyBuYW1lOiAndGhvIHNhbiBjaGllbiB0aGFuZycsIGRlczogJ05ow6AgaGnhu4FuIHRyaeG6v3QnXG59LCB7IG5hbWU6ICd2dWEgY2FtIGhvYScsIGRlczogJ05ow6AgaGnhu4FuIHRyaeG6v3QnXG59LCB7IG5hbWU6ICdZw6p1IGjDsmEgYsOsbmgnLCBkZXM6IFwiSMOyYSAyMCB0cuG6rW4gdGjDoWNoIMSR4bqldS4gQuG6oW4gY8OzIHRo4buDIG1hbmcgbOG6oWkgaMOyYSBiw6xuaCBjaG8gdGjhur8gZ2nhu5tpLlwiXG59XTtcbnZhciBTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlJyk7XG52YXIgQXJjaGl2ZW1lbnRLZXkgPSBbJ0JBSUtIT05HTkFOJywgJ0JBTkxBVFJJRVVQSFUnLCAnQkFUS0hBQ0hJRU5CQUknLCAnQkFUTkhJUENISUVOVEhBTkcnLCAnQlVDVE9DVlVPVExFTicsICdDSEFNVEFZQ0hJRU5USEFORycsICdDSElFTlRIQU5HTU9IQU5HJywgJ0RBSUtJRU5UVU9ORycsICdET0NDT0NBVUJBSScsICdFVkVSRVNUJywgJ0ZBTlNJUEFOJywgJ0hBVFRSSUNLJywgJ0hVWUVOVEhPQUknLCAnSVRFTURFRkFVTFQnLCAnS0VPTkdPVCcsICdLSE9JREFVTUFOSE1FJywgJ0tIT0lET05HVEhBTkhDT05HJywgJ0tIT0JBVUtJRU5USFVDJywgJ0tJRU5UVU9ORycsICdLWVBIVU5HRElDSFRIVScsICdOSEFISUVOVFJJRVQnLCAnT0xZTVBVUycsICdUSEFOUlVBJywgJ1RIQU5UT0NUQU9CQU8nLCAnVEhBUFRPQU5USEFQTVknLCAnVEhPU0FOQ0hJRU5USEFORycsICdWVUFDQU1IT0EnLCAnWUVVSE9BQklOSCddO1xudmFyIEFyY2hpdmVtZW50TnVtYmVyID0gY2MuRW51bSh7XG4gICAgQkFJS0hPTkdOQU46IDAsXG4gICAgQkFOTEFUUklFVVBIVTogMSxcbiAgICBCQVRLSEFDSElFTkJBSTogMixcbiAgICBCQVROSElQQ0hJRU5USEFORzogMyxcbiAgICBCVUNUT0NWVU9UTEVOOiA0LFxuICAgIENIQU1UQVlDSElFTlRIQU5HOiA1LFxuICAgIENISUVOVEhBTkdNT0hBTkc6IDYsXG4gICAgREFJS0lFTlRVT05HOiA3LFxuICAgIERPQ0NPQ0FVQkFJOiA4LFxuICAgIEVWRVJFU1Q6IDksXG4gICAgRkFOU0lQQU46IDEwLFxuICAgIEhBVFRSSUNLOiAxMSxcbiAgICBIVVlFTlRIT0FJOiAxMixcbiAgICBLRU9OR09UOiAxMyxcbiAgICBLSE9JREFVTUFOSE1FOiAxNCxcbiAgICBLSE9JRE9OR1RIQU5IQ09ORzogMTUsXG4gICAgS0hPQkFVS0lFTlRIVUM6IDE2LFxuICAgIEtJRU5UVU9ORzogMTcsXG4gICAgS1lQSFVOR0RJQ0hUSFU6IDE4LFxuICAgIE5IQUhJRU5UUklFVDogMTksXG4gICAgT0xZTVBVUzogMjAsXG4gICAgVEhBTlJVQTogMjEsXG4gICAgVEhBTlRPQ1RBT0JBTzogMjIsXG4gICAgVEhBUFRPQU5USEFQTVk6IDIzLFxuICAgIFRIT1NBTkNISUVOVEhBTkc6IDI0LFxuICAgIFZVQUNBTUhPQTogMjUsXG4gICAgWUVVSE9BQklOSDogMjYsXG4gICAgREVGQVVMVDogMjdcbn0pO1xuLy9yZXNvdXJjZXMvdGV4dHVyZXMvYXJjaGl2ZW1lbnQvXG52YXIgQXJjaGl2ZW1lbnRQYXRoID0gWydhdHBfX2FjaGlldmVtZW50X2JhaV9raG9uZ19uYW4ucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfYmFuX2xhX3RyaWV1X3BodS5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9iYXRfa2hhX2NoaWVuX2JhaS5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9iYXRfbmhpcF9jaGllbl90aGFuZy5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9idWNfdG9jX3Z1b3RfbGVuLnBuZycsICdhdHBfX2FjaGlldmVtZW50X2NoYW1fdGF5X2NoaWVuX3RoYW5nLnBuZycsICdhdHBfX2FjaGlldmVtZW50X2NoaWVuX3RoYW5nX21vX2hhbmcucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfZGFpX2tpZW5fdHVvbmcucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfZG9jX2NvX2NhdV9iYWkucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfZXZlcmVzdC5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9mYW5zaXBhbi5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9oYXRfdHJpY2sucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfaHV5ZW5fdGhvYWkucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfa2VvX25nb3QucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfa2hvaV9kYXVfbWFuaF9tZS5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9raG9pX2RvbmdfdGhhbmhfY29uZy5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9raG9fYmF1X2tpZW5fdGh1Yy5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9raWVuX3R1b25nLnBuZycsICdhdHBfX2FjaGlldmVtZW50X2t5X3BodW5nX2RpY2hfdGh1LnBuZycsICdhdHBfX2FjaGlldmVtZW50X25oYV9oaWVuX3RyaWV0LnBuZycsICdhdHBfX2FjaGlldmVtZW50X29seW1wdXMucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfdGhhbl9ydWEucG5nJywgJ2F0cF9fYWNoaWV2ZW1lbnRfdGhhbl90b2NfdGFvX2Jhby5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF90aGFwX3RvYW5fdGhhcF9teS5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF90aG9fc2FuX2NoaWVuX3RoYW5nLnBuZycsICdhdHBfX2FjaGlldmVtZW50X3Z1YV9jYW1faG9hLnBuZycsICdhdHBfX2FjaGlldmVtZW50X3lldV9ob2FfYmluaC5wbmcnLCAnYXRwX19hY2hpZXZlbWVudF9pdGVtX2RlZmF1bHQucG5nJ107XG5cbnZhciBBcmNoaXZlbWVudE1heCA9IHtcbiAgICBCQUlLSE9OR05BTjogMTAsIC8vdGh1YSAxMGzhuqduIDxt4buRYyA1XG4gICAgQkFOTEFUUklFVVBIVTogMSwgLy8gxJHhuqF0IMSRYyB0cmnhu4d1IHBow7pcbiAgICBCQVRLSEFDSElFTkJBSTogMTAsIC8vMTAgbOG6p24gbGnDqm4gdGnhur9wIHRy4bqjIGzhu51pIMSRYyA+PSBt4buRYyAxMFxuICAgIEJBVE5ISVBDSElFTlRIQU5HOiAxMCwgLy8gMTAgbOG6p24gdHLhuqMgbOG7nWkgPj1t4buRYyAxMCAoayBj4bqnbiBsacOqbiB0aeG6v3ApXG4gICAgQlVDVE9DVlVPVExFTjogdHJ1ZSwgLy8gY8OidSBo4buPaSBtaW4gLCBu4bq/dSDEkeG6oXQga2hv4bqjbmcgY8OhY2ggNSBjw6J1IGjhu49pIG5nYXkgc2F1IGzhuqduIGNoxqFpIG1pblxuICAgIENIQU1UQVlDSElFTlRIQU5HOiB0cnVlLCAvLyB0aHVhIGhv4bq3YyBk4burbmcgbOG6oWkg4bufIGPDonUgaOG7j2kgc+G7kSAxNSAoayB0cuG6oyBs4buraSDEkWMpXG4gICAgQ0hJRU5USEFOR01PSEFORzogdHJ1ZSwgLy8gdsaw4bujdCBxdWEgbeG7kWMgMTAgbOG6p24gxJHhuqd1IHRpw6puXG4gICAgREFJS0lFTlRVT05HOiA1LCAvLzUgbOG6p24gbMOgIHRyaeG7h3UgcGjDulxuICAgIERPQ0NPQ0FVQkFJOiAxMCwgLy8gMTAgbOG6p24gdHJp4buHdSBwaMO6XG4gICAgRVZFUkVTVDogMTUsIC8vIGPDonUgaOG7j2kgY2FvIG5o4bqldCB04burbmcgdHLhuqMgbOG7nWkgxJFjLCB04burIDEtPjE1XG4gICAgRkFOU0lQQU46IDgsIC8vIGPDonUgaOG7j2kgY2FvIG5ow6J0IHThu6tuZyDEkeG6oXQgxJHGsOG7o2MsIDEtPjhcbiAgICBIQVRUUklDSzogMywgLy8zIGzhuqduIGxpw6puIHRp4bq/cCDEkeG6oXQgbeG7kWMgPj0xMFxuICAgIEhVWUVOVEhPQUk6IDUwLCAvLzUwIGzhuqduIMSR4bqhdCBt4buRYyA+PTEyXG4gICAgS0VPTkdPVDogMjAsIC8vIDIwIGzhuqduIGvhur90IHRow7pjIOG7nyBt4buRYyA+PTUgdsOgIG3hu5FjIDwxMFxuICAgIEtIT0lEQVVNQU5ITUU6IHRydWUsIC8vIGzhuqduIMSR4bqndSDEkeG6oXQgxJHhur9uIG3hu5FjID49NVxuICAgIEtIT0lET05HVEhBTkhDT05HOiB0cnVlLCAvL2zhuqduIMSR4bqndSDEkeG6oXQgxJHhur9uIG3hu5FjID49MTBcbiAgICBLSE9CQVVLSUVOVEhVQzogMTUsIC8vMTUgbOG6p24gxJHhuqF0ID49OFxuICAgIEtJRU5UVU9ORzogMjAsIC8vMjAgbOG6p24gxJHhuqF0IG3hu5FjID49MTBcbiAgICBLWVBIVU5HRElDSFRIVTogMTAsIC8vdGjDoWNoIMSR4bqldTogaMOyYSBob+G6t2MgdGjhuq9uZyAyMFxuICAgIE5IQUhJRU5UUklFVDogMzAsIC8vIDMwIGzhuqduIMSR4bqhdCBt4buRYyA+PTEwXG4gICAgT0xZTVBVUzogMTAsIC8vY8OidSBo4buPaSBjYW8gbmjDonQgdOG7q25nIMSR4bqhdCDEkcaw4bujYywgMS0+MTBcbiAgICBUSEFOUlVBOiAyMCwgLy8gMjAgbOG6p24gdGh1YSA8beG7kWMgNVxuICAgIFRIQU5UT0NUQU9CQU86IDIwLCAvLyAyMCBs4bqnbiB0cuG6oyBs4budaSA+PW3hu5FjIDUgdsOgIDw9beG7kWMgMTBcbiAgICBUSEFQVE9BTlRIQVBNWTogMTAsIC8vIDEwIGzhuqduIGsgdHLhuqMgbOG7nWkgxJFjIGhv4bq3YyBk4burbmcgbOG6oWkg4bufIGPDonUgaOG7j2kgc+G7kSAxMVxuICAgIFRIT1NBTkNISUVOVEhBTkc6IDMwLCAvLyAzMCBs4bqnbiA+PSBt4buRYyAxMFxuICAgIFZVQUNBTUhPQTogMTAsIC8vIHRow6FjaCDEkeG6pXU6IGjDsmEgMTAgbOG6p25cbiAgICBZRVVIT0FCSU5IOiAyMCAvLyB0aMOhY2ggxJHhuqV1LCBow7JhIDIwIGzhuqduXG59O1xudmFyIGxzID0gY2Muc3lzLmxvY2FsU3RvcmFnZTtcbnZhciBQX1BBVEggPSAncmVzb3VyY2VzL3RleHR1cmVzL2FyY2hpdmVtZW50Lyc7XG52YXIgQXJjaGl2ZW1lbnRQcmVmYWIgPSBjYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGFyY2hpdmVJY29uOiBjYy5TcHJpdGUsXG4gICAgICAgIGxiTmFtZTogY2MuTGFiZWwsXG4gICAgICAgIHByb2dyZXNzOiBjYy5Qcm9ncmVzc0JhcixcbiAgICAgICAgZGlhbG9nOiBjYy5QcmVmYWJcbiAgICB9LFxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChudW1iZXIsIHByb3BlcnRpZXMsIGRhdGEpIHtcbiAgICAgICAgdmFyIHN0ciA9IEFyY2hpdmVtZW50TmFtZVtudW1iZXJdLm5hbWU7XG4gICAgICAgIGlmIChzdHIubGVuZ3RoID4gMTUpIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgMTUpICsgXCIuLi5cIjtcbiAgICAgICAgdGhpcy5sYk5hbWUuc3RyaW5nID0gc3RyO1xuICAgICAgICBpZiAoZGF0YSA9PT0gdHJ1ZSB8fCBkYXRhID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKGRhdGEgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVNwcml0ZShudW1iZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVNwcml0ZSgyNyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcy5wcm9ncmVzcyA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBkYXRhIC8gQXJjaGl2ZW1lbnRNYXhbcHJvcGVydGllc107XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVNwcml0ZShudW1iZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzLnByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VTcHJpdGUoMjcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmKHR5cGU9PT1mYWxzZSl7IC8vZGVmYXVsdFxuICAgICAgICAvLyAgICAgdGhpcy5jaGFuZ2VTcHJpdGUoMjcpO1xuICAgICAgICAvLyB9ZWxzZXsvLyB3aGF0IHR5cGUsIHdoYXQgbnVtYmVyXG4gICAgICAgIC8vICAgICB0aGlzLmNoYW5nZVNwcml0ZShudW1iZXIpO1xuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBjaGFuZ2VTcHJpdGU6IGZ1bmN0aW9uIGNoYW5nZVNwcml0ZShudW1iZXIpIHtcbiAgICAgICAgdmFyIHBhdGggPSBQX1BBVEggKyBBcmNoaXZlbWVudFBhdGhbbnVtYmVyXTtcbiAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcocGF0aCk7XG4gICAgICAgIHZhciB0ZXh0dXJlID0gY2MudGV4dHVyZUNhY2hlLmFkZEltYWdlKHVybCk7XG4gICAgICAgIHZhciByZWN0ID0gdGhpcy5hcmNoaXZlSWNvbi5zcHJpdGVGcmFtZS5nZXRSZWN0KCk7XG4gICAgICAgIGlmIChjYy5zeXMuaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuYXJjaGl2ZUljb24uc3ByaXRlRnJhbWUgPSBjYy5TcHJpdGVGcmFtZSh0ZXh0dXJlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXJjaGl2ZUljb24uc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4dHVyZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy5hcmNoaXZlSWNvbi5zcHJpdGVGcmFtZT0gbmV3IGNjLlNwcml0ZUZyYW1lKHRleHR1cmUscmVjdCk7XG4gICAgICAgIC8vIHRoaXMuYXJjaGl2ZUljb24uc3ByaXRlRnJhbWUuc2V0VGV4dHVyZSh0ZXh0dXJlKTtcbiAgICB9XG5cbiAgICAvKlxyXG4gICAgXHJcbiAgICBpdGVtOiBOVU1CRVIsTkFNRSxQQVRILENPVU5ULE1BWFxyXG4gICAgKi9cblxufSk7XG4vL2xvYWQganNvbiDEkeG7kWkgdMaw4bujbmcgbMawdSB0cuG7ryBj4bunYSBhcmNoaXZlbWVudFxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQXJjaGl2ZW1lbnROdW1iZXI6IEFyY2hpdmVtZW50TnVtYmVyLFxuICAgIEFyY2hpdmVtZW50S2V5OiBBcmNoaXZlbWVudEtleSxcbiAgICBBcmNoaXZlbWVudE5hbWU6IEFyY2hpdmVtZW50TmFtZSxcbiAgICBBcmNoaXZlbWVudFBhdGg6IEFyY2hpdmVtZW50UGF0aCxcbiAgICBBcmNoaXZlbWVudFByZWZhYjogQXJjaGl2ZW1lbnRQcmVmYWIsXG4gICAgQXJjaGl2ZW1lbnRNYXg6IEFyY2hpdmVtZW50TWF4XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnODkzYzFRRHRZUkFZSkNFempzSGpITnknLCAnQXJjaGl2ZW1lbnQnKTtcbi8vIHNjcmlwdHNcXEFyY2hpdmVtZW50LmpzXG5cbnZhciBBcmNoaXZlbWVudFByZWZhYiA9IHJlcXVpcmUoJ0FyY2hpdmVtZW50UHJlZmFiJyk7XG52YXIgQXJLZXkgPSBBcmNoaXZlbWVudFByZWZhYi5BcmNoaXZlbWVudEtleTtcbnZhciBBck51bSA9IEFyY2hpdmVtZW50UHJlZmFiLkFyY2hpdmVtZW50TnVtYmVyO1xudmFyIEFyTmFtZSA9IEFyY2hpdmVtZW50UHJlZmFiLkFyY2hpdmVtZW50TmFtZTtcbnZhciBBck1heCA9IEFyY2hpdmVtZW50UHJlZmFiLkFyY2hpdmVtZW50TWF4O1xudmFyIGxzID0gY2Muc3lzLmxvY2FsU3RvcmFnZTtcbnZhciBTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlJyk7XG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGNvbnRlbnROb2RlOiBjYy5TY3JvbGxWaWV3LFxuICAgICAgICBpdGVtUHJlZmFiOiBjYy5QcmVmYWIsXG4gICAgICAgIGRpYWxvZzogY2MuUHJlZmFiXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgd2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICAgICAgdmFyIGRlc2lnblNpemUgPSBjYy52aWV3LmdldEZyYW1lU2l6ZSgpO1xuICAgICAgICBpZiAoY2Muc3lzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICBjYy52aWV3LnNldERlc2lnblJlc29sdXRpb25TaXplKHdpblNpemUud2lkdGgsIHdpblNpemUuaGVpZ2h0LCBjYy5SZXNvbHV0aW9uUG9saWN5LlNIT1dfQUxMKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlib2FyZExpc3Rlbm5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmJhY2sgfHwga2V5Q29kZSA9PT0gY2MuS0VZLmJhY2tzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0hvbWVTY2VuZV9Mb2dpbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmhvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGtleWJvYXJkTGlzdGVubmVyLCB0aGlzKTtcbiAgICAgICAgaWYgKGxzLmdldEl0ZW0oU3RhdGUuQVJDSElWRU1FTlRfS0VZKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5pbml0Zmlyc3QoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSB0aGlzLmNvbnRlbnROb2RlLmNvbnRlbnQ7XG4gICAgICAgIHRoaXMuaW5pdGZpcnN0KCk7XG4gICAgICAgIHZhciBhcnIgPSBKU09OLnBhcnNlKGxzLmdldEl0ZW0oU3RhdGUuQVJDSElWRU1FTlRfS0VZKSk7XG4gICAgICAgIGNjLmxvZyhhcnIpO1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNzsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEFyS2V5W2ldO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBhcnJbcHJvcGVydGllc107XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuaXRlbVByZWZhYik7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50ID0gaXRlbS5nZXRDb21wb25lbnQoJ0FyY2hpdmVtZW50UHJlZmFiJyk7XG4gICAgICAgICAgICBjb21wb25lbnQuaW5pdChpLCBwcm9wZXJ0aWVzLCBkYXRhKTtcbiAgICAgICAgICAgIC8vIGFkZCBvdGhlciBjb2RlXG5cbiAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbSk7XG4gICAgICAgICAgICBjb250ZW50LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG93RGlhbG9nOiBmdW5jdGlvbiBzaG93RGlhbG9nKHRpdGxlLCBjb250ZW50KSB7XG4gICAgICAgIGNjLmxvZyhkYXRhKTtcbiAgICB9LFxuICAgIG9uY2xpY2tCYWNrOiBmdW5jdGlvbiBvbmNsaWNrQmFjaygpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdIb21lU2NlbmVfTG9naW4nKTtcbiAgICB9LFxuXG4gICAgLy8gICAgLHVwZGF0ZVN0YXRlOmZ1bmN0aW9uKHJlYWxMZXZlbCl7XG4gICAgLy8gICAgICAgIHZhciBvYmpBcnI9bHMuZ2V0SXRlbShTdGF0ZS5BUkNISVZFTUVOVF9LRVkpO1xuICAgIC8vICAgICAgICAgaWYobHMuZ2V0SXRlbShTdGF0ZS5BUkNISVZFTUVOVF9LRVkpIT09bnVsbCl7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5pbml0Zmlyc3QoKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgdmFyIGFycj1KU09OLnBhcnNlKG9iakFycik7XG4gICAgLy8gICAgICAgIGlmKHJlYWxMZXZlbDw1KXtcbiAgICAvLyAgICAgICAgICAgIGFyci5CQUlLSE9OR05BTj0gYXJyLkJBSUtIT05HTkFOPj1Bck1heC5CQUlLSE9OR05BTj9Bck1heC5CQUlLSE9OR05BTjphcnIuQkFJS0hPTkdOQU4rKztcbiAgICAvLyAgICAgICAgICAgIGFyci5CVUNUT0NWVU9UTEVOPSBhcnIuQlVDVE9DVlVPVExFTj49QXJNYXguQlVDVE9DVlVPVExFTj9Bck1heC5CVUNUT0NWVU9UTEVOOmFyci5CVUNUT0NWVU9UTEVOO1xuICAgIC8vICAgICAgICAgICAgYXJyLlRIQU5SVUE9IGFyci5USEFOUlVBPj1Bck1heC5USEFOUlVBP0FyTWF4LlRIQU5SVUE6YXJyLlRIQU5SVUErKztcbiAgICAvLyAgICAgICAgICAgIGFyci5FVkVSRVNUPSBhcnIuRVZFUkVTVD49QXJNYXguRVZFUkVTVD9hcnIuRVZFUkVTVDpBck1heC5FVkVSRVNUO1xuICAgIC8vICAgICAgICAgICAgYXJyLk9MWU1QVVM9IGFyci5PTFlNUFVTPj1Bck1heC5PTFlNUFVTP2Fyci5PTFlNUFVTOkFyTWF4Lk9MWU1QVVM7XG4gICAgLy8gICAgICAgICAgICBhcnIuRkFOU0lQQU49IGFyci5GQU5TSVBBTj49QXJNYXguRkFOU0lQQU4/YXJyLkZBTlNJUEFOOkFyTWF4LkZBTlNJUEFOO1xuICAgIC8vICAgICAgICB9XG4gICAgLy8gICAgICAgIGlmKHJlYWxMZXZlbD09PTE1KXtcbiAgICAvLyAgICAgICAgICAgIGFyci5FVkVSRVNUPTE1O1xuICAgIC8vICAgICAgICAgICAgYXJyLkJBTkxBVFJJRVVQSFU9MTtcbiAgICAvLyAgICAgICAgICAgIGFyci5EQUlLSUVOVFVPTkc9YXJyLkRBSUtJRU5UVU9ORysrO1xuICAgIC8vICAgICAgICAgICAgYXJyLkJBVEtIQUNISUVOQkFJPWFyci5CQVRLSEFDSElFTkJBSSsrO1xuICAgIC8vICAgICAgICAgICAgYXJyLkJBVE5ISVBDSElFTlRIQU5HPWFyci5CQVROSElQQ0hJRU5USEFORysrO1xuICAgIC8vICAgICAgICAgICAgYXJyLktIT0lEQVVNQU5ITUU9dHJ1ZTtcbiAgICAvLyAgICAgICAgfSAgIFxuICAgIC8vICAgICAgICB0aGlzLnNhdmVBcmNoaXZlbWVudChhcnIpO1xuICAgIC8vICAgIH1cblxuICAgIHNhdmVBcmNoaXZlbWVudDogZnVuY3Rpb24gc2F2ZUFyY2hpdmVtZW50KGFycikge1xuICAgICAgICBscy5zZXRJdGVtKFN0YXRlLkFyY2hpdmVtZW50S2V5LCBhcnIpO1xuICAgICAgICBjYy5sb2coXCJzYXZlIGNvbXBsZXRlXCIpO1xuICAgIH0sXG5cbiAgICBnZXRBcmNoaXZlbWVudDogZnVuY3Rpb24gZ2V0QXJjaGl2ZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxzLmdldEl0ZW0oU3RhdGUuQVJDSElWRU1FTlRfS0VZKSk7XG4gICAgfSxcblxuICAgIC8vXG4gICAgaW5pdGZpcnN0OiBmdW5jdGlvbiBpbml0Zmlyc3QoKSB7XG4gICAgICAgIGlmIChKU09OLnBhcnNlKGxzLmdldEl0ZW0oU3RhdGUuQVJDSElWRU1FTlRfS0VZKSkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBBclN0YXRlID0ge1xuICAgICAgICAgICAgICAgIEJBSUtIT05HTkFOOiAwLCAvL3RodWEgMTBs4bqnbiA8beG7kWMgNVxuICAgICAgICAgICAgICAgIEJBTkxBVFJJRVVQSFU6IDAsIC8vIMSR4bqhdCDEkWMgdHJp4buHdSBwaMO6XG4gICAgICAgICAgICAgICAgQkFUS0hBQ0hJRU5CQUk6IDAsIC8vMTAgbOG6p24gbGnDqm4gdGnhur9wIHRy4bqjIGzhu51pIMSRYyA+PSBt4buRYyAxMFxuICAgICAgICAgICAgICAgIEJBVE5ISVBDSElFTlRIQU5HOiAwLCAvLyAxMCBs4bqnbiB0cuG6oyBs4budaSA+PW3hu5FjIDEwIChrIGPhuqduIGxpw6puIHRp4bq/cClcbiAgICAgICAgICAgICAgICBCVUNUT0NWVU9UTEVOOiBmYWxzZSwgLy8gY8OidSBo4buPaSBtaW4gLCBu4bq/dSDEkeG6oXQga2hv4bqjbmcgY8OhY2ggNyBjw6J1IGjhu49pIG5nYXkgc2F1IGzhuqduIGNoxqFpIG1pblxuICAgICAgICAgICAgICAgIENIQU1UQVlDSElFTlRIQU5HOiBmYWxzZSwgLy8gdGh1YSBob+G6t2MgZOG7q25nIGzhuqFpIOG7nyBjw6J1IGjhu49pIHPhu5EgMTUgKGsgdHLhuqMgbOG7q2kgxJFjKVxuICAgICAgICAgICAgICAgIENISUVOVEhBTkdNT0hBTkc6IGZhbHNlLCAvLyB2xrDhu6N0IHF1YSBt4buRYyAxMCBs4bqnbiDEkeG6p3UgdGnDqm5cbiAgICAgICAgICAgICAgICBEQUlLSUVOVFVPTkc6IDAsIC8vNSBs4bqnbiBsw6AgdHJp4buHdSBwaMO6XG4gICAgICAgICAgICAgICAgRE9DQ09DQVVCQUk6IDAsIC8vIDEwIGzhuqduIHRyaeG7h3UgcGjDulxuICAgICAgICAgICAgICAgIEVWRVJFU1Q6IDAsIC8vIGPDonUgaOG7j2kgY2FvIG5o4bqldCB04burbmcgdHLhuqMgbOG7nWkgxJFjLCB04burIDEtPjE1XG4gICAgICAgICAgICAgICAgRkFOU0lQQU46IDAsIC8vIGPDonUgaOG7j2kgY2FvIG5ow6J0IHThu6tuZyDEkeG6oXQgxJHGsOG7o2MsIDEtPjhcbiAgICAgICAgICAgICAgICBIQVRUUklDSzogMCwgLy8zIGzhuqduIGxpw6puIHRp4bq/cCDEkeG6oXQgbeG7kWMgPj0xMFxuICAgICAgICAgICAgICAgIEhVWUVOVEhPQUk6IDAsIC8vNTAgbOG6p24gxJHhuqF0IG3hu5FjID49MTJcbiAgICAgICAgICAgICAgICBLRU9OR09UOiAwLCAvLyAyMCBs4bqnbiBr4bq/dCB0aMO6YyDhu58gbeG7kWMgPj01IHbDoCBt4buRYyA8MTBcbiAgICAgICAgICAgICAgICBLSE9JREFVTUFOSE1FOiBmYWxzZSwgLy8gbOG6p24gxJHhuqd1IMSR4bqhdCDEkeG6v24gbeG7kWMgPj01XG4gICAgICAgICAgICAgICAgS0hPSURPTkdUSEFOSENPTkc6IGZhbHNlLCAvL2zhuqduIMSR4bqndSDEkeG6oXQgxJHhur9uIG3hu5FjID49MTBcbiAgICAgICAgICAgICAgICBLSE9CQVVLSUVOVEhVQzogMCwgLy8xNSBs4bqnbiDEkeG6oXQgPj04XG4gICAgICAgICAgICAgICAgS0lFTlRVT05HOiAwLCAvLzIwIGzhuqduIMSR4bqhdCBt4buRYyA+PTEwXG4gICAgICAgICAgICAgICAgS1lQSFVOR0RJQ0hUSFU6IDAsIC8vdGjDoWNoIMSR4bqldTogaMOyYSBob+G6t2MgdGjhuq9uZyAyMFxuICAgICAgICAgICAgICAgIE5IQUhJRU5UUklFVDogMCwgLy8gMzAgbOG6p24gxJHhuqF0IG3hu5FjID49MTBcbiAgICAgICAgICAgICAgICBPTFlNUFVTOiAwLCAvL2PDonUgaOG7j2kgY2FvIG5ow6J0IHThu6tuZyDEkeG6oXQgxJHGsOG7o2MsIDEtPjEwXG4gICAgICAgICAgICAgICAgVEhBTlJVQTogMCwgLy8gMjAgbOG6p24gdGh1YSA8beG7kWMgNVxuICAgICAgICAgICAgICAgIFRIQU5UT0NUQU9CQU86IDAsIC8vIDIwIGzhuqduIHRy4bqjIGzhu51pID49beG7kWMgNSB2w6AgPD1t4buRYyAxMFxuICAgICAgICAgICAgICAgIFRIQVBUT0FOVEhBUE1ZOiAwLCAvLyAxMCBs4bqnbiBrIHRy4bqjIGzhu51pIMSRYyBob+G6t2MgZOG7q25nIGzhuqFpIOG7nyBjw6J1IGjhu49pIHPhu5EgMTFcbiAgICAgICAgICAgICAgICBUSE9TQU5DSElFTlRIQU5HOiAwLCAvLyAzMCBs4bqnbiA+PSBt4buRYyAxMFxuICAgICAgICAgICAgICAgIFZVQUNBTUhPQTogMCwgLy8gdGjDoWNoIMSR4bqldTogaMOyYSAxMCBs4bqnblxuICAgICAgICAgICAgICAgIFlFVUhPQUJJTkg6IDAgLy8gdGjDoWNoIMSR4bqldSwgaMOyYSAyMCBs4bqnblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbHMuc2V0SXRlbShTdGF0ZS5BUkNISVZFTUVOVF9LRVksIEpTT04uc3RyaW5naWZ5KEFyU3RhdGUpKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzFkNTdYMVR6dElOcTVSMENkcDFva0EnLCAnQXVkaW9Db250cm9sbGVyJyk7XG4vLyBzY3JpcHRzXFxtb2R1bGVzXFxBdWRpb0NvbnRyb2xsZXIuanNcblxudmFyIGxvY2Fsc3QgPSBjYy5zeXMubG9jYWxTdG9yYWdlO1xudmFyIFN0YXRlID0gcmVxdWlyZSgnU3RhdGUnKTtcbnZhciBHYW1lU1RBVEUgPSBTdGF0ZS5HYW1lU3RhdGU7XG52YXIgSGVscFN0YXRlID0gU3RhdGUuSGVscFN0YXRlO1xudmFyIEFuc3dlclN0YXRlID0gU3RhdGUuQW5zd2VyU3RhdGU7XG5cbnZhciBBdWRpb0NvbnRyb2xsZXIgPSB7XG4gICAgc2V0U291bmRNb2RlOiBmdW5jdGlvbiBzZXRTb3VuZE1vZGUoc291bmRNb2RlKSB7XG4gICAgICAgIC8vc291bmRNb2RlID0gdHJ1ZS9mYWxzZVxuICAgICAgICBsb2NhbHN0LnNldEl0ZW0oR2FtZVNUQVRFLlNPVU5EX01PREUsIHNvdW5kTW9kZSk7XG4gICAgfSxcbiAgICBzZXRNdXNpY01vZGU6IGZ1bmN0aW9uIHNldE11c2ljTW9kZShtdXNpY01vZGUpIHtcbiAgICAgICAgbG9jYWxzdC5zZXRJdGVtKEdhbWVTVEFURS5NVVNJQ19NT0RFLCBtdXNpY01vZGUpO1xuICAgIH0sXG4gICAgZ2V0U291bmRNb2RlOiBmdW5jdGlvbiBnZXRTb3VuZE1vZGUoKSB7XG4gICAgICAgIHZhciBtb2RlID0gbG9jYWxzdC5nZXRJdGVtKEdhbWVTVEFURS5TT1VORF9NT0RFKTtcbiAgICAgICAgaWYgKEJvb2xlYW4obW9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RlID09PSBcInRydWVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRNdXNpY01vZGU6IGZ1bmN0aW9uIGdldE11c2ljTW9kZSgpIHtcbiAgICAgICAgdmFyIG1vZGUgPSBsb2NhbHN0LmdldEl0ZW0oR2FtZVNUQVRFLk1VU0lDX01PREUpO1xuICAgICAgICBpZiAoQm9vbGVhbihtb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZGUgPT09IFwidHJ1ZVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHBsYXlBdWRpbzogZnVuY3Rpb24gcGxheUF1ZGlvKG5hbWUsIGxvb3ApIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5nZXRTb3VuZE1vZGUoKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcoUF9QQVRIICsgbmFtZSk7XG4gICAgICAgICAgICBhdWRpb0lEID0gY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh1cmwsIGxvb3ApO1xuICAgICAgICAgICAgLy8gY2MubG9nKFwiZHVyYXRpb246XCIrIGNjLkF1ZGlvQ2xpcCh1cmwpLmR1cmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdWRpb0lEO1xuICAgIH0sXG4gICAgcGxheU11c2ljOiBmdW5jdGlvbiBwbGF5TXVzaWMobmFtZSwgbG9vcCkge1xuICAgICAgICBpZiAodGhpcy5nZXRTb3VuZE1vZGUoKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIHVybCA9IGNjLnVybC5yYXcoUF9QQVRIICsgbmFtZSk7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModXJsLCBsb29wKTtcbiAgICAgICAgICAgIC8vIGNjLmxvZyhcImR1cmF0aW9uOlwiKyBjYy5BdWRpb0NsaXAodXJsKS5kdXJhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgIH0sXG4gICAgcGxheUJhY2tncm91bmRBdWRpbzogZnVuY3Rpb24gcGxheUJhY2tncm91bmRBdWRpbyhuYW1lLCBsb29wKSB7XG4gICAgICAgIGlmICh0aGlzLmdldE11c2ljTW9kZSgpID09PSB0cnVlKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyhQX1BBVEggKyBuYW1lKTtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodXJsLCBsb29wKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcGxheUJhY2tncm91bmRNdXNpYzogZnVuY3Rpb24gcGxheUJhY2tncm91bmRNdXNpYyhpc0dhbWUpIHtcbiAgICAgICAgaWYgKGlzR2FtZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUJhY2tncm91bmRBdWRpbygnYmdtdXNpYy5tcDMnLCB0cnVlKTtcbiAgICAgICAgfWlmIChpc0dhbWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldE11c2ljTW9kZSgpID09PSB0cnVlKSB0aGlzLnBsYXlCYWNrZ3JvdW5kQXVkaW8oJ2JhY2tncm91bmRfbXVzaWMubXAzJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHBsYXlCYWNrZ3JvdW5kQWZ0ZXJBbnN3ZXI6IGZ1bmN0aW9uIHBsYXlCYWNrZ3JvdW5kQWZ0ZXJBbnN3ZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldE11c2ljTW9kZSgpID09PSB0cnVlKSB0aGlzLnBsYXlCYWNrZ3JvdW5kQXVkaW8oJ2JhY2tncm91bmRfbXVzaWNfYy5tcDMnLCB0cnVlKTtcbiAgICB9LFxuICAgIHBsYXlDbGlja1NvdW5kOiBmdW5jdGlvbiBwbGF5Q2xpY2tTb3VuZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5QXVkaW8oJ3RvdWNoX3NvdW5kLm1wMycsIGZhbHNlKTtcbiAgICB9LFxuICAgIHBsYXlBbnN3ZXJDaG9vc2U6IGZ1bmN0aW9uIHBsYXlBbnN3ZXJDaG9vc2UobnVtYmVyQW5zKSB7XG4gICAgICAgIHZhciBuYW1lYXVkaW8xID0gJ2Fuc19hLm1wMyc7XG4gICAgICAgIHN3aXRjaCAobnVtYmVyQW5zKSB7XG4gICAgICAgICAgICBjYXNlIEFuc3dlclN0YXRlLkFOU1dFUl9BOlxuICAgICAgICAgICAgICAgIG5hbWVhdWRpbzEgPSAnYW5zX2EubXAzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0I6XG4gICAgICAgICAgICAgICAgbmFtZWF1ZGlvMSA9ICdhbnNfYi5tcDMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQzpcbiAgICAgICAgICAgICAgICBuYW1lYXVkaW8xID0gJ2Fuc19jLm1wMyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFuc3dlclN0YXRlLkFOU1dFUl9EOlxuICAgICAgICAgICAgICAgIG5hbWVhdWRpbzEgPSAnYW5zX2QubXAzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBsYXlBdWRpbyhuYW1lYXVkaW8xLCBmYWxzZSk7XG4gICAgfSxcbiAgICBwbGF5QW5zd2VyOiBmdW5jdGlvbiBwbGF5QW5zd2VyKG51bWJlclRydWUsIGlzVHJ1ZSkge1xuICAgICAgICB2YXIgbmFtZWF1ZGlvID0gJ3RvdWNoX3NvdW5kLm1wMyc7XG4gICAgICAgIHN3aXRjaCAobnVtYmVyVHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQTpcbiAgICAgICAgICAgICAgICBpZiAoaXNUcnVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVhdWRpbyA9ICd0cnVlX2EubXAzJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuYW1lYXVkaW8gPSAnbG9zZV9hLm1wMyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQjpcbiAgICAgICAgICAgICAgICBpZiAoaXNUcnVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVhdWRpbyA9ICd0cnVlX2IubXAzJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuYW1lYXVkaW8gPSAnbG9zZV9iLm1wMyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQzpcbiAgICAgICAgICAgICAgICBpZiAoaXNUcnVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVhdWRpbyA9ICd0cnVlX2MubXAzJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuYW1lYXVkaW8gPSAnbG9zZV9jLm1wMyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfRDpcbiAgICAgICAgICAgICAgICBpZiAoaXNUcnVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVhdWRpbyA9ICd0cnVlX2QyLm1wMyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZWF1ZGlvID0gJ2xvc2VfZC5tcDMnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBsYXlBdWRpbyhuYW1lYXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgcGxheVJlYWRRdWVzdGlvbjogZnVuY3Rpb24gcGxheVJlYWRRdWVzdGlvbihudW1iZXJRdWVzdGlvbikge30sXG4gICAgcGxheUhlbHBDbGljazogZnVuY3Rpb24gcGxheUhlbHBDbGljayhudW1iZXJIZWxwKSB7XG4gICAgICAgIHZhciBuYW1lYXVkaW8gPSAnJztcbiAgICAgICAgc3dpdGNoIChudW1iZXJIZWxwKSB7XG4gICAgICAgICAgICBjYXNlIEhlbHBTdGF0ZS5ONTA1MDpcbiAgICAgICAgICAgICAgICBuYW1lYXVkaW8gPSAnc291bmQ1MDUwXzIubXAzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSGVscFN0YXRlLkFVRElFTkNFOlxuICAgICAgICAgICAgICAgIG5hbWVhdWRpbyA9ICdraGFuX2dpYS5tcDMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBIZWxwU3RhdGUuQ0FMTDpcbiAgICAgICAgICAgICAgICBuYW1lYXVkaW8gPSAnaG9pX3lfa2llbl9jaHV5ZW5fZ2lhXzAxYi5tcDMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBIZWxwU3RhdGUuQ0hBTkdFOlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEhlbHBTdGF0ZS5TVE9QOlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWVhdWRpbyAhPT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMucGxheUF1ZGlvKG5hbWVhdWRpbywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwbGF5TG9zZUdhbWU6IGZ1bmN0aW9uIHBsYXlMb3NlR2FtZSgpIHtcbiAgICAgICAgdmFyIGRlbGF5ID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2MuZGVsYXlUaW1lKDMpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdmFyIHBsYXlsb3NlID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5TXVzaWMoJ2xvc2UubXAzJywgZmFsc2UpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShwbGF5bG9zZSwgZGVsYXkpKTtcbiAgICAgICAgY2MubG9nKFwiaGVyZVwiKTtcbiAgICB9LFxuICAgIHBsYXlSdWxlcjogZnVuY3Rpb24gcGxheVJ1bGVyKCkge30sXG4gICAgc3RvcEFsbDogZnVuY3Rpb24gc3RvcEFsbCgpIHtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcEFsbEVmZmVjdHMoKTtcbiAgICB9LFxuXG4gICAgZW5kQWxsOiBmdW5jdGlvbiBlbmRBbGwoKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLmVuZCgpO1xuICAgIH0sXG4gICAgcGF1c2VBbGw6IGZ1bmN0aW9uIHBhdXNlQWxsKCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wYXVzZUFsbEVmZmVjdHMoKTtcbiAgICB9XG5cbn07XG52YXIgUF9QQVRIID0gJ3Jlc291cmNlcy9yYXcvJztcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEF1ZGlvQ29udHJvbGxlcjogQXVkaW9Db250cm9sbGVyXG5cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MmVkNmo1NUNoS0ZhRlNOR09keS9XZycsICdCb251c1ByZWZhYicpO1xuLy8gc2NyaXB0c1xcdWlcXEJvbnVzUHJlZmFiLmpzXG5cbnZhciBCb251c1ByZWZhYiA9IGNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsYWJNb25leToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBsYWJBcmNoaXJlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcbiAgICBzZXRNb25leTogZnVuY3Rpb24gc2V0TW9uZXkodG1vbmV5KSB7XG4gICAgICAgIHRoaXMubGFiTW9uZXkuc3RyaW5nID0gdG1vbmV5O1xuICAgIH0sXG4gICAgc2V0QXJjaGlyZTogZnVuY3Rpb24gc2V0QXJjaGlyZSh0YXJjaGlyZSkge1xuICAgICAgICB0aGlzLmxhYkFyY2hpcmUuc3RyaW5nID0gdGFyY2hpcmU7XG4gICAgfVxuXG59KTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEJvbnVzUHJlZmFiOiBCb251c1ByZWZhYlxuXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnODNhYmNCUG5ScEhLcW9NZzNBV1FGbU8nLCAnQ29uZmlybURpYWxvZ1ByZWZhYicpO1xuLy8gc2NyaXB0c1xcbW9kdWxlc1xcQ29uZmlybURpYWxvZ1ByZWZhYi5qc1xuXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGJUaXRsZTogY2MuTGFiZWwsXG4gICAgICAgIGxiQ29udGVudDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgYnRuT0s6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBidG5DYW5jZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBsYkJ0bk9LOiBjYy5MYWJlbCxcbiAgICAgICAgbGJCdG5DYW5jZWw6IGNjLkxhYmVsLFxuICAgICAgICBhbmltRGlhbG9nOiBjYy5BbmltYXRpb24sXG4gICAgICAgIHBhcmVudENvbXBvbmVudDogY2MuQ29tcG9uZW50XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmFuaW1EaWFsb2cgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoY29udGVudFN0ciwgcGFyZW50Q29tcG9uZW50KSB7XG5cbiAgICAgICAgdGhpcy5sYkNvbnRlbnQuc3RyaW5nID0gY29udGVudFN0cjtcbiAgICAgICAgdGhpcy5wYXJlbnRDb21wb25lbnQgPSBwYXJlbnRDb21wb25lbnQ7XG4gICAgICAgIHRoaXMuYW5pbURpYWxvZy5wbGF5KCdhbmltX3RyYW5zaXRpb25fcXVlc3Rpb25faW4nKTtcbiAgICAgICAgY2MubG9nKFwiYW5pbV9hbmltXCIpO1xuICAgIH0sXG4gICAgaW5pdENvbmZpcm06IGZ1bmN0aW9uIGluaXRDb25maXJtKHRpdGxlLCBuYW1lQnRuQ29uZmlybSwgY29udGVudCwgcGFyZW50Q29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMubGJUaXRsZS5zdHJpbmcgPSB0aXRsZTtcbiAgICAgICAgdGhpcy5sYkJ0bk9LLnN0cmluZyA9IG5hbWVCdG5Db25maXJtO1xuICAgICAgICB0aGlzLmxiQ29udGVudC5zdHJpbmcgPSBjb250ZW50O1xuICAgICAgICB0aGlzLmJ0bkNhbmNlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ0bk9LLm5vZGUuc2V0UG9zaXRpb24oY2MucCgwLCAtMTUwKSk7XG4gICAgICAgIHRoaXMuYnRuT0subm9kZS53aWR0aCA9IDIwMDtcbiAgICAgICAgdGhpcy5wYXJlbnRDb21wb25lbnQgPSBwYXJlbnRDb21wb25lbnQ7XG4gICAgICAgIHRoaXMuYW5pbURpYWxvZy5wbGF5KCdhbmltX3RyYW5zaXRpb25fcXVlc3Rpb25faW4nKTtcbiAgICB9LFxuXG4gICAgY2xpY2tPSzogZnVuY3Rpb24gY2xpY2tPSygpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRDb21wb25lbnQub25DbGlja09LRGlhbG9nKCk7XG4gICAgfSxcbiAgICBjbGlja0NhbmNlbDogZnVuY3Rpb24gY2xpY2tDYW5jZWwoKSB7XG4gICAgICAgIHRoaXMucGFyZW50Q29tcG9uZW50Lm9uQ2xpY2tDYW5jZWxEaWFsb2coKTtcbiAgICAgICAgdGhpcy5hbmltRGlhbG9nLnBsYXkoJ2FuaW1fdHJhbnNpdGlvbl9xdWVzdGlvbl9vdXQnKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzk2MWE5YXV2b1pDVGEweWhENDNmeGdLJywgJ0RhdGFMZXZlbCcpO1xuLy8gc2NyaXB0c1xcZGF0YVxcRGF0YUxldmVsLmpzXG5cbnZhciBkYXRhbGV2ZWwgPSBbe1xuICAgIGxldmVsOiBcIjAxXCIsXG4gICAgbmFtZTogXCIyMDAuMDAwXCIsXG4gICAgbW9uZXk6IDIwMDAwMFxufSwge1xuICAgIGxldmVsOiBcIjAyXCIsXG4gICAgbmFtZTogXCI0MDAuMDAwXCIsXG4gICAgbW9uZXk6IDQwMDAwMFxufSwgeyBsZXZlbDogXCIwM1wiLFxuICAgIG5hbWU6IFwiNjAwLjAwMFwiLFxuICAgIG1vbmV5OiA2MDAwMDBcbn0sIHsgbGV2ZWw6IFwiMDRcIixcbiAgICBuYW1lOiBcIjEuMDAwLjAwMFwiLFxuICAgIG1vbmV5OiAxMDAwMDAwXG59LCB7IGxldmVsOiBcIjA1XCIsXG4gICAgbmFtZTogXCIyLjAwMC4wMDBcIixcbiAgICBtb25leTogMjAwMDAwMFxufSwgeyBsZXZlbDogXCIwNlwiLFxuICAgIG5hbWU6IFwiMy4wMDAuMDAwXCIsXG4gICAgbW9uZXk6IDMwMDAwMDBcbn0sIHsgbGV2ZWw6IFwiMDdcIixcbiAgICBuYW1lOiBcIjYuMDAwLjAwMFwiLFxuICAgIG1vbmV5OiA2MDAwMDAwXG59LCB7IGxldmVsOiBcIjA4XCIsXG4gICAgbmFtZTogXCIxMC4wMDAuMDAwXCIsXG4gICAgbW9uZXk6IDEwMDAwMDAwXG59LCB7IGxldmVsOiBcIjA5XCIsXG4gICAgbmFtZTogXCIxNC4wMDAuMDAwXCIsXG4gICAgbW9uZXk6IDE0MDAwMDAwXG59LCB7IGxldmVsOiBcIjEwXCIsXG4gICAgbmFtZTogXCIyMi4wMDAuMDAwXCIsXG4gICAgbW9uZXk6IDIyMDAwMDAwXG59LCB7IGxldmVsOiBcIjExXCIsXG4gICAgbmFtZTogXCIzMC4wMDAuMDAwXCIsXG4gICAgbW9uZXk6IDMwMDAwMDAwXG59LCB7IGxldmVsOiBcIjEyXCIsXG4gICAgbmFtZTogXCI0MC4wMDAuMDAwXCIsXG4gICAgbW9uZXk6IDQwMDAwMDAwXG59LCB7IGxldmVsOiBcIjEzXCIsXG4gICAgbmFtZTogXCI2MC4wMDAuMDAwXCIsXG4gICAgbW9uZXk6IDYwMDAwMDAwXG59LCB7IGxldmVsOiBcIjE0XCIsXG4gICAgbmFtZTogXCI4NS4wMDAuMDAwXCIsXG4gICAgbW9uZXk6IDg1MDAwMDAwXG59LCB7IGxldmVsOiBcIjE1XCIsXG4gICAgbmFtZTogXCIxNTAuMDAwLjAwMFwiLFxuICAgIG1vbmV5OiAxNTAwMDAwMDBcbn1dO1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGF0YWxldmVsOiBkYXRhbGV2ZWxcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5ZDU1NWJBRlc5R05iYXBjUXBia0dESScsICdHYW1lT3ZlcicpO1xuLy8gc2NyaXB0c1xcR2FtZU92ZXIuanNcblxudmFyIEF1ZGlvQ3RyID0gcmVxdWlyZSgnQXVkaW9Db250cm9sbGVyJyk7XG52YXIgQXVkaW9Db250cm9sbGVyID0gQXVkaW9DdHIuQXVkaW9Db250cm9sbGVyO1xuXG52YXIgRGF0YUxldmVsID0gcmVxdWlyZSgnRGF0YUxldmVsJykuZGF0YWxldmVsO1xudmFyIFN0b3JlRGF0YSA9IHJlcXVpcmUoJ1N0b3JlRGF0YScpO1xudmFyIFVzZXJEYXRhID0gU3RvcmVEYXRhLlVzZXJEYXRhO1xudmFyIFVzZXJLZXkgPSByZXF1aXJlKCdVc2VySW5mb3JLZXknKS5Vc2VySW5mb3JLZXk7XG52YXIgbGFzdExldmVsID0gLTE7XG52YXIgaXNTdG9wSGVscCA9IGZhbHNlO1xudmFyIGxzID0gY2Muc3lzLmxvY2FsU3RvcmFnZTtcbnZhciBTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlJyk7XG52YXIgQXJNYXggPSByZXF1aXJlKCdBcmNoaXZlbWVudFByZWZhYicpLkFyY2hpdmVtZW50TWF4O1xuXG52YXIgQ29uZ1NlbnRlbmNlID0ge1xuICAgIFdIRU5TVE9QOiBcIkLhuqBOIMSQw4MgROG7qk5HIENV4buYQyBDSMagSSBU4bqgSSBDw4JVIEjhu45JIFPhu5AgXCIsXG4gICAgTE9TVDE6IFwiQuG6oE4gxJDDgyBWxq/hu6JUIFFVQSBDw4JVIEjhu45JIFPhu5AgXCIsXG4gICAgTE9TVDI6IFwiQuG6oE4gxJDDgyBYVeG6pFQgU+G6rkMgVsav4buiVCBRVUEgQ8OCVSBI4buOSSBT4buQIFwiLFxuICAgIExPU1QzOiBcIlRVWeG7hlQgVuG7nEkhIELhuqBOIMSQw4MgWFXhuqRUIFPhuq5DIFbGr+G7olQgUVVBIEPDglUgSOG7jkkgU+G7kCBcIlxufTtcbnZhciBHYW1lT3ZlciA9IGNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdXNlck5hbWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJ0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICB1c2VySWNvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGxhYmVsTGFzdExldmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBtb25leUJvbnVzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBjb25ncmF0dWxhdGlvbjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgdG90YWxtb25leTogMCxcbiAgICAgICAgbWJvbnVzOiAwXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgd2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgY2Mudmlldy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSh3aW5TaXplLndpZHRoLCB3aW5TaXplLmhlaWdodCwgY2MuUmVzb2x1dGlvblBvbGljeS5TSE9XX0FMTCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0KGxhc3RMZXZlbCwgaXNTdG9wSGVscCk7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGxhc3RsZXZlbCwgaXNTdG9wSGVscCkge1xuICAgICAgICB0aGlzLmxhYmVsTGFzdExldmVsLnN0cmluZyA9IFwiXCI7XG4gICAgICAgIGlmIChpc1N0b3BIZWxwID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyBnaXUgbmd1ecOqbiB0aeG7gW4gdGjGsOG7n25nIMSR4buRaSB2cyBsYXN0bGV2ZWwtMVxuICAgICAgICAgICAgLy8gdGhpcy5sYWJlbExhc3RMZXZlbC5zdHJpbmc9bGFzdGxldmVsKzE7XG5cbiAgICAgICAgICAgIGlmIChsYXN0bGV2ZWwgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbmV5Qm9udXMuc3RyaW5nID0gXCIwIFZORFwiO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZ3JhdHVsYXRpb24uc3RyaW5nID0gQ29uZ1NlbnRlbmNlLldIRU5TVE9QICsgXCIxXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubW9uZXlCb251cy5zdHJpbmcgPSBEYXRhTGV2ZWxbbGFzdGxldmVsIC0gMV0ubmFtZSArIFwiIFZORFwiO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZ3JhdHVsYXRpb24uc3RyaW5nID0gQ29uZ1NlbnRlbmNlLldIRU5TVE9QICsgKGxhc3RsZXZlbCArIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG9TYXZlTW9uZXkoRGF0YUxldmVsW2xhc3RsZXZlbCAtIDFdLm1vbmV5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRp4buBbiB0aMaw4bufbmcgdHLhu58gduG7gSBt4buRYyB0aOG6pXAgZ+G6p24gbmjhuqV0XG4gICAgICAgICAgICAvLyB0aGlzLmxhYmVsTGFzdExldmVsLnN0cmluZz1sYXN0bGV2ZWw7XG4gICAgICAgICAgICBpZiAobGFzdGxldmVsID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25ncmF0dWxhdGlvbi5zdHJpbmcgPSBDb25nU2VudGVuY2UuV0hFTlNUT1AgKyBcIjFcIjtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbmV5Qm9udXMuc3RyaW5nID0gXCIwIFZORFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhc3RsZXZlbCA8PSA0ICYmIGxhc3RsZXZlbCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmdyYXR1bGF0aW9uLnN0cmluZyA9IENvbmdTZW50ZW5jZS5MT1NUMSArIGxhc3RsZXZlbDtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbmV5Qm9udXMuc3RyaW5nID0gXCIwIFZORFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhc3RsZXZlbCA+IDQgJiYgbGFzdGxldmVsIDw9IDkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmdyYXR1bGF0aW9uLnN0cmluZyA9IENvbmdTZW50ZW5jZS5MT1NUMiArIGxhc3RsZXZlbDtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbmV5Qm9udXMuc3RyaW5nID0gRGF0YUxldmVsWzRdLm5hbWUgKyBcIiBWTkRcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmRvU2F2ZU1vbmV5KERhdGFMZXZlbFs0XS5tb25leSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGFzdGxldmVsID4gOSAmJiBsYXN0bGV2ZWwgPD0gMTQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmdyYXR1bGF0aW9uLnN0cmluZyA9IENvbmdTZW50ZW5jZS5MT1NUMyArIGxhc3RsZXZlbDtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbmV5Qm9udXMuc3RyaW5nID0gRGF0YUxldmVsWzldLm5hbWUgKyBcIiBWTkRcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmRvU2F2ZU1vbmV5KERhdGFMZXZlbFs5XS5tb25leSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGFzdGxldmVsID4gMTQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlR2FtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNjLmxvZyhsYXN0bGV2ZWwpO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKGxhc3RsZXZlbCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlR2FtZTogZnVuY3Rpb24gY29tcGxldGVHYW1lKCkge1xuICAgICAgICBjYy5sb2coXCJkb3dpblwiKTtcbiAgICAgICAgdGhpcy5jb25ncmF0dWxhdGlvbi5zdHJpbmcgPSBDb25nU2VudGVuY2UuTE9TVDMgKyBsYXN0bGV2ZWw7XG4gICAgICAgIHRoaXMubW9uZXlCb251cy5zdHJpbmcgPSBEYXRhTGV2ZWxbMTRdLm5hbWUgKyBcIiBWTkRcIjtcbiAgICAgICAgdGhpcy5kb1NhdmVNb25leShEYXRhTGV2ZWxbMTRdLm1vbmV5KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKDE1KTtcbiAgICB9LFxuXG4gICAgZG9TYXZlTW9uZXk6IGZ1bmN0aW9uIGRvU2F2ZU1vbmV5KG1vbmV5Ym9udXMpIHtcbiAgICAgICAgdmFyIHRvdGFsID0gU3RvcmVEYXRhLmdldERhdGEoVXNlcktleS5UT1RBTCk7XG4gICAgICAgIHRvdGFsID0gU3RvcmVEYXRhLmlzTnVtYmVyKHRvdGFsKSA/IHRvdGFsIDogMDtcbiAgICAgICAgdGhpcy50b3RhbG1vbmV5ID0gcGFyc2VJbnQodG90YWwpICsgcGFyc2VJbnQobW9uZXlib251cyk7XG4gICAgICAgIFN0b3JlRGF0YS5zYXZlRGF0YUJ5S2V5KFVzZXJLZXkuVE9UQUwsIHRoaXMudG90YWxtb25leSk7XG4gICAgICAgIC8vIFN0b3JlRGF0YS5zYXZlRGF0YUJ5S2V5KFVzZXJLZXkuVE9UQUwsMCk7IC8vdXNlIHRvIHJlc2V0IGRhdGFcbiAgICAgICAgY2MubG9nKFwic2F2aW5nIDogXCIgKyBTdG9yZURhdGEuZ2V0RGF0YShVc2VyS2V5LlRPVEFMKSk7XG4gICAgfSxcblxuICAgIGNsaWNrQ2FuY2VsOiBmdW5jdGlvbiBjbGlja0NhbmNlbCgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdIb21lU2NlbmVfTG9naW4nKTtcbiAgICB9LFxuICAgIGNsaWNrQnRuU2luZ2xlOiBmdW5jdGlvbiBjbGlja0J0blNpbmdsZSgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdMb2FkR2FtZVNjZW5lX0xvZ2luJyk7XG4gICAgfSxcbiAgICBjbGlja0J0blRoYWNoRGF1OiBmdW5jdGlvbiBjbGlja0J0blRoYWNoRGF1KCkge1xuICAgICAgICBjYy5sb2coXCJ0aGFjaCBkYXUgbW9kZVwiKTtcbiAgICB9LFxuICAgIGNsaWNrQnRuU2hhcmU6IGZ1bmN0aW9uIGNsaWNrQnRuU2hhcmUoKSB7fVxuICAgIC8vc2hhcmUgY29kZVxuXG4gICAgLy8gZ2FtZSBvdmVyIMSR4bq/bSB2w6AgdGjDqm0gc+G7rWEgxJHhu5FpIHZzIGFyY2hpdsOqbWVudFxuICAgICwgaW5pdGZpcnN0OiBmdW5jdGlvbiBpbml0Zmlyc3QoKSB7XG4gICAgICAgIGlmIChKU09OLnBhcnNlKGxzLmdldEl0ZW0oU3RhdGUuQVJDSElWRU1FTlRfS0VZKSkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBBclN0YXRlID0ge1xuICAgICAgICAgICAgICAgIEJBSUtIT05HTkFOOiAwLCAvL3RodWEgMTBs4bqnbiA8beG7kWMgNVxuICAgICAgICAgICAgICAgIEJBTkxBVFJJRVVQSFU6IDAsIC8vIMSR4bqhdCDEkWMgdHJp4buHdSBwaMO6XG4gICAgICAgICAgICAgICAgQkFUS0hBQ0hJRU5CQUk6IDAsIC8vMTAgbOG6p24gbGnDqm4gdGnhur9wIHRy4bqjIGzhu51pIMSRYyA+PSBt4buRYyAxMFxuICAgICAgICAgICAgICAgIEJBVE5ISVBDSElFTlRIQU5HOiAwLCAvLyAxMCBs4bqnbiB0cuG6oyBs4budaSA+PW3hu5FjIDEwIChrIGPhuqduIGxpw6puIHRp4bq/cClcbiAgICAgICAgICAgICAgICBCVUNUT0NWVU9UTEVOOiAwLCAvLyBjw6J1IGjhu49pIG1pbiAsIG7hur91IMSR4bqhdCBraG/huqNuZyBjw6FjaCA3IGPDonUgaOG7j2kgbmdheSBzYXUgbOG6p24gY2jGoWkgbWluXG4gICAgICAgICAgICAgICAgQ0hBTVRBWUNISUVOVEhBTkc6IGZhbHNlLCAvLyB0aHVhIGhv4bq3YyBk4burbmcgbOG6oWkg4bufIGPDonUgaOG7j2kgc+G7kSAxNSAoayB0cuG6oyBs4buraSDEkWMpXG4gICAgICAgICAgICAgICAgQ0hJRU5USEFOR01PSEFORzogZmFsc2UsIC8vIHbGsOG7o3QgcXVhIG3hu5FjIDEwIGzhuqduIMSR4bqndSB0acOqblxuICAgICAgICAgICAgICAgIERBSUtJRU5UVU9ORzogMCwgLy81IGzhuqduIGzDoCB0cmnhu4d1IHBow7pcbiAgICAgICAgICAgICAgICBET0NDT0NBVUJBSTogMCwgLy8gMTAgbOG6p24gdHJp4buHdSBwaMO6XG4gICAgICAgICAgICAgICAgRVZFUkVTVDogMCwgLy8gY8OidSBo4buPaSBjYW8gbmjhuqV0IHThu6tuZyB0cuG6oyBs4budaSDEkWMsIHThu6sgMS0+MTVcbiAgICAgICAgICAgICAgICBGQU5TSVBBTjogMCwgLy8gY8OidSBo4buPaSBjYW8gbmjDonQgdOG7q25nIMSR4bqhdCDEkcaw4bujYywgMS0+OFxuICAgICAgICAgICAgICAgIEhBVFRSSUNLOiAwLCAvLzMgbOG6p24gbGnDqm4gdGnhur9wIMSR4bqhdCBt4buRYyA+PTEwXG4gICAgICAgICAgICAgICAgSFVZRU5USE9BSTogMCwgLy81MCBs4bqnbiDEkeG6oXQgbeG7kWMgPj0xMlxuICAgICAgICAgICAgICAgIEtFT05HT1Q6IDAsIC8vIDIwIGzhuqduIGvhur90IHRow7pjIOG7nyBt4buRYyA+PTUgdsOgIG3hu5FjIDwxMFxuICAgICAgICAgICAgICAgIEtIT0lEQVVNQU5ITUU6IGZhbHNlLCAvLyBs4bqnbiDEkeG6p3UgxJHhuqF0IMSR4bq/biBt4buRYyA+PTVcbiAgICAgICAgICAgICAgICBLSE9JRE9OR1RIQU5IQ09ORzogZmFsc2UsIC8vbOG6p24gxJHhuqd1IMSR4bqhdCDEkeG6v24gbeG7kWMgPj0xMFxuICAgICAgICAgICAgICAgIEtIT0JBVUtJRU5USFVDOiAwLCAvLzE1IGzhuqduIMSR4bqhdCA+PThcbiAgICAgICAgICAgICAgICBLSUVOVFVPTkc6IDAsIC8vMjAgbOG6p24gxJHhuqF0IG3hu5FjID49MTBcbiAgICAgICAgICAgICAgICBLWVBIVU5HRElDSFRIVTogMCwgLy90aMOhY2ggxJHhuqV1OiBow7JhIGhv4bq3YyB0aOG6r25nIDIwXG4gICAgICAgICAgICAgICAgTkhBSElFTlRSSUVUOiAwLCAvLyAzMCBs4bqnbiDEkeG6oXQgbeG7kWMgPj0xMFxuICAgICAgICAgICAgICAgIE9MWU1QVVM6IDAsIC8vY8OidSBo4buPaSBjYW8gbmjDonQgdOG7q25nIMSR4bqhdCDEkcaw4bujYywgMS0+MTBcbiAgICAgICAgICAgICAgICBUSEFOUlVBOiAwLCAvLyAyMCBs4bqnbiB0aHVhIDxt4buRYyA1XG4gICAgICAgICAgICAgICAgVEhBTlRPQ1RBT0JBTzogMCwgLy8gMjAgbOG6p24gdHLhuqMgbOG7nWkgPj1t4buRYyA1IHbDoCA8PW3hu5FjIDEwXG4gICAgICAgICAgICAgICAgVEhBUFRPQU5USEFQTVk6IDAsIC8vIDEwIGzhuqduIGsgdHLhuqMgbOG7nWkgxJFjIGhv4bq3YyBk4burbmcgbOG6oWkg4bufIGPDonUgaOG7j2kgc+G7kSAxMVxuICAgICAgICAgICAgICAgIFRIT1NBTkNISUVOVEhBTkc6IDAsIC8vIDMwIGzhuqduID49IG3hu5FjIDEwXG4gICAgICAgICAgICAgICAgVlVBQ0FNSE9BOiAwLCAvLyB0aMOhY2ggxJHhuqV1OiBow7JhIDEwIGzhuqduXG4gICAgICAgICAgICAgICAgWUVVSE9BQklOSDogMCAvLyB0aMOhY2ggxJHhuqV1LCBow7JhIDIwIGzhuqduXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBscy5zZXRJdGVtKFN0YXRlLkFSQ0hJVkVNRU5UX0tFWSwgSlNPTi5zdHJpbmdpZnkoQXJTdGF0ZSkpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVTdGF0ZTogZnVuY3Rpb24gdXBkYXRlU3RhdGUocmVhbExldmVsKSB7XG4gICAgICAgIHZhciBhcnIgPSBKU09OLnBhcnNlKGxzLmdldEl0ZW0oU3RhdGUuQVJDSElWRU1FTlRfS0VZKSk7XG4gICAgICAgIGlmIChhcnIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGZpcnN0KCk7XG4gICAgICAgICAgICBhcnIgPSBKU09OLnBhcnNlKGxzLmdldEl0ZW0oU3RhdGUuQVJDSElWRU1FTlRfS0VZKSk7XG4gICAgICAgIH1cblxuICAgICAgICBhcnIuRVZFUkVTVCA9IGFyci5FVkVSRVNUIDw9IGxhc3RMZXZlbCA/IGxhc3RMZXZlbCA6IGFyci5FVkVSRVNUO1xuICAgICAgICBhcnIuT0xZTVBVUyA9IGFyci5PTFlNUFVTIDw9IGxhc3RMZXZlbCA/IGxhc3RMZXZlbCA6IGFyci5PTFlNUFVTO1xuICAgICAgICBhcnIuRkFOU0lQQU4gPSBhcnIuRkFOU0lQQU4gPD0gbGFzdExldmVsID8gbGFzdExldmVsIDogYXJyLkZBTlNJUEFOO1xuXG4gICAgICAgIGlmIChyZWFsTGV2ZWwgPCA1KSB7XG4gICAgICAgICAgICBhcnIuQkFJS0hPTkdOQU4gPSBhcnIuQkFJS0hPTkdOQU4gPT09IEFyTWF4LkJBSUtIT05HTkFOID8gQXJNYXguQkFJS0hPTkdOQU4gOiBhcnIuQkFJS0hPTkdOQU4gKyAxO1xuICAgICAgICAgICAgYXJyLlRIQU5SVUEgPSBhcnIuVEhBTlJVQSA9PT0gQXJNYXguVEhBTlJVQSA/IEFyTWF4LlRIQU5SVUEgOiBhcnIuVEhBTlJVQSArIDE7XG4gICAgICAgICAgICBhcnIuSEFUVFJJQ0sgPSBhcnIuSEFUVFJJQ0sgPT09IEFyTWF4LkhBVFRSSUNLID8gQXJNYXguSEFUVFJJQ0sgOiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWFsTGV2ZWwgPj0gNSAmJiByZWFsTGV2ZWwgPCAxMCkge1xuICAgICAgICAgICAgYXJyLktFT05HT1QgPSBhcnIuS0VPTkdPVCA9PT0gQXJNYXguS0VPTkdPVCA/IEFyTWF4LktFT05HT1QgOiBhcnIuS0VPTkdPVCArIDE7XG4gICAgICAgICAgICBhcnIuS0hPSURBVU1BTkhNRSA9IHRydWU7XG4gICAgICAgICAgICBhcnIuVEhBTlRPQ1RBT0JBTyA9IGFyci5USEFOVE9DVEFPQkFPID09PSBBck1heC5USEFOVE9DVEFPQkFPID8gQXJNYXguVEhBTlRPQ1RBT0JBTyA6IGFyci5USEFOVE9DVEFPQkFPICsgMTtcbiAgICAgICAgICAgIGFyci5IQVRUUklDSyA9IGFyci5IQVRUUklDSyA9PT0gQXJNYXguSEFUVFJJQ0sgPyBBck1heC5IQVRUUklDSyA6IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlYWxMZXZlbCA9PT0gMTQpIGFyci5DSEFNVEFZQ0hJRU5USEFORyA9IHRydWU7XG4gICAgICAgIGlmIChyZWFsTGV2ZWwgPj0gMTAgJiYgcmVhbExldmVsIDw9IDE1KSB7XG4gICAgICAgICAgICBhcnIuQ0hJRU5USEFOR01PSEFORyA9IHRydWU7XG4gICAgICAgICAgICBhcnIuS0hPSURPTkdUSEFOSENPTkcgPSB0cnVlO1xuICAgICAgICAgICAgYXJyLkhBVFRSSUNLID0gYXJyLkhBVFRSSUNLID09PSBBck1heC5IQVRUUklDSyA/IEFyTWF4LkhBVFRSSUNLIDogYXJyLkhBVFRSSUNLICsgMTtcbiAgICAgICAgICAgIGFyci5CQVRLSEFDSElFTkJBSSA9IGFyci5CQVRLSEFDSElFTkJBSSA9PT0gQXJNYXguQkFUS0hBQ0hJRU5CQUkgPyBBck1heC5CQVRLSEFDSElFTkJBSSA6IGFyci5CQVRLSEFDSElFTkJBSSArIDE7XG4gICAgICAgICAgICBhcnIuQkFUTkhJUENISUVOVEhBTkcgPSBhcnIuQkFUTkhJUENISUVOVEhBTkcgPT09IEFyTWF4LkJBVE5ISVBDSElFTlRIQU5HID8gQXJNYXguQkFUTkhJUENISUVOVEhBTkcgOiBhcnIuQkFUTkhJUENISUVOVEhBTkcgKyAxO1xuICAgICAgICAgICAgYXJyLk5IQUhJRU5UUklFVCA9IGFyci5OSEFISUVOVFJJRVQgPT09IEFyTWF4Lk5IQUhJRU5UUklFVCA/IEFyTWF4Lk5IQUhJRU5UUklFVCA6IGFyci5OSEFISUVOVFJJRVQgKyAxO1xuICAgICAgICAgICAgYXJyLktJRU5UVU9ORyA9IGFyci5LSUVOVFVPTkcgPT09IEFyTWF4LktJRU5UVU9ORyA/IEFyTWF4LktJRU5UVU9ORyA6IGFyci5LSUVOVFVPTkcgKyAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWFsTGV2ZWwgPj0gOCkge1xuICAgICAgICAgICAgYXJyLkJVQ1RPQ1ZVT1RMRU4gPSB0cnVlO1xuICAgICAgICAgICAgYXJyLktIT0JBVUtJRU5USFVDID0gYXJyLktIT0JBVUtJRU5USFVDID09PSBBck1heC5LSE9CQVVLSUVOVEhVQyA/IEFyTWF4LktIT0JBVUtJRU5USFVDIDogYXJyLktIT0JBVUtJRU5USFVDICsgMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVhbExldmVsID09PSAxNSkge1xuICAgICAgICAgICAgYXJyLkVWRVJFU1QgPSAxNTtcbiAgICAgICAgICAgIGFyci5CQU5MQVRSSUVVUEhVID0gMTtcbiAgICAgICAgICAgIGFyci5EQUlLSUVOVFVPTkcgPSBhcnIuREFJS0lFTlRVT05HID09PSBBck1heC5EQUlLSUVOVFVPTkcgPyBBck1heC5EQUlLSUVOVFVPTkcgOiBhcnIuREFJS0lFTlRVT05HICsgMTtcbiAgICAgICAgICAgIGFyci5LSE9JREFVTUFOSE1FID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNhdmVBcmNoaXZlbWVudChhcnIpO1xuICAgIH0sXG5cbiAgICBzYXZlQXJjaGl2ZW1lbnQ6IGZ1bmN0aW9uIHNhdmVBcmNoaXZlbWVudChhcnIpIHtcbiAgICAgICAgbHMuc2V0SXRlbShTdGF0ZS5BUkNISVZFTUVOVF9LRVksIEpTT04uc3RyaW5naWZ5KGFycikpO1xuXG4gICAgICAgIGNjLmxvZyhcIj4+Pj4+Pj5zYXZlIGNvbXBsZXRlXCIpO1xuICAgICAgICBjYy5sb2coYXJyKTtcbiAgICB9XG59KTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEdhbWVPdmVyOiBHYW1lT3ZlcixcbiAgICBzZXRJbml0OiBmdW5jdGlvbiBzZXRJbml0KGIpIHtcbiAgICAgICAgaXNTdG9wSGVscCA9IGI7XG4gICAgfSxcbiAgICBzZXRDdXJyZW50TGV2ZWw6IGZ1bmN0aW9uIHNldEN1cnJlbnRMZXZlbChhKSB7XG4gICAgICAgIGxhc3RMZXZlbCA9IGE7XG4gICAgfVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzMyZGUzM0JHMFpPK0twdTdXd0dFUjNnJywgJ0dhbWVfSGVscE1lbnUnKTtcbi8vIHNjcmlwdHNcXG1vZHVsZXNcXEdhbWVfSGVscE1lbnUuanNcblxudmFyIEF1ZGlvQ3RyID0gcmVxdWlyZSgnQXVkaW9Db250cm9sbGVyJyk7XG52YXIgQXVkaW9Db250cm9sbGVyID0gQXVkaW9DdHIuQXVkaW9Db250cm9sbGVyO1xuXG52YXIgR2FtZU92ZXIgPSByZXF1aXJlKCdHYW1lT3ZlcicpO1xudmFyIEFuc3dlclN0YXRlID0gcmVxdWlyZSgnU3RhdGUnKS5BbnN3ZXJTdGF0ZTtcbnZhciBIZWxwU3RhdGUgPSByZXF1aXJlKCdTdGF0ZScpLkhlbHBTdGF0ZTtcbnZhciBHYW1lX0hlbHBNZW51ID0gY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBidG5TdG9wOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b24sXG4gICAgICAgICAgICBzdGF0ZTogdHJ1ZSxcbiAgICAgICAgICAgIGlzR2FtZU92ZXI6IEJvb2xlYW4oZmFsc2UpXG4gICAgICAgIH0sXG4gICAgICAgIGJ0bkNoYW5nZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICAgICAgc3RhdGU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgYnRuNTA1MDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICAgICAgc3RhdGU6IHRydWUsXG4gICAgICAgICAgICBwaHV0aHVvYzogY2MuRW51bVxuICAgICAgICB9LFxuICAgICAgICBidG5DYWxsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b24sXG4gICAgICAgICAgICBzdGF0ZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBidG5BdWRpZW5jZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICAgICAgc3RhdGU6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZ3JvdXBCdG5BbnM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNvbXBvbmVudFxuICAgICAgICB9LFxuICAgICAgICBwcmVzczogMCxcbiAgICAgICAgcGxheWVyX2Fuc3dlcjogY2MuRW51bSxcbiAgICAgICAgcGFuZWxIZWxwOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGNwYXJlbnQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgcGFuZWxPcHBvQXVkaWVuY2U6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgbm9kZVBhcmVudDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBzcHJpdGVDaGFuZ2U6IGNjLlNwcml0ZSxcbiAgICAgICAgc3ByaXRlNTA1MDogY2MuU3ByaXRlLFxuICAgICAgICBzcHJpdGVBdWRpZW5jZTogY2MuU3ByaXRlLFxuICAgICAgICBzcHJpdGVDYWxsOiBjYy5TcHJpdGUsXG5cbiAgICAgICAgaXNDbGljazogZmFsc2UsXG4gICAgICAgIGhlbHBfY29tcG9uZW50OiBjYy5Db21wb25lbnQsXG4gICAgICAgIHBhbmVsT3BDb21wOiBjYy5Db21wb25lbnQsXG4gICAgICAgIGdhbWVDb21wb25lbnQ6IGNjLkNvbXBvbmVudFxuICAgIH0sXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucHJlc3MgPSAwO1xuICAgICAgICB0aGlzLmhlbHBfY29tcG9uZW50ID0gdGhpcy5wYW5lbEhlbHAuZ2V0Q29tcG9uZW50KCdQYW5lbE9wcG90dW5pdHknKTtcbiAgICAgICAgdGhpcy5wYW5lbE9wQ29tcCA9IHRoaXMucGFuZWxPcHBvQXVkaWVuY2UuZ2V0Q29tcG9uZW50KFwiVUlDb250ZW50QXVkaWVuY2VcIik7XG4gICAgICAgIHRoaXMucGxheWVyX2Fuc3dlciA9IGNjLkVudW0oMCk7XG4gICAgICAgIC8vIHBsYXllcl9hbnN3ZXI9MDtcbiAgICAgICAgdGhpcy5idG5TdG9wLnN0YXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5idG5DYWxsLnN0YXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5idG5DaGFuZ2Uuc3RhdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmJ0bkF1ZGllbmNlLnN0YXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5idG41MDUwLnN0YXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5idG5TdG9wLmlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nYW1lQ29tcG9uZW50ID0gdGhpcy5ub2RlUGFyZW50LmdldENvbXBvbmVudCgnR2FtZScpO1xuXG4gICAgICAgIHRoaXMuc3ByaXRlQ2hhbmdlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3ByaXRlNTA1MC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNwcml0ZUF1ZGllbmNlLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3ByaXRlQ2FsbC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ0bjUwNTAucGh1dGh1b2MgPSAtMTtcbiAgICB9LFxuICAgIHNldFRydWVBbnN3ZXI6IGZ1bmN0aW9uIHNldFRydWVBbnN3ZXIoYW5zd2VyKSB7XG4gICAgICAgIHRoaXMucGxheWVyX2Fuc3dlciA9IGFuc3dlcjtcbiAgICB9LFxuXG4gICAgY2xpY2tCdXR0b25TdG9wOiBmdW5jdGlvbiBjbGlja0J1dHRvblN0b3AoKSB7XG4gICAgICAgIHRoaXMuY2xpY2tCdXR0b24odGhpcy5idG5TdG9wLCBIZWxwU3RhdGUuU1RPUCk7XG4gICAgfSxcbiAgICBjbGlja0J1dHRvbkNoYW5nZTogZnVuY3Rpb24gY2xpY2tCdXR0b25DaGFuZ2UoKSB7XG4gICAgICAgIHRoaXMuY2xpY2tCdXR0b24odGhpcy5idG5DaGFuZ2UsIEhlbHBTdGF0ZS5DSEFOR0UpO1xuICAgIH0sXG4gICAgY2xpY2tCdXR0b241MDUwOiBmdW5jdGlvbiBjbGlja0J1dHRvbjUwNTAoKSB7XG4gICAgICAgIHRoaXMuY2xpY2tCdXR0b24odGhpcy5idG41MDUwLCBIZWxwU3RhdGUuTjUwNTApO1xuICAgIH0sXG4gICAgY2xpY2tCdXR0b25DYWxsOiBmdW5jdGlvbiBjbGlja0J1dHRvbkNhbGwoKSB7XG4gICAgICAgIHRoaXMuY2xpY2tCdXR0b24odGhpcy5idG5DYWxsLCBIZWxwU3RhdGUuQ0FMTCk7XG4gICAgfSxcbiAgICBjbGlja0J1dHRvbkF1ZGllbmNlOiBmdW5jdGlvbiBjbGlja0J1dHRvbkF1ZGllbmNlKCkge1xuICAgICAgICB0aGlzLmNsaWNrQnV0dG9uKHRoaXMuYnRuQXVkaWVuY2UsIEhlbHBTdGF0ZS5BVURJRU5DRSk7XG4gICAgfSxcbiAgICBjbGlja0J1dHRvbjogZnVuY3Rpb24gY2xpY2tCdXR0b24oYnV0dG9uLCBudW1iZXJCdXR0b24pIHtcbiAgICAgICAgLy8gdGhpcy5nYW1lQ29tcG9uZW50LnNldElzU3RhcnQoZmFsc2UpO1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUNsaWNrU291bmQoKTtcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLnBsYXlIZWxwQ2xpY2sobnVtYmVyQnV0dG9uKTtcbiAgICAgICAgYnV0dG9uLm5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSBidXR0b24uZGlzYWJsZWRTcHJpdGU7XG4gICAgICAgIC8vIGNjLmxvZyhidXR0b24ubm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSk7XG4gICAgICAgIHN3aXRjaCAobnVtYmVyQnV0dG9uKSB7XG4gICAgICAgICAgICBjYXNlIEhlbHBTdGF0ZS5TVE9QOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ0blN0b3Auc3RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5idG5TdG9wLmlzR2FtZU92ZXI9dHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lQ29tcG9uZW50LnNldElzU3RhcnQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVDb21wb25lbnQuc2hvd0RpYWxvZyhcIkLhuqFuIGPDsyBjaOG6r2MgY2jhuq9uIG114buRbiBk4burbmcgY3Xhu5ljIGNoxqFpP1wiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5nYW1lb3ZlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSGVscFN0YXRlLkNIQU5HRTpcbiAgICAgICAgICAgICAgICAvLyBjb2RlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYnRuQ2hhbmdlLnN0YXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuYnRuQ2hhbmdlLmRpc2FibGVkU3ByaXRlPXRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkbyBhbnl0aGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVDaGFuZ2Uubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSGVscFN0YXRlLk41MDUwOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ0bjUwNTAuc3RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lQ29tcG9uZW50LnNldElzU3RhcnQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGxheWF1ZGlvID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9Db250cm9sbGVyLnBsYXlIZWxwQ2xpY2soSGVscFN0YXRlLk41MDUwKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnRuNTA1MC5waHV0aHVvYyA9IHRoaXMuZ2FtZUNvbXBvbmVudC5nZXRDdXJyZW50UXVlc3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvaXQgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvNTA1MCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idG41MDUwLnN0YXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZTUwNTAubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlbGF5ID0gY2MuZGVsYXlUaW1lKDMuMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UocGxheWF1ZGlvLCBkZWxheSwgZG9pdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSGVscFN0YXRlLkNBTEw6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYnRuQ2FsbC5zdGF0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ2xpY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ0bkNhbGwuc3RhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb1Nob3dQYW5lbE9wcG90dW5pdGllcyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVDYWxsLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEhlbHBTdGF0ZS5BVURJRU5DRTpcbiAgICAgICAgICAgICAgICAvLyBjb2RlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYnRuQXVkaWVuY2Uuc3RhdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5BdWRpZW5jZS5zdGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvU2hvd1BhbmVsT3Bwb3R1bml0aWVzKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVBdWRpZW5jZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5wYXVzZVRhcmdldChidXR0b24ubm9kZSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBkbzUwNTA6IGZ1bmN0aW9uIGRvNTA1MCgpIHtcbiAgICAgICAgdmFyIGFuczEgPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcbiAgICAgICAgdmFyIGFuczIgPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcbiAgICAgICAgd2hpbGUgKGFuczIgPT09IHRoaXMucGxheWVyX2Fuc3dlciB8fCBhbnMxID09PSB0aGlzLnBsYXllcl9hbnN3ZXIgfHwgYW5zMSA9PT0gYW5zMiB8fCBhbnMxID09PSBBbnN3ZXJTdGF0ZS5FTVBUWSB8fCBhbnMyID09PSBBbnN3ZXJTdGF0ZS5FTVBUWSkge1xuICAgICAgICAgICAgYW5zMiA9IHRoaXMuZ2V0T3RoZXJBbnN3ZXI1MDUwKCk7XG4gICAgICAgICAgICBhbnMxID0gdGhpcy5nZXRPdGhlckFuc3dlcjUwNTAoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyb3VwQnRuQW5zLmRlYWN0aXZlQnV0dG9uNTA1MChhbnMxKTtcbiAgICAgICAgdGhpcy5ncm91cEJ0bkFucy5kZWFjdGl2ZUJ1dHRvbjUwNTAoYW5zMik7XG4gICAgICAgIGlmICh0aGlzLmJ0bkF1ZGllbmNlLnN0YXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmhlbHBfY29tcG9uZW50LnNldDUwNTBmb3JBdWRpZW5jZSgxICsgMiArIDMgKyA0IC0gdGhpcy5wbGF5ZXJfYW5zd2VyIC0gYW5zMSAtIGFuczIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZUNvbXBvbmVudC5zZXRJc1N0YXJ0KHRydWUpO1xuICAgIH0sXG4gICAgZG9TaG93UGFuZWxPcHBvdHVuaXRpZXM6IGZ1bmN0aW9uIGRvU2hvd1BhbmVsT3Bwb3R1bml0aWVzKGlzQ2FsbCkge1xuICAgICAgICB0aGlzLmNwYXJlbnQub3BhY2l0eSA9IDEwMDtcbiAgICAgICAgdGhpcy5wYW5lbEhlbHAub3BhY2l0eSA9IDI1NTtcblxuICAgICAgICB0aGlzLmhlbHBfY29tcG9uZW50LnNldEFuc3dlcih0aGlzLnBsYXllcl9hbnN3ZXIpO1xuICAgICAgICBpZiAoaXNDYWxsID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUF1ZGlvKFwiaGVscF9jYWxsLm1wM1wiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY2MuZGVsYXlUaW1lKDEpO1xuICAgICAgICAgICAgfSwgdGhpcyksIGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlbHBfY29tcG9uZW50LmNsaWNrQ2FsbFBhbmVsKCk7XG4gICAgICAgICAgICAgICAgdmFyIGFuaW0gPSB0aGlzLnBhbmVsSGVscC5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICBhbmltLnBsYXkoJ2FuaW1faGVscF90cmFuc2l0aW9uX2luJyk7XG4gICAgICAgICAgICB9LCB0aGlzKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNGdW5jID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWVDb21wb25lbnQuZ2V0Q3VycmVudFF1ZXN0aW9uKCkgPT09IHRoaXMuYnRuNTA1MC5waHV0aHVvYykgdGhpcy5oZWxwX2NvbXBvbmVudC5jbGlja0F1ZGllbmNlKHRydWUpO2Vsc2UgdGhpcy5oZWxwX2NvbXBvbmVudC5jbGlja0F1ZGllbmNlKGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIHZhciBhbmltID0gdGhpcy5wYW5lbEhlbHAuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgICAgICAgICAgYW5pbS5wbGF5KCdhbmltX2hlbHBfdHJhbnNpdGlvbl9pbicpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBjYy5kZWxheVRpbWUoMik7XG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGRlbGF5LCBjRnVuYykpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyAsc2hvd0F1ZGllbmNlQWZ0ZXI1MDUwOmZ1bmN0aW9uKCl7XG5cbiAgICAvLyB9XG4gICAgZ2V0T3RoZXJBbnN3ZXI1MDUwOiBmdW5jdGlvbiBnZXRPdGhlckFuc3dlcjUwNTAoKSB7XG4gICAgICAgIHZhciByYW4gPSBNYXRoLnJhbmRvbSgpICogMTAwO1xuICAgICAgICB2YXIgcmUgPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcbiAgICAgICAgaWYgKHJhbiA8PSAyNSkge1xuICAgICAgICAgICAgcmUgPSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmFuID4gMjUgJiYgcmFuIDw9IDUwKSB7XG4gICAgICAgICAgICByZSA9IEFuc3dlclN0YXRlLkFOU1dFUl9CO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyYW4gPiA1MCAmJiByYW4gPD0gNzUpIHtcbiAgICAgICAgICAgIHJlID0gQW5zd2VyU3RhdGUuQU5TV0VSX0M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJhbiA+IDc1ICYmIHJhbiA8PSAxMDApIHtcbiAgICAgICAgICAgIHJlID0gQW5zd2VyU3RhdGUuQU5TV0VSX0Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlO1xuICAgIH0sXG5cbiAgICBpc09wcG90dW5pdGllc0NsaWNrYWJsZTogZnVuY3Rpb24gaXNPcHBvdHVuaXRpZXNDbGlja2FibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQ2xpY2s7XG4gICAgfSxcbiAgICBzZXRPcHBvdHVuaXRpZXNDbGlja2FibGU6IGZ1bmN0aW9uIHNldE9wcG90dW5pdGllc0NsaWNrYWJsZShpc0NsaWNrKSB7XG4gICAgICAgIHRoaXMuaXNDbGljayA9IGlzQ2xpY2s7XG4gICAgfSxcbiAgICBkb0Rpc2FsbG93Q2xpY2tlZEFsbEhlbHA6IGZ1bmN0aW9uIGRvRGlzYWxsb3dDbGlja2VkQWxsSGVscCgpIHtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMuYnRuU3RvcC5ub2RlLCB0cnVlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMuYnRuQ2hhbmdlLm5vZGUsIHRydWUpO1xuICAgICAgICBjYy5ldmVudE1hbmFnZXIucGF1c2VUYXJnZXQodGhpcy5idG5DYWxsLm5vZGUsIHRydWUpO1xuICAgICAgICBjYy5ldmVudE1hbmFnZXIucGF1c2VUYXJnZXQodGhpcy5idG5BdWRpZW5jZS5ub2RlLCB0cnVlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMuYnRuNTA1MC5ub2RlLCB0cnVlKTtcbiAgICB9LFxuICAgIGRvQWxsb3dDbGlja2VkQWxsSGVscDogZnVuY3Rpb24gZG9BbGxvd0NsaWNrZWRBbGxIZWxwKCkge1xuICAgICAgICBjYy5ldmVudE1hbmFnZXIucmVzdW1lVGFyZ2V0KHRoaXMuYnRuU3RvcC5ub2RlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzLmJ0bkNoYW5nZS5ub2RlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzLmJ0bkNhbGwubm9kZSk7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5yZXN1bWVUYXJnZXQodGhpcy5idG5BdWRpZW5jZS5ub2RlKTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzLmJ0bjUwNTAubm9kZSk7XG4gICAgfVxuICAgIC8vICxnYW1lb3ZlcjpmdW5jdGlvbigpe1xuICAgIC8vICAgICBHYW1lT3Zlci5zZXRJbml0KHRydWUpO1xuICAgIC8vICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0dhbWVPdmVyU2NlbmUnKTtcbiAgICAvLyB9XG5cbn0pO1xubW9kdWxlLnJlcG9ydHMgPSB7XG4gICAgR2FtZV9IZWxwTWVudTogR2FtZV9IZWxwTWVudVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQ2M2E3UWdIK05QcWJhSWNMZDRRK2dRJywgJ0dhbWUnKTtcbi8vIHNjcmlwdHNcXEdhbWUuanNcblxudmFyIEF1ZGlvQ3RyID0gcmVxdWlyZSgnQXVkaW9Db250cm9sbGVyJyk7XG52YXIgQXVkaW9Db250cm9sbGVyID0gQXVkaW9DdHIuQXVkaW9Db250cm9sbGVyO1xuXG52YXIgTG9hZEdhbWUgPSByZXF1aXJlKCdMb2FkR2FtZV9Mb2dpbicpO1xudmFyIExvYWRHYW1lX0xvZ2luID0gTG9hZEdhbWUuTG9hZEdhbWVfTG9naW47XG52YXIgR2FtZV9IZWxwTWVudSA9IHJlcXVpcmUoJ0dhbWVfSGVscE1lbnUnKS5HYW1lX0hlbHBNZW51O1xudmFyIEFuc3dlckNvbnRyb2xsZXIgPSByZXF1aXJlKCdBbnN3ZXJCdXR0b25Db250cm9sbGVyJykuQW5zd2VyQnV0dG9uQ29udHJvbGxlcjtcbnZhciBzdHJpbmdpbmZvcm1hdGlvbiA9IFwic3RyaW5nIGluZm9yXCI7XG52YXIgQW5zd2VyU3RhdGUgPSByZXF1aXJlKCdTdGF0ZScpLkFuc3dlclN0YXRlO1xudmFyIE1vbmV5SW5HYW1lID0gcmVxdWlyZSgnTW9uZXlJbkdhbWUnKTtcbnZhciBMaXN0TGV2ZWxNb25leSA9IHJlcXVpcmUoJ0xpc3RMZXZlbE1vbmV5Jyk7XG52YXIgR2FtZU92ZXIgPSByZXF1aXJlKCdHYW1lT3ZlcicpO1xudmFyIEdPdmVyID0gR2FtZU92ZXIuR2FtZU92ZXI7XG4vLyB2YXIgTGlzdExldmVsTW9uZXk9IExpc3QuTGlzdExldmVsTW9uZXk7XG52YXIgY3VycmVudFF1ZXN0aW9uID0gMDtcbnZhciBHYW1lID0gY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBtb25leUl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IE1vbmV5SW5HYW1lXG4gICAgICAgIH0sXG4gICAgICAgIGhlbHBub2RlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGxpc3ROb2RlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRlbnRNYWluTm9kZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGxhYmVsQ29udGVudFF1ZXN0aW9uOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBsYWJlbFRpdGxlUXVlc3Rpb246IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGFuc0NvbnRyb2xsZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IEFuc3dlckNvbnRyb2xsZXJcbiAgICAgICAgfSxcbiAgICAgICAgb3Bwb3R1bml0aWVzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIHRpbWVCYXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgY2hvb3NlOiBjYy5FbnVtLFxuICAgICAgICB0cnVlQW5zd2VyOiBjYy5FbnVtLFxuICAgICAgICBsYWJlbFRpbWVyOiBjYy5MYWJlbCxcbiAgICAgICAgdGltZTogMCxcbiAgICAgICAgc3BlZWRUaW1lckJhcjogMCxcbiAgICAgICAgdGltZU9uY2VMZXZlbDogMzAsIC8vMzBzZWNvbmRzIHBlciBsZXZlbFxuICAgICAgICBpc1N0YXJ0OiBCb29sZWFuKGZhbHNlKSwgLy9cbiAgICAgICAgaXNOZXh0OiBCb29sZWFuKGZhbHNlKSxcbiAgICAgICAgaXNQbGF5OiBCb29sZWFuKGZhbHNlKSxcbiAgICAgICAgdHh0UXVlc3Rpb246IFwiQ29udGVudCBxdWVzdGlvblwiLFxuICAgICAgICB0eHRRdWVzVGl0bGU6IFwiQ8OidSBcIixcbiAgICAgICAgYW5pbV9saXN0OiBjYy5BbmltYXRpb24sXG4gICAgICAgIGFuaW1fbWFpbjogY2MuQW5pbWF0aW9uLFxuICAgICAgICBoZWxwczogY2MuQ29tcG9uZW50LFxuICAgICAgICB0aW1lU3RhcnQ6IDAsXG4gICAgICAgIHRpbWVQYXVzZTogMCxcbiAgICAgICAgdGltZUVuZDogMCxcbiAgICAgICAgdG90YWxUaW1lOiAwLFxuICAgICAgICBtZW10aW1lcjogMCxcbiAgICAgICAgZGlhbG9nQ29uZmlybTogY2MuUHJlZmFiXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgd2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICAgICAgLy8gaWYoY2Muc3lzLmlzTW9iaWxlKXtcbiAgICAgICAgLy8gICAgIGNjLnZpZXcuc2V0RGVzaWduUmVzb2x1dGlvblNpemUod2luU2l6ZS53aWR0aCx3aW5TaXplLmhlaWdodCxjYy5SZXNvbHV0aW9uUG9saWN5LlNIT1dfQUxMKTtcbiAgICAgICAgLy8gICAgIHRoaXMudGltZXJiYXIudG90YWxMZW5ndGg9d2luU2l6ZS53aWR0aDtcbiAgICAgICAgLy8gfVxuICAgICAgICB2YXIgc2l6ZUNhbnZhcyA9IGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpO1xuICAgICAgICB0aGlzLmlzU3RhcnQgPSBmYWxzZTtcbiAgICAgICAgLy8gdGhpcy5zcGVlZFRpbWVyQmFyPSh0aGlzLnRpbWVyYmFyLndpZHRoL3RoaXMudGltZU9uY2VMZXZlbCkvNjA7XG4gICAgICAgIHN0cmluZ2luZm9ybWF0aW9uID0gTG9hZEdhbWUuZ2V0U3RyaW5nSnNvbigpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9LFxuXG4gICAgbmV4dFRpbWVCYXI6IGZ1bmN0aW9uIG5leHRUaW1lQmFyKHNwZWVkVGltZXJCYXIpIHtcblxuICAgICAgICBpZiAoc3BlZWRUaW1lckJhciA+IDApIHtcbiAgICAgICAgICAgIHRoaXMudGltZUJhci53aWR0aCA9IHRoaXMudGltZUJhci53aWR0aCAtIHNwZWVkVGltZXJCYXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVCYXIud2lkdGggPSB0aGlzLnRpbWVCYXIud2lkdGggLSAxMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50aW1lQmFyLndpZHRoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BHYW1lKCk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFN0cmluZ0pzb246IGZ1bmN0aW9uIGdldFN0cmluZ0pzb24oKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdpbmZvcm1hdGlvbjtcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgdGhpcy5jaG9vc2UgPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcbiAgICAgICAgY3VycmVudFF1ZXN0aW9uID0gMDtcbiAgICAgICAgdGhpcy5pc1N0YXJ0ID0gZmFsc2U7XG4gICAgICAgIC8vIHRoaXMuYW5zQ29udHJvbGxlci5yZW1vdmVFdmVudExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuYW5pbV9saXN0ID0gdGhpcy5saXN0Tm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5hbmltX21haW4gPSB0aGlzLmNvbnRlbnRNYWluTm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgdGhpcy5pbml0UHJlKCk7XG4gICAgfSxcbiAgICBpbml0UHJlOiBmdW5jdGlvbiBpbml0UHJlKCkge1xuICAgICAgICB0aGlzLmhlbHBzLmRvQWxsb3dDbGlja2VkQWxsSGVscCgpO1xuICAgICAgICB0aGlzLmxhYmVsVGltZXIuc3RyaW5nID0gdGhpcy50aW1lT25jZUxldmVsO1xuICAgICAgICAvLyB0aGlzLnRpbWVyYmFyLnByb2dyZXNzPTE7XG4gICAgICAgIHRoaXMuc2V0TW9uZXkoY3VycmVudFF1ZXN0aW9uKTtcbiAgICAgICAgdGhpcy5zcGVlZFRpbWVyQmFyID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLndpZHRoIC8gMzAgLyA0MDtcbiAgICAgICAgdGhpcy50aW1lQmFyLndpZHRoID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZSgpLndpZHRoO1xuICAgICAgICB0aGlzLm1lbXRpbWVyID0gdGhpcy50aW1lQmFyO1xuICAgICAgICB2YXIgbGlzdENvbXBvbmVudCA9IHRoaXMubGlzdE5vZGUuZ2V0Q29tcG9uZW50KCdMaXN0TGV2ZWxNb25leScpO1xuICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uID09PSAwICYmIHRoaXMuaXNTdGFydCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGxpc3RDb21wb25lbnQuaW5pdEZpcnN0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0Q29tcG9uZW50LmluaXRHYW1lKGN1cnJlbnRRdWVzdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgQXVkaW9Db250cm9sbGVyLnN0b3BBbGwoKTtcbiAgICAgICAgdGhpcy5hbmltX2xpc3QucGxheSgnYW5pbV90cmFuc2l0aW9uX2xpc3RfaW4nKTtcbiAgICAgICAgdGhpcy5hbmltX21haW4ucGxheSgnYW5pbV90cmFuc2l0aW9uX3F1ZXN0aW9uX291dCcpO1xuICAgIH0sXG4gICAgY2xpY2tMaXN0TGV2ZWxNb25leTogZnVuY3Rpb24gY2xpY2tMaXN0TGV2ZWxNb25leSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdGFydCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5wbGF5QmFja2dyb3VuZE11c2ljKHRydWUpO1xuICAgICAgICAgICAgQXVkaW9Db250cm9sbGVyLnBsYXlDbGlja1NvdW5kKCk7XG4gICAgICAgICAgICB0aGlzLmFuaW1fbGlzdC5wbGF5KCdhbmltX3RyYW5zaXRpb25fbGlzdF9vdXQnKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbV9tYWluLnBsYXkoJ2FuaW1fdHJhbnNpdGlvbl9xdWVzdGlvbl9pbicpO1xuICAgICAgICAgICAgdGhpcy5hbnNDb250cm9sbGVyLmluaXQoKTtcbiAgICAgICAgICAgIHRoaXMuYW5zQ29udHJvbGxlci5yZXNldEV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIEdhbWVPdmVyLnNldEN1cnJlbnRMZXZlbChjdXJyZW50UXVlc3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaXNQbGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudGltZVN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB0aGlzLnRvdGFsVGltZSA9IDA7XG4gICAgICAgICAgICBpZiAodGhpcy5pc05leHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0U3RhcnRHYW1lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdE5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjYWxsQmFjayA9IGNjLmNhbGxGdW5jKHRoaXMuc2hvd0RpYWxvZywgdGhpcywgXCJC4bqhbiBjw7MgY2jhuq9jIGNo4bqvbiBtdeG7kW4gZOG7q25nIGN14buZYyBjaMahaT9cIik7XG4gICAgICAgICAgICB2YXIga2V5Ym9hcmRsaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmJhY2sgfHwga2V5Q29kZSA9PT0gY2MuS0VZLmJhY2tzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2s7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmhvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoa2V5Ym9hcmRsaXN0ZW5lciwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFRleHRGb3JBbnN3ZXI6IGZ1bmN0aW9uIHNldFRleHRGb3JBbnN3ZXIocXVlc3Rpb25qc29uKSB7XG4gICAgICAgIHRoaXMudHh0UXVlc3Rpb24gPSBxdWVzdGlvbmpzb24ucXVlc3Rpb247XG4gICAgICAgIHRoaXMuYW5zQ29udHJvbGxlci5zZXRUZXh0Rm9yQnV0dG9uKHF1ZXN0aW9uanNvbi5hbnN3ZXJfYSwgcXVlc3Rpb25qc29uLmFuc3dlcl9iLCBxdWVzdGlvbmpzb24uYW5zd2VyX2MsIHF1ZXN0aW9uanNvbi5hbnN3ZXJfZCk7XG4gICAgICAgIHRoaXMudHJ1ZUFuc3dlciA9IHF1ZXN0aW9uanNvbi5hbnN3ZXJfdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbENvbnRlbnRRdWVzdGlvbi5zdHJpbmcgPSB0aGlzLnR4dFF1ZXN0aW9uO1xuICAgICAgICB0aGlzLmxhYmVsVGl0bGVRdWVzdGlvbi5zdHJpbmcgPSB0aGlzLnR4dFF1ZXNUaXRsZSArIHF1ZXN0aW9uanNvbi5sZXZlbDtcblxuICAgICAgICB0aGlzLmhlbHBzLnNldFRydWVBbnN3ZXIodGhpcy50cnVlQW5zd2VyKTtcbiAgICB9LFxuXG4gICAgaW5pdFN0YXJ0R2FtZTogZnVuY3Rpb24gaW5pdFN0YXJ0R2FtZSgpIHtcbiAgICAgICAgLy8gdGhpcy5hbnNDb250cm9sbGVyLmluaXQoKTtcbiAgICAgICAgdGhpcy5pc1N0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc05leHQgPSBmYWxzZTtcbiAgICAgICAgLy9sb2FkIGRhdGEgdG8gdGhpcyBub2Rlc1xuICAgICAgICB2YXIganNvbmNvbnRlbnQgPSBKU09OLnBhcnNlKHN0cmluZ2luZm9ybWF0aW9uKTtcbiAgICAgICAgdmFyIHF1ZXN0aW9uanNvbiA9IGpzb25jb250ZW50LnF1ZXN0aW9ua2l0c1tjdXJyZW50UXVlc3Rpb25dO1xuICAgICAgICB0aGlzLnNldFRleHRGb3JBbnN3ZXIocXVlc3Rpb25qc29uKTtcbiAgICB9LFxuICAgIGluaXROZXh0OiBmdW5jdGlvbiBpbml0TmV4dCgpIHtcbiAgICAgICAgdGhpcy5pc05leHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbnNDb250cm9sbGVyLnJlZnJlc2goKTtcbiAgICAgICAgdmFyIGpzb25jb250ZW50ID0gSlNPTi5wYXJzZShzdHJpbmdpbmZvcm1hdGlvbik7XG4gICAgICAgIHZhciBxdWVzdGlvbmpzb24gPSBqc29uY29udGVudC5xdWVzdGlvbmtpdHNbY3VycmVudFF1ZXN0aW9uXTtcbiAgICAgICAgdGhpcy5zZXRUZXh0Rm9yQW5zd2VyKHF1ZXN0aW9uanNvbik7XG4gICAgICAgIHRoaXMuaXNTdGFydCA9IHRydWU7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNTdGFydCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNQbGF5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIHZhciB0aW1lciA9IHRoaXMudGltZU9uY2VMZXZlbCAtIHRoaXMudG90YWxUaW1lIC0gKG5vdyAtIHRoaXMudGltZVN0YXJ0KSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgdGhpcy5sYWJlbFRpbWVyLnN0cmluZyA9IE1hdGgucm91bmQodGltZXIpIDw9IDAgPyAwIDogTWF0aC5yb3VuZCh0aW1lcik7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVyICogdGhpcy5zcGVlZFRpbWVyQmFyICogNDAgLSB0aGlzLnNwZWVkVGltZXJCYXIgPT09IHRoaXMubWVtdGltZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lQmFyLndpZHRoID0gdGhpcy50aW1lQmFyLndpZHRoIC0gdGhpcy5zcGVlZFRpbWVyQmFyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUJhci53aWR0aCA9IHRpbWVyICogdGhpcy5zcGVlZFRpbWVyQmFyICogNDAgLSB0aGlzLnNwZWVkVGltZXJCYXI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVtdGltZXIgPSB0aGlzLnRpbWVCYXIud2lkdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVCYXIud2lkdGggPD0gMCB8fCB0aGlzLnRvdGFsVGltZSArIE1hdGguZmxvb3IoKG5vdyAtIHRoaXMudGltZVN0YXJ0KSAvIDEwMDApID49IHRoaXMudGltZU9uY2VMZXZlbCB8fCB0aGlzLmxhYmVsVGltZXIuc3RyaW5nID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICAgICAgQXVkaW9Db250cm9sbGVyLnN0b3BBbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgQXVkaW9Db250cm9sbGVyLnBsYXlNdXNpYygnb3V0X29mX3RpbWUubXAzJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BHYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0NvbmZpcm0oXCJUaMO0bmcgYsOhb1wiLCBcIsSQ4buTbmcgw71cIiwgXCJI4bq/dCBnaeG7nVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGZpbmlzaDogZnVuY3Rpb24gZmluaXNoKCkge1xuICAgICAgICB0aGlzLmNoZWNrUmVzdWx0KHRoaXMuYW5zQ29udHJvbGxlci5nZXROdW1iZXJCdXR0b25DbGlja2VkKCksIHRoaXMudHJ1ZUFuc3dlcik7XG4gICAgfSxcbiAgICBzdG9wR2FtZTogZnVuY3Rpb24gc3RvcEdhbWUoKSB7XG4gICAgICAgIHRoaXMuaXNTdGFydCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzUGxheSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBjaGVja1Jlc3VsdDogZnVuY3Rpb24gY2hlY2tSZXN1bHQobnVtQnV0dG9uQ2hvb3NlLCBudW1CdXR0b25UcnVlKSB7XG4gICAgICAgIHRoaXMuYW5zQ29udHJvbGxlci5yZW1vdmVFdmVudExpc3RlbmVyKCk7XG4gICAgICAgIHZhciBkZWxheSA9IGNjLmRlbGF5VGltZSgzKTtcbiAgICAgICAgaWYgKG51bUJ1dHRvbkNob29zZSA9PT0gbnVtQnV0dG9uVHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGZ1bmNUcnVlUmUgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbnNDb250cm9sbGVyLnNldFRydWVSZXN1bHQoY3VycmVudFF1ZXN0aW9uKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgdmFyIGFmdGVyVCA9IGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbiArPSAxO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UXVlc3Rpb24gPCAxNSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTmV4dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFByZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcEdhbWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIC8vIGxldCBzZXF1ZW5jZVQ9Y2Muc2VxdWVuY2UoZnVuY1RydWVSZSxkZWxheSxhZnRlclQpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShmdW5jVHJ1ZVJlLCBkZWxheSwgYWZ0ZXJUKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZnVuY0ZhbHNlUmUgPSBjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbnNDb250cm9sbGVyLnNldEZhbHNlUmVzdWx0KG51bUJ1dHRvblRydWUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgYWZ0ZXJGID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoZmFsc2UpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VxdWVuY2VGID0gY2Muc2VxdWVuY2UoZnVuY0ZhbHNlUmUsIGRlbGF5LCBhZnRlckYpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXF1ZW5jZUYpO1xuXG4gICAgICAgICAgICAvL2dhbWVvdmVyXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldE1vbmV5OiBmdW5jdGlvbiBzZXRNb25leShudW1iZXJxdWVzdGlvbikge1xuICAgICAgICB0aGlzLm1vbmV5SXRlbS5zZXRMYWJlbE1vbmV5KGN1cnJlbnRRdWVzdGlvbiAtIDEpO1xuICAgIH0sXG4gICAgcmVzdGFydDogZnVuY3Rpb24gcmVzdGFydCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnR2FtZVNjZW5lJyk7XG4gICAgfSxcbiAgICBnZXRDdXJyZW50UXVlc3Rpb246IGZ1bmN0aW9uIGdldEN1cnJlbnRRdWVzdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRRdWVzdGlvbjtcbiAgICB9LFxuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiBnYW1lT3Zlcihpc1N0b3BIZWxwKSB7XG4gICAgICAgIEdhbWVPdmVyLnNldEluaXQoaXNTdG9wSGVscCk7XG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0dhbWVPdmVyU2NlbmUnKTtcbiAgICB9LFxuICAgIGRpc2FibGVNYWluQ29udGVudDogZnVuY3Rpb24gZGlzYWJsZU1haW5Db250ZW50KCkge1xuICAgICAgICB0aGlzLmFuc0NvbnRyb2xsZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLmhlbHBzLmRvRGlzYWxsb3dDbGlja2VkQWxsSGVscCgpO1xuICAgIH0sXG4gICAgZW5hYmxlTWFpbkNvbnRlbnQ6IGZ1bmN0aW9uIGVuYWJsZU1haW5Db250ZW50KCkge1xuICAgICAgICB0aGlzLmFuc0NvbnRyb2xsZXIucmVzZXRFdmVudExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuaGVscHMuZG9BbGxvd0NsaWNrZWRBbGxIZWxwKCk7XG4gICAgfSxcbiAgICBzZXRJc1N0YXJ0OiBmdW5jdGlvbiBzZXRJc1N0YXJ0KGlzU3QpIHtcbiAgICAgICAgdGhpcy5pc1BsYXkgPSBpc1N0O1xuICAgICAgICBpZiAodGhpcy5pc1N0YXJ0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAoaXNTdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVFbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsVGltZSA9IHRoaXMudG90YWxUaW1lICsgTWF0aC5mbG9vcigodGhpcy50aW1lRW5kIC0gdGhpcy50aW1lU3RhcnQpIC8gMTAwMCk7XG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKE1hdGguZmxvb3IoKHRoaXMudGltZUVuZC10aGlzLnRpbWVTdGFydCkvMTAwMCkgK1wiIFwiK3RoaXMudG90YWxUaW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lU3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvd0RpYWxvZzogZnVuY3Rpb24gc2hvd0RpYWxvZyhjb250ZW50RGlhbG9nKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZU1haW5Db250ZW50KCk7XG4gICAgICAgIHZhciBkaWFsb2cgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmRpYWxvZ0NvbmZpcm0pO1xuICAgICAgICBkaWFsb2cuc2V0UG9zaXRpb24gPSBjYy5wKDEwODAsIDY0MCk7XG4gICAgICAgIGRpYWxvZy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQoZGlhbG9nKTtcbiAgICAgICAgdmFyIGNvbXAgPSBkaWFsb2cuZ2V0Q29tcG9uZW50KCdDb25maXJtRGlhbG9nUHJlZmFiJyk7XG4gICAgICAgIGNvbXAuaW5pdChjb250ZW50RGlhbG9nLCB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KCdHYW1lJykpO1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWRkQ2hpbGQoZGlhbG9nKTtcbiAgICAgICAgdGhpcy5pc1BsYXkgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25DbGlja09LRGlhbG9nOiBmdW5jdGlvbiBvbkNsaWNrT0tEaWFsb2coKSB7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5zdG9wQWxsKCk7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5wbGF5QXVkaW8oJ2xvc2UubXAzJywgZmFsc2UpO1xuICAgICAgICBpZiAodGhpcy5pc1N0YXJ0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWVPdmVyKHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNTdGFydCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEdhbWUoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrQ2FuY2VsRGlhbG9nOiBmdW5jdGlvbiBvbkNsaWNrQ2FuY2VsRGlhbG9nKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BsYXkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZU1haW5Db250ZW50KCk7XG4gICAgICAgICAgICB0aGlzLmlzUGxheSA9IHRydWU7XG4gICAgICAgICAgICBjYy5sb2coXCJjbGljayBjYW5jZWxcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob3dDb25maXJtOiBmdW5jdGlvbiBzaG93Q29uZmlybSh0aXRsZSwgbmFtZUJ0bkNvbmZpcm0sIGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlTWFpbkNvbnRlbnQoKTtcbiAgICAgICAgdmFyIGRpYWxvZyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuZGlhbG9nQ29uZmlybSk7XG4gICAgICAgIGRpYWxvZy5zZXRQb3NpdGlvbiA9IGNjLnAoMTA4MCwgNjQwKTtcbiAgICAgICAgZGlhbG9nLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChkaWFsb2cpO1xuICAgICAgICB2YXIgY29tcCA9IGRpYWxvZy5nZXRDb21wb25lbnQoJ0NvbmZpcm1EaWFsb2dQcmVmYWInKTtcbiAgICAgICAgY29tcC5pbml0Q29uZmlybSh0aXRsZSwgbmFtZUJ0bkNvbmZpcm0sIGNvbnRlbnQsIHRoaXMubm9kZS5nZXRDb21wb25lbnQoJ0dhbWUnKSk7XG4gICAgICAgIC8vIHRoaXMubm9kZS5hZGRDaGlsZChkaWFsb2cpO1xuICAgICAgICB0aGlzLmlzUGxheSA9IGZhbHNlO1xuICAgIH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgR2FtZTogR2FtZSxcbiAgICBnZXRMYXN0TGV2ZWw6IGZ1bmN0aW9uIGdldExhc3RMZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRRdWVzdGlvbjtcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnM2M2MGFGQ2o1QkN4YkR3OEVuN0kzK2InLCAnSG9tZVNjZW5lX0xvZ2luJyk7XG4vLyBzY3JpcHRzXFxIb21lU2NlbmVfTG9naW4uanNcblxudmFyIFJlYWRXcml0ZUpzb24gPSByZXF1aXJlKCdSZWFkV3JpdGVKc29uJyk7XG52YXIgU3RvcmVEYXRhID0gcmVxdWlyZSgnU3RvcmVEYXRhJyk7XG52YXIgVXNlcktleSA9IHJlcXVpcmUoJ1VzZXJJbmZvcktleScpLlVzZXJJbmZvcktleTtcbnZhciBBdWRpb0N0ciA9IHJlcXVpcmUoJ0F1ZGlvQ29udHJvbGxlcicpO1xudmFyIEF1ZGlvQ29udHJvbGxlciA9IEF1ZGlvQ3RyLkF1ZGlvQ29udHJvbGxlcjtcbnZhciBTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlJyk7XG5cbnZhciBIb21lU2NlbmVfTG9naW4gPSBjYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgYnV0dG9uU2luZ2xlUGxheToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIGJ1dHRvblRoYWNoRGF1OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcblxuICAgICAgICBsb2FkaW5nUHJlZmFiOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpblByZWZhYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICB1c2VyUHJlZmFiOiBjYy5QcmVmYWIsXG4gICAgICAgIGJvbnVzUHJlZmFiOiBjYy5QcmVmYWJcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHdpblNpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG4gICAgICAgIHZhciBkZXNpZ25TaXplID0gY2Mudmlldy5nZXRGcmFtZVNpemUoKTtcbiAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgY2Mudmlldy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSh3aW5TaXplLndpZHRoLCB3aW5TaXplLmhlaWdodCwgY2MuUmVzb2x1dGlvblBvbGljeS5TSE9XX0FMTCk7XG4gICAgICAgIH1cbiAgICAgICAgY2MubG9nKFwidXBkYXRlIDA4LTA2LTIwMTZcIik7XG4gICAgICAgIHZhciBrZXlib2FyZExpc3Rlbm5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmJhY2sgfHwga2V5Q29kZSA9PT0gY2MuS0VZLmJhY2tzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coXCJzdG9wIGdhbWVcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNjLkdhbWUub25TdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnNjcmVlbi5leGl0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmhvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKFwiY2xpY2tpbmcgaG9tZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgY2MuR2FtZS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcihrZXlib2FyZExpc3Rlbm5lciwgdGhpcyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUJhY2tncm91bmRNdXNpYyhmYWxzZSk7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICB2YXIgdXNlcm5hbWUgPSBTdG9yZURhdGEuZ2V0RGF0YShVc2VyS2V5Lk5BTUUpO1xuICAgICAgICB1c2VybmFtZSA9IHVzZXJuYW1lID09PSBudWxsID8gXCJOb25hbWVcIiA6IHVzZXJuYW1lO1xuICAgICAgICB2YXIgdXNlclBGID0gY2MuaW5zdGFudGlhdGUodGhpcy51c2VyUHJlZmFiKTtcbiAgICAgICAgdmFyIHVzZXJDb21wID0gdXNlclBGLmdldENvbXBvbmVudCgnVXNlclByZWZhYicpO1xuICAgICAgICB1c2VyQ29tcC5zZXROYW1lKHVzZXJuYW1lKTtcbiAgICAgICAgdXNlckNvbXAuc2V0VHlwZShcIlRow60gc2luaFwiKTtcblxuICAgICAgICB1c2VyUEYuc2V0UG9zaXRpb24oLTM2MCwgMCk7XG4gICAgICAgIHVzZXJQRi5zZXRDb250ZW50U2l6ZSh1c2VyUEYud2lkdGgsIHRoaXMuY29udGFpblByZWZhYi5oZWlnaHQpO1xuICAgICAgICB0aGlzLmNvbnRhaW5QcmVmYWIuYWRkQ2hpbGQodXNlclBGKTtcblxuICAgICAgICB2YXIgbW9uZXkgPSBTdG9yZURhdGEuZ2V0RGF0YShVc2VyS2V5LlRPVEFMKTtcbiAgICAgICAgbW9uZXkgPSAhU3RvcmVEYXRhLmlzTnVtYmVyKG1vbmV5KSB8fCBwYXJzZUludChtb25leSkgPCAwID8gMCA6IG1vbmV5O1xuICAgICAgICB2YXIgYm9udXNQRiA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYm9udXNQcmVmYWIpO1xuICAgICAgICB2YXIgYm9udXNDb21wID0gYm9udXNQRi5nZXRDb21wb25lbnQoJ0JvbnVzUHJlZmFiJyk7XG4gICAgICAgIGJvbnVzQ29tcC5zZXRNb25leShTdG9yZURhdGEuZ2V0TWlsbGlvbihwYXJzZUludChtb25leSkpKTtcblxuICAgICAgICBib251c1BGLnNldFBvc2l0aW9uKDEwMCwgMCk7XG4gICAgICAgIHRoaXMuY29udGFpblByZWZhYi5hZGRDaGlsZChib251c1BGKTtcbiAgICB9LFxuXG4gICAgZG9Mb2FkVXNlckluZm9ybWF0aW9uOiBmdW5jdGlvbiBkb0xvYWRVc2VySW5mb3JtYXRpb24oKSB7XG4gICAgICAgIFJlYWRXcml0ZUpzb24ucmVhZEZpbGVKc29uKCdyZXNvdXJjZXMvVXNlckluZm9ybWF0aW9uLmpzb24nKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tCdXR0b25TaW5nbGVQbGF5OiBmdW5jdGlvbiBvbkNsaWNrQnV0dG9uU2luZ2xlUGxheSgpIHtcbiAgICAgICAgdGhpcy5uZXh0U2NlbmUoJ0xvYWRHYW1lU2NlbmVfTG9naW4nKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tCdXR0b25UaGFjaERhdTogZnVuY3Rpb24gb25DbGlja0J1dHRvblRoYWNoRGF1KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNsaWNraW5nIGJ1dHRvbiB0aGFjaGRhdVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tBcmNoaXZlbWVudDogZnVuY3Rpb24gb25DbGlja0FyY2hpdmVtZW50KCkge1xuICAgICAgICB0aGlzLm5leHRTY2VuZSgnQXJjaGl2ZW1lbnRTY2VuZScpO1xuICAgIH0sXG5cbiAgICBvbkNsaWNrU2V0dGluZzogZnVuY3Rpb24gb25DbGlja1NldHRpbmcoKSB7XG4gICAgICAgIHRoaXMubmV4dFNjZW5lKCdTZXR0aW5nU2NlbmUnKTtcbiAgICB9LFxuICAgIG5leHRTY2VuZTogZnVuY3Rpb24gbmV4dFNjZW5lKHNjZW5lKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBhdXNlQWxsRWZmZWN0cygpO1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUNsaWNrU291bmQoKTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKHNjZW5lKTtcbiAgICB9XG5cbiAgICAvL0FyY2hpdmVtZW50U2NlbmVcblxuICAgIC8vICxpbml0Rmlyc3Q6ZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgdmFyIGFyckFyPVtdO1xuICAgIC8vICAgICB2YXIgbHM9IGNjLnN5cy5sb2NhbFN0b3JhZ2U7XG4gICAgLy8gICAgIGlmKGxzLmdldEl0ZW0oU3RhdGUuQVJDSElWRU1FTlRfS0VZKSE9PW51bGwpe1xuICAgIC8vICAgICAgICAgZm9yKHZhciBpPTA7aTwyNztpKyspe1xuICAgIC8vICAgICAgICAgICAgIGFyckFyLnB1c2goLTEpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICBscy5zZXRJdGVtKFN0YXRlLkFSQ0hJVkVNRU5UX0tFWSxKU09OLnN0cmluZ2lmeShhcnJBcikpO1xuICAgIC8vICAgICB9XG5cbiAgICAvLyB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgSG9tZVNjZW5lX0xvZ2luOiBIb21lU2NlbmVfTG9naW5cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlMWNhZmZVc0FGRVA2SWpUMlptdmtpaCcsICdJdGVtTGV2ZWwnKTtcbi8vIHNjcmlwdHNcXHVpXFxJdGVtTGV2ZWwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxldmVsOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIG1vbmV5OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIHVuZGVyOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoZGF0YWxldmVsLCB0eXBlSXRlbSkge1xuICAgICAgICBpZiAoZGF0YWxldmVsLmxldmVsID09IDUgfHwgZGF0YWxldmVsLmxldmVsID09IDEwIHx8IGRhdGFsZXZlbC5sZXZlbCA9PSAxNSkge1xuICAgICAgICAgICAgdGhpcy5sZXZlbC5ub2RlLmNvbG9yID0gbmV3IGNjLkNvbG9yKDI1NSwgMjEwLCAwKTtcbiAgICAgICAgICAgIHRoaXMubW9uZXkubm9kZS5jb2xvciA9IG5ldyBjYy5Db2xvcigyNTUsIDIxMCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sZXZlbC5zdHJpbmcgPSBkYXRhbGV2ZWwubGV2ZWw7XG4gICAgICAgIHRoaXMubW9uZXkuc3RyaW5nID0gZGF0YWxldmVsLm5hbWU7XG4gICAgICAgIHN3aXRjaCAodHlwZUl0ZW0pIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAvL25vcm1hbFxuICAgICAgICAgICAgICAgIHRoaXMudW5kZXIubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAvL2N1cnJlbnRcbiAgICAgICAgICAgICAgICB0aGlzLnVuZGVyLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAvL2RvbmVcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDEwMDtcbiAgICAgICAgICAgICAgICB0aGlzLnVuZGVyLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldEN1cnJlbnQ6IGZ1bmN0aW9uIHNldEN1cnJlbnQoKSB7XG4gICAgICAgIHRoaXMudW5kZXIubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIH0sXG4gICAgc2V0RG9uZTogZnVuY3Rpb24gc2V0RG9uZSgpIHtcbiAgICAgICAgdGhpcy5sZXZlbC5ub2RlLm9wYWNpdHkgPSAxMDA7XG4gICAgICAgIHRoaXMubW9uZXkubm9kZS5vcGFjaXR5ID0gMTAwO1xuICAgIH0sXG4gICAgc2V0Tm9ybWFsOiBmdW5jdGlvbiBzZXROb3JtYWwoKSB7XG4gICAgICAgIHRoaXMudW5kZXIubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuICAgIHNldERhdGE6IGZ1bmN0aW9uIHNldERhdGEoZGF0YWxldmVsKSB7XG4gICAgICAgIHRoaXMubGV2ZWwuc3RyaW5nID0gZGF0YWxldmVsLmxldmVsO1xuICAgICAgICB0aGlzLm1vbmV5LnN0cmluZyA9IGRhdGFsZXZlbC5uYW1lO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDM0NzB5VktROURYS0J2YTR0dDY0eEQnLCAnTGlzdExldmVsTW9uZXknKTtcbi8vIHNjcmlwdHNcXHVpXFxMaXN0TGV2ZWxNb25leS5qc1xuXG52YXIgRGF0YUxldmVsID0gcmVxdWlyZSgnRGF0YUxldmVsJykuZGF0YWxldmVsO1xudmFyIGFycmF5ID0gW107XG52YXIgTGlzdExldmVsTW9uZXkgPSBjYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgc2Nyb2xsdmlldzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsVmlld1xuICAgICAgICB9LFxuICAgICAgICBwcmVmYWJJdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgY3VycmVudDogNFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuICAgIGluaXRHYW1lOiBmdW5jdGlvbiBpbml0R2FtZShsZXZlbCkge1xuICAgICAgICAvL2xldmVsIDAtPiAxNFxuICAgICAgICB2YXIgY29udGVudCA9IHRoaXMuc2Nyb2xsdmlldy5jb250ZW50O1xuXG4gICAgICAgIHZhciBuZXdDb21wID0gYXJyYXlbbGV2ZWxdLmdldENvbXBvbmVudCgnSXRlbUxldmVsJykuc2V0Q3VycmVudCgpO1xuXG4gICAgICAgIHZhciBvbGRDb21wID0gYXJyYXlbbGV2ZWwgLSAxXS5nZXRDb21wb25lbnQoJ0l0ZW1MZXZlbCcpLnNldE5vcm1hbCgpO1xuICAgIH0sXG4gICAgaW5pdEZpcnN0OiBmdW5jdGlvbiBpbml0Rmlyc3QoKSB7XG4gICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5zY3JvbGx2aWV3LmNvbnRlbnQ7XG4gICAgICAgIGFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IDE0OyBpKyspIHtcblxuICAgICAgICAgICAgdmFyIGRhdGEgPSBEYXRhTGV2ZWxbaV07XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiSXRlbSk7XG5cbiAgICAgICAgICAgIHZhciBjb21wb25lbnQgPSBpdGVtLmdldENvbXBvbmVudCgnSXRlbUxldmVsJyk7XG4gICAgICAgICAgICBjb21wb25lbnQuaW5pdChkYXRhLCAwKTtcbiAgICAgICAgICAgIC8vIHRoaXMucHJlZmFiSXRlbS5hY3RpdmU9dHJ1ZTtcbiAgICAgICAgICAgIGNvbnRlbnQuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICBpdGVtLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgLy8gdmFyIGRlbW89Y2MuY2FsbEZ1bmMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vICAgICBjYy5sb2coXCJ0aGlzIGlzIHRlc3QgcnVuYWN0aW9uXCIpO1xuICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgICAgIC8vIGNjLmxvZyhcInN0YXJ0XCIpO1xuICAgICAgICAgICAgLy8gdmFyIHNlPWNjLnNlcXVlbmNlKGRlbGF5LGRlbW8pO1xuICAgICAgICAgICAgLy8gdGhpcy5ub2RlLnJ1bkFjdGlvbihzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlbGF5ID0gY2MuZGVsYXlUaW1lKDEuNSk7XG4gICAgICAgIHZhciBmaXJzdExldmVsID0gY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXJyYXlbMF0uZ2V0Q29tcG9uZW50KCdJdGVtTGV2ZWwnKS5zZXRDdXJyZW50KCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB2YXIgc2VxdWVuY2UgPSBjYy5zZXF1ZW5jZShkZWxheSwgZmlyc3RMZXZlbCk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxdWVuY2UpO1xuICAgIH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBMaXN0TGV2ZWxNb25leTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2MxN2ZmWXNObTVLT3J0K1oxWHpHVGlwJywgJ0xvYWRHYW1lX0xvZ2luJyk7XG4vLyBzY3JpcHRzXFxMb2FkR2FtZV9Mb2dpbi5qc1xuXG52YXIgTGlzdExldmVsTW9uZXkgPSByZXF1aXJlKCdMaXN0TGV2ZWxNb25leScpLkxpc3RMZXZlbE1vbmV5O1xudmFyIFN0b3JlRGF0YSA9IHJlcXVpcmUoJ1N0b3JlRGF0YScpO1xudmFyIFVzZXJLZXkgPSByZXF1aXJlKCdVc2VySW5mb3JLZXknKS5Vc2VySW5mb3JLZXk7XG52YXIgc3RyaW5nanNvbiA9IFwic3RyaW5nIGpzb25cIjtcbnZhciBMb2FkR2FtZV9Mb2dpbiA9IGNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdXNlclByZWZhYjogY2MuUHJlZmFiLFxuICAgICAgICBib251c1ByZWZhYjogY2MuUHJlZmFiLFxuICAgICAgICBjb250YWluUHJlZmFiOiBjYy5Ob2RlLFxuICAgICAgICBzdHJqc29uOiBcIlwiXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgd2luU2l6ZSA9IGNjLmRpcmVjdG9yLmdldFdpblNpemUoKTtcbiAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgY2Mudmlldy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSh3aW5TaXplLndpZHRoLCB3aW5TaXplLmhlaWdodCwgY2MuUmVzb2x1dGlvblBvbGljeS5TSE9XX0FMTCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYoY2Muc3lzLm9zPT09Y2Muc3lzLk9TX1dJTkRPV1Mpe1xuICAgICAgICAvLyAgICAgY2Mud2luU2l6ZT1jYy53XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgdGhpcy5kb0xvYWRKc29uKCk7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICB2YXIgdXNlcm5hbWUgPSBTdG9yZURhdGEuZ2V0RGF0YShVc2VyS2V5Lk5BTUUpO1xuICAgICAgICB1c2VybmFtZSA9IHVzZXJuYW1lID09PSBudWxsID8gXCJOb25hbWVcIiA6IHVzZXJuYW1lO1xuICAgICAgICB2YXIgdXNlclBGID0gY2MuaW5zdGFudGlhdGUodGhpcy51c2VyUHJlZmFiKTtcbiAgICAgICAgdmFyIHVzZXJDb21wID0gdXNlclBGLmdldENvbXBvbmVudCgnVXNlclByZWZhYicpO1xuICAgICAgICB1c2VyQ29tcC5zZXROYW1lKHVzZXJuYW1lKTtcbiAgICAgICAgdXNlckNvbXAuc2V0VHlwZShcIlRow60gc2luaFwiKTtcblxuICAgICAgICB1c2VyUEYuc2V0UG9zaXRpb24oLTIwMCwgMjApO1xuICAgICAgICB1c2VyUEYuc2V0Q29udGVudFNpemUodXNlclBGLndpZHRoLCB0aGlzLmNvbnRhaW5QcmVmYWIuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5jb250YWluUHJlZmFiLmFkZENoaWxkKHVzZXJQRik7XG5cbiAgICAgICAgdmFyIG1vbmV5ID0gU3RvcmVEYXRhLmdldERhdGEoVXNlcktleS5UT1RBTCk7XG4gICAgICAgIG1vbmV5ID0gIVN0b3JlRGF0YS5pc051bWJlcihtb25leSkgfHwgcGFyc2VJbnQobW9uZXkpIDwgMCA/IDAgOiBtb25leTtcbiAgICAgICAgdmFyIGJvbnVzUEYgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJvbnVzUHJlZmFiKTtcbiAgICAgICAgdmFyIGJvbnVzQ29tcCA9IGJvbnVzUEYuZ2V0Q29tcG9uZW50KCdCb251c1ByZWZhYicpO1xuICAgICAgICBib251c0NvbXAuc2V0TW9uZXkoU3RvcmVEYXRhLmdldE1pbGxpb24ocGFyc2VJbnQobW9uZXkpKSk7XG5cbiAgICAgICAgYm9udXNQRi5zZXRQb3NpdGlvbigtMTAwLCAtNTApO1xuICAgICAgICB0aGlzLmNvbnRhaW5QcmVmYWIuYWRkQ2hpbGQoYm9udXNQRik7XG4gICAgfSxcblxuICAgIGxvYWRPdGhlclNjZW5lOiBmdW5jdGlvbiBsb2FkT3RoZXJTY2VuZSgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdHYW1lU2NlbmUnKTtcbiAgICB9LFxuICAgIGRvTG9hZEpzb246IGZ1bmN0aW9uIGRvTG9hZEpzb24oKSB7XG4gICAgICAgIHZhciB1cmwgPSBjYy51cmwucmF3KCdyZXNvdXJjZXMvZGF0YS9RdWVzdGlvbktpdC5qc29uJyk7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkKHVybCwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICAgICAgICBzdHJpbmdqc29uID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcbiAgICAgICAgICAgIHRoaXMuc3RyanNvbiA9IHN0cmluZ2pzb247XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0dhbWVTY2VuZScpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdldFN0ckpzb246IGZ1bmN0aW9uIGdldFN0ckpzb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmpzb247XG4gICAgfSxcblxuICAgIHNldE5hbWVQbGF5ZXI6IGZ1bmN0aW9uIHNldE5hbWVQbGF5ZXIobmFtZSkge1xuICAgICAgICB0aGlzLm5hbWVwbGF5ZXIuc3RyaW5nID0gbmFtZTtcbiAgICB9LFxuXG4gICAgc2V0TW9uZXk6IGZ1bmN0aW9uIHNldE1vbmV5KG1vbmV5KSB7XG4gICAgICAgIHRoaXMubGFiZWxtb25leS5zdHJpbmcgPSBtb25leTtcbiAgICB9LFxuXG4gICAgc2V0VHlwZUxheWVyOiBmdW5jdGlvbiBzZXRUeXBlTGF5ZXIodHlwZSkge1xuICAgICAgICB0aGlzLnR5cGVsYXllci5zdHJpbmcgPSB0eXBlO1xuICAgIH1cblxufSk7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBMb2FkR2FtZV9Mb2dpbjogTG9hZEdhbWVfTG9naW4sXG5cbiAgICBnZXRTdHJpbmdKc29uOiBmdW5jdGlvbiBnZXRTdHJpbmdKc29uKCkge1xuICAgICAgICByZXR1cm4gc3RyaW5nanNvbjtcbiAgICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNGY4MWZVRmFSSlBocVIvQjF0WXhvWXcnLCAnTW9uZXlJbkdhbWUnKTtcbi8vIHNjcmlwdHNcXHVpXFxNb25leUluR2FtZS5qc1xuXG52YXIgRGF0YUxldmVsID0gcmVxdWlyZSgnRGF0YUxldmVsJykuZGF0YWxldmVsO1xudmFyIE1vbmV5SW5HYW1lID0gY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsYWJlbE1vbmV5OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBiZWdpbjogMCxcbiAgICAgICAgbW9uZXk6IDBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcbiAgICBzZXRMYWJlbE1vbmV5OiBmdW5jdGlvbiBzZXRMYWJlbE1vbmV5KG51bWJlcnF1ZXN0aW9uKSB7XG4gICAgICAgIC8vMCAtPiAxNFxuICAgICAgICBpZiAobnVtYmVycXVlc3Rpb24gPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRleHRMYWJlbCh0aGlzLmJlZ2luKTtcbiAgICAgICAgICAgIHRoaXMubW9uZXkgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBEYXRhTGV2ZWxbbnVtYmVycXVlc3Rpb25dO1xuICAgICAgICAgICAgdGhpcy5tb25leSA9IGRhdGEubW9uZXk7XG4gICAgICAgICAgICB0aGlzLnNldFRleHRMYWJlbChkYXRhLm5hbWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRUZXh0TGFiZWw6IGZ1bmN0aW9uIHNldFRleHRMYWJlbCh0ZXh0bW9uZXkpIHtcbiAgICAgICAgdGhpcy5sYWJlbE1vbmV5LnN0cmluZyA9IHRleHRtb25leTtcbiAgICB9LFxuICAgIGdldE1vbmV5OiBmdW5jdGlvbiBnZXRNb25leSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9uZXk7XG4gICAgfVxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbm1vZHVsZS5leHBvcnRzID0gTW9uZXlJbkdhbWU7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwN2IyZVdyT210TWdMZi8wbjRMMm93TicsICdQYW5lbE9wcG90dW5pdHknKTtcbi8vIHNjcmlwdHNcXG1vZHVsZXNcXFBhbmVsT3Bwb3R1bml0eS5qc1xuXG52YXIgQW5zd2VyU3QgPSByZXF1aXJlKCdTdGF0ZScpO1xudmFyIEdhbWVIZWxwID0gcmVxdWlyZSgnR2FtZV9IZWxwTWVudScpO1xudmFyIEF1ZGlvQ29udHJvbGxlciA9IHJlcXVpcmUoJ0F1ZGlvQ29udHJvbGxlcicpO1xudmFyIEFuc3dlclN0YXRlID0gQW5zd2VyU3QuQW5zd2VyU3RhdGU7XG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdhbWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IEdhbWVIZWxwXG4gICAgICAgIH0sXG4gICAgICAgIG5vZGVQYXJlbnQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBub2RlSGVscHM6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgbm9kZUNhbGw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgbm9kZUFuc3dlckNhbGw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgbm9kZUF1ZGllbmNlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGJ1dHRvblRlYWNoZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBidXR0b25Eb2N0b3I6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBidXR0b25FbmdpbmVlcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIGJ1dHRvblJlcG9ydGVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgaWNvbkFuc3dlcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGxhYmVsTmFtZUNhbGw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGxhYmVsQW5zd2VyQ2FsbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgYnV0dG9uQ2xvc2VBbnN3ZXJDYWxsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgYW5zd2VyOiBjYy5FbnVtLFxuICAgICAgICBnYW1lQ29tcG9uZW50OiBjYy5Db21wb25lbnQsXG4gICAgICAgIG90aGVyNTA1MDogY2MuRW51bVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5nYW1lQ29tcG9uZW50ID0gdGhpcy5ub2RlUGFyZW50LmdldENvbXBvbmVudCgnR2FtZScpO1xuICAgICAgICB0aGlzLm90aGVyNTA1MCA9IEFuc3dlclN0YXRlLkVNUFRZO1xuICAgIH0sXG4gICAgc2V0QW5zd2VyOiBmdW5jdGlvbiBzZXRBbnN3ZXIodHJ1ZWFuc3dlcikge1xuICAgICAgICB0aGlzLmFuc3dlciA9IHRydWVhbnN3ZXI7XG4gICAgfSxcbiAgICBjbGlja0F1ZGllbmNlOiBmdW5jdGlvbiBjbGlja0F1ZGllbmNlKGlzMm9wKSB7XG4gICAgICAgIHRoaXMuZ2FtZUNvbXBvbmVudC5zZXRJc1N0YXJ0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5ub2RlQ2FsbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ub2RlQW5zd2VyQ2FsbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ub2RlQXVkaWVuY2UuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgLy8gdmFyIGFsbG93Q2xpY2tlZD0gdGhpcy5ub2RlSGVscHMuZ2V0Q29tcG9uZW50KCdHYW1lX0hlbHBNZW51Jyk7XG4gICAgICAgIC8vIGFsbG93Q2xpY2tlZC5kb0Rpc2FsbG93Q2xpY2tlZEFsbEhlbHAoKTtcbiAgICAgICAgdGhpcy5nYW1lQ29tcG9uZW50LmRpc2FibGVNYWluQ29udGVudCgpO1xuICAgICAgICB2YXIgQXVkQ29tcG9uZW50ID0gdGhpcy5ub2RlQXVkaWVuY2UuZ2V0Q29tcG9uZW50KCdVSUNvbnRlbnRBdWRpZW5jZScpO1xuICAgICAgICBpZiAoaXMyb3AgPT09IHRydWUpIHtcbiAgICAgICAgICAgIEF1ZENvbXBvbmVudC5zZXRUd29PcHRpb25zKHRoaXMuYW5zd2VyLCB0aGlzLm90aGVyNTA1MCk7XG4gICAgICAgIH1cbiAgICAgICAgQXVkQ29tcG9uZW50LmluaXQodGhpcy5hbnN3ZXIsIGlzMm9wKTtcbiAgICB9LFxuICAgIHNldDUwNTBmb3JBdWRpZW5jZTogZnVuY3Rpb24gc2V0NTA1MGZvckF1ZGllbmNlKG9wdGlvbjIpIHtcbiAgICAgICAgdGhpcy5vdGhlcjUwNTAgPSBvcHRpb24yO1xuICAgIH0sXG5cbiAgICBjbGlja0NhbGxQYW5lbDogZnVuY3Rpb24gY2xpY2tDYWxsUGFuZWwoKSB7XG4gICAgICAgIHRoaXMuZ2FtZUNvbXBvbmVudC5zZXRJc1N0YXJ0KGZhbHNlKTtcbiAgICAgICAgLy8gdGhpcy5ub2RlQXVkaWVuY2Uubm9kZS5hY3RpdmU9ZmFsc2U7XG4gICAgICAgIHRoaXMubm9kZUNhbGwuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2RlQW5zd2VyQ2FsbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ub2RlQXVkaWVuY2UuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5nYW1lQ29tcG9uZW50LmRpc2FibGVNYWluQ29udGVudCgpO1xuICAgICAgICAvLyB2YXIgYWxsb3dDbGlja2VkPSB0aGlzLm5vZGVIZWxwcy5nZXRDb21wb25lbnQoJ0dhbWVfSGVscE1lbnUnKTtcbiAgICAgICAgLy8gYWxsb3dDbGlja2VkLmRvRGlzYWxsb3dDbGlja2VkQWxsSGVscCgpO1xuICAgIH0sXG4gICAgc2hvd0Fuc3dlckNhbGw6IGZ1bmN0aW9uIHNob3dBbnN3ZXJDYWxsKG51bSkge1xuICAgICAgICB2YXIgdXJsID0gbnVsbDtcbiAgICAgICAgdmFyIHRleHR1cmUgPSBudWxsO1xuICAgICAgICAvLyB2YXJBdWRpb0NvbnRyb2xsZXIucGxheUF1ZGlvKCdoZWxwX2NhbGxiJyk7XG4gICAgICAgIHRoaXMubm9kZUFuc3dlckNhbGwuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2RlQ2FsbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChudW0pIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsTmFtZUNhbGwuc3RyaW5nID0gXCJCw6FjIHPEqVwiO1xuICAgICAgICAgICAgICAgIHVybCA9IGNjLnVybC5yYXcoJ3Jlc291cmNlcy90ZXh0dXJlcy9vcHBvdHVuaXRpZXMvYXRwX19hY3Rpdml0eV9wbGF5ZXJfbGF5b3V0X2hlbHBfY2FsbF8wMS5wbmcnKTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlID0gY2MudGV4dHVyZUNhY2hlLmFkZEltYWdlKHVybCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pY29uQW5zd2VyLnNwcml0ZUZyYW1lLnNldFRleHR1cmUodGV4dHVyZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdGhpcy5sYWJlbE5hbWVDYWxsLnN0cmluZyA9IFwiR2nDoW8gdmnDqm5cIjtcbiAgICAgICAgICAgICAgICB1cmwgPSBjYy51cmwucmF3KCdyZXNvdXJjZXMvdGV4dHVyZXMvb3Bwb3R1bml0aWVzL2F0cF9fYWN0aXZpdHlfcGxheWVyX2xheW91dF9oZWxwX2NhbGxfMDIucG5nJyk7XG4gICAgICAgICAgICAgICAgdGV4dHVyZSA9IGNjLnRleHR1cmVDYWNoZS5hZGRJbWFnZSh1cmwpO1xuICAgICAgICAgICAgICAgIHRoaXMuaWNvbkFuc3dlci5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleHR1cmUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHRoaXMubGFiZWxOYW1lQ2FsbC5zdHJpbmcgPSBcIkvhu7kgc8awXCI7XG4gICAgICAgICAgICAgICAgdXJsID0gY2MudXJsLnJhdygncmVzb3VyY2VzL3RleHR1cmVzL29wcG90dW5pdGllcy9hdHBfX2FjdGl2aXR5X3BsYXllcl9sYXlvdXRfaGVscF9jYWxsXzAzLnBuZycpO1xuICAgICAgICAgICAgICAgIHRleHR1cmUgPSBjYy50ZXh0dXJlQ2FjaGUuYWRkSW1hZ2UodXJsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmljb25BbnN3ZXIuc3ByaXRlRnJhbWUuc2V0VGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsTmFtZUNhbGwuc3RyaW5nID0gXCJQaMOzbmcgdmnDqm5cIjtcbiAgICAgICAgICAgICAgICB1cmwgPSBjYy51cmwucmF3KCdyZXNvdXJjZXMvdGV4dHVyZXMvb3Bwb3R1bml0aWVzL2F0cF9fYWN0aXZpdHlfcGxheWVyX2xheW91dF9oZWxwX2NhbGxfMDQucG5nJyk7XG4gICAgICAgICAgICAgICAgdGV4dHVyZSA9IGNjLnRleHR1cmVDYWNoZS5hZGRJbWFnZSh1cmwpO1xuICAgICAgICAgICAgICAgIHRoaXMuaWNvbkFuc3dlci5zcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleHR1cmUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWxBbnN3ZXJDYWxsLnN0cmluZyA9IFwiVGhlbyB0w7RpIMSRw6FwIMOhbiDEkcO6bmcgbMOgIFwiICsgQW5zd2VyU3QuZ2V0TmFtZUFuc3dlcih0aGlzLmFuc3dlcik7XG4gICAgICAgIC8vIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MuZGVsYXlUaW1lKDEpLGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy8gfSx0aGlzKSk7XG4gICAgfSxcbiAgICBjbGlja0RvY3RvcjogZnVuY3Rpb24gY2xpY2tEb2N0b3IoKSB7XG4gICAgICAgIC8vIHNldFRpbWVvdXQodGhpcy5zaG93QW5zd2VyQ2FsbCgxKSwgMTAwMCk7XG4gICAgICAgIHRoaXMuc2hvd0Fuc3dlckNhbGwoMSk7XG4gICAgfSxcbiAgICBjbGlja1RlYWNoZXI6IGZ1bmN0aW9uIGNsaWNrVGVhY2hlcigpIHtcbiAgICAgICAgdGhpcy5zaG93QW5zd2VyQ2FsbCgyKTtcbiAgICB9LFxuICAgIGNsaWNrRW5naW5lZXI6IGZ1bmN0aW9uIGNsaWNrRW5naW5lZXIoKSB7XG4gICAgICAgIHRoaXMuc2hvd0Fuc3dlckNhbGwoMyk7XG4gICAgfSxcbiAgICBjbGlja1JlcG9ydGVyOiBmdW5jdGlvbiBjbGlja1JlcG9ydGVyKCkge1xuICAgICAgICB0aGlzLnNob3dBbnN3ZXJDYWxsKDQpO1xuICAgIH0sXG4gICAgY2xpY2tCdXR0b25DbG9zZTogZnVuY3Rpb24gY2xpY2tCdXR0b25DbG9zZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnNldE9wcG90dW5pdGllc0NsaWNrYWJsZShmYWxzZSk7XG4gICAgICAgIHRoaXMubm9kZVBhcmVudC5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB2YXIgYW5pbSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgYW5pbS5wbGF5KCdhbmltX2hlbHBfdHJhbnNpdGlvbl9vdXQnKTtcbiAgICAgICAgLy8gdmFyIGFsbG93Q2xpY2tlZD0gdGhpcy5ub2RlSGVscHMuZ2V0Q29tcG9uZW50KCdHYW1lX0hlbHBNZW51Jyk7XG4gICAgICAgIC8vIGFsbG93Q2xpY2tlZC5kb0FsbG93Q2xpY2tlZEFsbEhlbHAoKTtcblxuICAgICAgICB0aGlzLmdhbWVDb21wb25lbnQuZW5hYmxlTWFpbkNvbnRlbnQoKTtcbiAgICAgICAgdGhpcy5nYW1lQ29tcG9uZW50LnNldElzU3RhcnQodHJ1ZSk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2VkOTU4S3owZmxBMVl0Yll1NnZMdGgwJywgJ1JlYWRXcml0ZUpzb24nKTtcbi8vIHNjcmlwdHNcXG1vZHVsZXNcXFJlYWRXcml0ZUpzb24uanNcblxudmFyIFJlYWRXcml0ZUpzb24gPSB7fTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFJlYWRXcml0ZUpzb246IFJlYWRXcml0ZUpzb24sXG4gICAgcmVhZEZpbGVKc29uOiBmdW5jdGlvbiByZWFkRmlsZUpzb24odXJsanNvbikge1xuICAgICAgICB2YXIgdXJsID0gY2MudXJsLnJhdyh1cmxqc29uKTtcbiAgICAgICAgdmFyIHN0cmluZ2NvbnRlbnQgPSBcIlwiO1xuICAgICAgICBjYy5sb2FkZXIubG9hZCh1cmwsIGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgICAgICAgc3RyaW5nY29udGVudCA9IEpTT04uc3RyaW5naWZ5KHJlcyk7XG4gICAgICAgICAgICBzdHJpbmdjb250ZW50ID0gc3RyaW5nY29udGVudC5zdWJzdHJpbmcoMSwgc3RyaW5nY29udGVudC5sYXN0SW5kZXhPZihcIl1cIikpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdsb2FkWycrIHVybCArJ10sIGVyclsnK2VycisnXSByZXN1bHQ6ICcgKyBKU09OLnN0cmluZ2lmeSggcmVzICkgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBzdHJpbmdjb250ZW50O1xuICAgIH1cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczMjc1OVZySllWUHZMRnFzSldWQXRDcycsICdTZXR0aW5nJyk7XG4vLyBzY3JpcHRzXFxTZXR0aW5nLmpzXG5cbnZhciBzdG9yYWdlID0gY2Muc3lzLmxvY2FsU3RvcmFnZTtcbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCdTdGF0ZScpLkdhbWVTdGF0ZTtcblxudmFyIEF1ZGlvQ3RyID0gcmVxdWlyZSgnQXVkaW9Db250cm9sbGVyJyk7XG52YXIgQXVkaW9Db250cm9sbGVyID0gQXVkaW9DdHIuQXVkaW9Db250cm9sbGVyO1xuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzb3VuZE9uOiBjYy5TcHJpdGUsXG4gICAgICAgIHNvdW5kT2ZmOiBjYy5TcHJpdGUsXG4gICAgICAgIG11c2ljT246IGNjLlNwcml0ZSxcbiAgICAgICAgbXVzaWNPZmY6IGNjLlNwcml0ZSxcbiAgICAgICAgYnRuU291bmQ6IGNjLkJ1dHRvbixcbiAgICAgICAgYnRuTXVzaWM6IGNjLkJ1dHRvbixcbiAgICAgICAgc291bmRtb2RlOiBCb29sZWFuKGZhbHNlKSxcbiAgICAgICAgbXVzaWNtb2RlOiBCb29sZWFuKGZhbHNlKVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHdpblNpemUgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplKCk7XG4gICAgICAgIGlmIChjYy5zeXMuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgIGNjLnZpZXcuc2V0RGVzaWduUmVzb2x1dGlvblNpemUod2luU2l6ZS53aWR0aCwgd2luU2l6ZS5oZWlnaHQsIGNjLlJlc29sdXRpb25Qb2xpY3kuU0hPV19BTEwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlib2FyZExpc3Rlbm5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmJhY2sgfHwga2V5Q29kZSA9PT0gY2MuS0VZLmJhY2tzcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0hvbWVTY2VuZV9Mb2dpbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gY2MuS0VZLmhvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW5kKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGtleWJvYXJkTGlzdGVubmVyLCB0aGlzKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMuY2hhbmdlc291bmRtb2RlKHRoaXMuc291bmRtb2RlKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VtdXNpY21vZGUodGhpcy5tdXNpY21vZGUpO1xuICAgICAgICBjYy5sb2coJz4+PiAxY3VycmVudCBtIG4gcyBtb2RlOiAnICsgc3RvcmFnZS5nZXRJdGVtKEdhbWVTdGF0ZS5NVVNJQ19NT0RFKSArIFwiIFwiICsgc3RvcmFnZS5nZXRJdGVtKEdhbWVTdGF0ZS5TT1VORF9NT0RFKSk7XG4gICAgICAgIGNjLmxvZygnPj4+IDJjdXJyZW50IG0gbiBzIG1vZGU6ICcgKyB0aGlzLmdldE11c2ljTW9kZSgpICsgXCIgXCIgKyB0aGlzLmdldFNvdW5kTW9kZSgpKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHRoaXMuc291bmRtb2RlID0gdGhpcy5nZXRTb3VuZE1vZGUoKTtcbiAgICAgICAgdGhpcy5tdXNpY21vZGUgPSB0aGlzLmdldE11c2ljTW9kZSgpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxuICAgIGNsaWNrU291bmRNb2RlOiBmdW5jdGlvbiBjbGlja1NvdW5kTW9kZSgpIHtcbiAgICAgICAgY2MubG9nKFwiPj4+Pj4+Pj4+Y2xpY2sgc291bmRcIik7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5wbGF5Q2xpY2tTb3VuZCgpO1xuXG4gICAgICAgIHRoaXMuc291bmRtb2RlID0gIXRoaXMuc291bmRtb2RlO1xuICAgICAgICB0aGlzLmNoYW5nZXNvdW5kbW9kZSh0aGlzLnNvdW5kbW9kZSk7XG4gICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShHYW1lU3RhdGUuU09VTkRfTU9ERSwgdGhpcy5zb3VuZG1vZGUpO1xuICAgICAgICBpZiAodGhpcy5zb3VuZG1vZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBBdWRpb0NvbnRyb2xsZXIuc3RvcEFsbCgpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmxvZyhcIj4+PiBhZnRlcjogXCIgKyB0aGlzLnNvdW5kbW9kZSArIFwiIFwiICsgc3RvcmFnZS5nZXRJdGVtKEdhbWVTdGF0ZS5TT1VORF9NT0RFKSk7XG4gICAgfSxcbiAgICBjbGlja011c2ljTW9kZTogZnVuY3Rpb24gY2xpY2tNdXNpY01vZGUoKSB7XG4gICAgICAgIGNjLmxvZyhcIj4+Pj4+Pj4+PmNsaWNrIHNvdW5kXCIpO1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIucGxheUNsaWNrU291bmQoKTtcbiAgICAgICAgdGhpcy5tdXNpY21vZGUgPSAhdGhpcy5tdXNpY21vZGU7XG4gICAgICAgIHRoaXMuY2hhbmdlbXVzaWNtb2RlKHRoaXMubXVzaWNtb2RlKTtcbiAgICAgICAgc3RvcmFnZS5zZXRJdGVtKEdhbWVTdGF0ZS5NVVNJQ19NT0RFLCB0aGlzLm11c2ljbW9kZSk7XG4gICAgICAgIGlmICh0aGlzLm11c2ljbW9kZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5zdG9wQWxsKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xpY2tCYWNrOiBmdW5jdGlvbiBjbGlja0JhY2soKSB7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5wbGF5Q2xpY2tTb3VuZCgpO1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0hvbWVTY2VuZV9Mb2dpbicpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2Vzb3VuZG1vZGU6IGZ1bmN0aW9uIGNoYW5nZXNvdW5kbW9kZShtb2RlKSB7XG4gICAgICAgIGlmIChtb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kT24ubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zb3VuZE9mZi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnNvdW5kT24ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc291bmRPZmYubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNoYW5nZW11c2ljbW9kZTogZnVuY3Rpb24gY2hhbmdlbXVzaWNtb2RlKG1vZGUpIHtcbiAgICAgICAgaWYgKG1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWNPbi5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm11c2ljT2ZmLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAobW9kZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMubXVzaWNPbi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tdXNpY09mZi5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldFNvdW5kTW9kZTogZnVuY3Rpb24gZ2V0U291bmRNb2RlKCkge1xuICAgICAgICB2YXIgbW9kZSA9IHN0b3JhZ2UuZ2V0SXRlbShHYW1lU3RhdGUuU09VTkRfTU9ERSk7XG4gICAgICAgIGlmIChCb29sZWFuKG1vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kZSA9PT0gXCJ0cnVlXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0TXVzaWNNb2RlOiBmdW5jdGlvbiBnZXRNdXNpY01vZGUoKSB7XG4gICAgICAgIHZhciBtb2RlID0gc3RvcmFnZS5nZXRJdGVtKEdhbWVTdGF0ZS5NVVNJQ19NT0RFKTtcbiAgICAgICAgaWYgKEJvb2xlYW4obW9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RlID09PSBcInRydWVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiZTVkZnFYREV4QUNLa3Z5UjF3THVoeScsICdTdGF0ZScpO1xuLy8gc2NyaXB0c1xcZGF0YVxcU3RhdGUuanNcblxudmFyIEFuc3dlclN0YXRlID0gY2MuRW51bSh7XG4gICAgRU1QVFk6IDAsXG4gICAgQU5TV0VSX0E6IDEsXG4gICAgQU5TV0VSX0I6IDIsXG4gICAgQU5TV0VSX0M6IDMsXG4gICAgQU5TV0VSX0Q6IDRcbn0pO1xudmFyIEhlbHBTdGF0ZSA9IGNjLkVudW0oe1xuICAgIEVNUFRZOiAwLFxuICAgIFNUT1A6IDEsXG4gICAgQ0hBTkdFOiAyLFxuICAgIE41MDUwOiAzLFxuICAgIENBTEw6IDQsXG4gICAgQVVESUVOQ0U6IDVcbn0pO1xudmFyIEdhbWVTdGF0ZSA9IHtcbiAgICBTT1VORF9NT0RFOiAnU09VTkRfTU9ERScsXG4gICAgTVVTSUNfTU9ERTogJ01VU0lDX01PREUnXG59O1xudmFyIFN0YXRlID0ge307XG52YXIgQVJDSElWRU1FTlRfS0VZID0gJ0FSQ0hJVkVNRU5UX0tFWSc7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBTdGF0ZTogU3RhdGUsXG4gICAgQW5zd2VyU3RhdGU6IEFuc3dlclN0YXRlLFxuICAgIEhlbHBTdGF0ZTogSGVscFN0YXRlLFxuICAgIEdhbWVTdGF0ZTogR2FtZVN0YXRlLFxuICAgIEFSQ0hJVkVNRU5UX0tFWTogJ0FSQ0hJVkVNRU5UX0tFWScsXG4gICAgZ2V0TmFtZUFuc3dlcjogZnVuY3Rpb24gZ2V0TmFtZUFuc3dlcihudW1iZXIpIHtcbiAgICAgICAgc3dpdGNoIChudW1iZXIpIHtcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0E6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdBJztcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0I6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdCJztcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0M6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdDJztcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0Q6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdEJztcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjY2EzZTA1RmJGSkg1UElwZ1QzVFFwRScsICdTdG9yZURhdGEnKTtcbi8vIHNjcmlwdHNcXG1vZHVsZXNcXFN0b3JlRGF0YS5qc1xuXG52YXIgVXNlckluZm9yS2V5ID0gcmVxdWlyZSgnVXNlckluZm9yS2V5Jyk7XG52YXIgVXNlcktleSA9IFVzZXJJbmZvcktleS5Vc2VySW5mb3JLZXk7XG52YXIgQXJjaGlyZUtleSA9IFVzZXJJbmZvcktleS5BcmNoaXJlS2V5O1xudmFyIEhpc3RvcnlLZXkgPSBVc2VySW5mb3JLZXkuSGlzdG9yeUtleTtcbnZhciBzdG9yYWdlID0gY2Muc3lzLmxvY2FsU3RvcmFnZTtcbnZhciBVc2VyRGF0YSA9IHtcbiAgICBJRDogXCJcIixcbiAgICBMRVZFTDogXCJcIixcbiAgICBFWFBFUklFTkNFOiAwLFxuICAgIE5BTUU6IFwibm9uYW1lXCIsXG4gICAgUExBWVRJTUVTOiA1MCxcbiAgICBBUkNISVJFOiB7XG4gICAgICAgIENPTVBMRVRFOiAwXG4gICAgfSxcbiAgICBUT1RBTDogMFxufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFVzZXJEYXRlOiBVc2VyRGF0YSxcbiAgICBzdG9yZURhdGE6IGZ1bmN0aW9uIHN0b3JlRGF0YShkYXRhKSB7XG4gICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShVc2VyS2V5LklELCBkYXRhLklEKTtcbiAgICAgICAgc3RvcmFnZS5zZXRJdGVtKFVzZXJLZXkuTEVWRUwsIGRhdGEuTEVWRUwpO1xuICAgICAgICBzdG9yYWdlLnNldEl0ZW0oVXNlcktleS5FWFBFUklFTkNFLCBkYXRhLkVYUEVSSUVOQ0UpO1xuICAgICAgICBzdG9yYWdlLnNldEl0ZW0oVXNlcktleS5OQU1FLCBkYXRhLk5BTUUpO1xuICAgICAgICBzdG9yYWdlLnNldEl0ZW0oVXNlcktleS5QTEFZVElNRVMsIGRhdGEuUExBWVRJTUVTKTtcbiAgICAgICAgc3RvcmFnZS5zZXRJdGVtKFVzZXJLZXkuVE9UQUwsIGRhdGEuVE9UQUwpO1xuICAgIH0sXG4gICAgc2F2ZURhdGFCeUtleTogZnVuY3Rpb24gc2F2ZURhdGFCeUtleShrZXksIGRhdGEpIHtcbiAgICAgICAgc3RvcmFnZS5zZXRJdGVtKGtleSwgZGF0YSk7XG4gICAgfSxcbiAgICBnZXREYXRhT2JqZWN0OiBmdW5jdGlvbiBnZXREYXRhT2JqZWN0KGtleSkge30sXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24gZ2V0RGF0YShrZXkpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIH0sXG4gICAgaXNOdW1iZXI6IGZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xuICAgICAgICByZXR1cm4gKC9eLT9bXFxkLl0rKD86ZS0/XFxkKyk/JC8udGVzdChvYmopXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBnZXRNaWxsaW9uOiBmdW5jdGlvbiBnZXRNaWxsaW9uKG1vbmV5KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBtb25leTtcbiAgICAgICAgaWYgKG1vbmV5ID09PSAwKSByZXR1cm4gMDtcbiAgICAgICAgaWYgKG1vbmV5IC8gMTAwMDAwMCA+PSAxKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBtb25leSAvIDEwMDAwMDAgKyBcIiB0clwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gbW9uZXkgLyAxMDAwICsgXCIgbmdcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgZ2V0T2JqZWN0OiBmdW5jdGlvbiBnZXRPYmplY3Qoa2V5KSB7fVxuXG4gICAgLy9hcmNoaXZlbWV0blxuXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTQwM2Zvck42RkVkS0l4Y2FYYXZyMU0nLCAnVUlDb250ZW50QXVkaWVuY2UnKTtcbi8vIHNjcmlwdHNcXHVpXFxVSUNvbnRlbnRBdWRpZW5jZS5qc1xuXG52YXIgQW5zd2VyU3RhdGUgPSByZXF1aXJlKCdTdGF0ZScpLkFuc3dlclN0YXRlO1xudmFyIEl0ZW0gPSB7XG4gICAgYW5zd2VyOiBjYy5FbnVtLFxuICAgIHBlcmNlbnQ6IDBcbn07XG52YXIgVUlDb250ZW50QXVkaWVuY2UgPSBjYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYmFyQToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgYmFyQjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgYmFyQzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgYmFyRDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcbiAgICAgICAgbGJQZXJjZW50QToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBsYlBlcmNlbnRCOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGxiUGVyY2VudEM6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSwgbGJQZXJjZW50RDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBtYXhoZWk6IDIxNSxcbiAgICAgICAgbWluaGVpOiAwLFxuICAgICAgICB0cnVlYW5zd2VyOiBBbnN3ZXJTdGF0ZS5FTVBUWSxcbiAgICAgICAgc3BhY2U6IDAsXG4gICAgICAgIGlzU3RhcnQ6IGNjLkJvb2xlYW4sXG4gICAgICAgIGFycjogW10sXG4gICAgICAgIGlzMk9wdGlvbjogY2MuQm9vbGVhbixcbiAgICAgICAgb3B0aW9uMTogY2MuRW51bSxcbiAgICAgICAgb3B0aW9uMjogY2MuRW51bVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5iYXJBLm5vZGUuaGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5iYXJCLm5vZGUuaGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5iYXJDLm5vZGUuaGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5iYXJELm5vZGUuaGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5sYlBlcmNlbnRBLnN0cmluZyA9IFwiMCAlXCI7XG4gICAgICAgIHRoaXMubGJQZXJjZW50Qi5zdHJpbmcgPSBcIjAgJVwiO1xuICAgICAgICB0aGlzLmxiUGVyY2VudEMuc3RyaW5nID0gXCIwICVcIjtcbiAgICAgICAgdGhpcy5sYlBlcmNlbnRELnN0cmluZyA9IFwiMCAlXCI7XG4gICAgICAgIHRoaXMubWF4aGVpID0gMjA1O1xuICAgICAgICB0aGlzLmlzMk9wdGlvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFyciA9IFtdO1xuICAgICAgICB0aGlzLm9wdGlvbjEgPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcbiAgICAgICAgdGhpcy5vcHRpb24yID0gQW5zd2VyU3RhdGUuRU1QVFk7XG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoYW5zd2VyVHJ1ZSwgaXNPcHMpIHtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5kZWxheVRpbWUoMy41KSwgY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pc1N0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaXMyT3B0aW9uID0gaXNPcHM7XG4gICAgICAgICAgICB0aGlzLnRydWVhbnN3ZXIgPSB0aGlzLmx1Y2t5KGFuc3dlclRydWUpO1xuICAgICAgICAgICAgdGhpcy5hcnIgPSB0aGlzLmFyclJhbmRvbSh0aGlzLmlzMk9wdGlvbik7XG4gICAgICAgIH0sIHRoaXMpKSk7XG4gICAgfSxcbiAgICBzZXRUd29PcHRpb25zOiBmdW5jdGlvbiBzZXRUd29PcHRpb25zKGFuczEsIGFuczIpIHtcbiAgICAgICAgLy9hbnMxPT09dHJ1ZVxuICAgICAgICB0aGlzLmlzMk9wdGlvbiA9IHRydWU7XG4gICAgICAgIHRoaXMub3B0aW9uMSA9IGFuczE7XG4gICAgICAgIHRoaXMub3B0aW9uMiA9IGFuczI7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdGFydCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5zcGFjZTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0KHRoaXMuYmFyQSwgdGhpcy5sYlBlcmNlbnRBLCB0aGlzLmFycltBbnN3ZXJTdGF0ZS5BTlNXRVJfQSAtIDFdLnBlcmNlbnQsIHNwZWVkKTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0KHRoaXMuYmFyQiwgdGhpcy5sYlBlcmNlbnRCLCB0aGlzLmFycltBbnN3ZXJTdGF0ZS5BTlNXRVJfQiAtIDFdLnBlcmNlbnQsIHNwZWVkKTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0KHRoaXMuYmFyQywgdGhpcy5sYlBlcmNlbnRDLCB0aGlzLmFycltBbnN3ZXJTdGF0ZS5BTlNXRVJfQyAtIDFdLnBlcmNlbnQsIHNwZWVkKTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0KHRoaXMuYmFyRCwgdGhpcy5sYlBlcmNlbnRELCB0aGlzLmFycltBbnN3ZXJTdGF0ZS5BTlNXRVJfRCAtIDFdLnBlcmNlbnQsIHNwZWVkKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZWZmZWN0OiBmdW5jdGlvbiBlZmZlY3Qoc3ByaXRlLCBsYWJlbCwgcGVyY2VudCwgc3BlZWQpIHtcbiAgICAgICAgaWYgKHBlcmNlbnQgPT09IC0xKSB7XG4gICAgICAgICAgICBzcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGxhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ByaXRlLm5vZGUuaGVpZ2h0ICsgc3BlZWQgPD0gcGVyY2VudCAqIHRoaXMuc3BhY2UpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdXaXRoUGVyY2VudChzcHJpdGUsIGxhYmVsLCBzcGVlZCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nV2l0aFBlcmNlbnQ6IGZ1bmN0aW9uIGNoYW5nV2l0aFBlcmNlbnQoc3ByaXRlLCBsYWJlbCwgc3BlZWQpIHtcbiAgICAgICAgc3ByaXRlLm5vZGUuc2V0Q29udGVudFNpemUoY2Muc2l6ZShzcHJpdGUubm9kZS53aWR0aCwgc3ByaXRlLm5vZGUuaGVpZ2h0ICsgc3BlZWQpKTtcbiAgICAgICAgbGFiZWwubm9kZS5wb3NpdGlvbiA9IG5ldyBjYy5WZWMyKGxhYmVsLm5vZGUucG9zaXRpb24ueCwgbGFiZWwubm9kZS5wb3NpdGlvbi55ICsgc3BlZWQpO1xuICAgICAgICBsYWJlbC5zdHJpbmcgPSBNYXRoLnJvdW5kKHNwcml0ZS5ub2RlLmhlaWdodCAvIHRoaXMuc3BhY2UpICsgXCIgJVwiO1xuICAgICAgICBpZiAodGhpcy5nZXRCYXJPZlRydWVBbnN3ZXIodGhpcy50cnVlYW5zd2VyKS5ub2RlLmhlaWdodCA9PT0gdGhpcy5hcnJbdGhpcy50cnVlYW5zd2VyIC0gMV0ucGVyY2VudCAqIHRoaXMuc3BhY2UpIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdGFydCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFyclJhbmRvbTogZnVuY3Rpb24gYXJyUmFuZG9tKGlzMk9wcykge1xuICAgICAgICB2YXIgYXJySXRlbSA9IFtdO1xuICAgICAgICB2YXIgYXJyUmFuZCA9IFtdO1xuICAgICAgICB2YXIgYXJyQW5zd2VyID0gW107XG4gICAgICAgIGlmIChpczJPcHMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCA0OyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJyUmFuZC5wdXNoKC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8PSA0OyBqKyspIHtcbiAgICAgICAgICAgIGFyckFuc3dlci5wdXNoKGopO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNjLmxvZyhhcnJBbnN3ZXIrIFwiIF9fYXJyQW5zd2VyIGFmdGVyIHB1c2hpbmdcIik7XG4gICAgICAgIHZhciB0cnVlcG9zaXRpb24gPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJBbnN3ZXJbaV0gPT09IHRoaXMudHJ1ZWFuc3dlcikge1xuICAgICAgICAgICAgICAgIHRydWVwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2MubG9nKGFyckFuc3dlcisgXCIgX19hcnJBbnN3ZXIgYWZ0ZXIgY2hhbmdlIHRoZSBmaXJzdCBhbmQgdHJ1ZVwiKTtcbiAgICAgICAgLy8gY2MubG9nKFwiaW5pdCBhcnJSYW5kOiBcIithcnJSYW5kKTtcbiAgICAgICAgdmFyIG1heCA9IDEwMDtcbiAgICAgICAgaWYgKGlzMk9wcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgNDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJhbiA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIG1heCk7XG4gICAgICAgICAgICAgICAgYXJyUmFuZC5wdXNoKHJhbik7XG4gICAgICAgICAgICAgICAgbWF4ID0gbWF4IC0gcmFuO1xuICAgICAgICAgICAgICAgIGlmIChhcnJSYW5kLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICBhcnJSYW5kLnB1c2gobWF4KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJhbmQgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuICAgICAgICAgICAgdmFyIGNvbmxhaSA9IG1heCAtIHJhbmQ7XG4gICAgICAgICAgICBhcnJSYW5kW3RoaXMub3B0aW9uMSAtIDFdID0gcmFuZCA+IGNvbmxhaSA/IHJhbmQgOiBjb25sYWk7XG4gICAgICAgICAgICBhcnJSYW5kW3RoaXMub3B0aW9uMiAtIDFdID0gbWF4IC0gYXJyUmFuZFt0aGlzLm9wdGlvbjEgLSAxXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjYy5sb2coYXJyUmFuZCsgXCIgX19hcnJSYW5kIGFmdGVyIHB1c2ggcmFuZG9tXCIpO1xuICAgICAgICBpZiAoaXMyT3BzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdmFyIG1heEFyclJhbmQgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaWlpID0gMDsgaWlpIDwgYXJyUmFuZC5sZW5ndGg7IGlpaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyclJhbmRbaWlpXSA+IGFyclJhbmRbbWF4QXJyUmFuZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4QXJyUmFuZCA9IGlpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1ZXBvc2l0aW9uICE9PSBtYXhBcnJSYW5kKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRnID0gYXJyUmFuZFt0cnVlcG9zaXRpb25dO1xuICAgICAgICAgICAgICAgIGFyclJhbmRbdHJ1ZXBvc2l0aW9uXSA9IGFyclJhbmRbbWF4QXJyUmFuZF07XG4gICAgICAgICAgICAgICAgYXJyUmFuZFttYXhBcnJSYW5kXSA9IHRnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zcGFjZSA9IE1hdGgucm91bmQodGhpcy5tYXhoZWkgLyBhcnJSYW5kW3RydWVwb3NpdGlvbl0pO1xuXG4gICAgICAgIC8vIGNjLmxvZyhhcnJSYW5kK1wiIF9fX19hcnJSYW5kXCIpO1xuXG4gICAgICAgIGZvciAodmFyIHR0ID0gMDsgdHQgPCA0OyB0dCsrKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gbmV3IE9iamVjdCh7fSk7XG4gICAgICAgICAgICBvYmouYW5zd2VyID0gYXJyQW5zd2VyW3R0XTtcbiAgICAgICAgICAgIG9iai5wZXJjZW50ID0gYXJyUmFuZFt0dF07XG4gICAgICAgICAgICBhcnJJdGVtLnB1c2gob2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJySXRlbTtcbiAgICB9LFxuICAgIGdldEJhck9mVHJ1ZUFuc3dlcjogZnVuY3Rpb24gZ2V0QmFyT2ZUcnVlQW5zd2VyKG51bWJlcikge1xuICAgICAgICB2YXIgYmFyID0gbnVsbDtcbiAgICAgICAgc3dpdGNoIChudW1iZXIpIHtcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0E6XG4gICAgICAgICAgICAgICAgYmFyID0gdGhpcy5iYXJBO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBbnN3ZXJTdGF0ZS5BTlNXRVJfQjpcbiAgICAgICAgICAgICAgICBiYXIgPSB0aGlzLmJhckI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFuc3dlclN0YXRlLkFOU1dFUl9DOlxuICAgICAgICAgICAgICAgIGJhciA9IHRoaXMuYmFyQztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQW5zd2VyU3RhdGUuQU5TV0VSX0Q6XG4gICAgICAgICAgICAgICAgYmFyID0gdGhpcy5iYXJEO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXI7XG4gICAgfSxcbiAgICBsdWNreTogZnVuY3Rpb24gbHVja3kodHJ1ZUFOc3dlcikge1xuICAgICAgICB2YXIgb3RoZXIgPSBBbnN3ZXJTdGF0ZS5FTVBUWTtcbiAgICAgICAgdmFyIGx1Y2t5ID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogNjAwMCk7XG4gICAgICAgIGlmIChsdWNreSA+IDEwMDAgJiYgbHVja3kgPCAxMjAwKSB7XG4gICAgICAgICAgICB3aGlsZSAob3RoZXIgPT09IEFuc3dlclN0YXRlLkVNUFRZIHx8IG90aGVyID4gNCkge1xuICAgICAgICAgICAgICAgIG90aGVyID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKFwib3RoZXI6IFwiK290aGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZUFOc3dlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiNGZmNUpIY3BsQldyVjdaVUg5ZkZ3dicsICdVc2VySW5mb3JLZXknKTtcbi8vIHNjcmlwdHNcXGRhdGFcXFVzZXJJbmZvcktleS5qc1xuXG52YXIgVXNlckluZm9yS2V5ID0ge1xuICAgIElEOiBcImlkXCIsXG4gICAgTEVWRUw6IFwibGV2ZWxcIixcbiAgICBFWFBFUklFTkNFOiBcImV4cGVyaWVuY2VcIixcbiAgICBOQU1FOiBcIm5hbWVcIixcbiAgICBQTEFZVElNRVM6IFwidGltZXNcIixcbiAgICBBUkNISVJFOiBcImFyY2hpcmVcIixcbiAgICBISVNUT1JZOiBcImhpc3RvcnlcIixcbiAgICBUT1RBTDogXCJ0b3RhbG1vbmV5XCJcblxufTtcblxudmFyIEFyY2hpdmVtZW50S2V5ID0ge1xuICAgIENPTVBMRVRFOiBcImNvbXBsZXRlXCJcbn07XG5cbnZhciBIaXN0b3J5S2V5ID0ge1xuICAgIFFVRVNUSU9OOiBcInF1ZXN0aW9uXCIsXG4gICAgVElNRTogXCJ0aW1lXCJcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBVc2VySW5mb3JLZXk6IFVzZXJJbmZvcktleSxcbiAgICBBcmNoaXZlbWVudEtleTogQXJjaGl2ZW1lbnRLZXksXG4gICAgSGlzdG9yeUtleTogSGlzdG9yeUtleVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzcwNGQ2TlRLTEZBQjRER1E2M1JFTmZXJywgJ1VzZXJQcmVmYWInKTtcbi8vIHNjcmlwdHNcXHVpXFxVc2VyUHJlZmFiLmpzXG5cbnZhciBVc2VyUHJlZmFiID0gY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGljb246IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIGxiVXNlck5hbWU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgbGJUeXBlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0SWNvbjogZnVuY3Rpb24gc2V0SWNvbihibG9iKSB7fSxcbiAgICBzZXROYW1lOiBmdW5jdGlvbiBzZXROYW1lKG5hbWUpIHtcbiAgICAgICAgdGhpcy5sYlVzZXJOYW1lLnN0cmluZyA9IG5hbWU7XG4gICAgfSxcbiAgICBzZXRUeXBlOiBmdW5jdGlvbiBzZXRUeXBlKHR5cGUpIHtcbiAgICAgICAgdGhpcy5sYlR5cGUuc3RyaW5nID0gdHlwZTtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fVxuXG59KTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFVzZXJQcmVmYWI6IFVzZXJQcmVmYWJcblxufTtcblxuY2MuX1JGcG9wKCk7Il19
