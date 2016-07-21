"use strict";
cc._RFpush(module, 'ed958Kz0flA1YtbYu6vLth0', 'ReadWriteJson');
// scripts\modules\ReadWriteJson.js

var ReadWriteJson = {};
module.exports = {
    ReadWriteJson: ReadWriteJson,
    readFileJson: function readFileJson(urljson) {
        var url = cc.url.raw(urljson);
        var stringcontent = "";
        cc.loader.load(url, function (err, res) {
            stringcontent = JSON.stringify(res);
            stringcontent = stringcontent.substring(1, stringcontent.lastIndexOf("]"));
            // console.log( 'load['+ url +'], err['+err+'] result: ' + JSON.stringify( res ) );
        });
        return stringcontent;
    }
};

cc._RFpop();