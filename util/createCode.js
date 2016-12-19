/**
 * Created by Linwei on 2016/9/19.
 */
var crypto = require('crypto');
var co = require('co');
var nodeMailer = require('../util/nodeMailer');
var Code = require('../model/verificationCodeModel');

module.exports = (userId,type,email) => {
    co(function*() {
        try{
            var code = crypto.randomBytes(16).toString('base64');
            var date = new Date();
            var maxMin = date.getMinutes() + 15;
            date.setMinutes(maxMin);
            var result =yield Code.verificationCodeModel.qCreate({
                codeId:code,
                userId:userId,
                expirationTime:date,
                type:type
            });
            if(type == 1){
                nodeMailer.emailInformationUpdate(email,userId,code);
            }
            else{
                nodeMailer.userPasswordUpdate(email,userId,code);
            }
            console.log(result);
        }
        catch (err){
            console.log(err);
        }
    });
};