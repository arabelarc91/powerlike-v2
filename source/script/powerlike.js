let saver = {
    events : function() {
        $('.select-icon').click(function () {
            $(this).toggleClass("active")            
        })
    }
}

let sliders = {
    profiles : function() {
        $('.powerlike_options__carousel').slick({
            arrows: false,
            dots: true,
            infinite: false,
            mobileFirst: true,
            pauseOnFocus: false,
            pauseOnHover: false,
            centerMode: true,
            centerPadding: '20px'
        })
    }
}

let initialize = function() {
    saver.events()
    sliders.profiles()
}

$(document).ready(function() {
    initialize()
})