/**
 * Created by Linwei on 2016/9/22.
 */
"use strict";
var express = require('express');
var session = require('express-session');
var router = express.Router();
var co = require('co');
var resStatusCode = require('../util/resStatusCode');
var verification = require('../model/verificationCodeModel');
var user = require('../model/userModel');
class ValidatorController{
    constructor(){

    }
    /**
     *账号是否登陆存在或者过期
     */
    isLogin(req,res,next){
            if(!req.session.username){
                console.log(req.session.username);
                res.redirect('/');
            }
            else{
                next();
            }
    }

    /**
     * 找回验证码是否过期
     */
    isCode(req,res,next){
        co(function*(){
            try {
                var code = req.query.code;
                var codeResult = yield verification.verificationCodeModel.qAll({
                    codeId:code
                });
                var date = new Date();
                if(codeResult.length && codeResult[0].expirationTime > date){
                    resStatusCode(res,200,codeResult);
                }
                else{
                    resStatusCode(res,1201);
                }
            }
            catch (err){
                console.log(err);
            }
        })
    }

    /**
     * 用户是否存在
     */
    isUserId(req,res,next){
        co(function*() {
            try {
                var username = req.query.username;
                var userCheck = yield user.userModel.qAll({userId: username});
                if (userCheck.length) {
                    res.send(false);
                }
                else {
                    res.send(true);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
module.exports = ValidatorController;