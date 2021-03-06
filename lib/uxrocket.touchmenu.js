/**
 * UX Rocket
 * Hover/Tap transformation for touch screens
 * @author Bilal Cinarli
 */

;
(function($) {
    var ux,

        defaults = {
            subs   : '.sub-navigation',

            // callbacks
            onReady: false,
            onTap  : false
        },
        events = {
            touchstart: 'touchstart.uxTouchMenu',
            touchend  : 'touchend.uxTouchMenu',
            touchmove : 'touchmove.uxTouchMenu',

            pointerdown: 'pointerdown.uxTouchMenu',
            pointerup  : 'pointerup.uxTouchMenu',
            pointermove: 'pointermove.uxTouchMenu',

            MSPointerDown: 'MSPointerDown.uxTouchMenu',
            MSPointerUp  : 'MSPointerUp.uxTouchMenu',
            MSPointerMove: 'MSPointerMove.uxTouchMenu',

            touchStart: function() {
                return this.touchstart + ' ' + this.pointerdown + ' ' + this.MSPointerDown;
            },

            touchEnd: function() {
                return this.touchend + ' ' + this.pointerup + ' ' + this.MSPointerUp;
            },

            touchMove: function() {
                return this.touchmove + ' ' + this.pointermove + ' ' + this.MSPointerMove;
            },

            click: 'click.uxTouchMenu'
        },
        ns = {
            rocket : 'uxRocket',
            data   : 'uxTouchMenu',
            ready  : 'uxitd-touchmenu-ready',
            visible: 'uxitd-touchmenu-visible'
        };

    var TouchMenu = function(el, options, selector) {
        var $el = $(el),
            opts = $.extend({}, defaults, options, $el.data(), {'selector': selector});

        $el.data(ns.data, opts);

        // call onReady function if any
        callback(opts.onReady);

        // bind the ui interactions
        bindUIActions($el);
    };

    var bindUIActions = function($el) {
        var _opts = $el.data(ns.data),
            visible,
            touchmoved = false;

        $el.find('a[aria-haspopup="true"]').on(events.click, function(e) {
            e.preventDefault();
            $(this).parent().siblings().find(_opts.subs).removeClass(ns.visible).hide();
            $(this).siblings(_opts.subs).addClass(ns.visible).show();
        });

        $(document)
            .on(events.touchStart(), function(e) {
                $el.find('.' + ns.visible).show();
            })
            .on(events.touchMove(), function(e) {
                touchmoved = true;
            })
            .on(events.touchEnd(), function(e) {
                if(touchmoved == true) {
                    $el.find('.' + ns.visible).show();
                    touchmoved = false;
                    return;
                }
            })
            .on(events.click, function(e) {
                $el.find(_opts.subs).removeClass(ns.visible).hide();
                touchmoved = false;
            });

        $("iframe").on(events.click, function() {
            $el.find(_opts.subs).removeClass(ns.visible).hide();
        });

        $el.on(events.click, function(e) {
            e.stopPropagation();
        });
    };

    // global callback
    var callback = function(fn) {
        // if callback string is function call it directly
        if(typeof fn === 'function') {
            fn.apply(this);
        }

        // if callback defined via data-attribute, call it via new Function
        else {
            if(fn !== false) {
                var func = new Function('return' + fn);
                func();
            }
        }
    };

    // touch checks
    var is_touchEnabled = function() {
        if(!('ontouchstart' in window)
           && !navigator.msMaxTouchPoints
           && !navigator.userAgent.toLowerCase().match(/windows phone os 7/i)) {
            return false;
        }

        return true;
    };

    ux = $.fn.touchmenu = $.uxtouchmenu = function(options) {
        var selector = this.selector;

        return this.each(function(options) {
            var $el = $(this),
                uxrocket = $el.data(ns.rocket) || {},
                tap;

            if($el.hasClass(ns.ready) || !is_touchEnabled()) {
                return;
            }

            $el.addClass(ns.ready);

            uxrocket[ns.data] = {'hasWrapper': false, 'ready': ns.ready, 'selector': selector, 'options': options};

            $el.data(ns.rocket, uxrocket);

            tap = new TouchMenu(this, options, selector);
        });
    };

    ux.version = '0.1.0';

    ux.settings = defaults;
})(jQuery);