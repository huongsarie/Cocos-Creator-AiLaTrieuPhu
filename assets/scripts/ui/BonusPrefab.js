var BonusPrefab=cc.Class({
    extends: cc.Component,

    properties: {
        labMoney:{
            default:null,
            type:cc.Label
        }
        ,labArchire:{
            default:null,
            type:cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

    },
    setMoney:function(tmoney){
        this.labMoney.string=tmoney;
    }
    ,setArchire:function(tarchire){
        this.labArchire.string=tarchire;
    }

});
module.exports={
    BonusPrefab:BonusPrefab
    
};
