let saver = {
    events : function() {
        $('.select-icon').click(function() {
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
    },

    devices : function() {
        $('.powerlike_devicedetail__content__device').slick({
            arrows: false,
            dots: false,
            infinite: false,
            mobileFirst: true,
            pauseOnFocus: false,
            pauseOnHover: false,
            centerMode: true,
            centerPadding: '20px'
        })
    },

    match_device: function() {
        $('.powerlike_devicedetail__content__match').slick({
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
    sliders.devices()
    sliders.match_device()
}

$(document).ready(function() {
    initialize()
})