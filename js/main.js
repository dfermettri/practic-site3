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

  // --- ПРОСТОЙ СЛАЙДЕР С БЕСКОНЕЧНЫМ ЛИСТАНИЕМ ---
  const initLoopSlider = (root) => {
    const wrapper = q(".swiper-wrapper", root);
    let slides = qa(".swiper-slide", root);
    if (!wrapper || slides.length <= 1) return;

    // клоны для визуального бесконечного цикла
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    wrapper.insertBefore(lastClone, slides[0]);
    wrapper.appendChild(firstClone);

    slides = qa(".swiper-slide", root);

    let index = 1; // начинаем с первого «настоящего» слайда
    let offsets = [];
    let isAnimating = false;

    const recalc = () => {
      if (!slides.length) return;
      offsets = slides.map((slide) => slide.offsetLeft);
      wrapper.style.transition = "none";
      wrapper.style.transform = `translateX(${-offsets[index]}px)`;
      // форсим перерисовку
      void wrapper.offsetHeight;
      wrapper.style.transition = "transform 0.4s ease";
    };

    const goTo = (i) => {
      if (!offsets.length || isAnimating) return;
      isAnimating = true;
      index = i;
      wrapper.style.transition = "transform 0.4s ease";
      wrapper.style.transform = `translateX(${-offsets[index]}px)`;
    };

    const shiftToRealSlide = () => {
      if (!offsets.length) return;
      if (index === 0) {
        index = slides.length - 2;
        wrapper.style.transition = "none";
        wrapper.style.transform = `translateX(${-offsets[index]}px)`;
      } else if (index === slides.length - 1) {
        index = 1;
        wrapper.style.transition = "none";
        wrapper.style.transform = `translateX(${-offsets[index]}px)`;
      }
      isAnimating = false;
    };

    recalc();

    const nextBtn = q(".swiper-button-next", root);
    const prevBtn = q(".swiper-button-prev", root);

    nextBtn &&
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!offsets.length) recalc();
        goTo(index + 1);
      });
    prevBtn &&
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!offsets.length) recalc();
        goTo(index - 1);
      });

    wrapper.addEventListener("transitionend", shiftToRealSlide);
    window.addEventListener("resize", recalc);
  };

  qa(".swiper.slider-home, .swiper.slider-hit, .swiper.slider-catalog, .swiper.slider-product, .swiper.reviews-slider, .swiper.slider-similar, .swiper.slider-like").forEach(
    (root) => initLoopSlider(root)
  );
});
