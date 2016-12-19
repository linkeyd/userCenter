var express = require('express');
var session = require('express-session');
var router = express.Router();
var UserController = require('../controller/userController');
var SendEmailController = require('../controller/forgotController');
var ValidatorController = require('../controller/validatorController');
var userController = new UserController();
var sendEmailController = new SendEmailController();
var validatorController = new ValidatorController();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("login.html");
});
router.get('/check/getCheckUserId',validatorController.isUserId);
router.get('/check/getCheckCode',validatorController.isCode);

router.post('/user/postLogin', userController.userLogin);
router.post('/user/postRegister',userController.userRegister);
router.post('/user/postUpdatePass',userController.userUpdatePass);
router.post('/user/postUserInfoChange',userController.UserInfoChange);
router.get('/user/getLoginOut',userController.userLoginOut);
router.get('/user/getUserInfo',userController.userGetInfo);
router.get('/rhythm/Experience',userController.rhythmExperience);

router.post('/forgot/postSendPassCode',sendEmailController.sendPassCode);
router.post('/forgot/postSendEmailCode',sendEmailController.sendEmailCode);
router.post('/forgot/forgotPassword',sendEmailController.forgotPassword);
router.post('/forgot/forgotEmail',sendEmailController.forgotEmail);

module.exports = router;
