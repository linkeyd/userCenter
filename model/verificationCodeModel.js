/**
 * Created by Linwei on 2016/7/7.
 */

var orm = require('orm');
var qOrm = require('q-orm');
var co = require('co');
var connection = require('./connection');
connection.then(function(db){
    exports.verificationCodeModel = db.qDefine("auth_code",{
        codeId :  { type:'text' , key: true },
        userId:String,
        expirationTime:{ type: "date", time: true },
        type : Number
    });
    db.qSync();
});