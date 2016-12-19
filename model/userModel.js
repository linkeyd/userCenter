/**
 * Created by Linwei on 2016/7/7.
 */

var orm = require('orm');
var qOrm = require('q-orm');
var co = require('co');
var connection = require('./connection');
connection.then(function(db){
    exports.userModel = db.qDefine("exd_user",{
        userId :  { type:'text' , key: true },
        password : String,
        email :String,
        sex : String,
        birthDay:{ type: "date", time: false },
        locateProvince : String,
        locateCity : String,
        locateDistrict : String,
        locateCountry : String,
        phoneNumber:String,
        avatar:String
    });
    db.qSync();
});


