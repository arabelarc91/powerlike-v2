$(function() {
    'use strict'
    $('label.entel_options span').each(function() {
        var textBtn = $(this).text().replace(/[^A-Z0-9]/ig, " ").toUpperCase()
        $(this).text(textBtn)
    })


    var selectProfile = (function() {
        var inputInitial = {
            slider_options: ".powerlike_options__carousel"
        }

        var suscribeEvents = function() {
        }
        
        var events = {
            slider_options: function(e) {
                $(inputInitial.slider_options).slick({
                    arrows: false,
                    dots: true,
                    infinite: false,
                    mobileFirst: true,
                    pauseOnFocus: false,
                    pauseOnHover: false,
                    centerMode: true,
                    centerPadding: '20px',
                })
            }
        }

        var initialize = function() {
            suscribeEvents()
            events.slider_options()
        }

        return {
            init: initialize
        }
    })()

    selectProfile.init()
    console.log("reaDY!")
})