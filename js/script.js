jQuery.noConflict();
jQuery(document).ready(function() {
//Styler
jQuery('input[type=radio], input[type=checkbox], input.quantity, input.quantity-basket').styler({
	onFormStyled:function(a) {
		var quantity = jQuery('input.quantity, input.quantity-basket');
		if(quantity.length > 0) {
			jQuery(quantity).each(function() {
				var val = jQuery(this).val(),
				max = jQuery(this).attr('max');
				if(val >= max) {
					jQuery(this).parent().parent().find('.plus').addClass('disabled');
				}
			});				
		}
	}
});

//Phone Mask
jQuery("input.tel").inputmask("+7(999) 999-99-99");

//Sliders
var slider = new Swiper(".slider-home", {
	speed: 1000,
	loop:true,
	autoplay: {
		delay:4000,
		disableOnInteraction:false
	},
	pagination: {
		el: '.slider-home .swiper-pagination',
		clickable:true,
	},
	navigation: {
		nextEl: '.slider-home .swiper-button-next',
		prevEl: '.slider-home .swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
		768: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
		1280: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
	},
});

var hit = new Swiper(".slider-hit", {
	speed: 600,
	navigation: {
		nextEl: '.slider-hit .swiper-button-next',
		prevEl: '.slider-hit .swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 'auto',
			spaceBetween: 2,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 2,
		},
		1280: {
			slidesPerView: 4,
			spaceBetween: 8,
		},
	},
});

var hit2 = new Swiper(".slider-catalog", {
	speed: 600,
	navigation: {
		nextEl: '.slider-catalog .swiper-button-next',
		prevEl: '.slider-catalog .swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 'auto',
			spaceBetween: 2,
		},
		768: {
			slidesPerView: 4,
			spaceBetween: 2,
		},
		1280: {
			slidesPerView: 5,
			spaceBetween: 8,
		},
	},
});

var categories = new Swiper(".category-slider__list", {
	speed: 600,
	breakpoints: {
		320: {
			slidesPerView: 'auto',
			spaceBetween: 16,
		},
		768: {
			slidesPerView: 'auto',
			spaceBetween: 24,
		},
		1280: {
			slidesPerView: 'auto',
			spaceBetween: 24,
		},
	},
});

var hit3 = new Swiper(".slider-product", {
	speed: 600,
	navigation: {
		nextEl: '.slider-product .swiper-button-next',
		prevEl: '.slider-product .swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 'auto',
			spaceBetween: 2,
		},
		768: {
			slidesPerView: 'auto',
			spaceBetween: 8,
		},
		1280: {
			slidesPerView: 'auto',
			spaceBetween: 8,
		},
	},
});

var reviews = new Swiper(".reviews-slider", {
	speed: 600,
	navigation: {
		nextEl: '.reviews-slider .swiper-button-next',
		prevEl: '.reviews-slider .swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 'auto',
			spaceBetween: 2,
		},
		768: {
			slidesPerView: 'auto',
			spaceBetween: 8,
		},
		1280: {
			slidesPerView: 'auto',
			spaceBetween: 8,
		},
	},
});

var hit4 = new Swiper(".slider-similar", {
	speed: 600,
	navigation: {
		nextEl: '.slider-similar .swiper-button-next',
		prevEl: '.slider-similar .swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 'auto',
			spaceBetween: 2,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 2,
		},
		1280: {
			slidesPerView: 4,
			spaceBetween: 8,
		},
	},
});

var hit5 = new Swiper(".slider-like", {
	speed: 600,
	navigation: {
		nextEl: '.slider-like .swiper-button-next',
		prevEl: '.slider-like .swiper-button-prev',
	},
	breakpoints: {
		320: {
			slidesPerView: 'auto',
			spaceBetween: 2,
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 2,
		},
		1280: {
			slidesPerView: 4,
			spaceBetween: 8,
		},
	},
});

