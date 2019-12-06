let greeting = {
    events: function() {
        $('.powerlike_profile_market__content__options__button').click(function() {
            flow.setHash('/start')
        })
    }
}

let options = {
    setValButton: function() {
        let perfilText

        $(".powerlike_options__carousel").on('afterChange', function(event, slick, currentSlide, nextSlide){
            perfilText =  $(".powerlike_options__carousel .slick-current .tag").text()
            $('#profile_name').text(perfilText)
        })
    },
    events: function() {
        let perfilValue

        $('.button_entel__carousel > a').click(function() {
            perfilValue =  $(".powerlike_options__carousel .slick-current .tag").text()
            flow.showPerfil(perfilValue)
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
        $('.powerlike_devicedetail__content__match__slide').slick({
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
    },
    backEvent: function() {
        let hashValue
        
        $('.arrow-back').click(function() {
            hashValue = window.location.hash

            if (hashValue === '#/start') {
                flow.setHash('')
            }
        })
    },
    showPerfil: function(perfilValue) {
        console.log(perfilValue)
    }
}

let load_options = function() {
    options.setValButton()
    options.events()
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
    sliders.match_device()
}

let load_flow = function() {
    flow.detectPopState()
    flow.changeScreen(window.location.hash)
    flow.backEvent()
}

let initialize = function() {
    load_options()
    load_greeting()
    load_saver()
    load_slider()
    load_flow()
}

$(document).ready(function() {
    initialize()
})