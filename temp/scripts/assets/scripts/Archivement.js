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