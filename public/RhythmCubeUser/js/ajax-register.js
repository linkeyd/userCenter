/**
 * Created by Linwei on 2016/4/18.
 */

/**
 * registerSuccess=true
 * registerCancel=1//关闭注册
 * @type {{init}}
 */

//自定义验证方法只允许用户输入字母下划线数字
jQuery.validator.addMethod("isChar", function(value, element, param) {
    var length = value.length;
    var regName = /^[A-Za-z0-9_-]+$/;
    return this.optional(element) || regName.test( value );
}, $.validator.format(language.trans["1104"]));


var registerData = function () {
    var ajax = function (url, data, callback) {
        $.ajax({
            url: url,
            data: data,
            type: 'post',
            dataType: 'json',
            success: callback,
            setTimeOut: (2000),
            error: function (err) {
                console.log(err);
            }
        })
    };

    var validate = function () {
        $('.register-check').validate({
            errorClass: 'errLabel',
            rules: {
                username: {
                    required: true,
                    minlength: 6,
                    maxlength:30,
                    isChar:true,
                    remote:{
                    url:"/check/getCheckUserId",
                        type:'get',
                        dataType:'json',
                        data:{
                            username:$(".username").val()
                        }
                    }
                },
                password: {
                    required: true,
                    minlength: 7
                },
                checkPassword: {
                    required: true,
                    minlength: 7,
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                username: {
                    required: language.trans["1105"],
                    minlength: language.trans["1109"],
                    maxlength:language.trans["1110"],
                    remote:language.trans["1101"]
                },
                password: {
                    required: language.trans["1108"],
                    minlength: language.trans["1111"]
                },
                checkPassword: {
                    required: language.trans["1108"],
                    minlength: language.trans["1111"],
                    equalTo: language.trans["1107"]
                },
                email: {
                    required: language.trans["1106"],
                    email: language.trans["1112"]
                }
            }
        })
    };

    var callback = function (data) {
        if (data.status == 200) {
            dialog.open(language.trans[data.status]);
            window.setTimeout(function(){
                window.location.href = '?registerSuccess=1';
            },2000);
        }
        else {
                dialog.open(language.trans[data.status]);
        }
    };
    return {
        /**
         * 执行接口
         */
        init: function () {
            validate();
            $(".reg").click(function () {
                if ($('.register-check').validate().form()) {
                    var form = {
                        username: $("#username").val(),
                        password: $("#password").val(),
                        email: $("#email").val()
                    };
                    ajax('/user/postRegister', form, callback);
                }
            });
        }
    }
}();
/**
 * 调用
 */
$(function () {
    registerData.init();
});

