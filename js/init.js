/*
 * Copyright (c) 2022 Binura Salindra
 * Author: Binura Salindra
 * This file is made for CURRENT TEMPLATE
*/

jQuery(document).ready(function(){

	"use strict";
	
	// here all ready functions
	
	tokyo_tm_modalbox();
	tokyo_tm_page_transition();
	tokyo_tm_trigger_menu();
	tokyo_tm_service_popup();
	tokyo_tm_modalbox_news();
	tokyo_tm_modalbox_portfolio();
	tokyo_tm_my_progress();
	tokyo_tm_projects();
	tokyo_tm_portfolio();
	tokyo_tm_cursor();
	tokyo_tm_imgtosvg();
	tokyo_tm_popup();
	tokyo_tm_data_images();
	tokyo_tm_owl_carousel();
    tokyo_tm_contact_form();
	tokyo_tm_particle_background();

	jQuery(window).load('body', function(){
		tokyo_tm_my_load();
	});
	
});

// -----------------------------------------------------
// ---------------   FUNCTIONS    ----------------------
// -----------------------------------------------------
(function () {
    if (typeof emailjs !== "undefined") {
        emailjs.init("YvKw5a6mHClTIHaRN");
    }
})();
// -----------------------------------------------------
// --------------------   MODALBOX    ------------------
// -----------------------------------------------------

function tokyo_tm_modalbox(){
	"use strict";
	
	jQuery('.tokyo_tm_all_wrap').prepend('<div class="tokyo_tm_modalbox"><div class="box_inner"><div class="close"><a href="#"><i class="icon-cancel"></i></a></div><div class="description_wrap"></div></div></div>');
}

// -----------------------------------------------------
// -------------   PAGE TRANSITION    ------------------
// -----------------------------------------------------

function tokyo_tm_page_transition(){
	
	"use strict";
	
	var section 		= jQuery('.tokyo_tm_section');
	var allLi 			= jQuery('.transition_link li');
	var button			= jQuery('.transition_link a');
	var wrapper 		= jQuery('.tokyo_tm_all_wrap');
	var enter	 		= wrapper.data('enter');
	var exit		 	= wrapper.data('exit');
	
	button.on('click',function(){
		var element 	= jQuery(this);
		var href		= element.attr('href');
		if(element.parent().hasClass('tokyo_tm_button')){
			jQuery('.menu .transition_link a[href="'+href+'"]').trigger('click');
			hashtag();
			return false;
		}
		var sectionID 	= jQuery(href);
		var parent	 	= element.closest('li');
			if(!parent.hasClass('active')) {
				allLi.removeClass('active');
				wrapper.find(section).removeClass('animated '+enter);
				if(wrapper.hasClass('opened')) {
					wrapper.find(section).addClass('animated '+exit);
				}
				parent.addClass('active');
				wrapper.addClass('opened');
				wrapper.find(sectionID).removeClass('animated '+exit).addClass('animated '+enter);
				jQuery(section).addClass('hidden');
				jQuery(sectionID).removeClass('hidden').addClass('active');
			}
		return false;
	});
}

// -----------------------------------------------------
// ---------------   TRIGGER MENU    -------------------
// -----------------------------------------------------

function tokyo_tm_trigger_menu(){
	
	"use strict";

	var hamburger 		= jQuery('.tokyo_tm_topbar .trigger .hamburger');
	var mobileMenu		= jQuery('.tokyo_tm_mobile_menu');
	var mobileMenuList	= jQuery('.tokyo_tm_mobile_menu ul li a');

	hamburger.on('click',function(){
		var element 	= jQuery(this);

		if(element.hasClass('is-active')){
			element.removeClass('is-active');
			mobileMenu.removeClass('opened');
		}else{
			element.addClass('is-active');
			mobileMenu.addClass('opened');
		}
		return false;
	});
	
	mobileMenuList.on('click',function(){
		jQuery('.tokyo_tm_topbar .trigger .hamburger').removeClass('is-active');
		mobileMenu.removeClass('opened');
		return false;
	});
}

// -------------------------------------------------
// -------------  SERVICE POPUP  -------------------
// -------------------------------------------------

