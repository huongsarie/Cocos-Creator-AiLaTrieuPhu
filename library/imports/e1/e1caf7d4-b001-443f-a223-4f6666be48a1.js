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