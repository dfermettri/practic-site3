document.addEventListener("DOMContentLoaded", () => {
  const q = (s, root = document) => root.querySelector(s);
  const qa = (s, root = document) => Array.from(root.querySelectorAll(s));

  // --- БАЗОВЫЕ ПОПАПЫ ---
  const hideAllPopups = () => {
    qa(".popup").forEach((p) => (p.style.display = "none"));
    const black = q(".black-bg");
    if (black) black.style.display = "none";
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
      const isSizeBtn = trigger.classList.contains("btn-border") && link === "add-item";
      if (!isSizeBtn && link) {
        e.preventDefault();
        hideAllPopups();
        const popup = q(`#${link}`);
        if (popup) {
          popup.style.display = "block";
          document.body.classList.add("fix");
          if (trigger.hasAttribute("data-bg")) {
            const black = q(".black-bg");
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

    // клик по размерам
    const sizeBtn = e.target.closest("button.btn.btn-border[data-link='add-item']");
    if (sizeBtn) {
      e.preventDefault();
      const group =
        sizeBtn.closest(".add-size__box") ||
        sizeBtn.closest(".product-item__size") ||
        sizeBtn.closest(".catalog-item__size-box") ||
        sizeBtn.parentElement;
      if (group) {
        qa("button.btn.btn-border[data-link='add-item']", group).forEach((b) =>
          b.classList.remove("active")
        );
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
});