//Form
jQuery(document).on('submit', '#subscribe-form', function(e) {
	e.preventDefault();
	const emailInput = jQuery('#email');
	const emailError = jQuery(this).find('.error-txt');
	const email = jQuery(emailInput).val().trim();
	const check = jQuery('#check');
	let valid = true;

	check.parent().removeClass('error');
	emailInput.parent().removeClass('error');
	emailError.text('');
	if (email === '') {
		emailInput.parent().addClass('error');
		emailError.text('Вы забыли написать email');
		valid = false;
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		emailInput.parent().addClass('error');
		emailError.text('Неправильный формат адреса');
		valid = false;
	}
	if(!jQuery(check).is(':checked')) {
		check.parent().addClass('error');
		valid = false;
	}
	if (valid) {
		jQuery('.subscribe-txt__box').html('<div class="success-txt"><h3>Спасибо за подписку!</h3></div>');
	}
});

jQuery(document).on('submit', '#subscribe-form2', function(e) {
	e.preventDefault();
	const emailInput2 = jQuery('#email2');
	const emailError2 = jQuery(this).find('.error-txt');
	const email2 = jQuery(emailInput2).val().trim();
	const check2 = jQuery('#check2');
	let valid = true;

	check2.parent().removeClass('error');
	emailInput2.parent().removeClass('error');
	emailError2.text('');
	if (email2 === '') {
		emailInput2.parent().addClass('error');
		emailError2.text('Вы забыли написать email');
		valid = false;
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email2)) {
		emailInput2.parent().addClass('error');
		emailError2.text('Неправильный формат адреса');
		valid = false;
	}
	if(!jQuery(check2).is(':checked')) {
		check2.parent().addClass('error');
		valid = false;
	}
	if (valid) {
		jQuery(this).parents('.popup-content__box').parent().find('.popup-header').html('<h3>Спасибо за подписку</h3><div class="popup-txt__box">Теперь вы будете в курсе всех новинок и акций</div><button class="btn" data-close>Закрыть</button>');
		jQuery(this).parents('.popup-content__box').html('');
	}
});

jQuery(document).on('submit', '#stat-form', function(e) {
	e.preventDefault();
	const phoneInput = jQuery('#phone');
	const phoneError = jQuery(phoneInput).parent().find('.error-txt');
	const phone = jQuery(phoneInput).val().trim();
	
	const statInput = jQuery('#stat');
	const statError = jQuery(statInput).parent().find('.error-txt');
	const stat = jQuery(statInput).val().trim();
	
	let valid = true;

	phoneInput.parent().removeClass('error');
	phoneError.text('');
	if (phone === '') {
		phoneInput.parent().addClass('error');
		phoneError.text('Введите номер телефона');
		valid = false;
	} else if (phone.replace(/[^0-9]/g, '').length < 11) {
		phoneInput.parent().addClass('error');
		phoneError.text('Введите корректный номер телефона');
		valid = false;
	}
	
	statInput.parent().removeClass('error');
	statError.text('');
	if (stat === '') {
		statInput.parent().addClass('error');
		statError.text('Введите номер заказа');
		valid = false;
	}
	
	if (valid) {
		jQuery('.stat-list').fadeIn(0);
	}
});

