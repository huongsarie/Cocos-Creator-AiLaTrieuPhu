var AnswerState=cc.Enum({
    EMPTY:0,
    ANSWER_A:1,
    ANSWER_B:2,
    ANSWER_C:3,
    ANSWER_D:4,
});
var HelpState=cc.Enum({
    EMPTY:0,
    STOP:1,
    CHANGE:2,
    N5050:3,
    CALL:4,
    AUDIENCE:5
});
var GameState={
    SOUND_MODE:'SOUND_MODE'
    ,MUSIC_MODE:'MUSIC_MODE'
};
var State={
    
};
var ARCHIVEMENT_KEY='ARCHIVEMENT_KEY';
module.exports={
    State:State,
    AnswerState: AnswerState,
    HelpState:HelpState,
    GameState:GameState,
    ARCHIVEMENT_KEY:'ARCHIVEMENT_KEY',
    getNameAnswer: function(number){
    switch (number) {
            case AnswerState.ANSWER_A:
                return 'A';
            case AnswerState.ANSWER_B:
                return 'B';
            case AnswerState.ANSWER_C:
                return 'C';
            case AnswerState.ANSWER_D:
                return 'D';
        }
    }
};