// -------------------------------
// ------- function steps --------
// -------------------------------

var globalBateryMin,
    globalBateryMax,
    globalCameraMin,
    globalCameraMax,
    globalRamMin,
    globalRamMax

// -------------------------------
// ------- function steps --------
// -------------------------------

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
        $('.powerlike__preselector ul li').click(function() {
            flow.setHash('/matches')
            console.log(globalBateryMin)
            console.log(globalBateryMax)
            console.log(globalCameraMin)
            console.log(globalCameraMax)
            console.log(globalRamMin)
            console.log(globalRamMax)
        })
    }
}

let matches = {
    events: function() {
        $('.powerlike_devicedetail .link-detalle,.powerlike_devicedetail .link-ficha').click(function() {
            flow.setHash('/detalle')
        })
    }
}

// -------------------------------
// ------- general funcions ------
// -------------------------------

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
        // reset
        $('.entel-powerlike section').removeClass('active')
        
        // decisions tree
        if (hashValue === '') {
            $('.powerlike_profile_market').addClass('active')

        } else if (hashValue === '#/perfiles') {
            $('.powerlike_options').addClass('active')

        } else if (hashValue === '#/gamer') {
            $('.powerlike_chooseprofile.gamer').addClass('active')
            ranges.nullCamera()

        } else if (hashValue === '#/influencer') {
            $('.powerlike_chooseprofile.influencer').addClass('active')
            ranges.nullCamera()

        } else if (hashValue === '#/aventurero') {
            $('.powerlike_chooseprofile.aventurero').addClass('active')
            ranges.nullRam()

        } else if (hashValue === '#/ahorrador') {
            $('.powerlike_chooseprofile.ahorrador').addClass('active')
            ranges.nullBateryCameraRam()

        } else if (hashValue === '#/modalidad') {
            $('.powerlike__preselector').addClass('active')

        } else if (hashValue === '#/matches') {
            $('.powerlike_devicedetail').addClass('active')

        } else if (hashValue === '#/detalle') {
            $('.powerlike_specs').addClass('active')
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
                
                if (referer !== undefined) {
                    flow.setHash('/' + referer)
                } else {
                    flow.setHash('')
                }
            } else if (hashValue === '#/matches') {
                flow.setHash('/modalidad')

            } else if (hashValue === '#/detalle') {
                flow.setHash('/matches')                
            }
        })
    }
}

