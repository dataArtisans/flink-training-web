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
    var heightDifference = $(window).outerHeight() - ($('.page-content').outerHeight() + $('footer').outerHeight());
    if(heightDifference > 0) {
        $('footer').css('margin-top', heightDifference);
    }
});

function isMobile(){
    if ($(".da-nav__mobile-toggle").css("display") == "block" ){
        return true;
    }
}
