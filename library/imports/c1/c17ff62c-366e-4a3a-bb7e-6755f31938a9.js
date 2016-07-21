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