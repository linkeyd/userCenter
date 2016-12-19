/**
 * Created by Linwei on 2016/4/19.
 */
var dialog = function(){
    var dialogHeight = function(){
        var height = $(window).height();
        $(".dialog-in").css({
            'height':height/3,
            'margin-top':height/3
        })
    };

    var dialogOpen = function(data){
        $(".dialog-message").html(data);
        $(".dialog-warp").fadeIn();
        setTimeout(close, 2000 )
    };

    var close = function (){
        $(".dialog-warp").fadeOut();
    }

    var click = function(){
        $(".dialog-close").click(function(){
            close();
        });
    }
    return{
        init:function(){
            dialogHeight();
            click();
        },
        open:function(data){
            dialogOpen(data);
        }
    }
}();

dialog.init();