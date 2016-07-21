var ReadWriteJson={
   
};
module.exports={
    ReadWriteJson:ReadWriteJson,
    readFileJson : function(urljson){
        let url= cc.url.raw(urljson);
        var stringcontent="";
        cc.loader.load(url, function(err,res){
            stringcontent= JSON.stringify(res);
            stringcontent=stringcontent.substring(1, stringcontent.lastIndexOf("]"));
            // console.log( 'load['+ url +'], err['+err+'] result: ' + JSON.stringify( res ) );
           
        });
        return stringcontent;
    }
};
