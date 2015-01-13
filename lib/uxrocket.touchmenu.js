/**
 * UX Rocket
 * Hover/Tap transformation for touch screens
 * @author Bilal Cinarli
 */

;(function($){
    var ux,

        defaults = {
            subs: '.sub-navigation',

            // callbacks
            onReady: false,
            onTap: false
        };

    var TouchMenu = function(el, options){
        var $el = $(el),
            opts = $.extend({}, defaults, options, $el.data());

        // call onReady function if any
        callback(opts.onReady);

        // bind the ui interactions
        bindUIActions($el, opts);
    };

    var bindUIActions = function($el, opts){
        var visible,
            touchmoved = false;

        $el.find('a[aria-haspopup="true"]').on('click', function(e){
            e.preventDefault();
            $(this).parent().siblings().find(opts.subs).removeClass('uxitd-touchmenu-visible').hide();
            $(this).siblings(opts.subs).addClass('uxitd-touchmenu-visible').show();
        });

        $(document)
            .on('touchmove MSPointerMove pointermove', function(e){
                touchmoved = true;
            })
            .on('touchstart MSPointerDown pointerdown', function(e){
                $el.find('.uxitd-touchmenu-visible').show();
            })
            .on('touchend MSPointerUp pointerup', function(e){
                if(touchmoved == true){
                    $el.find('.uxitd-touchmenu-visible').show();
                    touchmoved = false;
                    return;
                }
            })
            .on('click', function(e){
                $el.find(opts.subs).removeClass('uxitd-touchmenu-visible').hide();
                touchmoved = false;
            });

        $("iframe").on('click', function(){
            $el.find(opts.subs).removeClass('uxitd-touchmenu-visible').hide();
        });

        $el.on('click', function(e){
            e.stopPropagation();
        });
    };

    // global callback
    var callback = function(fn){
        // if callback string is function call it directly
        if(typeof fn === 'function'){
            call(fn);
        }

        // if callback defined via data-attribute, call it via new Function
        else {
            if(fn !== false){
                var func = new Function('return' + fn);
                func();
            }
        }
    };

    // touch checks
    var is_touchEnabled = function(){
        if( !( 'ontouchstart' in window ) &&
            !navigator.msMaxTouchPoints &&
            !navigator.userAgent.toLowerCase().match( /windows phone os 7/i )){
            return false;
        }

        return true;
    };

    ux = $.fn.touchmenu = $.uxtouchmenu = function(options){
        return this.each(function(options){
            var $el = $(this),
                tap;

            if($el.hasClass('uxitd-touchmenu-ready') || !is_touchEnabled()){
                return;
            }

            $el.addClass('uxitd-toucmenu-ready');

            tap = new TouchMenu(this, options);
        });
    };

    ux.version = '0.1.0';

    ux.settings = defaults;
})(jQuery);