function tokyo_tm_service_popup(){
	
	"use strict";
	
	var modalBox		= jQuery('.tokyo_tm_modalbox');
	var button			= jQuery('.tokyo_tm_services .tokyo_tm_full_link');
	var closePopup		= modalBox.find('.close');
	
	button.on('click',function(){
		var element = jQuery(this);
		var parent	= element.closest('.tokyo_tm_services .list ul li');
		var elImage	= parent.find('.popup_service_image').attr('src');
		var title	= parent.find('.title').text();
		var content = parent.find('.service_hidden_details').html();
		modalBox.addClass('opened');
		modalBox.find('.description_wrap').html(content);
		modalBox.find('.service_popup_informations').prepend('<div class="image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="'+elImage+'"></div></div>');
		tokyo_tm_data_images();
		modalBox.find('.service_popup_informations .image').after('<div class="main_title"><h3>'+title+'</h3></div>');
		return false;
	});
	closePopup.on('click',function(){
		modalBox.removeClass('opened');
		modalBox.find('.description_wrap').html('');
		return false;
	});
}

// -------------------------------------------------
// -------------  MODALBOX NEWS  -------------------
// -------------------------------------------------

function tokyo_tm_modalbox_news(){
	
	"use strict";
	
	var modalBox	= jQuery('.tokyo_tm_modalbox');
	var list 		= jQuery('.tokyo_tm_news ul li');
	var closePopup	= modalBox.find('.close');
	
	list.each(function(){
		var element 	= jQuery(this);
		var details 	= element.find('.list_inner').html();
		var buttons 	= element.find('.details .title a,.tokyo_tm_full_link,.tokyo_tm_read_more a');
		var mainImage	= element.find('.main');
		var imgData		= mainImage.data('img-url');
		var title		= element.find('.title');
		var titleHref	= element.find('.title a').html();
		buttons.on('click',function(){
			jQuery('body').addClass('modal');
			modalBox.addClass('opened');
			modalBox.find('.description_wrap').html(details);
			mainImage = modalBox.find('.main');
			mainImage.css({backgroundImage: 'url('+imgData+')'});
			title = modalBox.find('.title');
			title.html(titleHref);
			tokyo_tm_imgtosvg();
			return false;
		});
	});
	closePopup.on('click',function(){
		modalBox.removeClass('opened');
		modalBox.find('.description_wrap').html('');
		jQuery('body').removeClass('modal');
		return false;
	});
}

// -------------------------------------------------
// -------------  MODALBOX PORTFOLIO  --------------
// -------------------------------------------------

function tokyo_tm_modalbox_portfolio(){
	
	"use strict";
	
	var modalBox	= jQuery('.tokyo_tm_modalbox');
	var button		= jQuery('.tokyo_tm_portfolio .popup_info');
	
	button.on('click',function(){
		var element 	= jQuery(this);
		var parent		= element.closest('li');
		var image		= parent.find('.abs_image').data('img-url');
		var details 	= parent.find('.details_all_wrap').html();
		var title 		= parent.find('.entry').data('title');
		var category 	= parent.find('.entry').data('category');
		console.log(image);
		
		modalBox.addClass('opened');
		modalBox.find('.description_wrap').html(details);
		modalBox.find('.popup_details').prepend('<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="'+image+'"></div></div>');
		modalBox.find('.popup_details .top_image').after('<div class="portfolio_main_title"><h3>'+title+'</h3><span>'+category+'</span><div>');	
		tokyo_tm_data_images();
		return false;
	});
}

// -------------------------------------------------
// -----------------    PORTFOLIO    ---------------
// -------------------------------------------------

function tokyo_tm_projects() {
	
	"use strict";
	
	jQuery('.tokyo_tm_portfolio_animation_wrap').each(function() {
		jQuery(this).on('mouseenter', function() {
			if (jQuery(this).data('title')) {
				jQuery('.tokyo_tm_portfolio_titles').html(jQuery(this).data('title') + '<span class="work__cat">' + jQuery(this).data('category') + '</span>');
				jQuery('.tokyo_tm_portfolio_titles').addClass('visible');
			}

			jQuery(document).on('mousemove', function(e) {
				jQuery('.tokyo_tm_portfolio_titles').css({
					left: e.clientX - 10,
					top: e.clientY + 25
				});
			});
		}).on('mouseleave', function() {
			jQuery('.tokyo_tm_portfolio_titles').removeClass('visible');
		});
	});
}

// filterable 

