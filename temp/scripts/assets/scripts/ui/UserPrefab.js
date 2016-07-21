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