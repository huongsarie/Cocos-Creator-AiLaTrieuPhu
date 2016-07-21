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