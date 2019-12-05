let greeting = {
    events: function() {
        $('.powerlike_profile_market__content__options__button').click(function() {
            flow.setHash('/start')
        })
    }
}

let saver = {
    events: function() {
        $('.select-icon').click(function() {
            $(this).toggleClass("active")
        })
    }
}

let sliders = {
    profiles: function() {
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
    devices: function () {
        $(".powerlike_devicedetail__content__device").slick({
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

let flow = {
    setHash: function(hash) {
        // '/value'
        window.location.hash = hash
    },
    detectPopState: function() {
        let hashValue

        window.addEventListener('popstate', function() {
            hashValue = window.location.hash
            flow.changeScreen(hashValue)
        })
    },
    changeScreen: function(hashValue) {
        $('.entel-powerlike section').removeClass('active')
        
        if (hashValue === '') {
            $('.powerlike_profile_market').addClass('active')
        } else if (hashValue === '#/start') {
            $('.powerlike_options').addClass('active')
        }
    }
}

let load_greeting = function() {
    greeting.events()
}

let load_saver = function() {
    saver.events()
}

let load_slider = function() {
    sliders.profiles()
    sliders.devices()
}

let load_flow = function() {
    flow.detectPopState()
    flow.changeScreen(window.location.hash)
}

let initialize = function() {
    load_greeting()
    load_saver()
    load_slider()
    load_flow()
}

$(document).ready(function() {
    initialize()
})