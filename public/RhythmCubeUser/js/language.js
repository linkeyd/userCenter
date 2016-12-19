/**
 * Created by Linwei on 2016/4/22.
 */

var language = "";
var LanguageTab = function () {
    /**
     * 插入中英文转换
     * @param data
     */
    var callback = function (data) {
        var items = $('[i18n]').find('*');
        var trans = data.trans;
        for (var i = 0; i < items.length; i++) {
            var item = items.eq(i);
            if (item.children().length == 0) {
                var change = trans[item.text()];
                var val = trans[item.val()];
                var place = trans[item.attr("placeholder")];
                item.attr("placeholder",place);
                item.val(val);
                if (change)item.text(change);
            }
        }
    };

    /**
     *
     * @param c_name
     * @param value
     * @param hour
     * @constructor
     */
    var SetCookie = function(c_name,value,hour){
        var cookieDate = new Date();
        cookieDate.setDate(cookieDate.getTime() + hour*60*60*1000);
        document.cookie = c_name+"="+encodeURI(value)
            +((hour==null)?" ":";expires="+cookieDate.toUTCString() );
    };

    /**
     *
     * @param c_name
     * @returns {*}
     * @constructor
     */
    var GetCookie = function(c_name){
        var cookieEnd;
        var cookieKey;
        var cookie = "";
        if(document.cookie.length > 0)
        {
            cookieKey = document.cookie.indexOf(c_name + "=");
            if(cookieKey != -1)
            {
                cookieKey = cookieKey + c_name.length + 1;
                cookieEnd = document.cookie.indexOf(";",cookieKey);
                if(cookieEnd == -1)
                {
                    cookieEnd = document.cookie.length;
                }
                cookie = decodeURI(document.cookie.substring(cookieKey,cookieEnd));
                if(cookie == "ch")
                {
                    return null
                }
                return cookie;
            }
        }

        return cookie;
    };

    /**
     * 获取url的参数信息
     * @returns {Object}
     * @constructor
     */
    var GetRequest = function () {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strMate = str.split("&");

            for (var i = 0; i < strMate.length; i++) {
                theRequest[strMate[i].split("=")[0]] = decodeURI(strMate[i].split("=")[1]);
            }
        }
        return theRequest;
    };

    return {
        Init: function () {
            var request = new GetRequest();
            var lang = request.lang;
            SetCookie('lang',lang ,15);

        },
        reload:function(){
            var getCookie = GetCookie("lang");
            switch (getCookie){
                case 'jp':
                    language = jp;
                    callback(jp);
                    break;
                case 'en':
                    language = en;
                    callback(en);
                    break;
                default:
                    language = ch;
            }
        },
        lang:function(){
            var getCookie = GetCookie("lang");
            return getCookie;
        }
    }
}();



