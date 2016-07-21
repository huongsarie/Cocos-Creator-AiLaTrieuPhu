var localst=cc.sys.localStorage;
var State=require('State');
var GameSTATE=State.GameState;
var HelpState= State.HelpState;
var AnswerState= State.AnswerState;

var AudioController={
    setSoundMode:function(soundMode){//soundMode = true/false
        localst.setItem(GameSTATE.SOUND_MODE,soundMode);
    }
    ,setMusicMode:function(musicMode){
        localst.setItem(GameSTATE.MUSIC_MODE,musicMode);
    }
    ,getSoundMode:function(){
        var mode= localst.getItem(GameSTATE.SOUND_MODE);
        if(Boolean(mode)){
            return mode==="true";
        }else{
            return true;
        }
    }
    ,getMusicMode:function(){
        var mode= localst.getItem(GameSTATE.MUSIC_MODE);
        if(Boolean(mode)){
            return mode==="true";
        }else{
            return true;
        }
    }
    ,playAudio:function(name,loop){
        var audioID=null;
        if(this.getSoundMode()===true){
            var url= cc.url.raw(P_PATH+name);
            audioID=cc.audioEngine.playEffect(url,loop);
        // cc.log("duration:"+ cc.AudioClip(url).duration);
        }else{
            return;
        }
        return audioID;
    }
    ,playMusic:function(name,loop){
        if(this.getSoundMode()===true){
            var url= cc.url.raw(P_PATH+name);
            cc.audioEngine.playMusic(url,loop);
        // cc.log("duration:"+ cc.AudioClip(url).duration);
        }else{
            return;
        }
    }
    ,playBackgroundAudio:function(name,loop){
            if(this.getMusicMode()===true ){
                var url= cc.url.raw(P_PATH+name);
                cc.audioEngine.playEffect(url,loop);
            }
    }
    ,playBackgroundMusic:function(isGame){
        if(isGame===false){
            this.playBackgroundAudio('bgmusic.mp3', true);
        }if(isGame===true){
            if(this.getMusicMode()===true )
            this.playBackgroundAudio('background_music.mp3', true);
        }
    }
    ,playBackgroundAfterAnswer:function(){
        if(this.getMusicMode()===true )
            this.playBackgroundAudio('background_music_c.mp3', true);
    }
    ,playClickSound:function(){
        this.playAudio('touch_sound.mp3',false);
    }
    ,playAnswerChoose:function(numberAns){
        var nameaudio1='ans_a.mp3';
        switch (numberAns) {
            case AnswerState.ANSWER_A:
                    nameaudio1='ans_a.mp3';
                break;
            case AnswerState.ANSWER_B:
                    nameaudio1='ans_b.mp3';
                break;
            case AnswerState.ANSWER_C:
                    nameaudio1='ans_c.mp3';
                break;
           case AnswerState.ANSWER_D:
                    nameaudio1='ans_d.mp3';
                break;
        }
        this.playAudio(nameaudio1,false);
    }
    ,playAnswer:function(numberTrue,isTrue){
        var nameaudio='touch_sound.mp3';
        switch (numberTrue) {
            case AnswerState.ANSWER_A:
                if(isTrue===true){
                    nameaudio='true_a.mp3';
                }else{
                    nameaudio='lose_a.mp3';
                }
                break;
            case AnswerState.ANSWER_B:
                if(isTrue===true){
                    nameaudio='true_b.mp3';
                }else{
                    nameaudio='lose_b.mp3';
                }
                break;
            case AnswerState.ANSWER_C:
                if(isTrue===true){
                    nameaudio='true_c.mp3';
                }else{
                    nameaudio='lose_c.mp3';
                }
                break;
           case AnswerState.ANSWER_D:
                if(isTrue===true){
                    nameaudio='true_d2.mp3';
                }else{
                    nameaudio='lose_d.mp3';
                }
                break;
        }
        this.playAudio(nameaudio,false);
    }
    
    ,playReadQuestion:function(numberQuestion){
        
    }
    ,playHelpClick:function(numberHelp){
        var nameaudio='';
        switch (numberHelp) {
            case HelpState.N5050:
                nameaudio='sound5050_2.mp3';
                break;
            case HelpState.AUDIENCE:
                nameaudio='khan_gia.mp3';
                break;
            case HelpState.CALL:
                nameaudio='hoi_y_kien_chuyen_gia_01b.mp3';
                break;
            case HelpState.CHANGE:
            //
                break;
            case HelpState.STOP:
            //
                break;
        }
        if(nameaudio!==''){
            this.playAudio(nameaudio,false);  
        }
    }
    ,playLoseGame:function(){
        let delay=cc.callFunc(function(){
            cc.delayTime(3);
        },this);
        let playlose=cc.callFunc(function(){
            this.playMusic('lose.mp3',false);
        },this);
        this.node.runAction(cc.sequence(playlose,delay));
        cc.log("here");
        
    }
    ,playRuler:function(){
        
    }
    ,stopAll:function(){
        cc.audioEngine.stopAllEffects ( );
    }
    
    ,endAll:function(){
        cc.audioEngine.end();
    }
    ,pauseAll:function(){
        cc.audioEngine.pauseAllEffects();
    }
    
    
};
const P_PATH='resources/raw/';
module.exports={
    AudioController:AudioController
    
};