function tokyo_tm_portfolio(){

	"use strict";

	if(jQuery().isotope) {

		// Needed variables
		var list 		 = jQuery('.tokyo_tm_portfolio .portfolio_list');
		var filter		 = jQuery('.tokyo_tm_portfolio .portfolio_filter ul');

		if(filter.length){
			// Isotope Filter 
			filter.find('a').on('click', function(){
				var selector = jQuery(this).attr('data-filter');
				list.isotope({ 
					filter				: selector,
					animationOptions	: {
						duration			: 750,
						easing				: 'linear',
						queue				: false
					}
				});
				return false;
			});	

			// Change active element class
			filter.find('a').on('click', function() {
				filter.find('a').removeClass('current');
				jQuery(this).addClass('current');
				return false;
			});	
		}
	}
}

// -------------------------------------------------
// -------------  PROGRESS BAR  --------------------
// -------------------------------------------------

function tokyo_tm_my_progress(){
	"use strict";
	
	var list = jQuery('.tokyo_progress .progress_inner');
	list.each(function(){
		var element = jQuery(this);
		var bar		= element.find('.bar_in');
		var number	= element.data('value');
		bar.css({width:number+'%'});
	});
	
}

// -----------------------------------------------------
// ---------------   PRELOADER   -----------------------
// -----------------------------------------------------

function tokyo_tm_preloader(){
	
	"use strict";
	
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
	var preloader = $('#preloader');
	
	if (!isMobile) {
		setTimeout(function() {
			preloader.addClass('preloaded');
		}, 800);
		setTimeout(function() {
			preloader.remove();
		}, 2000);

	} else {
		preloader.remove();
	}
}

// -----------------------------------------------------
// -----------------   MY LOAD    ----------------------
// -----------------------------------------------------

function tokyo_tm_my_load(){
	
	"use strict";
	
	var speed	= 500;
	setTimeout(function(){tokyo_tm_preloader();},speed);
}

// -----------------------------------------------------
// ------------------   CURSOR    ----------------------
// -----------------------------------------------------

function tokyo_tm_cursor(){
    "use strict";
	
	var myCursor	= jQuery('.mouse-cursor');
	
	if(myCursor.length){
		if ($("body")) {
        const e = document.querySelector(".cursor-inner"),
            t = document.querySelector(".cursor-outer");
        let n, i = 0,
            o = !1;
        window.onmousemove = function (s) {
            o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)", n = s.clientY, i = s.clientX
        }, $("body").on("mouseenter", "a, .cursor-pointer", function () {
            e.classList.add("cursor-hover"), t.classList.add("cursor-hover")
        }), $("body").on("mouseleave", "a, .cursor-pointer", function () {
            $(this).is("a") && $(this).closest(".cursor-pointer").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
        }), e.style.visibility = "visible", t.style.visibility = "visible"
    }
	}
};

// -----------------------------------------------------
// ---------------    IMAGE TO SVG    ------------------
// -----------------------------------------------------

function tokyo_tm_imgtosvg(){
	
	"use strict";
	
	jQuery('img.svg').each(function(){
		
		var jQueryimg 		= jQuery(this);
		var imgClass		= jQueryimg.attr('class');
		var imgURL			= jQueryimg.attr('src');

		jQuery.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var jQuerysvg = jQuery(data).find('svg');

			// Add replaced image's classes to the new SVG
			if(typeof imgClass !== 'undefined') {
				jQuerysvg = jQuerysvg.attr('class', imgClass+' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			jQuerysvg = jQuerysvg.removeAttr('xmlns:a');

			// Replace image with new SVG
			jQueryimg.replaceWith(jQuerysvg);

		}, 'xml');

	});
}

// -----------------------------------------------------
// --------------------   POPUP    ---------------------
// -----------------------------------------------------

function tokyo_tm_popup(){
	
	"use strict";

	jQuery('.gallery_zoom').each(function() { // the containers for all your galleries
		jQuery(this).magnificPopup({
			delegate: 'a.zoom', // the selector for gallery item
			type: 'image',
			gallery: {
			  enabled:true
			},
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});

	});
	jQuery('.popup-youtube, .popup-vimeo').each(function() { // the containers for all your galleries
		jQuery(this).magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false
		});
	});
	
	jQuery('.soundcloude_link').magnificPopup({
	  type : 'image',
	   gallery: {
		   enabled: true, 
	   },
	});
}

// -----------------------------------------------------
// ---------------   DATA IMAGES    --------------------
// -----------------------------------------------------

function tokyo_tm_data_images(){
	
	"use strict";
	
	var data			= jQuery('*[data-img-url]');
	
	data.each(function(){
		var element			= jQuery(this);
		var url				= element.data('img-url');
		element.css({backgroundImage: 'url('+url+')'});
	});
}

