$(function() {
    'use strict'
    
    var selectProfile = (function() {
        var inputInitial = {
            slider_options: ".powerlike_options__carousel",
            select_icon :".select-icon",
            counter_button: ".counter"
        }

        var suscribeEvents = function() {
            var selectIcon = $(inputInitial.select_icon)
            selectIcon.on("click", events.list_brands)

            var buttonCounter = $(inputInitial.counter_button)
            buttonCounter.on("click", events.counter_button)
        }
        
        var events = {
            counter_button: function () {
                $(this).toggleClass("active")
            },

            list_brands: function () {
                $(this).toggleClass("active")
            },

            slider_options: function(e) {
                $(inputInitial.slider_options).slick({
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