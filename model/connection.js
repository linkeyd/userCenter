/**
 * Created by Linwei on 2016/7/6.
 */
var express = require("express");
var orm = require('orm');
var qOrm = require('q-orm');
var setting = require("../setting");


orm.settings.set("connection.pool",true);
orm.settings.set("connection.debug",true);
module.exports = qOrm.qConnect("mysql://"+setting.DB_USER+":"+setting.DB_PASS+"@"+setting.DB_HOST+":"+setting.DB_PORT+"/"+setting.DB_DATABASE).fail(function (err) {
    console.log(err);
});