//Popup
jQuery(document).on('click', '[data-popup]', function(e) {
	e.preventDefault();
	var link = jQuery(this).data('link'),
		bg = jQuery(this).data('bg'),
		input = jQuery('.popup').find('.input-box:first-child input'),
		animation = jQuery(this).data('animation'),
		animationTab = jQuery(this).data('tab-anim'),
		message = jQuery(this).data('message'),
		gallery = jQuery(this).data('photo'),
		index = jQuery(this).data('index');
	if(link) {
		jQuery('body').addClass('fix');
		if(message !== undefined) {
			//jQuery('body').append('<div class="select-overlay active"></div>');
		} else {
			jQuery('.popup').fadeOut(300).addClass('hide');
		}
		
		if(animation == 'down') {
			if(jQuery(window).width() > 1200) {
				jQuery('#'+link).show('slide', {direction: 'right'}, 300);
			} else {
				jQuery('#'+link).slideDown(200);
				jQuery('#'+link).find('.popup-box').addClass('show');
			}
		} else if(animation == 'right') {
			if(jQuery(window).width() > 1200) {
				jQuery('#'+link).show('slide', {direction: 'right'}, 300);
			} else {
				jQuery('#'+link).show('slide', {direction: 'right'}, 300);
				jQuery('#'+link).find('.popup-box').addClass('show');
			}
		} else {
			if(jQuery(window).width() < 1200) {
				if(animationTab) {
					jQuery('#'+link).fadeIn(0);
				} else {
					jQuery('#'+link).fadeIn(200);
				}					
			} else {
				jQuery('#'+link).fadeIn(300);
			}				
		}			
		if(input) {
			input.focus();
		}
		if(bg !== undefined) {
			jQuery('.black-bg').fadeIn(300);
		}
	}
	if(gallery !== undefined) {
		galleryListPopup.slideTo(gallery, 0, false);
	}
	if(jQuery('.header-menu__box').hasClass('active')) {
		jQuery('.header-menu__box').removeClass('active');
	}
	if(jQuery('.menu-btn').hasClass('active')) {
		jQuery('.menu-btn').removeClass('active');
	}
	if(index !== undefined) {
		jQuery('.tabber-menu__box').addClass('hover');
	}
	jQuery('.size-bg').fadeOut(300);
});

jQuery(document).on('click', '.close, .black-bg, [data-close]', function(e) {
	e.preventDefault();
	
	jQuery('.tabber-menu__box, .catalog-list').removeClass('hover');
	
	var message = jQuery(this).parents('.popup').data('message'),
		alert = jQuery(this).data('alert');
	if(message !== undefined) {
		jQuery(this).parents('.popup').fadeOut(300).addClass('hide');
	} else {
		if(jQuery(this).parent().attr('id') == 'tooltip') {
			jQuery('#tooltip').slideUp(300).removeClass('answer');
			jQuery('.tooltip-bg').fadeOut(300);
		} else {
			jQuery('.popup').fadeOut(300).addClass('hide');
			jQuery('.black-bg, .size-bg, .add-size').fadeOut(300);
			jQuery('#tooltip').slideUp(300).removeClass('answer');
			if(jQuery(this).attr('class') == 'black-bg') {
				jQuery('#cookie').fadeOut(300);
			}
			jQuery('body').removeClass('fix');
			jQuery('.popup-box').removeClass('show');
		}
	}
	
	if(jQuery('.header-menu__box').hasClass('active')) {
		jQuery('.header-menu__box').removeClass('active');
	}	
	if(jQuery('.menu-btn').hasClass('active')) {
		jQuery('.menu-btn').removeClass('active');
	}
	if(jQuery('.menu-category__box a').hasClass('active')) {
		jQuery('.menu-category__box a').removeClass('active');	
	}	
});

jQuery(document).on('click', '.tooltip-bg', function(e) {
	e.preventDefault();
	jQuery('#tooltip').slideUp(300).removeClass('answer');
	jQuery(this).fadeOut(300);
});

jQuery(document).on('click', '.catalog-item__like-box button', function(e) {
	e.preventDefault();
	if(jQuery(this).hasClass('selected')) {
		jQuery(this).removeClass('selected');
		jQuery('#info-message').find('span').empty().html('Товар удален из избранного');
		jQuery('#info-message').show('slide', {direction: 'right'}, 300);
	} else {
		jQuery(this).addClass('selected');
		jQuery('#info-message').find('span').empty().html('Товар добавлен в избранное');
		jQuery('#info-message').show('slide', {direction: 'right'}, 300);
	}
	setTimeout(function() {
		jQuery('#info-message').fadeOut(500);
	}, 1500);
});

jQuery(document).on('click', '.catalog-item__delete-box button', function(e) {
	e.preventDefault();
	jQuery('#info-message').find('span').empty().html('Товар удален из корзины');
	jQuery('#info-message').show('slide', {direction: 'right'}, 300);

	setTimeout(function() {
		jQuery('#info-message').fadeOut(500);
	}, 1500);
});