// -----------------------------------------------------
// ----------------    OWL CAROUSEL    -----------------
// -----------------------------------------------------

function tokyo_tm_owl_carousel(){

	"use strict";
	
	var carousel			= jQuery('.tokyo_tm_testimonials .owl-carousel');
	
	carousel.owlCarousel({
		loop: true,
		items: 2,
		lazyLoad: false,
		margin: 30,
		autoplay: true,
		autoplayTimeout: 7000,
		dots: false,
		nav: false,
		navSpeed: false,
		responsive : {
			0 : {
				items: 1
			},
			768 : {
				items: 2
			}
		}
	});
}

// -----------------------------------------------------
// ----------------    Contact Form    -----------------
// -----------------------------------------------------
function tokyo_tm_contact_form() {

    var form = jQuery("#contact_form");
    var returnMessage = jQuery(".returnmessage");

    if (!form.length || !returnMessage.length) {
        return; // safety check
    }

    form.on("submit", function(e) {
        e.preventDefault();

        var name = jQuery("#name").val().trim();
        var email = jQuery("#email").val().trim();
        var message = jQuery("#message").val().trim();

        if (!name || !email || !message) {
            jQuery(".empty_notice").fadeIn();
            return;
        }

        // Sending state
        returnMessage
            .html("⏳ Sending message...")
            .addClass("sending")
            .fadeIn();

        emailjs.send("service_a3nycjj", "template_qxpw70p", {
            name: name,
            email: email,
            message: message
        })
            .then(function() {
                returnMessage
                    .html(returnMessage.data("success"))
                    .removeClass("sending");

                form[0].reset();
            })
            .catch(function() {
                returnMessage
                    .html("❌ Failed to send message. Please try again.")
                    .removeClass("sending");
            });
    });
}

