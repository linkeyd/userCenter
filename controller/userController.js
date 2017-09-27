/**
 * Created by Linwei on 2016/9/22.
 */
"use strict";
var express = require('express');
var session = require('express-session');
var router = express.Router();
var co = require('co');
var crypto = require('crypto');
var user = require('../model/userModel');
var db = require('../model/connection');
var resStatusCode = require('../util/resStatusCode');
var nodeMailer = require('../util/nodeMailer');

class UserController {
    constructor(){

    }
    /**
     *账号登陆
     */
    userLogin(req, res, next) {
        co(function*() {
            try {
                //前端req给服务端账号密码
                var username = req.body.username;
                var password = crypto.createHash('md5').update(req.body.password).digest('base64');
                //mysql 查找id
                var loginResult = yield user.userModel.qAll({
                    userId: username
                });
                //账号不存在
                if (!loginResult.length) {
                    resStatusCode(res, 1001);
                }
                //密码不正确
                else if (password != loginResult[0].password) {
                    resStatusCode(res, 1002);
                }
                //登陆成功
                else {
                    req.session.sessionUsername = loginResult[0].userId;
                    resStatusCode(res, 200, loginResult[0]);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }

    /**
     * 账号登出
     */
    userLoginOut(req, res, next) {
        req.session.destroy(function (err) {
            if (err) console.log("session销毁失败.");
            else {
                resStatusCode(res, 200, "成功退出");
                console.log("session被销毁.");
            }
        })
    }

    /**
     * 用户注册
     */
    userRegister(req, res, next) {
        co(function*() {
            try {
                var username = req.body.username;
                var password = crypto.createHash('md5').update(req.body.password).digest('base64');
                var passwordCheck = crypto.createHash('md5').update(req.body.password).digest('base64');
                var email = req.body.email;
                var sex = req.body.sex;
                var birthDay = req.body.birthDay;
                var locateCountry = "";//国家
                var locateProvince = req.body.locateProvince;
                var locateCity = req.body.locateCity;
                var locateDistrict = req.body.locateDistrict;
                var phoneNumber = req.body.phoneNumber;
                // var chinaText = /[\u4E00-\u9FA5]/i;  //账号使用中文
                //非法字符账号
                var illegalChar = /^[A-Za-z0-9_-]+$/;
                //账号为空
                if (username === '' || username == 'undefined') {
                    resStatusCode(res, 1105);
                }
                //账号非法字符
                else if (!illegalChar.test(username)) {
                    resStatusCode(res, 1104);
                }
                //密码和检查密码不一致
                else if (password != passwordCheck) {
                    resStatusCode(res, 1107);
                }
                //邮箱为空
                else if (email === '') {
                    resStatusCode(res, 1106);
                }
                else {
                    //生日为空赋值
                    if (birthDay === '') {
                        birthDay = new Date();
                    }
                    //数据库添加
                    var registerResult = yield user.userModel.qCreate({
                        userId: username,
                        password: password,
                        email: email,
                        sex: sex,
                        birthDay: birthDay,
                        locateProvince: locateProvince,
                        locateCity: locateCity,
                        locateDistrict: locateDistrict,
                        phoneNumber: phoneNumber,
                        avatar: 'avatar/default.png'
                    });
                    nodeMailer.regeditEmail(username, username, email);
                    resStatusCode(res, 200);
                }
            }
            catch (err) {
                console.log(err);
            }
        })
    }

    /**
     * 获取用户信息
     */
    userGetInfo(req,res,next){
        co(function*() {
            try {

                var userSelect = yield user.userModel.qGet(req.session.sessionUsername);
                if (userSelect) {
                    resStatusCode(res,200,userSelect);
                }
            }
            catch (err) {
                // console.log(err);
                // 没有登陆
                resStatusCode(res, 1301);
            }
        });
    }

    /**
     * 修改用户信息
     */
    userInfoChange(req,res,next){
        co(function*(){
            try{
                var username = req.session.sessionUsername;
                var phoneNumber = req.body.phoneNumber;
                var birthDay = req.body.birthDay;
                var sex = req.body.sex;
                var locateProvince = req.body.locateProvince;
                var locateCity = req.body.locateCity;
                var locateDistrict = req.body.locateDistrict;
                var update = yield user.userModel.qGet(username);
                update.phoneNumber = phoneNumber;
                update.birthDay = birthDay;
                update.sex = sex;
                update.locateProvince = locateProvince;
                update.locateCity = locateCity;
                update.locateDistrict = locateDistrict;
                update.qSave();
                resStatusCode(res,200);
            }
            catch (err){
                console.log(err);
            }
        })
    }
    /**
     * 修改用户密码
     */
    userUpdatePass(req,res,next){
        co(function*() {
            try {
                var username = req.session.sessionUsername;
                var password = crypto.createHash('md5').update(req.body.psw).digest('base64');
                var newPass = crypto.createHash('md5').update(req.body.password).digest('base64');
                var resultPsw = yield user.userModel.qAll({
                    userId: username,
                    password: password
                });
                if (resultPsw.length) {
                    var update = yield user.userModel.qGet(username);
                    update.password = newPass;
                    update.qSave();
                    resStatusCode(res,200);
                }
                else {
                    resStatusCode(res,1002);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }

    /**
     * 获取用户经验等级
     */
    rhythmExperience(req,res,next){
        co(function*(){
            try{
                var _db = yield db;
                var username = req.session.sessionUsername;

                var exp = (yield _db.qExecQuery("select experience from rhythm_user where userId=?",[username]))[0];
                if(exp.length>0){
                    var level = parseInt(Math.sqrt(exp[0].experience / 1000));
                    var thisExp = exp[0].experience - (level*level)*1000;
                    var expCount = ((level+1)*(level+1))*1000-(level*level)*1000;
                    var percentage = parseInt((thisExp / expCount)*100);
                    var message = {
                        level : level,
                        exp : thisExp,
                        expCount : expCount ,
                        percentage : percentage + "%"
                    };
                    resStatusCode(res,200,message);
                }
                else{
                    var message = {
                        level : 0,
                        exp : 0,
                        expCount : 0 ,
                        percentage : 0 + "%"
                    };
                    resStatusCode(res,200,message);
                }
            }
            catch (err){
                console.log(err);
            }
        });

    }


    /**
     * 用户头像上传
     */
    avatarUpload(req,res,next){
        
    };

}

module.exports = UserController;