jQuery(document).on('click', '.close-box', function(e) {
	e.preventDefault();
	jQuery('#info-message').fadeOut(500);
});

//Copy
jQuery(document).on('click', '#app-btn', function(e) {
	var temp = jQuery('#app-link');
	temp.select();
	document.execCommand('copy');
	jQuery('.app-download__box').fadeOut(300);
});

jQuery(document).on('click', '#app-download', function(e) {
	e.preventDefault();
	jQuery(this).prev().fadeToggle(300);
});

var inputs = jQuery('.filter-price__input input');
if(jQuery(inputs).length > 0) {
	if(jQuery(inputs).val() != '') {
		jQuery(inputs).parent().find('.delete-btn').stop().fadeIn(100);
	}		
}

jQuery(".filter-price__input .price").inputmask("currency",{
	"placeholder": "  ",
    groupSeparator: ' ',
    autoGroup: true,
	suffix: ' ₽',
	digits: 0,
    digitsOptional: false,
});

jQuery(".filter-price__input .number").inputmask("decimal",{
	"placeholder": "  ",
    groupSeparator: ' ',
    autoGroup: true,
    digits: 0,
    digitsOptional: false,
	radixPoint: '',
});

jQuery('.filter-price__input input').on('input', function() {
	jQuery(this).parent().find('.delete-btn').stop().fadeIn(100);
});

jQuery(document).on('click', '.delete-btn', function(e) {
	e.preventDefault();
	jQuery(this).parent().find('input').val('').focus();
	jQuery(this).stop().fadeOut(100);
});

//filter
var filter = jQuery('main .filters-box');
if(jQuery(filter).length > 0) {
	let lastScrollTop = 0;
	var filterBottom = jQuery('main .filters-box').offset().top + jQuery('main .filters-box').height() + 16;
	jQuery(window).on('scroll', function(event) {
		let st = jQuery(this).scrollTop();
		if (st < lastScrollTop && filterBottom < st){
			jQuery('.filters-header').slideDown(300);
			if(jQuery(window).width() < 1200) {	
				jQuery('#top').fadeIn(300);
			}
		} else {
			jQuery('.filters-header').slideUp(300);
			jQuery('#top').fadeOut(300);
		}
		lastScrollTop = st;
	});
}

//Top
jQuery(document).on('click', '#top', function(e) {
	jQuery('html, body').animate({
		scrollTop: jQuery('main').offset().top - 90
	}, 800);
});

//Link
jQuery(document).on('click', '[data-go]', function(e) {
	e.preventDefault();
	var link = jQuery(this).data('go');
	if(jQuery(window).width() < 1100) {
		jQuery('html, body').animate({
			scrollTop: jQuery('#'+link).offset().top - 80
		}, 1000);
	} else {
		jQuery('html, body').animate({
			scrollTop: jQuery('#'+link).offset().top - 130
		}, 1000);
	}
});

header();