let ranges = {
    gamer: function() {
        let range1 = document.getElementById('range-gamer-frecuence'),
            $range1 = $('#range-gamer-frecuence'),
            range2 = document.getElementById('range-gamer-apps'),
            $range2 = $('#range-gamer-apps')

        range1.oninput = function() {
            if (0 <= this.value && this.value <= 33) {
                $range1.next().text('Más de 1 horas')
                // global mAh
                globalBateryMin = 750
                globalBateryMax = 1000
            } else if (34 <= this.value && this.value <= 66) {
                $range1.next().text('Más de 3 horas')
                // global mAh
                globalBateryMin = 1001
                globalBateryMax = 3000
            } else if (67 <= this.value && this.value <= 100) {
                $range1.next().text('Más de 5 horas')
                // global mAh
                globalBateryMin = 3001
                globalBateryMax = 9999
            }
        }

        range2.oninput = function() {
            if (0 <= this.value && this.value <= 33) {
                $range2.next().text('Más de 1 juego')
                // global GBs
                globalRamMin = 0
                globalRamMax = 0.9
            } else if (34 <= this.value && this.value <= 66) {
                $range2.next().text('Más de 3 juegos')
                // global GBs
                globalRamMin = 1
                globalRamMax = 2.9
            } else if (67 <= this.value && this.value <= 100) {
                $range2.next().text('Más de 5 juegos')
                // global GBs
                globalRamMin = 3
                globalRamMax = 4
            }
        }
    },
    influencer: function() {
        let range1 = document.getElementById('range-influencer-apps'),
            $range1 = $('#range-influencer-apps'),
            range2 = document.getElementById('range-influencer-nivel'),
            $range2 = $('#range-influencer-nivel')

        range1.oninput = function() {
            if (0 <= this.value && this.value <= 33) {
                $range1.next().text('Más de 1 horas')
                // global mAh 
                globalBateryMin = 750
                globalBateryMax = 1000
            } else if (34 <= this.value && this.value <= 66) {
                $range1.next().text('Más de 3 horas')
                // global mAh
                globalBateryMin = 1001
                globalBateryMax = 3000
            } else if (67 <= this.value && this.value <= 100) {
                $range1.next().text('Más de 5 horas')
                // global mAh
                globalBateryMin = 3001
                globalBateryMax = 9999
            }
        }

        range2.oninput = function() {
            if (0 <= this.value && this.value <= 33) {
                $range2.next().text('Poco')
                // global MP
                globalCameraMin = 0
                globalCameraMax = 12
            } else if (34 <= this.value && this.value <= 66) {
                $range2.next().text('Mucho')
                // global MP
                globalCameraMin = 13
                globalCameraMax = 21
            } else if (67 <= this.value && this.value <= 100) {
                $range2.next().text('Demasiado')
                // global MP
                globalCameraMin = 22
                globalCameraMax = 53
            }
        }
    },
    aventurero: function() {
        let range1 = document.getElementById('range-aventurero-fotos'),
            $range1 = $('#range-aventurero-fotos'),
            range2 = document.getElementById('range-aventurero-apps'),
            $range2 = $('#range-aventurero-apps')

        range1.oninput = function() {
            if (0 <= this.value && this.value <= 33) {
                $range1.next().text('Poco')
                // global MP
                globalCameraMin = 0
                globalCameraMax = 12
            } else if (34 <= this.value && this.value <= 66) {
                $range1.next().text('Mucho')
                // global MP
                globalCameraMin = 13
                globalCameraMax = 21
            } else if (67 <= this.value && this.value <= 100) {
                $range1.next().text('Demasiado')
                // global MP
                globalCameraMin = 22
                globalCameraMax = 53
            }
        }

        range2.oninput = function() {
            if (0 <= this.value && this.value <= 33) {
                $range2.next().text('Más de 1 apps')
                // global GBs
                globalRamMin = 0
                globalRamMax = 0.9
            } else if (34 <= this.value && this.value <= 66) {
                $range2.next().text('Más de 3 apps')
                // global GBs
                globalRamMin = 1
                globalRamMax = 2.9
            } else if (67 <= this.value && this.value <= 100) {
                $range2.next().text('Más de 5 apps')
                // global GBs
                globalRamMin = 3
                globalRamMax = 4
            }
        }
    },
    nullBatery: function() {
        globalBateryMin = 0,
        globalBateryMax = 0,
        globalCameraMin = 13,
        globalCameraMax = 21,
        globalRamMin = 1,
        globalRamMax = 2.9
    },
    nullCamera: function() {
        globalBateryMin = 1001,
        globalBateryMax = 3000,
        globalCameraMin = 0,
        globalCameraMax = 0,
        globalRamMin = 1,
        globalRamMax = 2.9
    },
    nullRam: function() {
        globalBateryMin = 1001,
        globalBateryMax = 3000,
        globalCameraMin = 13,
        globalCameraMax = 21,
        globalRamMin = 0,
        globalRamMax = 0
    },
    nullBateryCameraRam: function() {
        globalBateryMin = 0,
        globalBateryMax = 0,
        globalCameraMin = 0,
        globalCameraMax = 0,
        globalRamMin = 0,
        globalRamMax = 0
    }
}

// -------------------------------
// --------- load funcions -------
// -------------------------------

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

let load_matches = function() {
    matches.events()
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

let load_range = function() {
    ranges.gamer()
    ranges.influencer()
    ranges.aventurero()
}

// -------------------------------
// --------- init funcion --------
// -------------------------------

let initialize = function() {
    load_greeting()
    load_profiles()
    load_profile_selected()
    load_preselector()
    load_matches()
    load_slider()
    load_flow()
    load_range()
}

$(document).ready(function() {
    initialize()
})