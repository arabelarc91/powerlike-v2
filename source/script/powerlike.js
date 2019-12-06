let greeting = {
    events: function() {
        $('.powerlike_profile_market__content__options__button[filter="persona"]').click(function() {            
            flow.setHash('/perfiles')            
        })
    }
}

let profiles = {
    setValButton: function() {
        let perfilText

        $('.powerlike_options__carousel').on('afterChange', function(event, slick, currentSlide, nextSlide){
            perfilText =  $('.powerlike_options__carousel .slick-current .tag').text()
            $('#profile_name').text(perfilText)
        })
    },
    events: function() {
        let perfilText

        $('.button_entel__carousel > a').click(function() {
            perfilText =  $('.powerlike_options__carousel .slick-current .tag').text()
            flow.showPerfil(perfilText)
        })
    }
}

let profile_selected = {
    events: function() {
        let hash

        $('.powerlike_chooseprofile .button_entel__carousel > a').click(function() {
            hash = window.location.hash

            flow.setHash('/modalidad')
            $('.powerlike__preselector').attr('referer',hash.replace('#/',''))
        })
    }
}

let preselector = {
    events: function() {
        let modality

        $('.powerlike__preselector .powerlike__preselector__content__buttons').click(function() {
            modality = $(this).attr('filter')            
        })
    }
}

// -----------------------------

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
    devices: function() {
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
        // reset
        $('.entel-powerlike section').removeClass('active')
        
        // decisions tree
        if (hashValue === '') {
            $('.powerlike_profile_market').addClass('active')

        } else if (hashValue === '#/perfiles') {
            $('.powerlike_options').addClass('active')

        } else if (hashValue === '#/gamer') {
            $('.powerlike_chooseprofile.gamer').addClass('active')

        } else if (hashValue === '#/influencer') {
            $('.powerlike_chooseprofile.influencer').addClass('active')

        } else if (hashValue === '#/aventurero') {
            $('.powerlike_chooseprofile.aventurero').addClass('active')

        } else if (hashValue === '#/ahorrador') {
            $('.powerlike_chooseprofile.ahorrador').addClass('active')

        } else if (hashValue === '#/modalidad') {
            $('.powerlike__preselector').addClass('active')            
        }
    },
    showPerfil: function(perfilText) {
        flow.setHash('/' + perfilText.replace(' ',''))
    },
    backEvent: function() {
        let hashValue
        
        $('.arrow-back').click(function() {
            hashValue = window.location.hash

            if (hashValue === '#/perfiles') {
                flow.setHash('')

            } else if (hashValue === '#/gamer' || hashValue === '#/influencer' || hashValue === '#/aventurero' || hashValue === '#/ahorrador') {
                flow.setHash('/perfiles')

            }  else if (hashValue === '#/modalidad') {
                // move back to profile
                let referer = $('.powerlike__preselector').attr('referer')
                
                if (referer != undefined) {
                    flow.setHash('/' + referer)
                } else {
                    flow.setHash('')
                }            
            }
        })
    }
}

// -----------------------------

let load_greeting = function() {
    greeting.events()
}

let load_profiles = function() {
    profiles.setValButton()
    profiles.events()
}

let load_profile_selected = function() {
    profile_selected.events()
}

let load_preselector = function() {
    preselector.events()
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
    load_greeting()
    load_profiles()
    load_profile_selected()
    load_preselector()
    load_slider()
    load_flow()
}

$(document).ready(function() {
    initialize()
})