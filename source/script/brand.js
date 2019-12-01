/*global $, test, dataLayer, ga, window, MEDIA*/

$(document).ready(function ($) {
    'use strict'

    /**
     * Product users
     * script to Product of ecommerce entel vtex
     *
     * @return <Function> init
     */
    let brand = (function () {
        let init,
            vtexApiConnect,
            vtexApiConnectBack,
            POLITIC,
            products,
            resetProducts,
            getBrandList,
            getParameterURL,
            scrollPagination,
            getPortal,
            getModality,
            formatString,
            filters = [],
            brands = [],
            currentUrl = window.location.pathname,
            getParameterInit,
            parameterInit


        // validating politic comercial
        if (currentUrl.indexOf('personas') > -1) {
            POLITIC = 'personas'
        } else if (currentUrl.indexOf('empresas') > -1) {
            POLITIC = 'empresas'
        } else {
            POLITIC = 'accesorios'
        }        

        // Generic function to get data to vtex by url data
        vtexApiConnect = function (urlApi) {
            let result = $.ajax({
                type: 'GET',
                url: urlApi,
                timeout: 0,
                async: false,
                crossDomain: true,
                headers : {
                    'Content-Type': 'application/json'
                }
            })

            if (urlApi.indexOf('http') > -1) {
                return result.responseText
            }

            return JSON.parse(result.responseText)
        }

        // Generic function to get data to vtex by url data
        vtexApiConnectBack = function (urlApi) {
            let result = $.ajax({
                type: 'POST',
                url: 'https://www.entel.pe/wp-admin/admin-ajax.php',
                data: {
                    action: 'get_data_vtex_api',
                    dataString: 'url=' + urlApi
                },
                timeout: 0,
                async: false,
                crossDomain: true
            })

            return JSON.parse(result.responseText)
        }

        // Function to get brand list
        getBrandList = function () {
            let result = $.ajax({
                type: 'POST',
                url: 'https://www.entel.pe/wp-admin/admin-ajax.php',
                data: {
                    action: 'get_brand_list_vtex'
                },
                timeout: 0,
                async: false,
                crossDomain: true
            })

            return JSON.parse(result.responseText)
        }

        // Generic function to get URL parameter
        getParameterURL = function (parameter) {
            let pageUrl = decodeURIComponent(window.location.search.substring(1)),
                parameters = pageUrl.split('&'),
                parameterName,
                i

            for (i = 0; i < parameters.length; i++) {
                parameterName = parameters[i].split('=')

                if (parameterName[0] === parameter) {
                    return parameterName[1] === undefined ? true : parameterName[1]
                }
            }
        }

        // Function to reset general vars
        resetProducts = function () {
            products = null
        }

        // Function to get portal current value
        getPortal = function () {
            return (getParameterURL('para')) ? getParameterURL('para') : $('input[name="portal"]:checked').val()
        }

        // Funtion to get modality current value
        getModality = function () {
            return (getParameterURL('modalidad')) ? getParameterURL('modalidad') : ''
        }

        // Function to format a string to url format    
        formatString = function (string) {
            var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,."
            for (var i = 0; i < specialChars.length; i++) {
                string= string.replace(new RegExp("\\" + specialChars[i], 'gi'), '')
            }
            string = string.toLowerCase()
            string = string.replace(/ /g,"-")            
            string = string.replace(/á/gi,"a")
            string = string.replace(/à/gi,"a")
            string = string.replace(/é/gi,"e")
            string = string.replace(/è/gi,"e")
            string = string.replace(/í/gi,"i")
            string = string.replace(/ì/gi,"i")
            string = string.replace(/ó/gi,"o")
            string = string.replace(/ò/gi,"o")
            string = string.replace(/ú/gi,"u")
            string = string.replace(/ù/gi,"u")
            string = string.replace(/ñ/gi,"n")
            return string
        }

        getParameterInit = function () {
            //capturing parameters for google
            if (getParameterURL('gclid')) {
                return '&gclid=' + getParameterURL('gclid')
            //capturing parameters for facebook
            } else if (getParameterURL('utm_source') || getParameterURL('utm_medium') || getParameterURL('utm_campaign') || getParameterURL('utm_term') || getParameterURL('utm_content')) {
                let utm_source = (getParameterURL('utm_source')) ? '&utm_source=' + getParameterURL('utm_source') : '',
                    utm_medium = (getParameterURL('utm_medium')) ? '&utm_medium=' + getParameterURL('utm_medium') : '',
                    utm_campaign = (getParameterURL('utm_campaign')) ? '&utm_campaign=' + getParameterURL('utm_campaign') : '',
                    utm_term = (getParameterURL('utm_term')) ? '&utm_term=' + getParameterURL('utm_term') : '',
                    utm_content = (getParameterURL('utm_content')) ? '&utm_content=' + getParameterURL('utm_content') : ''
                
                return utm_source + utm_medium + utm_campaign + utm_term + utm_content
            } else {
                return ''
            }
        }
    
        parameterInit = getParameterInit()

        // Generic function to normalize text
        String.prototype.normalizeText = function (tex) {
            return (this).normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '-').toLocaleLowerCase()
        }

        // Products section
        class Products {
            constructor (portal, modality, filters, brands, parameterInit) {
                this.portal = this.validatePortal(portal) ? portal : 'personas'
                this.modality =  this.validateModality(modality) ? modality : ''
                this.filters = filters
                this.brands = brands
                this.parameterInit = parameterInit
                this.counter = 0
                this.counterTwo = 0
                this.baseProducts = {}
            }

            load () {
                this.initialLoad()
            }

            initialLoad () {
                let searchText = getParameterURL('s'),
                    urlApiInit = this.getApiUrlBase() + this.getUrlModality() + this.getUrlFilters() + this.getUrlSort(),
                    portalParameter = '?para=' + this.portal,
                    modalityParameter = (this.modality) ? '&modalidad=' + this.modality : ''

                switch (true) {
                    // when isn't search
                    case !searchText:
                        // Load data
                        this.loadDataFiltered(urlApiInit)

                        // Refresh URL
                        history.pushState(null, '', portalParameter + modalityParameter + parameterInit)
                        
                        break

                    // when is search
                    case searchText:
                        $('products__content').prepend('<p>Resultados de búsqueda: ' + searchText + '</p>')

                        // Load data
                        urlApiInit += '&ft=' + searchText

                        this.loadDataFiltered(urlApiInit)

                        // Refresh URL
                        history.pushState(null, '', '?para=' + this.portal + '&s=' + searchText)
                }
            }

            getEmptyData (dataProducts) {
                let dataEmpty = {},
                    cont = 0
    
                $.each(dataProducts, function (i, item) {
                    if (Object.values(this.baseProducts).indexOf(parseInt(item['ID Equipo base'])) == -1) {
                        this.baseProducts[this.counterTwo] = parseInt(item['ID Equipo base'])
                        dataEmpty[cont] = item
                        this.counterTwo++
                        cont++
                    }
                }.bind(this))
    
                dataEmpty.length = cont
    
                return {data: dataEmpty, lenghtTotal: dataProducts.length}
            }

            getApiUrlBase () {
                let urlApiInit

                if (this.validatePortal(this.portal) && this.validateModality(this.modality)) {
                    switch (this.portal) {
                        case 'personas':
                            urlApiInit = '/api/catalog_system/pub/products/search/?fq=C:/1/2/&fq=specificationFilter_184:Kit'
                            break
                        case 'emprendedores':
                            urlApiInit = '/api/catalog_system/pub/products/search/?fq=C:/9/11/&fq=specificationFilter_290:Kit'
                            break
                        case 'empresas':
                            urlApiInit = '/api/catalog_system/pub/products/search/?fq=C:/9/11/&fq=specificationFilter_290:Kit'
                            break
                        case 'accesorios':
                            urlApiInit = '/api/catalog_system/pub/products/search/?fq=C:/48/'
                            break
                    }

                    // Validate to "chips"
                    if (this.modality === 'chip-entel') {
                        urlApiInit = '/api/catalog_system/pub/products/search/?fq=productClusterIds:343'
                    }

                } else {
                    switch(this.portal) {
                        case 'personas':
                            urlApiInit = '/api/catalog_system/pub/products/search/?fq=productClusterIds:315'
                            break
                        case 'emprendedores':
                            urlApiInit = '/api/catalog_system/pub/products/search/?fq=productClusterIds:317'
                            break
                        case 'empresas':
                            urlApiInit = '/api/catalog_system/pub/products/search/?fq=productClusterIds:317'
                            break
                        case 'accesorios':
                            urlApiInit = '/api/catalog_system/pub/products/search/?fq=productClusterIds:318'
                            break
                    }
                }
    
                return urlApiInit
            }

            getUrlModality () {
                let modalityScript = '',
                    fieldModality = (this.portal === 'empresas' || this.portal === 'emprendedores') ? '592' : '590'
    
                switch(this.modality) {
                    case 'migra-postpago':
                        modalityScript = '&fq=specificationFilter_' + fieldModality + ':Postpago Migra'
                        break
                    case 'linea-nueva-postpago':
                        modalityScript = '&fq=specificationFilter_' + fieldModality + ':Postpago Línea Nueva'
                        break
                    case 'renovacion-postpago':
                        modalityScript = '&fq=specificationFilter_' + fieldModality + ':Postpago Renovación'
                        break
                    case 'equipos-libres':
                        modalityScript = '&fq=specificationFilter_' + fieldModality + ':Libres&fq=specificationFilter_134:Libre'
                        break
                    case 'chip-entel':
                        modalityScript = ''
                        break                        
                }

                return modalityScript
            }

            getUrlFilters () {
                let filterScript = ''

                this.filters.forEach (function (element) {
                    filterScript += element
                })

                return filterScript
            }

            getUrlSort () {
                return $('select[name="order-products"]').val()
            }

            validateModality (modality) {
                let modalities = {
                        0: 'migra-postpago',
                        1: 'linea-nueva-postpago',
                        2: 'equipos-libres',
                        3: 'renovacion-postpago',                        
                        4: 'chip-entel'
                    }
    
                if (Object.values(modalities).indexOf(modality) > -1) {
                    return true
                }
    
                return false
            }

            validatePortal (portal) {
                let portals = {
                        0: 'personas',
                        1: 'emprendedores',
                        2: 'empresas'
                    }

                if (Object.values(portals).indexOf(portal) > -1) {
                    return true
                }

                return false
            }

            printProductCards (dataProducts, page) {
                let htmlProduct,
                    product,
                    getModalityTex,
                    modality = this.modality,
                    portal = this.portal,
                    modalities = [{
                        'migra-postpago' : 'Postpago Migra',
                        'linea-nueva-postpago' : 'Postpago Línea Nueva',
                        'equipos-libres' : 'Libres',
                        'renovacion-postpago' : 'Postpago Renovación'
                    }]

                // function to get text modality
                getModalityTex = function (modalityParameter) {
                    let modalityExtend = '',
                        modalityTex = 'Postpago',
                        modalityConditional = (modalityParameter) ? modalityParameter : modalities[0][modality]

                    switch (modalityConditional) {
                        case 'Postpago Migra':
                            modalityExtend = 'Portabilidad'
                            break
                        case 'Postpago Renovación':
                            modalityExtend = 'Renovación'
                            break
                        case 'Postpago Línea Nueva':
                            modalityExtend = 'Línea Nueva'
                            break
                        case 'Libres':
                            modalityTex = 'Equipo'
                            modalityExtend = 'Libre'
                            break
                    }

                    return [modalityTex, modalityExtend]
                }

                // iterating data products
                $.each(dataProducts, function (i, item) {
                    let image,
                        priceText,
                        nameProduct,
                        indexModality,
                        feeParameter,
                        ofertParameter,
                        modalityParameter,
                        flag = 1,
                        namePlan = (portal === 'empresas' || portal === 'emprendedores') ? 'Negocio Chip' : 'Entel Chip',
                        flagModality = (modality) ? modalities[0][modality] : 'Postpago Migra'

						// validating index of modality
						$.each(item.items, function (i, item) {
                            if (flag) {
                                indexModality = i
                            }

							if (modality === '') {
								if (item.hasOwnProperty('Recomendados') && item.Recomendados[0] === 'Si') {
									flag = 0
									indexModality = i

									return
								} else {
									if (item.hasOwnProperty('Cuota') && parseInt(item.Cuota[0]) === 18 && flag) {
                                        flag = 0
										indexModality = i

										return
									}
								}
							}

							if (item.Modalidad[0] === flagModality || modality === 'chip-entel') {
								if (flagModality === 'Libres') {
									indexModality = i
								} else {
									if (item.hasOwnProperty('Recomendados') && item.Recomendados[0] === 'Si') {
										flag = 0
										indexModality = i

										return
									} else {
										if (item.hasOwnProperty('Cuota') && parseInt(item.Cuota[0]) === 18 && flag) {
                                            flag = 0
											indexModality = i

											return
                                        }
									}
								}
							}

							return
						})

                    // Setting parameters
                    feeParameter = parseInt(item.items[indexModality].Cuota[0])
                    ofertParameter = (item.items[indexModality].hasOwnProperty('Tag_promocion')) ? item.items[indexModality].Tag_promocion[0] : 'regular'
                    ofertParameter = (ofertParameter === 'Postpago Migra Especial') ? 'especial' : ofertParameter.toLowerCase()
                    modalityParameter = item.items[indexModality].Modalidad[0].toLowerCase()

                    // Set name product and price text
                    nameProduct = item.items[indexModality].name.split('-')[0].replace(' Migra', '').replace('Linea Nueva', ''),
                    priceText = 'Cuota inicial'

                    // Set image URL
                    image = item.items[indexModality].images[0]

                    // Validating to "solo chip"
                    if (item.items[indexModality].nameComplete.indexOf('Solo Chip') > -1) {
                        priceText = 'Precio'
                        nameProduct = 'Súper Chip Entel Plus'
                    }

                    if (!feeParameter) {
                        priceText = 'Pago único'
                    }

                    // set product
                    product = {
                        sku: item.items[indexModality].itemId,
                        name: nameProduct,
                        urlFicha : (item.link + '?modalidad=' + modalityParameter.normalizeText() + '&plan=' + item['Plan']).normalizeText() + '&oferta=' + ofertParameter + '&cuota=' + feeParameter,
                        brand: item.brand,
                        image: image.imageUrl.replace(image.imageId, image.imageId + '-130-130'),
                        modality: (item.items[indexModality].hasOwnProperty('Modalidad')) ? getModalityTex(item.items[indexModality].Modalidad[0]) : getModalityTex(''),
                        modalityBuy: item['Medio de Compra'],
                        prices: {
                            cost: item.items[indexModality].sellers[0].commertialOffer.Price,
                            list: item.items[indexModality].sellers[0].commertialOffer.ListPrice,
                            vep: (item.items[indexModality].hasOwnProperty('Mensualidad VeP')) ? item.items[indexModality]['Mensualidad VeP'][0] : 0,
                            discount: parseInt(100 - parseFloat((100 * item.items[indexModality].sellers[0].commertialOffer.Price) / item.items[indexModality].sellers[0].commertialOffer.ListPrice)),
                        },
                        plan: {
                            name: item['Plan'],
                            price: item['Cargo fijo mensual'],
                        },
                        tags: {
                            twoPerOne: item.items[indexModality]['Tag_promo_doble'],
                            promo: item.items[indexModality]['Tag_promocion']
                        }
                    }

                    // Setting HTML product
                    htmlProduct = ''
                    htmlProduct += '<a class="entel-thumbnail-phone-card draw-line-gray" data-sku=' + product.sku + ' data-gtm-name="Cards equipos" data-gtm-category="Catálogo Entel Perú" data-gtm-label="' + product.brand + " " + product.name + '" data-gtm-action="click card equipo" href="' + product.urlFicha + '" title="' + product.name + '">'

                    htmlProduct += '</div>'
                    htmlProduct += '<h2 class="entel-thumbnail-phone-card__model" title="' + product.name + '"><span class="entel-thumbnail-phone-card__marca">' + product.brand + '</span>' + product.name + '</h2>'
                    htmlProduct += '<div class="entel-thumbnail-phone-card__description">'
                    htmlProduct += '<div class="entel-thumbnail-phone-card__phone-image">'

                    htmlProduct += '<img src="' + product.image + '" data-lazy-type="image" data-src="' + product.image + '" title="' + product.name + '" alt="' + product.name + '" width="130" height="130">'
                    htmlProduct += '</div>'
                    htmlProduct += '<div class="entel-thumbnail-phone-card__detail">'
                    htmlProduct += '<div class="entel-thumbnail-phone-card__detail__name"><strong>' + product.modality[0] + '</strong> ' + product.modality[1] + '</div>'

                    if (product.modality[0] == 'Postpago') {
                        // Setting name to "entel power"
                        namePlan = (product.plan.price >= 85 && product.plan.price <= 129 && portal === 'personas') ? 'Entel Power' : namePlan

                        htmlProduct += '<div class="entel-thumbnail-phone-card__detail__plan- entel-thumbnail-phone-card__detail__plan-price__postpago">' + namePlan + ' ' + product.plan.price + '</div>'
                        htmlProduct += '<div class="entel-thumbnail-phone-card__detail__phone-initialfee"><span>S/ <em>' + product.prices.cost + ' </em><br> <small>' + priceText + '</small></span></div>'

                        // validatting to "solo chip"
                        if (product.name.indexOf('Súper Chip') === -1 && feeParameter) {
                            htmlProduct += '<div class="entel-thumbnail-phone-card__detail__phone-plussign"><span><strong class="orange">+</strong></span></div>'
                            htmlProduct += '<div class="entel-thumbnail-phone-card__detail__phone-price"><span>S/ ' + product.prices.vep + ' <br> <small>Cuota mensual (x18)</small></span></div></div>'
                        }
                    } else {
                        htmlProduct += '<div class="entel-thumbnail-phone-card__detail__plan-price">Pago único</div>'
                        htmlProduct += '<div class="entel-thumbnail-phone-card__detail__phone-initialfee"><span>S/ ' + parseFloat(product.prices.cost) + '</span></div>'

                        if (product.prices.list && product.prices.list != product.prices.cost) {
                            htmlProduct += '<div class="entel-thumbnail-phone-card__detail__phone-initialfee--small"> <small class="orange">ANTES:  <s>S/ ' + parseFloat(product.prices.list) + '</s></small></div>'
                        }
                    }

                    htmlProduct += '</div>'
                    htmlProduct += '<span class="entel-thumbnail-phone-card__entel-button">COMPRAR AHORA</span>'
                    htmlProduct += '</div>'
                    htmlProduct += '</a>'

                    $('.products__content').append(htmlProduct)
                })
            }

            loadDataPerPage (urlApi) {
                let flag = true,
                    page = 1,
                    pagination = [[0, 49], [50, 99], [100, 149], [150, 199], [200, 249], [250, 299], [300, 349], [350, 399], [400, 449], [450, 499], [500, 549], [550, 599], [600, 649], [650, 699], [700, 749], [750, 799], [800, 849], [850, 899], [900, 949], [950, 999]]
    
                // load data of the page 1
                let dataPageOne = this.getEmptyData(vtexApiConnect(urlApi + '&_from=' + pagination[0][0] + '&_to=' + pagination[0][1])),
                    totalPageOne = dataPageOne.lenghtTotal

                // validating num of data to print product cards
                switch (true) {
                    case totalPageOne === 0:
                        $('.products__content').html('<p>Oh, todavía no tenemos lo que estás buscando. ¡Pronto novedades!</p>')
                        return false
                        break
                
                    case totalPageOne < 50:
                        this.printProductCards(dataPageOne.data, page)
                        return false
                        break

                    case totalPageOne === 50:
                        this.printProductCards(dataPageOne.data, page)
                        this.counter = 1

                        // scroll event to show data per page
                        scrollPagination = function () {
                            let limitHeight = $('.products__content').offset().top + $('.products__content').outerHeight() - $(window).innerHeight() - $('html, body').scrollTop()

                            if (limitHeight <= 0 && flag === true) {

                                let dataPerPage = this.getEmptyData(vtexApiConnect(urlApi + '&_from=' + pagination[this.counter][0] + '&_to=' + pagination[this.counter][1])),
                                    totalPerPage = dataPerPage.lenghtTotal

                                page = this.counter + 1

                                switch (true) {
                                    case totalPerPage === 0:
                                        return flag = false
                                        break
                                    
                                    case totalPerPage < 50:
                                        this.printProductCards(dataPerPage.data, page)
                                        return  flag = false
                                        break

                                    case totalPerPage === 50:
                                        this.printProductCards(dataPerPage.data, page)
                                        this.counter++
                                        return  flag = true
                                        break
                                }
                            }
                        }.bind(this)

                        window.addEventListener('scroll', scrollPagination)
                        break
                }
            }

            loadDataFiltered (urlApi) {
                this.resetGeneralVars()

                $('.products__content').addClass('loading')

                // load products
                setTimeout (function () {
                    $('.products__content').html('')
                    this.loadDataPerPage(urlApi)
                    $('.products__content').removeClass('loading')
                }.bind(this), 300)
            }

            resetGeneralVars () {
                this.counter = 0
                this.counterTwo = 0
                this.baseProducts = {}
                window.removeEventListener('scroll', scrollPagination);
            }
        }

        // Filter nav section
        class filterNav {
            load () {
                this.sideFilter ()
                this.selectOrder ()
            }

            sideFilter () {
                let load = {
                    open : function () {
                        $('.principal-filters').addClass('active')
                        $('.entel-overlay').addClass('active')

                        // Hidding float button
                        $('.btn-open-modal').addClass('ocult')
                        $('.btn-open-modal').removeClass('no-ocult')
                    },

                    close : function () {
                        $('.principal-filters').removeClass('active')
                        $('.entel-overlay').removeClass('active')

                        // Showing float button
                        $('.btn-open-modal').removeClass('ocult')
                        $('.btn-open-modal').addClass('no-ocult')
                    },

                    openClick : function () {
                        $('.filter-nav-section').on('click', '> a', function () {
                            this.open()
                        }.bind(this))
                    },

                    closeClick : function () {
                        $('.close-filter-nav').on('click', function () {
                            this.close()
                        }.bind(this))
                    }
                }

                // load functions 
                load.openClick()
                load.closeClick()
            }

            selectOrder () {
                $('#order-products').on('click', '.entel-select__dropdown li', function () {
                    // Load products
                    resetProducts()
                    products = new Products(getPortal(), getModality(), filters, brands, parameterInit)
                    products.load()
                })
            }
        }

        // principal filters
        class principalFilters {
            load () {
                this.toCompanies()
                this.brands()
                this.setBrandValues()
                this.parameterURL()
                this.clickPortal()
            }

            setBrandValues () {
                let _this = this
                // set brand values in bread crumbles                                
                $('.entel-breadcrumb ul li.active').text(_this.getCurrentBrand().name)
                // set brand values in h1 tag
                $('.products__title h1').text('CELULARES ' + _this.getCurrentBrand().name)
                // set text description from meta description
                let descriptionBrand = $('meta[name=description]').attr('content')
                $('.comentbox').text(descriptionBrand)
            }

            getCurrentBrand () {
                let id = '',
                    name = '',
                    currentBrand = window.location.pathname.replace('/',''),
                    dataBrands = [{"id":2000002,"name":"Huawei","isActive":true,"title":"Celulares Huawei - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Huawei.","imageUrl":null},{"id":2000007,"name":"Samsung","isActive":true,"title":"Celulares Samsung - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Samsung.","imageUrl":null},{"id":2000001,"name":"Apple","isActive":true,"title":"Celulares Apple - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Apple.","imageUrl":null},{"id":2000005,"name":"Motorola","isActive":true,"title":"Celulares Motorola - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Motorola.","imageUrl":null},{"id":2000003,"name":"LG","isActive":true,"title":"Celulares LG - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones LG.","imageUrl":null},{"id":2000008,"name":"Sony","isActive":true,"title":"Celulares Sony - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Sony.","imageUrl":null},{"id":2000006,"name":"Nokia","isActive":true,"title":"Celulares Nokia - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Nokia.","imageUrl":null},{"id":2000013,"name":"Xiaomi","isActive":true,"title":"Celulares Xiaomi - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Xiaomi.","imageUrl":null},{"id":2000009,"name":"ZTE","isActive":true,"title":"Celulares ZTE - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones ZTE.","imageUrl":null},{"id":2000000,"name":"Alcatel","isActive":true,"title":"Celulares Alcatel - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Alcatel.","imageUrl":null},{"id":2000010,"name":"Own","isActive":true,"title":"Celulares Own - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Own.","imageUrl":null},{"id":2000004,"name":"Lenovo","isActive":true,"title":"Celulares Lenovo - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Lenovo.","imageUrl":null},{"id":2000011,"name":"Entel","isActive":true,"title":"","metaTagDescription":"Entel","imageUrl":null},{"id":2000012,"name":"Logitech","isActive":true,"title":"Logitech","metaTagDescription":"","imageUrl":null}]

                $.each(dataBrands, function (i, item) {
                    if( formatString(item.name) == formatString(currentBrand) ){
                        id = item.id
                        name = item.name
                    }
                })

                return {name: name, id: id}
            }

            toCompanies () {
                if (POLITIC === 'empresas') {
                    $('.principal-filters > h3[title="Celulares Entel"]').remove()
                    $('.principal-filters > .entel-radio').remove()
                    $('.principal-filters > hr').remove()
                }
            }

            parameterURL () {
                let portal = getParameterURL('para')

                // Active current portal
                if (portal) {
                    $('input[value="' + portal +'"]').prop('checked', true)
                }

                // Actives modalities by portal
                this.activesModalitiesByPortal(portal)
            }

            clickPortal () {
                let _this = this
                
                $('.principal-filters input[type="radio"]').change(function() {
                    let portal = $(this).val(),
                        modality = _this.validateModalityByPortal(portal, getModality())

                    // Actives modalities by portal
                    _this.activesModalitiesByPortal(portal)

                    // Load products
                    resetProducts()
                    products = new Products(portal, modality, filters, brands, parameterInit)
                    products.load()
                    
                    // Update Brand box
                    _this.clearBrandTags()
                    _this.brands()
                })
            }

            clearBrandTags () {
                $('.brandbox').empty()
            }

            brands () {
                let queryString = '',
                    _this = this

                if( getParameterURL('para') ){
                    queryString = '?para=' + getParameterURL('para')
                    if ( getParameterURL('modalidad') ){
                        queryString = queryString + '&modalidad=' + getParameterURL('modalidad')
                    }
                }

                let htmlFilter = '',
                    dataBrands = [{"id":2000002,"name":"Huawei","isActive":true,"title":"Celulares Huawei - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Huawei.","imageUrl":null},{"id":2000007,"name":"Samsung","isActive":true,"title":"Celulares Samsung - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Samsung.","imageUrl":null},{"id":2000001,"name":"Apple","isActive":true,"title":"Celulares Apple - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Apple.","imageUrl":null},{"id":2000005,"name":"Motorola","isActive":true,"title":"Celulares Motorola - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Motorola.","imageUrl":null},{"id":2000003,"name":"LG","isActive":true,"title":"Celulares LG - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones LG.","imageUrl":null},{"id":2000008,"name":"Sony","isActive":true,"title":"Celulares Sony - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Sony.","imageUrl":null},{"id":2000006,"name":"Nokia","isActive":true,"title":"Celulares Nokia - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Nokia.","imageUrl":null},{"id":2000013,"name":"Xiaomi","isActive":true,"title":"Celulares Xiaomi - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Xiaomi.","imageUrl":null},{"id":2000009,"name":"ZTE","isActive":true,"title":"Celulares ZTE - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones ZTE.","imageUrl":null},{"id":2000000,"name":"Alcatel","isActive":true,"title":"Celulares Alcatel - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Alcatel.","imageUrl":null},{"id":2000010,"name":"Own","isActive":true,"title":"Celulares Own - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Own.","imageUrl":null},{"id":2000004,"name":"Lenovo","isActive":true,"title":"Celulares Lenovo - Catálogo Entel Perú","metaTagDescription":"Encuentra todos los celulares y smartphones Lenovo.","imageUrl":null},{"id":2000011,"name":"Entel","isActive":true,"title":"","metaTagDescription":"Entel","imageUrl":null},{"id":2000012,"name":"Logitech","isActive":true,"title":"Logitech","metaTagDescription":"","imageUrl":null}]

                $.each(dataBrands, function (i, item) {
                    let emptyName = item.name.trim().replace(' ', '').toLowerCase()

                    if (item.name !== 'Entel' && item.name !== 'Logitech' && item.name !== 'Lenovo') {
                        if( formatString(item.name) == window.location.pathname.replace('/','') ){
                            htmlFilter += '<a href="/' + formatString(item.name) + queryString + '" title="' + item.name + '" class="active">' + item.name + '</a>'
                        }else{
                            htmlFilter += '<a href="/' + formatString(item.name) + queryString + '" title="' + item.name + '"> ' + item.name + ' </a>'
                        }
                    }
                })

                $('.brandbox').html(htmlFilter)
            }

            activesModalitiesByPortal (portal) {
                // Show / hide modalities by portal
                if (portal === 'emprendedores' || portal === 'empresas' || POLITIC === 'empresas') {
                    $('.modalities-filter > a').addClass('no-ocult')
                    $('a[data-modality="renovacion-postpago"], a[data-modality="equipos-libres"], a[data-modality="chip-entel"]').addClass('ocult')
                } else {
                    $('.modalities-filter > a').removeClass('no-ocult')
                    $('a[data-modality="renovacion-postpago"], a[data-modality="equipos-libres"], a[data-modality="chip-entel"]').removeClass('ocult')
                }
            }

            validateModalityByPortal (portal, modality) {
                // Validating modality by portal and modality
                if (portal === 'emprendedores' && (modality === 'renovacion-postpago' || modality === 'equipos-libres' || modality === 'chip-entel')) {
                    modality = 'migra-postpago'

                    $('.modalities-filter > a').removeClass('active')
                    $('.modalities-filter > a[data-modality="' + modality + '"]').addClass('active')
                }

                return modality
            }
        }

        // modalities filter
        class modalitiesFilters {
            load () {
                this.clickItem()
                this.parameterURL()
            }

            parameterURL () {
                let modality = getParameterURL('modalidad')

                if (modality) {
                    this.activeItem('.modalities-filter > a[data-modality="' + modality + '"]')
                }
            }

            clickItem () {
                let _this = this

                $('.modalities-filter').on('click', '> a', function () {
                    var modality = $(this).attr('data-modality')

                    // Load products
                    resetProducts()
                    products = new Products(getPortal(), modality, filters, brands, parameterInit)
                    products.load()

                    // Active current item
                    _this.activeItem(this)

                    // Go to top
                    _this.scrollTop()
                    
                    principalFilters = new principalFilters()
                    principalFilters.clearBrandTags()
                    principalFilters.brands()
                })
            }

            activeItem (item) {
                $('.modalities-filter > a').removeClass('active')
                $(item).addClass('active').addClass('entel-catalogue__modalidad__btn--active')
            }

            scrollTop () {
                if ($(window).width() <= 768) {
                    $('html, body').animate({scrollTop: 0 }, 600);
                }
            }
        }

        init = function () {
            // load filter nav
            new filterNav().load()

            // load principal filters
            new principalFilters().load()

            // load modalities filters
            new modalitiesFilters().load()

            setTimeout (function () {
                let portal = (POLITIC === 'empresas') ? 'empresas' : getPortal(),
                    currentBrand = new principalFilters().getCurrentBrand()

                brands.push(currentBrand.name)
                filters.push('&fq=B:' + currentBrand.id)

                // Load Products
                resetProducts()
                products = new Products(portal, getModality(), filters, brands, parameterInit)
                products.load()
            }, 300)
        }

        return {
            init: init
        }
    }())

    brand.init()
})
