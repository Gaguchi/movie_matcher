MovieMatch = function(){
	
	"use strict"
	
	var screenWidth = $( window ).width();
	var screenHeight = $( window ).height();
	
	// Preloader ============
	var handlePreloader = function(){
		setTimeout(function() {
            jQuery('#preloader').fadeOut(300);
		},300);
	}

	// Menubar Toggler ============
    var handleMenubar = function() {
        jQuery('.menu-toggler').on('click',function(){
			jQuery('.sidebar').toggleClass('show');
			jQuery('.menu-toggler').toggleClass('show');
			jQuery('.dark-overlay').toggleClass('active');
		});
		jQuery('.dark-overlay').on('click',function(){
			jQuery('.menu-toggler,.sidebar').removeClass('show');
				jQuery(this).removeClass('active');
		});
		jQuery('.nav-color').on('click',function(){
			jQuery('.dark-overlay').removeClass('active');
		});
	}
	
	// Sticky Header ============
	var handleIsFixed = function(){
		$(window).scroll(function() {    
			var scroll = $(window).scrollTop();
			if (scroll >= 50) {
				$(".main-bar").addClass("sticky-header");
			}else{
				$(".main-bar").removeClass("sticky-header");
			}
		});
	}
    
    
	// Menubar Nav Active ============
    var handleMenubarNav = function() {
        $(".menubar-nav .nav-link").on("click",function(){
            $(".menubar-nav .nav-link").removeClass("active");
            $(this).addClass("active");
        });
	}
    
    
	
	/* Function ============ */
	return {
		init:function(){
			handleMenubar();
			handleIsFixed();
			handleMenubarNav();
		},

		load:function(){
			handlePreloader();
			handleSelectpicker();
			appNavigateShare();
		},
		
		resize:function(){
			screenWidth = $( window ).width();
		},
	}
	
}();

/* Document.ready Start */	
jQuery(document).ready(function() {
    'use strict';
	MovieMatch.init();
	
	$('[data-bs-toggle="popover"]').popover();
    $('.theme-dark .custom-switch input').prop('checked', true);
	
});
/* Document.ready END */

/* Window Load START */
jQuery(window).on('load',function () {
	'use strict'; 
    jQuery('.loader').removeClass('animated');
	MovieMatch.load();
	setTimeout(function(){
		jQuery('#splashscreen').addClass('active');
	 	jQuery('#splashscreen').fadeOut(1500);
	}, 1500);
	
    $('.theme-dark .custom-switch input').prop('checked', true).addClass('active');
	
});
/*  Window Load END */

/* Window Resize START */
jQuery(window).on('resize',function () {
	'use strict'; 
	
	MovieMatch.resize();
});
/*  Window Resize END */	