//Mobile
if(jQuery(window).width() < 1200) {	
	// === МОБИЛЬНАЯ ГАЛЕРЕЯ ТОВАРА ===
	if(jQuery('.product-gallery').length > 0) {
		var $items = jQuery('.product-gallery__item');
		var $dots = jQuery('.product-gallery__nav-dot');
		var $counter = jQuery('.product-gallery__counter');
		var $prevArrow = jQuery('.product-gallery__arrow.prev');
		var $nextArrow = jQuery('.product-gallery__arrow.next');
		var current = 0;
		var total = $items.length;
		
		function showSlide(i) {
			if(i < 0) i = total - 1;
			if(i >= total) i = 0;
			$items.removeClass('active').eq(i).addClass('active');
			$dots.removeClass('active').eq(i).addClass('active');
			if($counter.length) $counter.text((i+1) + '/' + total);
			current = i;
		}
		
		// Клик по точкам
		$dots.on('click', function() {
			showSlide(jQuery(this).data('slide'));
		});
		
		// Стрелки
		$prevArrow.on('click', function() {
			showSlide(current - 1);
		});
		$nextArrow.on('click', function() {
			showSlide(current + 1);
		});
		
		// Свайпы
		jQuery(".product-gallery").swipe({
			swipeLeft:function(event, direction, distance, duration, fingerCount) {
				showSlide(current + 1);
			},
			swipeRight:function(event, direction, distance, duration, fingerCount) {
				showSlide(current - 1);
			},
			threshold:50
		});
	}
	// === /МОБИЛЬНАЯ ГАЛЕРЕЯ ТОВАРА ===
	
	//Product Slider (для каталога)
	var num = 1;		
	jQuery(".pages-slider").swipe({		
		swipeRight:function(event, direction, distance, duration, fingerCount) {				
			num--;
			if(num <= 0) {
				num = 1;
			}
			var link = jQuery(this).find('div[data-img=img'+num+']').data('img');
			jQuery(this).next().find(".item[data-id="+link+"]").addClass('open');
			jQuery(this).find('div').removeClass('current');
			jQuery(this).find('div[data-img=img'+num+']').addClass('current');

			jQuery(this).next().find(".item").removeClass('current');
			jQuery(this).next().find(".item[data-id="+link+"]").css({'opacity':'1'}).addClass('current');				
		},
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			var allItems = jQuery(this).find('div').length; 
			num++;
			if(allItems <= num) {
				num = allItems;
			}
			var link = jQuery(this).find('div[data-img=img'+num+']').data('img'); 
			jQuery(this).next().find(".item[data-id="+link+"]").addClass('open');
			jQuery(this).find('div').removeClass('current');
			jQuery(this).find('div[data-img=img'+num+']').addClass('current');

			jQuery(this).next().find(".item").removeClass('current');
			jQuery(this).next().find(".item[data-id="+link+"]").css({'opacity':'1'}).addClass('current');
		},
		threshold:0
	});
	
	//Menu
	jQuery(document).on('click', '.footer-top__column nav > ul > li > a', function(e) {
		e.preventDefault();
		if(jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery(this).parent().find('ul').slideUp(400);
		} else {
			jQuery('.footer-top__column nav > ul > li > a').removeClass('active');
			jQuery('.footer-top__column nav > ul > li > a').parent().find('ul').slideUp(400);
			jQuery(this).addClass('active');
			jQuery(this).parent().find('ul').slideDown(400);
		}
	});
	
	jQuery('#email, .filter-price__input input').on('input', function() {
		jQuery(this).parent().find('.delete-btn').stop().fadeIn(100);
	});
	
	//Basket
	jQuery(document).on('click', '.catalog-item__basket-box .action-btn', function(e) {
		e.preventDefault();
		jQuery(this).parents('.catalog-list').addClass('hover');
		jQuery(this).next().slideDown(200);
		jQuery(this).parent().addClass('hover');
		jQuery(this).parent().find('.size-bg').fadeIn(200);
	});
	
	jQuery(document).on('click', '.close-size, .size-bg', function(e) {
		e.preventDefault();
		jQuery('.add-size').slideUp(200);
		jQuery('.catalog-item__basket-box').removeClass('hover');
		jQuery('.size-bg').fadeOut(200);
		jQuery(this).parents('.catalog-list').removeClass('hover');
	});
	
	jQuery(document).on('click', '.add-size__box .btn', function(e) {
		e.preventDefault();
		jQuery(this).addClass('active');
	});
	
	//Menu
	jQuery(document).on('click', '.menu-btn', function(e) {
		e.preventDefault();
		jQuery('.app-banner').fadeOut(300).addClass('hide');
		jQuery('body').toggleClass('fix');
		jQuery('#menu-phone').fadeToggle(300);		
		jQuery('.header-menu__box').toggleClass('active');
		if(jQuery(this).hasClass('active')) {
			jQuery('.menu-btn').removeClass('active');
		} else {
			jQuery('.menu-btn').addClass('active');					
		}
	});
	
	jQuery(document).on('click', '.parent > a', function(e) {
		e.preventDefault();
		jQuery(this).next().show('slide', {direction: 'right'}, 300);
		var txt = jQuery(this).text();
		jQuery(this).parents('.popup-content').find('.popup-header h3').html('<div><i class="icon back-icon"></i></div>'+txt).addClass('back');
	});
	
	jQuery(document).on('click', '.back', function(e) {
		e.preventDefault();
		jQuery('.child-menu').fadeOut(0);
		if(jQuery(this).parents('#menu-phone').length > 0) {
			var txt = 'Меню';
		} else {
			var txt = 'Каталог';
		}
		jQuery(this).parents('.popup-content').find('.popup-header h3').html(txt).removeClass('back');
	});
	
	//Tooltip
	jQuery(document).on('click', '.tooltip', function(e) {
		e.preventDefault();
		var txt = jQuery(this).data('text');
		jQuery('#tooltip span').empty().html(txt);
		jQuery('.tooltip-bg').stop().fadeIn('fast');
		jQuery('#tooltip').slideDown('fast');	
	});
	
	jQuery(document).on('click', '.hidden:not(:has(.filter-price__box)) .filter-title', function(e) {
		e.preventDefault();
		if(jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery(this).next().hide('slide', {direction: 'right'}, 300);
		} else {
			jQuery('.filter-title').removeClass('active');
			jQuery(this).addClass('active');
			jQuery(this).next().show('slide', {direction: 'right'}, 300);
		}	
	});
	
	jQuery(document).on('click', '.filter-back', function(e) {
		e.preventDefault();
		jQuery(this).parents('.filter-item__list').hide('slide', {direction: 'right'}, 300);
		jQuery('.filter-title').removeClass('active');
	});
} else {
	//Tooltip
	jQuery(document).on('mouseenter', '.tooltip', function(e) {
		var txt = jQuery(this).data('text');
		jQuery('#tooltip span').empty().html(txt);
				
		var heightItem = jQuery(this).height(),
			widthBox = jQuery('#tooltip').width(),
			topItem = jQuery(this).offset().top + heightItem + 10,
			left = jQuery(this).offset().left;
		
		if (jQuery(this).hasClass('catalog-item__icon')) {
			jQuery('#tooltip').stop().css({'top':topItem,'left':left}).fadeIn('fast');
		} else if(jQuery(this).parents('.popup')) {
			jQuery('#tooltip').stop().css({'top':topItem,'left':left - 130}).fadeIn('fast');
		} else {
			jQuery('#tooltip').stop().css({'top':topItem,'left':left}).fadeIn('fast');
		}
	});
	
	jQuery(document).on('mouseleave', '.tooltip', function(e) {
		jQuery('#tooltip').stop().fadeOut('fast');	
	});
	
	//Basket
	jQuery(document).on('click', '.catalog-item__basket-box .action-btn', function(e) {
		e.preventDefault();
		jQuery(this).next().fadeIn(300);
	});
	
	jQuery(document).on('mouseleave', '.catalog-item', function(e) {
		jQuery('.add-size').fadeOut(300);
	});
	
	jQuery(document).on('click', '.add-size__box .btn', function(e) {
		e.preventDefault();
		jQuery(this).addClass('active');
	});
	
	//Menu
	jQuery(document).on('click', '.menu-btn', function(e) {
		e.preventDefault();
		jQuery('#menu').fadeToggle(300);		
		jQuery('#menu .black-bg, #menu-girl .black-bg, #menu-boy .black-bg').fadeToggle(300);
		jQuery('#menu-girl, #menu-boy').fadeOut(300);
		jQuery('.menu-category__box a').removeClass('active');	
		if(!jQuery(this).parent().hasClass('open')) {
			jQuery(this).parent().toggleClass('active');
			jQuery(this).toggleClass('active');			
		} else {
			jQuery(this).parent().removeClass('open');
			jQuery(this).addClass('active');	 
		}
	});
	
	jQuery('.menu-category__box a').mouseenter(function() {
		var link = jQuery(this).data('link');
		if(jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
		} else {
			jQuery('.menu-category__box a').removeClass('active');
			jQuery(this).addClass('active');
		}
		
		jQuery('.popup-menu').stop().fadeOut(300);
		jQuery('#'+link).stop().fadeIn(300);
		jQuery('.header-menu__box').addClass('active');
		jQuery('#'+link+' .black-bg').stop().fadeIn(300);
		jQuery('#menu .black-bg').stop().fadeOut(300);
		jQuery('#menu').stop().fadeOut(300);
		jQuery('.header-menu__box').addClass('open');
		jQuery('.menu-btn').removeClass('active');
	});
	
	jQuery('#menu-girl .black-bg, #menu-boy .black-bg').mouseenter(function() {
		jQuery('#menu-girl, #menu-boy').stop().fadeOut(300);
		jQuery('.header-menu__box').removeClass('active');	
		jQuery(this).removeClass('active');	
		jQuery('.menu-category__box a').removeClass('active');		
	});
	
	jQuery('.tab-menu').mouseenter(function() {
		var link = jQuery(this).data('link');
		jQuery(this).parent().parent().find('.menu-content').stop().fadeOut(0);
		jQuery('#'+link).fadeIn(0);
		if(!jQuery(this).hasClass('active')) {
			jQuery(this).parent().parent().find('.tab-menu').removeClass('active');
			jQuery(this).addClass('active');
		}
	});
	
	//Product Slider
	jQuery('.pages-slider div').hover(function() {
		var link = jQuery(this).data('img');
		jQuery(this).parent().parent().find(".item[data-id="+link+"]").addClass('open');
		jQuery(this).parent().find('div').removeClass('current');
		jQuery(this).addClass('current');	

		if(jQuery(this).parent().next().find('div').hasClass('current')) {	
			jQuery(this).parent().next().find('div').removeClass('current');
			jQuery(this).parent().next().find('div[data-id='+link+']').addClass('current');
		} else {
			jQuery(this).parent().next().find('div[data-id='+link+']').addClass('current');
		}
	}, function() {
		jQuery(this).parent().parent().find('.item').removeClass('open');
		jQuery(this).parent().parent().find('.item.current').css({'opacity':'1'});
		jQuery(this).removeClass('current');
	});
	
	jQuery('.pages-slider div').mouseleave(function() {
		jQuery(this).parent().find('div:first-child').addClass('current');
		jQuery(this).parent().next().find('div.current').removeClass('current');
		jQuery(this).parent().next().find('div:first-child').addClass('current');
	});
	
	jQuery(document).on('click', '.hidden .filter-title', function(e) {
		e.preventDefault();
		if(jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery(this).next().slideUp(300);
		} else {
			jQuery('.filter-title').removeClass('active');
			jQuery('.hidden .filter-item__list').slideUp(300);
			jQuery(this).addClass('active');
			jQuery(this).next().slideDown(300);
		}	
	});
}
});	

function header() {
	processing = false;
	let lastScrollTop = 10;		
	jQuery(document).ready(function() {		
		let st = jQuery(this).scrollTop();
		if (st > 0){
			jQuery('header').addClass('fixed');
		}
	});
	jQuery(window).on('scroll', function(event) {
		let st = jQuery(this).scrollTop();				
		if(jQuery(window).width() > 1100) {			
			if (st > 0) {
				jQuery('header').addClass('fixed');				
			} else {
				jQuery('header').removeClass('fixed');
			}
		} else {
			if (st > lastScrollTop && st > 10) {
				jQuery('header').removeClass('top').addClass('fixed down').css('transform', 'translateY(-120px)');
			} else if(st < 10) {
				jQuery('header').removeClass('top fixed');
			} else {
				jQuery('header').removeClass('down').addClass('fixed top').css('transform', 'translateY(0)');
			}
			lastScrollTop = st;
		}
	});
}