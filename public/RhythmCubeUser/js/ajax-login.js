/**
 * Created by Linwei on 2016/4/17.
 */

/**
 * loginCancel = 1关闭登入框
 * success= userId
 * @type {{init}}
 */
var loginData = function () {
    //检查登入失败次数
    var checkLoginNum = 0;

    /**
     * ajax
     * @param url
     * @param data
     * @param callback
     */
    var ajax = function (url, data, callback) {
        $.ajax({
            //contentType:'application/json',
            url: url,
            data: data,
            dataType: 'json',
            type: 'post',
            success: callback,
            setTimeOut: (2000),
            error: function (err) {
                console.log(err);
            }
        })
    };

    /**
     * 输入验证
     */
    var validate = function () {
        $(".login-check").validate({
            errorClass: 'errLabel',
            rules: {
                username: 'required',
                password: {
                    required: true,

                }
            },
            messages: {
                username: {
                    required: language.trans["1004"]
                },
                password: {
                    required: language.trans["1005"]
                }
            },
            submitHandler:login
        });

        $(".login-check input").keypress(function(e){
            if(e.which == 13)
            {
                login();
            }

        })
    };



    /**
     * 成功返回
     * @param data
     */
    var callback = function (data) {
        if(data.status == 200)
        {
            console.log(data);
            window.location.href = "?username="+data.message.userId+"&password="+data.message.password;
        }
        else{
            dialog.open(language.trans[data.status]);
        }
    };

    var login = function(form){
        if ($('.login-check').validate().form()) {
            var forms = {
                username:$("#username").val(),
                password:$("#password").val()
            };
            ajax("/user/postLogin",forms,callback);
        }
        return false;
    };


    return {
        init: function () {
                validate();
                $(".login").click(login);
        }
    }
}();
$(function () {
    loginData.init();
});
