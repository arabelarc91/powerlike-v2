$(document).ready(function(){

    setHeight()

    $(window).resize(function(){
        setHeight()
    });
})

function setHeight () {
    let headerHeight = $('.preselector__header').height(),
        windowsHeight = $(window).height()

    $('.preselector__content').height(windowsHeight - headerHeight)
}