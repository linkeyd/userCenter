/**
 * Created by Linwei on 2016/9/22.
 */
"use strict";
var express = require('express');
var session = require('express-session');
var router = express.Router();
var co = require('co');
var user = require('../model/userModel');
var crypto = require('crypto');
var createCode = require('../util/createCode');
var resStatusCode = require('../util/resStatusCode');
var verification = require('../model/verificationCodeModel');
class SendEmailController {
    constructor(){

    }
    /**
     * 发送修改修改密码Code
     */
    sendPassCode(req, res, next) {
        co(function*() {
            try {
                var userId = req.body.username;
                var email = req.body.email;
                var userResult = yield user.userModel.qAll({
                    userId: userId,
                    email: email
                });
                if (userResult.length) {
                    createCode(userId, 0, email);
                    resStatusCode(res, 200, "邮件发送成功请登入您的邮箱查看");
                }
                else {
                    resStatusCode(res, 1301);
                }
            }
            catch (err) {
                console.log(err);
            }
        })
    }

    /**
     * 发送修改Email Code
     */
    sendEmailCode(req, res, next) {
        co(function*() {
            try{
                var userId = req.session.username;
                var email = req.body.email;
                var result = yield user.userModel.qGet(userId);
                if ( (result.email == email) || !result.email) {
                    createCode(userId,1,email);
                    resStatusCode(res,200,"邮件发送成功请登入您的邮箱查看");
                }
                else{
                    resStatusCode(res,1301);
                }
            }
            catch (err){
                console.log(err);
            }
        })
    }

    /**
     * 找回密码
     */
    forgotPassword(req,res,next) {
        co(function*() {
            try{
                var code = req.body.code;
                var codeResult = yield verification.verificationCodeModel.qAll({
                    codeId:code,
                    type:0  //密码的code
                });
                var newDate = new Date();
                if(codeResult[0].expirationTime > newDate) {
                    var password = crypto.createHash('md5').update(req.body.password).digest('base64');
                    var update = yield user.userModel.qGet(codeResult[0].userId);
                    update.password = password;
                    update.qSave();
                    resStatusCode(res,200,"密码修改成功");
                }
                else{
                    resStatusCode(res,1201);
                }
            }
            catch(err){
                console.log(err);
            }
        });
    }

    /**
     * 找回邮箱
     */
    forgotEmail(req,res,next){
        co(function*() {
            try{
                var code = req.body.code;
                var codeResult = yield verification.verificationCodeModel.qAll({
                    codeId:code,
                    type:1 //邮箱的code
                });
                var newDate = new Date();
                if(codeResult[0].expirationTime > newDate) {
                    var email = req.body.email;
                    var update = yield user.userModel.qGet(codeResult[0].userId);
                    update.email = email;
                    update.qSave();
                    resStatusCode(res,200,"邮箱修改成功")
                }
                else{
                    resStatusCode(res,1201);
                }
            }
            catch(err){
                console.log(err);
            }
        });
    }
}
module.exports = SendEmailController;