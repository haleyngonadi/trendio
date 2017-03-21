$(function(){
  Cufon.replace('.logo-text');

    var header = $("header");
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll >= 200) {
            header.addClass("darkHeader");
        } else {
            header.removeClass("darkHeader");
        }
    });
});
