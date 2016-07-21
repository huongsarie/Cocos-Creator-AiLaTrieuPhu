"use strict";
cc._RFpush(module, 'b4ff5JHcplBWrV7ZUH9fFwv', 'UserInforKey');
// scripts\data\UserInforKey.js

var UserInforKey = {
    ID: "id",
    LEVEL: "level",
    EXPERIENCE: "experience",
    NAME: "name",
    PLAYTIMES: "times",
    ARCHIRE: "archire",
    HISTORY: "history",
    TOTAL: "totalmoney"

};

var ArchivementKey = {
    COMPLETE: "complete"
};

var HistoryKey = {
    QUESTION: "question",
    TIME: "time"
};
module.exports = {
    UserInforKey: UserInforKey,
    ArchivementKey: ArchivementKey,
    HistoryKey: HistoryKey
};

cc._RFpop();