// -----------------------------------------------------
// -----------  3D PARTICLE BACKGROUND  ----------------
// -----------------------------------------------------
function tokyo_tm_particle_background() {
	"use strict";

	var canvases = document.querySelectorAll(".bg-canvas");
	if (!canvases.length) {
		return;
	}

	var prefersReducedMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
	var reducedMotion = prefersReducedMotion ? prefersReducedMotion.matches : false;
	var mouseTarget = { x: 0, y: 0 };
	var mouseCurrent = { x: 0, y: 0 };
	var scrollTarget = 0;
	var scrollCurrent = 0;
	var lastTime = 0;
	var rafId = null;
	var isHidden = false;
	var fields = [];

	function createField(canvas) {
		if (!canvas.getContext) {
			return null;
		}
		var ctx = canvas.getContext("2d");
		if (!ctx) {
			return null;
		}

		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		var width = 0;
		var height = 0;
		var particles = [];
		var positions = [];
		var isActive = true;

		function getParticleCount() {
			var isMobile = width <= 768;
			var area = width * height;
			var density = isMobile ? 26000 : 14000;
			var minCount = isMobile ? 18 : 60;
			var maxCount = isMobile ? 50 : 150;
			var count = Math.round(area / density);
			return Math.max(minCount, Math.min(maxCount, count));
		}

		function createParticles() {
			var count = getParticleCount();
			particles = [];
			positions = new Array(count);
			for (var i = 0; i < count; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					z: Math.random(),
					vx: (Math.random() - 0.5) * 0.35,
					vy: (Math.random() - 0.5) * 0.35
				});
				positions[i] = { x: 0, y: 0, z: 0 };
			}
		}

		function resizeCanvas() {
			var rect = canvas.getBoundingClientRect();
			width = rect.width || 0;
			height = rect.height || 0;
			if (width < 2 || height < 2) {
				isActive = false;
				return;
			}
			isActive = true;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			createParticles();
		}

		function wrapParticle(particle, margin) {
			if (particle.x < -margin) {
				particle.x = width + margin;
			} else if (particle.x > width + margin) {
				particle.x = -margin;
			}
			if (particle.y < -margin) {
				particle.y = height + margin;
			} else if (particle.y > height + margin) {
				particle.y = -margin;
			}
		}

		function drawFrame(delta) {
			if (!isActive) {
				return;
			}
			var motionFactor = reducedMotion ? 0.2 : 1;
			var parallaxStrength = reducedMotion ? 14 : 36;
			var scrollStrength = reducedMotion ? 0.03 : 0.08;
			var lineDistance = width <= 640 ? 80 : 120;
			var lineDistanceSq = lineDistance * lineDistance;
			var particleAlphaBase = reducedMotion ? 0.38 : 0.55;
			var margin = 60;

			ctx.clearRect(0, 0, width, height);

			for (var i = 0; i < particles.length; i++) {
				var p = particles[i];
				var speed = (0.5 + p.z) * motionFactor;
				p.x += p.vx * speed * delta;
				p.y += p.vy * speed * delta;
				wrapParticle(p, margin);

				var depth = p.z;
				var offsetX = mouseCurrent.x * parallaxStrength * (0.3 + depth);
				var offsetY = mouseCurrent.y * parallaxStrength * (0.3 + depth) - scrollCurrent * scrollStrength * (0.2 + depth);
				positions[i].x = p.x + offsetX;
				positions[i].y = p.y + offsetY;
				positions[i].z = depth;
			}

			// Draw lines first for a softer glow behind particles
			ctx.lineWidth = 1;
			for (var a = 0; a < positions.length; a++) {
				for (var b = a + 1; b < positions.length; b++) {
					var dx = positions[a].x - positions[b].x;
					var dy = positions[a].y - positions[b].y;
					var distSq = dx * dx + dy * dy;
					if (distSq < lineDistanceSq) {
						var distanceRatio = 1 - distSq / lineDistanceSq;
						var depthRatio = (positions[a].z + positions[b].z) * 0.5;
						var alpha = distanceRatio * depthRatio * 0.35;
						ctx.strokeStyle = "rgba(255,255,255," + alpha.toFixed(3) + ")";
						ctx.beginPath();
						ctx.moveTo(positions[a].x, positions[a].y);
						ctx.lineTo(positions[b].x, positions[b].y);
						ctx.stroke();
					}
				}
			}

			// Draw particles
			for (var c = 0; c < positions.length; c++) {
				var dot = positions[c];
				var radius = 0.7 + dot.z * 1.4;
				var alphaDot = particleAlphaBase + dot.z * 0.35;
				ctx.fillStyle = "rgba(255,255,255," + Math.min(alphaDot, 0.95).toFixed(3) + ")";
				ctx.beginPath();
				ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		resizeCanvas();

		return {
			resize: resizeCanvas,
			draw: drawFrame
		};
	}

	for (var i = 0; i < canvases.length; i++) {
		var field = createField(canvases[i]);
		if (field) {
			fields.push(field);
		}
	}

	if (!fields.length) {
		return;
	}

	function setMouseTarget(clientX, clientY) {
		var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
		var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
		if (!viewportWidth || !viewportHeight) {
			return;
		}
		mouseTarget.x = clientX / viewportWidth - 0.5;
		mouseTarget.y = clientY / viewportHeight - 0.5;
	}

	function animate(timestamp) {
		if (isHidden) {
			rafId = null;
			return;
		}
		if (!lastTime) {
			lastTime = timestamp;
		}
		var delta = Math.min((timestamp - lastTime) / 16.67, 2);
		lastTime = timestamp;

		mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
		mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;
		scrollTarget = window.pageYOffset || document.documentElement.scrollTop || 0;
		scrollCurrent += (scrollTarget - scrollCurrent) * 0.06;

		for (var j = 0; j < fields.length; j++) {
			fields[j].draw(delta);
		}
		rafId = window.requestAnimationFrame(animate);
	}

	function startAnimation() {
		if (!rafId) {
			lastTime = 0;
			rafId = window.requestAnimationFrame(animate);
		}
	}

	startAnimation();

	window.addEventListener("resize", function() {
		for (var i = 0; i < fields.length; i++) {
			fields[i].resize();
		}
	}, { passive: true });

	window.addEventListener("mousemove", function(event) {
		setMouseTarget(event.clientX, event.clientY);
	}, { passive: true });

	window.addEventListener("mouseout", function(event) {
		if (!event.relatedTarget && !event.toElement) {
			var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
			var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
			setMouseTarget(viewportWidth * 0.5, viewportHeight * 0.5);
		}
	}, { passive: true });

	document.addEventListener("visibilitychange", function() {
		isHidden = document.hidden;
		if (!isHidden) {
			startAnimation();
		}
	});

	if (prefersReducedMotion) {
		var motionListener = function(event) {
			reducedMotion = event.matches;
		};
		if (prefersReducedMotion.addEventListener) {
			prefersReducedMotion.addEventListener("change", motionListener);
		} else if (prefersReducedMotion.addListener) {
			prefersReducedMotion.addListener(motionListener);
		}
	}
}
