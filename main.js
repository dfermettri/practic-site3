document.addEventListener("DOMContentLoaded", () => {
  const q = (s, root = document) => root.querySelector(s);
  const qa = (s, root = document) => Array.from(root.querySelectorAll(s));

  // --- БАЗОВЫЕ ПОПАПЫ ---
  const hideAllPopups = () => {
    qa(".popup").forEach((p) => (p.style.display = "none"));
    // Скрываем все black-bg
    qa(".black-bg").forEach((bg) => (bg.style.display = "none"));
    document.body.classList.remove("fix");
  };

  document.addEventListener("click", (e) => {
    const headerMenuBtn = e.target.closest(".header-menu__box .menu-btn");
    if (headerMenuBtn) {
      e.preventDefault();
      const menu = q("#menu");
      const headerMenuBox = headerMenuBtn.closest(".header-menu__box");
      if (menu) {
        const isOpen = menu.style.display === "block";
        menu.style.display = isOpen ? "none" : "block";
        headerMenuBtn.classList.toggle("active", !isOpen);
        if (headerMenuBox) headerMenuBox.classList.toggle("active", !isOpen);
      }
      return;
    }

    const trigger = e.target.closest("[data-popup]");
    if (trigger) {
      const link = trigger.dataset.link;
      if (link) {
        e.preventDefault();
        hideAllPopups();
        const popup = q(`#${link}`);
        if (popup) {
          popup.style.display = "block";
          document.body.classList.add("fix");
          // Показываем black-bg для этого popup
          if (trigger.hasAttribute("data-bg")) {
            const black = q(`.black-bg[data-for="${link}"]`);
            if (black) black.style.display = "block";
          }
        }
      }
    }

    if (e.target.closest(".close, .black-bg, [data-close]")) {
      e.preventDefault();
      const menu = q("#menu");
      if (menu) menu.style.display = "none";
      qa(".header-menu__box").forEach((box) => box.classList.remove("active"));
      qa(".header-menu__box .menu-btn").forEach((btn) => btn.classList.remove("active"));
      hideAllPopups();
    }

    // клик по размерам (визуальное выделение)
    const sizeBtn = e.target.closest(
      ".add-size__box button.btn.btn-border, .product-item__size button.btn.btn-border, .catalog-item__size-box button.btn.btn-border"
    );
    if (sizeBtn) {
      const group =
        sizeBtn.closest(".add-size__box") ||
        sizeBtn.closest(".product-item__size") ||
        sizeBtn.closest(".catalog-item__size-box") ||
        sizeBtn.parentElement;
      if (group) {
        qa("button.btn.btn-border", group).forEach((b) => b.classList.remove("active"));
      }
      sizeBtn.classList.add("active");
    }
  });

  // --- ПРОСТОЙ СЛАЙДЕР БЕЗ БЕСКОНЕЧНОГО ЦИКЛА ---
  const initLoopSlider = (root) => {
    const wrapper = q(".swiper-wrapper", root);
    const slides = qa(".swiper-slide", root);
    if (!wrapper || slides.length <= 1) return;

    let offsets = [];
    let maxTranslate = 0;
    let currentTranslate = 0;
    let isAnimating = false;
    const nextBtn = q(".swiper-button-next", root);
    const prevBtn = q(".swiper-button-prev", root);

    const applyTranslate = (value, withAnimation = true) => {
      const clamped = Math.max(0, Math.min(value, maxTranslate));
      currentTranslate = clamped;
      wrapper.style.transition = withAnimation ? "transform 0.4s ease" : "none";
      wrapper.style.transform = `translateX(${-currentTranslate}px)`;
    };

    const recalc = () => {
      if (!slides.length) return;
      offsets = slides.map((slide) => slide.offsetLeft);
      maxTranslate = Math.max(0, wrapper.scrollWidth - root.clientWidth);
      applyTranslate(currentTranslate, false);
      // форсим перерисовку
      void wrapper.offsetHeight;
      wrapper.style.transition = "transform 0.4s ease";
      updateButtons();
    };

    const updateButtons = () => {
      if (prevBtn) prevBtn.classList.toggle("swiper-button-disabled", currentTranslate <= 0);
      if (nextBtn) nextBtn.classList.toggle("swiper-button-disabled", currentTranslate >= maxTranslate);
    };

    const goToTranslate = (nextTranslate) => {
      if (isAnimating) return;
      const clamped = Math.max(0, Math.min(nextTranslate, maxTranslate));
      if (Math.abs(clamped - currentTranslate) < 1) return;
      isAnimating = true;
      applyTranslate(clamped, true);
    };

    const getNextTranslate = () => {
      const target = offsets.find((v) => v > currentTranslate + 1);
      return target !== undefined ? target : maxTranslate;
    };

    const getPrevTranslate = () => {
      for (let i = offsets.length - 1; i >= 0; i -= 1) {
        if (offsets[i] < currentTranslate - 1) return offsets[i];
      }
      return 0;
    };

    const onTransitionEnd = () => {
      isAnimating = false;
      updateButtons();
    };

    recalc();

    nextBtn &&
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!offsets.length) recalc();
        goToTranslate(getNextTranslate());
      });
    prevBtn &&
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!offsets.length) recalc();
        goToTranslate(getPrevTranslate());
      });

    wrapper.addEventListener("transitionend", onTransitionEnd);
    window.addEventListener("resize", recalc);
    onTransitionEnd();
  };

  qa(".swiper.slider-home, .swiper.slider-hit, .swiper.slider-catalog, .swiper.slider-product, .swiper.reviews-slider, .swiper.slider-similar, .swiper.slider-like").forEach(
    (root) => initLoopSlider(root)
  );

  // --- МОБИЛЬНАЯ ГАЛЕРЕЯ ТОВАРА ---
  const initProductGallery = () => {
    const gallery = document.querySelector(".product-gallery");
    if (!gallery) return;

    const items = Array.from(gallery.querySelectorAll(".product-gallery__item"));
    if (items.length <= 1) return;

    // Убираем active у всех и ставим на первую
    items.forEach((item) => item.classList.remove("active"));
    items[0].classList.add("active");

    let currentIndex = 0;

    // Создаем сегменты
    const segmentsContainer = document.createElement("div");
    segmentsContainer.className = "product-gallery__segments";
    items.forEach((_, index) => {
      const segment = document.createElement("div");
      segment.className = `product-gallery__segment${index === 0 ? " active" : ""}`;
      segment.addEventListener("click", () => {
        currentIndex = index;
        showItem(currentIndex);
      });
      segmentsContainer.appendChild(segment);
    });
    gallery.parentNode.insertBefore(segmentsContainer, gallery.nextSibling);

    const showItem = (index) => {
      items.forEach((item, i) => {
        item.classList.toggle("active", i === index);
      });
      // Обновляем сегменты
      const segments = Array.from(segmentsContainer.querySelectorAll(".product-gallery__segment"));
      segments.forEach((seg, i) => {
        seg.classList.toggle("active", i === index);
      });
    };

    items.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        currentIndex = (index + 1) % items.length;
        showItem(currentIndex);
      });
    });
  };

  initProductGallery();

  // --- DESKTOP: "ХОРОШО СОЧЕТАЕТСЯ С" ПОД БЛОКОМ ССЫЛОК ТОВАРА ---
  const sliderProductBox = document.querySelector(".slider-product__box");
  const productInfoBlock = document.querySelector(".product-info__block");
  const productItemLinks = productInfoBlock?.querySelector(".product-item__links");
  const sliderOriginalParent = sliderProductBox?.parentNode || null;
  const sliderOriginalNextSibling = sliderProductBox?.nextSibling || null;
  const desktopMedia = window.matchMedia("(min-width: 1201px)");

  const placeSliderByViewport = () => {
    if (!sliderProductBox || !productInfoBlock || !productItemLinks || !sliderOriginalParent) return;
    let didMoveSlider = false;

    if (desktopMedia.matches) {
      if (sliderProductBox.parentNode !== productInfoBlock) {
        productInfoBlock.insertBefore(sliderProductBox, productItemLinks.nextSibling);
        didMoveSlider = true;
      }
    } else if (sliderProductBox.parentNode !== sliderOriginalParent) {
      if (sliderOriginalNextSibling && sliderOriginalNextSibling.parentNode === sliderOriginalParent) {
        sliderOriginalParent.insertBefore(sliderProductBox, sliderOriginalNextSibling);
      } else {
        sliderOriginalParent.appendChild(sliderProductBox);
      }
      didMoveSlider = true;
    }

    if (didMoveSlider) {
      // initLoopSlider пересчитывает геометрию на resize,
      // поэтому после переноса блока триггерим пересчет сразу.
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  };

  placeSliderByViewport();
  if (desktopMedia.addEventListener) {
    desktopMedia.addEventListener("change", placeSliderByViewport);
  } else if (desktopMedia.addListener) {
    desktopMedia.addListener(placeSliderByViewport);
  }

  // --- ШТОРКА ITEM-COMPONENTS ---
  const itemComponents = document.querySelector(".item-components");
  const itemComponentRight = document.querySelector(".item-component-right");
  const tooltip = document.querySelector(".item-components-tooltip");
  const overlay = document.querySelector(".item-components-tooltip-overlay");
  const hitSection = document.querySelector("#hit");
  if (itemComponents && tooltip && overlay) {
    const openTooltip = () => {
      tooltip.classList.add("active");
      overlay.classList.add("active");
    };
    const closeTooltip = () => {
      tooltip.classList.remove("active");
      overlay.classList.remove("active");
    };

    itemComponents.addEventListener("click", (e) => {
      e.stopPropagation();
      openTooltip();
    });

    tooltip.querySelector(".item-components-tooltip__close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTooltip();
    });

    overlay.addEventListener("click", closeTooltip);

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".item-components-tooltip") && !e.target.closest(".item-components")) {
        closeTooltip();
      }
    });
  }

  if (itemComponentRight && hitSection) {
    itemComponentRight.addEventListener("click", (e) => {
      e.preventDefault();
      hitSection.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // --- DESKTOP SCROLL TO TOP BUTTON ---
  const scrollTopBtn = document.querySelector(".scroll-top-btn");
  if (scrollTopBtn) {
    const desktopMedia = window.matchMedia("(min-width: 1201px)");
    const toggleScrollTopBtn = () => {
      const shouldShow = desktopMedia.matches && window.scrollY > 120;
      scrollTopBtn.classList.toggle("visible", shouldShow);
    };

    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleScrollTopBtn, { passive: true });
    window.addEventListener("resize", toggleScrollTopBtn);
    toggleScrollTopBtn();
  }

  // --- STICKY BOTTOM BAR ---
  const stickyBar = document.querySelector(".sticky-bottom-bar");
  const tabber = document.querySelector(".tabber-menu__box");
  const header = document.querySelector(".page-header");
  const footerBottomBox = document.querySelector(".footer-bottom__box");
  const body = document.body;
  if (stickyBar) {
    const tabberInitialParent = tabber?.parentNode || null;
    const tabberInitialNextSibling = tabber?.nextSibling || null;

    const moveTabberAfterFooter = () => {
      if (!tabber || !footerBottomBox || tabber.classList.contains("at-footer")) return;
      footerBottomBox.insertAdjacentElement("afterend", tabber);
      tabber.classList.add("at-footer");
      body.classList.add("tabber-at-footer");
    };

    const restoreTabberPosition = () => {
      if (!tabber || !tabberInitialParent || !tabber.classList.contains("at-footer")) return;
      if (tabberInitialNextSibling && tabberInitialNextSibling.parentNode === tabberInitialParent) {
        tabberInitialParent.insertBefore(tabber, tabberInitialNextSibling);
      } else {
        tabberInitialParent.appendChild(tabber);
      }
      tabber.classList.remove("at-footer");
      body.classList.remove("tabber-at-footer");
    };

    let lastScrollY = window.scrollY;
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const doc = document.documentElement;
          const isAtPageBottom = currentScrollY + window.innerHeight >= doc.scrollHeight - 80;
          const isFooterVisible = footerBottomBox
            ? footerBottomBox.getBoundingClientRect().top <= window.innerHeight
            : false;
          const shouldAttachTabberToFooter = isAtPageBottom || isFooterVisible;

          if (shouldAttachTabberToFooter) {
            tabber?.classList.remove("hidden");
            moveTabberAfterFooter();
            body.classList.add("tabber-at-footer");
            stickyBar.classList.remove("active");
            stickyBar.classList.remove("above-tabber");
            lastScrollY = currentScrollY;
            ticking = false;
            return;
          } else {
            restoreTabberPosition();
            body.classList.remove("tabber-at-footer");
          }

          // Sticky bar
          if (currentScrollY > 400) {
            stickyBar.classList.add("active");
          } else {
            stickyBar.classList.remove("active");
            stickyBar.classList.remove("above-tabber");
          }
          // Scroll direction
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            tabber?.classList.add("hidden");
            header?.classList.add("hidden");
            stickyBar.classList.remove("above-tabber");
          } else {
            // Scrolling up
            tabber?.classList.remove("hidden");
            header?.classList.remove("hidden");
            if (stickyBar.classList.contains("active")) {
              stickyBar.classList.add("above-tabber");
            }
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
    window.dispatchEvent(new Event("scroll"));
  }
});
