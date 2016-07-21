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