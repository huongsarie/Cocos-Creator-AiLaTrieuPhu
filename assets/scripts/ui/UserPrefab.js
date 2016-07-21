var UserPrefab=cc.Class({
    extends: cc.Component,

    properties: {
        icon:{
            default:null,
            type:cc.Sprite
        }
        ,lbUserName:{
            default:null,
            type:cc.Label
        }
        ,lbType:{
            default:null,
            type:cc.Label
        }
    }
    
    ,setIcon:function(blob){
        
    }
    ,setName:function(name){
        this.lbUserName.string=name;
    }
    ,setType:function(type){
        this.lbType.string=type;
    }
    ,

    // use this for initialization
    onLoad: function () {

    },

});
module.exports={
    UserPrefab:UserPrefab
    
};
