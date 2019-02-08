$(document).ready(function() {
    $('.da-nav__navigation > li').click(function() {
        if(isMobile()) {
            $(this).children('ul').toggle();
            $(this).toggleClass('active');
        }
    });
    $('.da-nav__mobile-toggle').click(function(){
        $('.da-nav__navigation').toggle();
    });
    $('footer').css('margin-top', 0);
    var heightDifference = $(window).outerHeight() - ($('.container').outerHeight() + $('footer').outerHeight());
    if(heightDifference > 0) {
        $('footer').css('margin-top', heightDifference);
    }
});

function isMobile(){
    if ($(".da-nav__mobile-toggle").css("display") == "block" ){
        return true;
    }
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000) + 1);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    setCookie(name, "", 0);
}

function toggleNav() {
    window.scrollTo(0, 0);
    $('#sidenavcol').toggle();
}
