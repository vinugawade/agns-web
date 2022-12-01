var IS2C = {},
    $ = jQuery.noConflict();
(function($) {
    "use strict";
    // Predefined Global Variables
    var $window = $(window),
        $theme_color = "#2250fc",
        $body = $("body"),
        $header = $("#header"),
        $headerCurrentClasses = $header.attr("class"),
        //Slider
        $slider = $("#slider"),
        $inspiroSlider = $(".inspiro-slider"),
        $carousel = $(".carousel"),
        windowWidth = $window.width();

    //Check if header exist
    if ($header.length > 0) {
        var $headerOffsetTop = $header.offset().top;
    }
    var Events = {
        browser: {
            isMobile: function() {
                if (
                    navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
                ) {
                    return true;
                } else {
                    return false;
                }
            },
        },
    };
    //Settings
    var Settings = {
        isMobile: Events.browser.isMobile,
        submenuLight: $header.hasClass("submenu-light") == true ? true : false,
        headerHasDarkClass: $header.hasClass("dark") == true ? true : false,
        headerDarkClassRemoved: false,
        sliderDarkClass: false,
        menuIsOpen: false,
        menuOverlayOpened: false,
    };

    //Window breakpoints
    $(window).breakpoints({
        triggerOnInit: true,
        breakpoints: [{
                name: "xs",
                width: 0,
            },
            {
                name: "sm",
                width: 576,
            },
            {
                name: "md",
                width: 768,
            },
            {
                name: "lg",
                width: 1025,
            },
            {
                name: "xl",
                width: 1200,
            },
        ],
    });

    var currentBreakpoint = $(window).breakpoints("getBreakpoint");
    $body.addClass("breakpoint-" + currentBreakpoint);
    $(window).bind("breakpoint-change", function(breakpoint) {
        $body.removeClass("breakpoint-" + breakpoint.from);
        $body.addClass("breakpoint-" + breakpoint.to);
    });

    $(window).bind("breakpoint-change", function(event) {
        $(window).breakpoints("greaterEqualTo", "lg", function() {
            $body.addClass("b--desktop");
            $body.removeClass("b--responsive");
        });
        $(window).breakpoints("lessThan", "lg", function() {
            $body.removeClass("b--desktop");
            $body.addClass("b--responsive");
        });
    });

    IS2C.core = {

        functions: function() {
            IS2C.core.headerFixed();
            IS2C.core.scrollTop();
            IS2C.core.Animations();
            IS2C.core.Counters();
            IS2C.core.gridClients();
        },

        headerFixed: function() {
            if (!$('body').hasClass('header-overlay')) {
                $('body').css('padding-top', $('#header').outerHeight() + 'px');
            }
            $(window).resize(function() {
                if (!$('body').hasClass('header-overlay')) {
                    $('body').css('padding-top', $('#header').outerHeight() + 'px');
                }
            });
            $(window).on('scroll', function(event) {
                event.preventDefault();
                if ($(window).scrollTop() >= 150) {
                    $('#header').addClass('fixed-header');
                } else {
                    $('#header').removeClass('fixed-header');
                }
            });
        },

        scrollTop: function() {
            var $scrollTop = $("#scrollTop");
            if ($scrollTop.length > 0) {
                var scrollOffset = $body.attr("data-offset") || 400;

                $(window).on('scroll', function(event) {
                    event.preventDefault();
                    var rollTop = ($(window).scrollTop() || $("body").scrollTop());
                    if (rollTop > 400) {
                        $scrollTop.css({
                            bottom: "26px",
                            opacity: 1,
                            "z-index": 199,
                        });
                    } else {
                        $scrollTop.css({
                            bottom: "16px",
                            opacity: 0,
                        });
                    }
                });

                $scrollTop.off("click").on("click", function() {
                    $("body,html").stop(true).animate({
                            scrollTop: 0,
                        },
                        1000,
                        "easeInOutExpo"
                    );
                    return false;
                });
            }
        },

        Animations: function() {
            var $animate = $("[data-animate]");
            if ($animate.length > 0) {
                if ($('.section_group').length > 0) {
                    $('.section_group').each(function(index, el) {
                        $(this).find('[data-animate]').each(function(eindex, el) {
                            var elem = $(this);
                            var attr_delay = elem.attr("data-animate-delay");
                            if (typeof attr_delay === 'undefined' || attr_delay === false) {
                                attr_delay = eindex * 100 + 200;
                                elem.attr("data-animate-delay", attr_delay);
                            }
                        });
                    });
                }

                $animate.each(function(eindex) {
                    var elem = $(this);
                    elem.addClass("animate__animated");
                    var attr_delay = elem.attr("data-animate-delay");

                    if (typeof attr_delay === 'undefined' || attr_delay === false) {
                        attr_delay = eindex * 10;
                        elem.attr("data-animate-delay", attr_delay);
                    }

                    elem.options = {
                        animate_prefix: "animate__",
                        animation: elem.attr("data-animate") || "fadeIn",
                        delay: elem.attr("data-animate-delay") || attr_delay,
                        direction: ~elem.attr("data-animate").indexOf("Out") ? "back" : "forward",
                        offsetX: elem.attr("data-animate-offsetX") || 0,
                        offsetY: elem.attr("data-animate-offsetY") || -100,
                    };
                    //Initializing jQuery Waypoint plugin and passing the options from data animations attributes
                    if (elem.options.direction == "forward") {
                        new Waypoint({
                            element: elem,
                            handler: function() {
                                var t = setTimeout(function() {
                                    elem.addClass(elem.options.animate_prefix + elem.options.animation + " visible");
                                }, elem.options.delay);
                                this.destroy();
                            },
                            offset: "100%",
                        });
                    } else {
                        elem.addClass("visible");
                        elem.on("click", function() {
                            elem.addClass(elem.options.animate_prefix + elem.options.animation);
                            return false;
                        });
                    }
                });
            }
        },

        Counters: function() {
            var $counter = $(".counter-number");
            if ($counter.length > 0) {
                $counter.each(function() {
                    var elem = $(this),
                        prefix = elem.find("span").attr("data-prefix") || "",
                        suffix = elem.find("span").attr("data-suffix") || "";
                    setTimeout(function() {
                        new Waypoint({
                            element: elem,
                            handler: function() {
                                elem.find("span").countTo({
                                    refreshInterval: 2,
                                    formatter: function(value, options) {
                                        return (
                                            String(prefix) +
                                            value.toFixed(options.decimals) +
                                            String(suffix)
                                        );
                                    },
                                });
                                this.destroy();
                            },
                            offset: "104%",
                        });
                    }, 100);
                });
            }
        },

        gridClients: function() {
            if ($('.view-clients .client-isp-filter').length > 0) {
                $('.view-clients .client-isp-filter .portfolio-item').addClass('col-12 col-sm-6 col-lg-4 col-xl-3');
                var $grid = $('.view-clients .client-isp-filter').isotope({
                    itemSelector: '.portfolio-item',
                    percentPosition: true,
                    masonry: {
                        columnWidth: '.filter-size'
                    }
                });
                $grid.imagesLoaded().progress(function() {
                    $grid.isotope('layout');
                });

                $('.client-filter-list').prepend('<li><a class="button active" data-filter="*">Show All</a></li>');
                $('.client-filter-list').on('click', '.button', function() {
                    var filterValue = $(this).attr('data-filter');
                    $(this).parents('.client-filter-list').find('.active').removeClass('active');
                    $(this).addClass('active');
                    $grid.isotope({ filter: filterValue });
                });

                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                if (urlParams.get("cs")) {
                    var filterValue = ".cs-" + urlParams.get("cs");
                    $(`*[data-filter='${filterValue}']`).trigger('click');
                }
                $('.node-cs .portfolio-images a').attr('data-fancybox', 'gallery');
                $('.node-cs .portfolio-images a').append('<span class="zoom-btn" ><span>ZOOM</span></span>');
            }
        },

    };

    IS2C.slider = {
        functions: function() {
            IS2C.slider.inspiroSlider();
            IS2C.slider.carousel();
        },
        inspiroSlider: function() {
            if ($inspiroSlider.length > 0) {
                //Check if flickity plugin is loaded
                if (typeof $.fn.flickity === "undefined") {
                    IS2C.elements.notification(
                        "Warning",
                        "jQuery flickity slider plugin is missing in plugins.js file.",
                        "danger"
                    );
                    return true;
                }
                var defaultAnimation = "animate__fadeInUp";

                function animate_captions($elem) {
                    var $captions = $elem;
                    $captions.each(function() {
                        var $captionElem = $(this),
                            animationDuration = "600ms";
                        if ($(this).attr("data-animate-duration")) {
                            animationDuration = $(this).attr("data-animate-duration") + "ms";
                        }
                        $captionElem.css({
                            opacity: 0,
                        });
                        $(this).css("animation-duration", animationDuration);
                    });
                    $captions.each(function(index) {
                        var $captionElem = $(this),
                            captionDelay =
                            $captionElem.attr("data-caption-delay") || index * 350 + 1000,
                            captionAnimation =
                            $captionElem.attr("data-caption-animate") || defaultAnimation;
                        var t = setTimeout(function() {
                            $captionElem.css({
                                opacity: 1,
                            });
                            $captionElem.addClass(captionAnimation);
                        }, captionDelay);
                    });
                }

                function hide_captions($elem) {
                    var $captions = $elem;
                    $captions.each(function(caption) {
                        var caption = $(this),
                            captionAnimation =
                            caption.attr("data-caption-animate") || defaultAnimation;
                        caption.removeClass(captionAnimation);
                        caption.removeAttr("style");
                    });
                }

                function start_kenburn(elem) {
                    var currentSlide = elem.find(".slide.is-selected"),
                        currentSlideKenburns = currentSlide.hasClass("kenburns");
                    if (currentSlideKenburns) {
                        setTimeout(function() {
                            currentSlide.find(".kenburns-bg").addClass("kenburns-bg-animate");
                        }, 500);
                    }
                }

                function stop_kenburn(elem) {
                    var notCurrentSlide = elem.find(".slide:not(.is-selected)");
                    notCurrentSlide
                        .find(".kenburns-bg")
                        .removeClass("kenburns-bg-animate");
                }


                function sliderHeight(elem, state) {
                    var elem,
                        headerHeight = $header.outerHeight(),
                        windowHeight = $window.height(),
                        sliderCurrentHeight = elem.height(),
                        screenHeightExtra = headerHeight,
                        $sliderClassSlide = elem.find(".slide"),
                        sliderFullscreen = elem.hasClass("slider-fullscreen"),
                        screenRatio = elem.hasClass("slider-halfscreen") ? 1 : 1.2,
                        transparentHeader = $header.attr("data-transparent"),
                        customHeight = elem.attr("data-height"),
                        responsiveHeightXs = elem.attr("data-height-xs"),
                        containerFullscreen = elem.find(".container").first().outerHeight(),
                        contentCrop;

                    if (containerFullscreen >= windowHeight) {
                        contentCrop = true;
                        var sliderMinHeight = containerFullscreen;
                        elem.css("min-height", sliderMinHeight + 100);
                        $sliderClassSlide.css("min-height", sliderMinHeight + 100);
                        elem
                            .find(".flickity-viewport")
                            .css("min-height", sliderMinHeight + 100);
                    }

                    sliderElementsHeight("null");

                    function sliderElementsHeight(height) {
                        if (height == "null") {
                            elem.css("height", "");
                            $sliderClassSlide.css("height", "");
                            elem.find(".flickity-viewport").css("height", "");
                        } else {
                            elem.css("height", height);
                            $sliderClassSlide.css("height", height);
                            elem.find(".flickity-viewport").css("height", height);
                        }
                    }
                    if (customHeight) {
                        $(window).breakpoints("greaterEqualTo", "lg", function() {
                            sliderElementsHeight(customHeight + "px");
                        });
                    }
                    if (responsiveHeightXs) {
                        $(window).breakpoints("lessThan", "md", function() {
                            sliderElementsHeight(responsiveHeightXs + "px");
                        });
                    }
                }
                $inspiroSlider.each(function() {
                    var elem = $(this);
                    //Plugin Options
                    elem.options = {
                        cellSelector: elem.attr("data-item") || ".slide",
                        prevNextButtons: elem.data("arrows") == false ? false : true,
                        pageDots: elem.data("dots") == false ? false : true,
                        fade: elem.data("fade") == true ? true : false,
                        draggable: elem.data("drag") == true ? true : false,
                        freeScroll: elem.data("free-scroll") == true ? true : false,
                        wrapAround: elem.data("loop") == false ? false : true,
                        groupCells: elem.data("group-cells") == true ? true : false,
                        autoPlay: elem.attr("data-autoplay") || 7000,
                        pauseAutoPlayOnHover: elem.data("hoverpause") == true ? true : false,
                        adaptiveHeight: elem.data("adaptive-height") == false ? false : false,
                        asNavFor: elem.attr("data-navigation") || false,
                        selectedAttraction: elem.attr("data-attraction") || 0.07,
                        friction: elem.attr("data-friction") || 0.9,
                        initialIndex: elem.attr("data-initial-index") || 0,
                        accessibility: elem.data("accessibility") == true ? true : false,
                        setGallerySize: elem.data("gallery-size") == false ? false : false,
                        resize: elem.data("resize") == false ? false : false,
                        cellAlign: elem.attr("data-align") || "left",
                        playWholeVideo: elem.attr("data-play-whole-video") == false ? false : true,
                    };



                    //Kenburns effect
                    elem.find(".slide").each(function() {
                        if ($(this).hasClass("kenburns")) {
                            var elemChild = $(this),
                                elemChildImage = elemChild
                                .css("background-image")
                                .replace(/.*\s?url\([\'\"]?/, "")
                                .replace(/[\'\"]?\).*/, "");

                            if (elemChild.attr("data-bg-image")) {
                                elemChildImage = elemChild.attr("data-bg-image");
                            }
                            elemChild.prepend(
                                '<div class="kenburns-bg" style="background-image:url(' +
                                elemChildImage +
                                ')"></div>'
                            );
                        }
                    });
                    elem.find(".slide video").each(function() {
                        this.pause();
                    });
                    $(window).breakpoints("lessThan", "lg", function() {
                        elem.options.draggable = true;
                    });

                    if (elem.find(".slide").length <= 1) {
                        elem.options.prevNextButtons = false;
                        elem.options.pageDots = false;
                        elem.options.autoPlay = false;
                        elem.options.draggable = false;
                    }

                    if (!$.isNumeric(elem.options.autoPlay) &&
                        elem.options.autoPlay != false
                    ) {
                        elem.options.autoPlay = Number(7000);
                    }


                    sliderHeight(elem);

                    var inspiroSliderData = elem.flickity({
                        cellSelector: elem.options.cellSelector,
                        prevNextButtons: elem.options.prevNextButtons,
                        pageDots: elem.options.pageDots,
                        fade: elem.options.fade,
                        draggable: elem.options.draggable,
                        freeScroll: elem.options.freeScroll,
                        wrapAround: elem.options.wrapAround,
                        groupCells: elem.options.groupCells,
                        autoPlay: Number(elem.options.autoPlay),
                        pauseAutoPlayOnHover: elem.options.pauseAutoPlayOnHover,
                        adaptiveHeight: elem.options.adaptiveHeight,
                        asNavFor: elem.options.asNavFor,
                        selectedAttraction: Number(elem.options.selectedAttraction),
                        friction: elem.options.friction,
                        initialIndex: elem.options.initialIndex,
                        accessibility: elem.options.accessibility,
                        setGallerySize: elem.options.setGallerySize,
                        resize: elem.options.resize,
                        cellAlign: elem.options.cellAlign,
                        on: {
                            ready: function(index) {
                                var $captions = elem.find(
                                    ".slide.is-selected .slide-captions > *"
                                );
                                sliderHeight(elem);
                                start_kenburn(elem);
                                animate_captions($captions);
                                setTimeout(function() {
                                    elem
                                        .find(".slide:not(.is-selected) video")
                                        .each(function(i, video) {
                                            video.pause();
                                            video.currentTime = 0;
                                        });
                                }, 700);
                            },
                        },
                    });

                    var flkty = inspiroSliderData.data("flickity");

                    function wrapAroundStop() {
                        if (flkty.player.state != 'playing') {
                            disableAutoplay()
                            return;
                        }

                        var isAtLast = flkty.selectedIndex == flkty.slides.length - 1;
                        if (isAtLast) {
                            disableAutoplay();
                        }
                    }

                    function disableAutoplay() {
                        elem.flickity('stopPlayer');
                        elem.off('select.flickity', wrapAroundStop);
                    }

                    inspiroSliderData.on("change.flickity", function() {
                        var $captions = elem.find(".slide.is-selected .slide-captions > *");
                        hide_captions($captions);
                        setTimeout(function() {
                            stop_kenburn(elem);
                        }, 1000);
                        start_kenburn(elem);
                        animate_captions($captions);
                        elem.find(".slide video").each(function(i, video) {
                            video.currentTime = 0;
                        });
                    });

                    inspiroSliderData.on("select.flickity", function() {
                        //  IS2C.elements.backgroundImage();
                        var $captions = elem.find(".slide.is-selected .slide-captions > *");
                        sliderHeight(elem);
                        start_kenburn(elem);
                        animate_captions($captions);
                        var video = flkty.selectedElement.querySelector("video");
                        if (video) {
                            video.play();
                            flkty.options.autoPlay = Number(video.duration * 1000);
                        } else {
                            flkty.options.autoPlay = Number(elem.options.autoPlay);
                        }

                        if (elem.options.wrapAround == false) {
                            wrapAroundStop();
                        }

                    });
                    inspiroSliderData.on("dragStart.flickity", function() {
                        var $captions = elem.find(
                            ".slide:not(.is-selected) .slide-captions > *"
                        );
                        hide_captions($captions);
                    });
                    $(window).resize(function() {
                        sliderHeight(elem);
                        elem.flickity("reposition");
                    });
                });
            }
        },

        carousel: function(elem) {
            if (elem) {
                $carousel = elem;
            }

            if ($carousel.length > 0) {
                //Check if flickity plugin is loaded
                if (typeof $.fn.flickity === "undefined") {
                    IS2C.elements.notification(
                        "Warning",
                        "jQuery flickity plugin is missing in plugins.js file.",
                        "danger"
                    );
                    return true;
                }
                $carousel.each(function() {
                    var elem = $(this);
                    //Plugin Options
                    elem.options = {
                        containerWidth: elem.width(),
                        items: elem.attr("data-items") || 4,
                        itemsLg: elem.attr("data-items-lg"),
                        itemsMd: elem.attr("data-items-md"),
                        itemsSm: elem.attr("data-items-sm"),
                        itemsXs: elem.attr("data-items-xs"),
                        margin: elem.attr("data-margin") || 10,
                        cellSelector: elem.attr("data-item") || false,
                        prevNextButtons: elem.data("arrows") == false ? false : true,
                        pageDots: elem.data("dots") == false ? false : true,
                        fade: elem.data("fade") == true ? true : false,
                        draggable: elem.data("drag") == false ? false : true,
                        freeScroll: elem.data("free-scroll") == true ? true : false,
                        wrapAround: elem.data("loop") == false ? false : true,
                        groupCells: elem.data("group-cells") == true ? true : false,
                        autoPlay: elem.attr("data-autoplay") || 7000,
                        pauseAutoPlayOnHover: elem.data("hover-pause") == false ? false : true,
                        asNavFor: elem.attr("data-navigation") || false,
                        lazyLoad: elem.data("lazy-load") == true ? true : false,
                        initialIndex: elem.attr("data-initial-index") || 0,
                        accessibility: elem.data("accessibility") == true ? true : false,
                        adaptiveHeight: elem.data("adaptive-height") == true ? true : false,
                        autoWidth: elem.data("auto-width") == true ? true : false,
                        setGallerySize: elem.data("gallery-size") == false ? false : true,
                        resize: elem.data("resize") == false ? false : true,
                        cellAlign: elem.attr("data-align") || "left",
                        contain: elem.data("contain") == false ? false : true,
                    };

                    //Calculate min/max on responsive breakpoints
                    elem.options.itemsLg =
                        elem.options.itemsLg ||
                        Math.min(Number(elem.options.items), Number(4));
                    elem.options.itemsMd =
                        elem.options.itemsMd ||
                        Math.min(Number(elem.options.itemsLg), Number(3));
                    elem.options.itemsSm =
                        elem.options.itemsSm ||
                        Math.min(Number(elem.options.itemsMd), Number(2));
                    elem.options.itemsXs =
                        elem.options.itemsXs ||
                        Math.min(Number(elem.options.itemsSm), Number(1));
                    var setResponsiveColumns;

                    function getCarouselColumns() {
                        switch ($(window).breakpoints("getBreakpoint")) {
                            case "xs":
                                setResponsiveColumns = Number(elem.options.itemsXs);
                                break;
                            case "sm":
                                setResponsiveColumns = Number(elem.options.itemsSm);
                                break;
                            case "md":
                                setResponsiveColumns = Number(elem.options.itemsMd);
                                break;
                            case "lg":
                                setResponsiveColumns = Number(elem.options.itemsLg);
                                break;
                            case "xl":
                                setResponsiveColumns = Number(elem.options.items);
                                break;
                        }
                    }
                    getCarouselColumns();
                    var itemWidth;

                    elem.find("> *").wrap('<div class="polo-carousel-item">');
                    if (elem.hasClass("custom-height")) {
                        elem.options.setGallerySize = false;
                        IS2C.core.customHeight(elem);
                        IS2C.core.customHeight(elem.find(".polo-carousel-item"));
                        var carouselCustomHeightStatus = true;
                    }
                    if (Number(elem.options.items) !== 1) {
                        if (elem.options.autoWidth || carouselCustomHeightStatus) {
                            elem.find(".polo-carousel-item").css({
                                "padding-right": elem.options.margin + "px",
                            });
                        } else {
                            itemWidth =
                                (elem.options.containerWidth + Number(elem.options.margin)) /
                                setResponsiveColumns;
                            elem.find(".polo-carousel-item").css({
                                width: itemWidth,
                                "padding-right": elem.options.margin + "px",
                            });
                        }
                    } else {
                        elem.find(".polo-carousel-item").css({
                            width: "100%",
                            "padding-right": "0 !important;",
                        });
                    }
                    if (elem.options.autoWidth || carouselCustomHeightStatus) {
                        elem.options.cellAlign = "center";
                    }

                    if (elem.options.autoPlay == "false") {
                        elem.options.autoPlay = false;
                    }

                    if (!$.isNumeric(elem.options.autoPlay) &&
                        elem.options.autoPlay != false
                    ) {
                        elem.options.autoPlay = Number(7000);
                    }

                    //Initializing plugin and passing the options
                    var $carouselElem = $(elem);
                    $carouselElem.imagesLoaded(function() {
                        // init Isotope after all images have loaded
                        $carouselElem.flickity({
                            cellSelector: elem.options.cellSelector,
                            prevNextButtons: elem.options.prevNextButtons,
                            pageDots: elem.options.pageDots,
                            fade: elem.options.fade,
                            draggable: elem.options.draggable,
                            freeScroll: elem.options.freeScroll,
                            wrapAround: elem.options.wrapAround,
                            groupCells: elem.options.groupCells,
                            autoPlay: Number(elem.options.autoPlay),
                            pauseAutoPlayOnHover: elem.options.pauseAutoPlayOnHover,
                            adaptiveHeight: elem.options.adaptiveHeight,
                            asNavFor: elem.options.asNavFor,
                            initialIndex: elem.options.initialIndex,
                            accessibility: elem.options.accessibility,
                            setGallerySize: elem.options.setGallerySize,
                            resize: elem.options.resize,
                            cellAlign: elem.options.cellAlign,
                            rightToLeft: elem.options.rightToLeft,
                            contain: elem.options.contain,
                        });
                        elem.addClass("carousel-loaded");
                    });

                    if (Number(elem.options.items) !== 1) {
                        $(window).on("resize", function() {
                            setTimeout(function() {
                                getCarouselColumns();
                                itemWidth =
                                    (elem.width() + Number(elem.options.margin)) /
                                    setResponsiveColumns;
                                if (elem.options.autoWidth || carouselCustomHeightStatus) {
                                    elem.find(".polo-carousel-item").css({
                                        "padding-right": elem.options.margin + "px",
                                    });
                                } else {
                                    if (!elem.hasClass("custom-height")) {
                                        elem.find(".polo-carousel-item").css({
                                            width: itemWidth,
                                            "padding-right": elem.options.margin + "px",
                                        });
                                    } else {
                                        IS2C.core.customHeight(elem.find(".polo-carousel-item"));
                                        elem.find(".polo-carousel-item").css({
                                            width: itemWidth,
                                            "padding-right": elem.options.margin + "px",
                                        });
                                    }
                                }
                                elem.find(".flickity-slider").css({
                                    "margin-right": -elem.options.margin / setResponsiveColumns + "px",
                                });
                                elem.flickity('resize');
                                elem.flickity("reposition");
                            }, 300);
                        });
                    }
                });
            }
        },
    };

    //Load Functions on document ready
    $(document).ready(function() {
        IS2C.core.functions();
        IS2C.slider.functions();
    });

})(jQuery);



(function($) {
    /**
     * jQuery function to prevent default anchor event and take the href * and the title to make a share popup
     * @param  {[object]} e           [Mouse event]
     * @param  {[integer]} intWidth   [Popup width defalut 500]
     * @param  {[integer]} intHeight  [Popup height defalut 400]
     * @param  {[boolean]} blnResize  [Is popup resizeabel default true]
     */
    $.fn.jquey_share_post = function(e, intWidth, intHeight, blnResize) {
        e.preventDefault();
        intWidth = intWidth || '500';
        intHeight = intHeight || '400';
        strResize = (blnResize ? 'yes' : 'no');
        var strTitle = ((typeof this.attr('title') !== 'undefined') ? this.attr('title') : 'Social Share'),
            strParam = 'width=' + intWidth + ',height=' + intHeight + ',resizable=' + strResize,
            objWindow = window.open(this.attr('href'), strTitle, strParam).focus();
    }

    $(document).ready(function($) {
        $('.btn-share').on("click", function(e) {
            $(this).jquey_share_post(e);
        });
      $('.navbar-toggler').on('click', function(event) {
        if ($(this).attr('aria-expanded') == 'false') {
          $(this).parents('#header').addClass('navbar-open');
        } else {
          $(this).parents('#header').removeClass('navbar-open');
        }
      });
    });
}(jQuery));
