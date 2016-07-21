
cc.Class({
    extends: cc.Component,

    properties: {
        lbTitle:cc.Label,
        lbContent:{
            default: null,
            type:cc.Label
        }
        ,btnOK:{
            default: null,
            type:cc.Button
        }
        ,btnCancel:{
            default: null,
            type:cc.Button
        }
        ,lbBtnOK:cc.Label
        ,lbBtnCancel:cc.Label
        ,animDialog:cc.Animation
        ,parentComponent:cc.Component
    },

    // use this for initialization
    onLoad: function () {
        this.animDialog=this.node.getComponent(cc.Animation);
    },

    init:function(contentStr,parentComponent){
        
        this.lbContent.string=contentStr;
        this.parentComponent=parentComponent;
        this.animDialog.play('anim_transition_question_in');
        cc.log("anim_anim");
        
    }
    ,initConfirm:function(title,nameBtnConfirm,content,parentComponent){
        this.lbTitle.string=title;
        this.lbBtnOK.string=nameBtnConfirm;
        this.lbContent.string=content;
        this.btnCancel.node.active=false;
        this.btnOK.node.setPosition(cc.p(0,-150));
        this.btnOK.node.width=200;
        this.parentComponent=parentComponent;
        this.animDialog.play('anim_transition_question_in');
    }
    
    ,clickOK:function(){
        this.parentComponent.onClickOKDialog();
    }
    ,clickCancel:function(){
        this.parentComponent.onClickCancelDialog();
        this.animDialog.play('anim_transition_question_out');
    }
});
