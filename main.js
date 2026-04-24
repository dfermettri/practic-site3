const DESKTOP_MEDIA_QUERY = "(min-width: 1201px)";
const CLASS_OPEN = "is-open";
const CLASS_VISIBLE = "is-visible";

function initInfoMessage({ q }) {
  const infoMessage = q("#info-message");
  const infoMessageText = q("#info-message span");
  const infoMessageClose = q("#info-message .close-box");
  let infoMessageTimer = null;

  const hideInfoMessage = () => {
    if (!infoMessage) return;
    infoMessage.classList.remove(CLASS_VISIBLE);
    if (infoMessageTimer) {
      window.clearTimeout(infoMessageTimer);
      infoMessageTimer = null;
    }
  };

  const showInfoMessage = (message) => {
    if (!infoMessage || !infoMessageText) return;
    infoMessageText.textContent = message;
    infoMessage.classList.add(CLASS_VISIBLE);
    if (infoMessageTimer) {
      window.clearTimeout(infoMessageTimer);
    }
    infoMessageTimer = window.setTimeout(() => {
      hideInfoMessage();
    }, 3000);
  };

  infoMessageClose?.addEventListener("click", hideInfoMessage);

  return { hideInfoMessage, showInfoMessage };
}

function initPopupSystem({ q, qa }) {
  const closeHeaderMenu = () => {
    const menu = q("#menu");
    if (menu) menu.classList.remove(CLASS_OPEN);
    qa(".header-menu__box").forEach((box) => box.classList.remove("active"));
    qa(".header-menu__box .menu-btn").forEach((btn) => btn.classList.remove("active"));
  };

  const closeAllPopups = () => {
    qa(".popup").forEach((popup) => popup.classList.remove(CLASS_OPEN));
    qa(".black-bg").forEach((bg) => bg.classList.remove(CLASS_OPEN));
    document.body.classList.remove("fix");
  };

  const openPopup = (link, withBackdrop = false) => {
    closeAllPopups();
    if (!link) return false;

    const popup = q(`#${link}`);
    if (!popup) return false;

    popup.classList.add(CLASS_OPEN);
    document.body.classList.add("fix");

    if (withBackdrop) {
      const black = q(`.black-bg[data-for="${link}"]`);
      black?.classList.add(CLASS_OPEN);
    }

    return true;
  };

  const toggleHeaderMenu = (headerMenuBtn) => {
    const menu = q("#menu");
    if (!menu) return;

    const headerMenuBox = headerMenuBtn.closest(".header-menu__box");
    const shouldOpen = !menu.classList.contains(CLASS_OPEN);

    menu.classList.toggle(CLASS_OPEN, shouldOpen);
    headerMenuBtn.classList.toggle("active", shouldOpen);
    headerMenuBox?.classList.toggle("active", shouldOpen);
  };

  return {
    closeAllPopups,
    closeHeaderMenu,
    openPopup,
    toggleHeaderMenu,
  };
}

function initFavoriteCounter({ qa }) {
  const favoriteCounters = qa(".favorite-num__box");

  const updateFavoriteCounter = () => {
    if (!favoriteCounters.length) return;
    const count = qa(".catalog-item__like-box button.selected, .sticky-bottom-bar__like-btn.selected").length;
    favoriteCounters.forEach((favoriteCounter) => {
      favoriteCounter.textContent = String(count);
      favoriteCounter.classList.toggle("visible", count > 0);
    });
  };

  return { updateFavoriteCounter };
}

function initCartSystem({ q, qa, popupSystem }) {
  const cartItems = [];
  const addItemPopupTitle = q("#add-item .popup-header h3");
  const addItemList = q("#add-item .basket-list");
  const addItemGoToBasketBtn = q("#add-item .popup-scroll > .btn.btn-border");
  const basketHeaderText = q("#basket .popup-header .popup-txt__box");
  const basketPopupScroll = q("#basket .popup-content__box .popup-scroll");
  const defaultBasketImage = q("#add-item .basket-item__pic img");
  const cartCounters = qa(".cart-num__box");
  const fallbackImageSrc = defaultBasketImage?.getAttribute("src") || "";
  const fallbackImageAlt = defaultBasketImage?.getAttribute("alt") || "";
  const basketEmptyText = basketHeaderText?.textContent.trim() || "В корзине пока нет товаров.";
  const basketEmptyContent = basketPopupScroll?.innerHTML || "";

  const COLOR_NAME_MAP = {
    black: "Черный",
    grey: "Серый",
    gray: "Серый",
    pink: "Розовый",
    blue: "Синий",
    green: "Зеленый",
    beige: "Бежевый",
    white: "Белый",
    brown: "Коричневый",
    burgundy: "Бордовый",
    red: "Красный",
    purple: "Пурпурный",
    orange: "Оранжевый",
    violet: "Фиолетовый",
    yellow: "Желтый",
    "light-blue": "Голубой",
  };

  const normalizeText = (value = "") => value.replace(/\s+/g, " ").trim();
  const getText = (selector, root = document) => normalizeText(q(selector, root)?.textContent || "");
  const escapeHtml = (value = "") =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const formatPrice = (price) => `${new Intl.NumberFormat("ru-RU").format(price)}<span class="rub">₽</span>`;
  const parsePriceValue = (priceHtml = "") => {
    const numeric = priceHtml.replace(/[^\d]/g, "");
    return numeric ? Number(numeric) : 0;
  };
  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getItemsNoun = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return "товар";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
    return "товаров";
  };

  const getColorDataFromDot = (colorDot) => {
    if (!colorDot) return { colorLabel: "", colorStyle: "" };
    const colorClass = Array.from(colorDot.classList).find((className) => !["catalog-item__color", "active"].includes(className));
    const colorLabel =
      COLOR_NAME_MAP[colorClass] ||
      (colorClass ? `${colorClass.charAt(0).toUpperCase()}${colorClass.slice(1).replace("-", " ")}` : "");
    return {
      colorLabel,
      colorStyle: window.getComputedStyle(colorDot).backgroundColor,
    };
  };

  const getCardProductData = (card, forcedSize = "") => {
    if (!card) return null;
    const image = q(".items-slider .item.current img", card) || q(".items-slider img", card) || q("img", card);
    const title = getText(".catalog-item__txt-box > a", card) || normalizeText(image?.getAttribute("alt") || "");
    const priceNode = q(".catalog-item__price-new", card) || q(".catalog-item__price h3", card);
    const oldPriceNode = q(".catalog-item__price-old", card);
    const colorDot = q(".catalog-item__colors-list .catalog-item__color.active", card) || q(".catalog-item__colors-list .catalog-item__color", card);
    const { colorLabel, colorStyle } = getColorDataFromDot(colorDot);
    const size = normalizeText(forcedSize) || getText(".add-size__box .btn.active", card) || "—";
    return {
      title,
      imageSrc: image?.getAttribute("src") || fallbackImageSrc,
      imageAlt: image?.getAttribute("alt") || fallbackImageAlt,
      priceHtml: priceNode?.innerHTML?.trim() || "",
      oldPriceHtml: oldPriceNode?.innerHTML?.trim() || "",
      colorLabel,
      colorStyle,
      size,
    };
  };

  const getMainProductData = () => {
    const image = q(".product-gallery__item.active img") || q(".product-gallery__item img");
    const priceNode = q(".item-price__box .catalog-item__price h3");
    const oldPriceNode = q(".item-price__box .catalog-item__price-old");
    const colorLabel = getText(".product-item__color .product-select__box span");
    const colorDot = q(".desktop-sticky-add__color .catalog-item__color");
    const colorStyle = colorDot ? window.getComputedStyle(colorDot).backgroundColor : "";
    const selectedSizeBtn = q(".product-item__size .add-size__box .btn.active");
    const size = normalizeText(selectedSizeBtn?.textContent || "") || getText(".product-item__size .product-select__box span") || "—";

    return {
      title: getText(".product-info__title h1"),
      imageSrc: image?.getAttribute("src") || fallbackImageSrc,
      imageAlt: image?.getAttribute("alt") || fallbackImageAlt,
      priceHtml: priceNode?.innerHTML?.trim() || "",
      oldPriceHtml: oldPriceNode?.innerHTML?.trim() || "",
      colorLabel,
      colorStyle,
      size,
    };
  };

  const getItemKey = ({ title, size, colorLabel, priceHtml }) =>
    `${normalizeText(title)}::${normalizeText(size)}::${normalizeText(colorLabel)}::${normalizeText(priceHtml)}`;

  const buildCartItemHtml = (item) => {
    const colorHtml = item.colorLabel
      ? `<div class="basket-color flex"><div class="item-color" style="background:${escapeHtml(item.colorStyle || "#ccc")}"></div><span>${escapeHtml(
          item.colorLabel
        )}</span></div>`
      : "";
    const oldPriceHtml = item.oldPriceHtml ? `<div class="basket-price__old">${item.oldPriceHtml}</div>` : "";

    return `
      <div class="basket-item flex" data-cart-key="${encodeURIComponent(item.key)}">
        <div class="basket-item__pic"><a href="#"><img src="${escapeHtml(item.imageSrc)}" alt="${escapeHtml(item.imageAlt)}" loading="lazy" /></a></div>
        <div class="basket-item__txt">
          <div class="basket-item__left">
            <a href="#"><h4>${escapeHtml(item.title)}</h4></a>
            <div class="flex fav-actions">
              ${colorHtml}
              <div class="basket-size">${escapeHtml(item.size)}</div>
              <div class="basket-quantity">${item.quantity} шт</div>
            </div>
          </div>
          <div class="basket-item__price-box flex">
            <div class="basket-item__right flex">
              <div class="basket-price__box flex">
                <div class="basket-price">${item.priceHtml}</div>
                ${oldPriceHtml}
              </div>
            </div>
            <div class="basket-item__actions flex">
              <div class="catalog-item__delete-box">
                <button class="action-btn" type="button" aria-label="Удалить товар" data-cart-remove="${encodeURIComponent(item.key)}">
                  <i class="icon remove-icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderAddItemPopup = () => {
    if (!addItemList) return;
    addItemList.innerHTML = cartItems.map((item) => buildCartItemHtml(item)).join("");
    if (addItemPopupTitle) {
      addItemPopupTitle.textContent = cartItems.length ? "Товар добавлен в корзину" : "Корзина";
    }
    if (addItemGoToBasketBtn) {
      addItemGoToBasketBtn.style.display = cartItems.length ? "" : "none";
    }
  };

  const renderBasketPopup = () => {
    if (!basketPopupScroll) return;
    if (!cartItems.length) {
      if (basketHeaderText) basketHeaderText.textContent = basketEmptyText;
      basketPopupScroll.innerHTML = basketEmptyContent;
      return;
    }

    const totalItems = getTotalItems();
    const totalPrice = cartItems.reduce((sum, item) => sum + parsePriceValue(item.priceHtml) * item.quantity, 0);
    if (basketHeaderText) {
      basketHeaderText.textContent = `В корзине ${totalItems} ${getItemsNoun(totalItems)}`;
    }
    basketPopupScroll.innerHTML = `
      <div class="basket-list">
        ${cartItems.map((item) => buildCartItemHtml(item)).join("")}
      </div>
      <div class="popup-btns__box popup-btns__filter">
        <div class="basket-total__box flex">
          <span>Итого</span>
          <strong>${formatPrice(totalPrice)}</strong>
        </div>
        <a href="#" class="btn">Оформить заказ</a>
      </div>
    `;
  };

  const renderCart = () => {
    const totalItems = getTotalItems();
    if (cartCounters.length) {
      cartCounters.forEach((counter) => {
        counter.textContent = String(totalItems);
        counter.classList.toggle("visible", totalItems > 0);
      });
    }
    renderAddItemPopup();
    renderBasketPopup();
  };

  const addToCart = (itemData) => {
    if (!itemData || !itemData.title || !itemData.priceHtml) return false;
    const normalizedItem = {
      title: normalizeText(itemData.title),
      imageSrc: itemData.imageSrc || fallbackImageSrc,
      imageAlt: itemData.imageAlt || itemData.title || fallbackImageAlt,
      priceHtml: normalizeText(itemData.priceHtml),
      oldPriceHtml: normalizeText(itemData.oldPriceHtml || ""),
      colorLabel: normalizeText(itemData.colorLabel || ""),
      colorStyle: normalizeText(itemData.colorStyle || ""),
      size: normalizeText(itemData.size || "—"),
      quantity: 1,
    };
    normalizedItem.key = getItemKey(normalizedItem);

    const existingItem = cartItems.find((item) => item.key === normalizedItem.key);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.unshift(normalizedItem);
    }
    renderCart();
    return true;
  };

  const removeCartItem = (itemKey) => {
    const itemIndex = cartItems.findIndex((item) => item.key === itemKey);
    if (itemIndex === -1) return;
    cartItems.splice(itemIndex, 1);
    renderCart();
    if (!cartItems.length) {
      popupSystem.openPopup("basket", true);
    }
  };

  const addItemFromCard = (card, forcedSize = "") => addToCart(getCardProductData(card, forcedSize));

  const addItemFromTrigger = (trigger) => {
    if (!trigger) return false;
    const card = trigger.closest(".catalog-item");
    if (card) {
      return addItemFromCard(card);
    }

    if (
      trigger.closest(".product-item__add-btn") ||
      trigger.closest(".sticky-bottom-bar") ||
      trigger.closest(".desktop-sticky-add") ||
      trigger.closest(".product-info__block")
    ) {
      return addToCart(getMainProductData());
    }

    return false;
  };

  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-cart-remove]");
    if (!removeBtn) return;
    e.preventDefault();
    const encodedKey = removeBtn.dataset.cartRemove || "";
    if (!encodedKey) return;
    removeCartItem(decodeURIComponent(encodedKey));
  });

  addItemGoToBasketBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    popupSystem.openPopup("basket", true);
  });

  renderCart();

  return {
    addItemFromCard,
    addItemFromTrigger,
  };
}

function initGlobalClickDelegation({ q, qa, popupSystem, showInfoMessage, updateFavoriteCounter, cartSystem }) {
  const closeCardSizeSelectors = (exceptBox = null) => {
    qa(".catalog-item__basket-box.hover").forEach((basketBox) => {
      if (exceptBox && basketBox === exceptBox) return;
      basketBox.classList.remove("hover");
      const addSizePanel = q(".add-size", basketBox);
      if (addSizePanel) {
        addSizePanel.style.display = "none";
      }
    });
  };

  const openCardSizeSelector = (basketBox) => {
    const addSizePanel = basketBox ? q(".add-size", basketBox) : null;
    if (!basketBox || !addSizePanel) return false;
    closeCardSizeSelectors(basketBox);
    basketBox.classList.add("hover");
    addSizePanel.style.display = "block";
    return true;
  };

  document.addEventListener("click", (e) => {
    const cardSizeCloseBtn = e.target.closest(".catalog-item__basket-box .add-size .close, .catalog-item__basket-box .add-size .close-size");
    if (cardSizeCloseBtn) {
      e.preventDefault();
      closeCardSizeSelectors();
      return;
    }

    const headerMenuBtn = e.target.closest(".header-menu__box .menu-btn");
    if (headerMenuBtn) {
      e.preventDefault();
      popupSystem.toggleHeaderMenu(headerMenuBtn);
      return;
    }

    const trigger = e.target.closest("[data-popup]");
    if (trigger) {
      const link = trigger.dataset.link;
      if (link) {
        e.preventDefault();
        closeCardSizeSelectors();
        if (link === "add-item") {
          cartSystem?.addItemFromTrigger(trigger);
        }
        popupSystem.openPopup(link, trigger.hasAttribute("data-bg"));
      }
    }

    if (e.target.closest(".close, .black-bg, [data-close]")) {
      e.preventDefault();
      closeCardSizeSelectors();
      popupSystem.closeHeaderMenu();
      popupSystem.closeAllPopups();
      return;
    }

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
        qa("button.btn.btn-border", group).forEach((btn) => btn.classList.remove("active"));
      }
      sizeBtn.classList.add("active");

      const productSizeBlock = sizeBtn.closest(".product-item__size");
      if (productSizeBlock) {
        const productSizeLabel = q(".product-select__box span", productSizeBlock);
        if (productSizeLabel) {
          productSizeLabel.textContent = sizeBtn.textContent.trim();
        }
      }
    }

    const cardColorDot = e.target.closest(".catalog-item__colors-list .catalog-item__color");
    if (cardColorDot) {
      const catalogItem = cardColorDot.closest(".catalog-item");
      if (!catalogItem) return;

      const sourceList = cardColorDot.closest(".catalog-item__colors-list");
      const sourceDots = sourceList ? qa(".catalog-item__color", sourceList) : [];
      const sourceIndex = sourceDots.indexOf(cardColorDot);
      const colorClass = Array.from(cardColorDot.classList).find((className) => !["catalog-item__color", "active"].includes(className));

      qa(".catalog-item__colors-list", catalogItem).forEach((colorsList) => {
        const dots = qa(".catalog-item__color", colorsList);
        if (!dots.length) return;

        dots.forEach((dot) => dot.classList.remove("active"));

        const matchedByColor = colorClass ? dots.find((dot) => dot.classList.contains(colorClass)) : null;
        const fallbackByIndex = sourceIndex >= 0 ? dots[sourceIndex] : null;
        const targetDot = matchedByColor || fallbackByIndex || dots[0];
        targetDot.classList.add("active");
      });

      return;
    }

    const cardBasketBtn = e.target.closest(".catalog-item__basket-box .action-btn");
    if (cardBasketBtn) {
      e.preventDefault();
      const basketBox = cardBasketBtn.closest(".catalog-item__basket-box");
      const addSizePanel = basketBox ? q(".add-size", basketBox) : null;
      if (addSizePanel) {
        if (basketBox.classList.contains("hover")) {
          closeCardSizeSelectors();
        } else {
          openCardSizeSelector(basketBox);
        }
      } else {
        const card = cardBasketBtn.closest(".catalog-item");
        cartSystem?.addItemFromCard(card);
        popupSystem.openPopup("add-item", true);
      }
      return;
    }

    const cardSizeBtn = e.target.closest(".catalog-item__basket-box .add-size .btn.btn-border");
    if (cardSizeBtn) {
      e.preventDefault();
      const card = cardSizeBtn.closest(".catalog-item");
      const selectedSize = cardSizeBtn.textContent.trim();
      cartSystem?.addItemFromCard(card, selectedSize);
      closeCardSizeSelectors();
      popupSystem.openPopup("add-item", true);
      return;
    }

    const favoriteBtn = e.target.closest(".catalog-item__like-box button, .sticky-bottom-bar__like-btn");
    if (favoriteBtn) {
      const likeIcon = q(".like-icon", favoriteBtn);
      if (!likeIcon) return;

      e.preventDefault();
      closeCardSizeSelectors();
      const isSelected = favoriteBtn.classList.toggle("selected");
      favoriteBtn.setAttribute("aria-pressed", String(isSelected));
      updateFavoriteCounter();
      showInfoMessage(isSelected ? "Товар добавлен в избранное" : "Товар удален из избранного");
      return;
    }

    if (!e.target.closest(".catalog-item__basket-box .add-size")) {
      closeCardSizeSelectors();
    }
  });
}

function initLoopSlider(root, { q, qa }) {
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

  const updateButtons = () => {
    if (prevBtn) prevBtn.classList.toggle("swiper-button-disabled", currentTranslate <= 0);
    if (nextBtn) nextBtn.classList.toggle("swiper-button-disabled", currentTranslate >= maxTranslate);
  };

  const recalc = () => {
    if (!slides.length) return;
    offsets = slides.map((slide) => slide.offsetLeft);
    maxTranslate = Math.max(0, wrapper.scrollWidth - root.clientWidth);
    applyTranslate(currentTranslate, false);
    // Force reflow before restoring transition.
    void wrapper.offsetHeight;
    wrapper.style.transition = "transform 0.4s ease";
    updateButtons();
  };

  const goToTranslate = (nextTranslate) => {
    if (isAnimating) return;
    const clamped = Math.max(0, Math.min(nextTranslate, maxTranslate));
    if (Math.abs(clamped - currentTranslate) < 1) return;
    isAnimating = true;
    applyTranslate(clamped, true);
  };

  const getNextTranslate = () => {
    const target = offsets.find((value) => value > currentTranslate + 1);
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

  nextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!offsets.length) recalc();
    goToTranslate(getNextTranslate());
  });

  prevBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!offsets.length) recalc();
    goToTranslate(getPrevTranslate());
  });

  wrapper.addEventListener("transitionend", onTransitionEnd);
  window.addEventListener("resize", recalc);
  onTransitionEnd();
}

function initSliders({ q, qa }) {
  qa(".swiper.slider-home, .swiper.slider-hit, .swiper.slider-catalog, .swiper.slider-product, .swiper.reviews-slider, .swiper.slider-similar, .swiper.slider-like").forEach((root) =>
    initLoopSlider(root, { q, qa })
  );
}

function initProductGallery({ q }) {
  const gallery = q(".product-gallery");
  if (!gallery) return;

  const items = Array.from(gallery.querySelectorAll(".product-gallery__item"));
  if (items.length <= 1) return;

  items.forEach((item) => item.classList.remove("active"));
  items[0].classList.add("active");

  let currentIndex = 0;
  const segmentsContainer = document.createElement("div");
  segmentsContainer.className = "product-gallery__segments";

  const showItem = (index) => {
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
    const segments = Array.from(segmentsContainer.querySelectorAll(".product-gallery__segment"));
    segments.forEach((segment, i) => {
      segment.classList.toggle("active", i === index);
    });
  };

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

  items.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (index + 1) % items.length;
      showItem(currentIndex);
    });
  });
}

function initRelatedProductsPlacement() {
  const sliderProductBox = document.querySelector(".slider-product__box");
  const productInfoBlock = document.querySelector(".product-info__block");
  const productItemLinks = productInfoBlock?.querySelector(".product-item__links");
  const sliderOriginalParent = sliderProductBox?.parentNode || null;
  const sliderOriginalNextSibling = sliderProductBox?.nextSibling || null;
  const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);

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
      // Recalculate slider geometry right after DOM move.
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
}

function initItemComponentsPanel() {
  const itemComponents = document.querySelector(".item-components");
  const itemComponentRight = document.querySelector(".item-component-right");
  const tooltip = document.querySelector(".item-components-tooltip");
  const overlay = document.querySelector(".item-components-tooltip-overlay");
  const hitSection = document.querySelector("#hit");

  if (tooltip && overlay) {
    const tooltipText = tooltip.querySelector(".item-components-tooltip__txt");
    const defaultTooltipText = tooltipText?.textContent.trim() || "";

    const openTooltip = () => {
      tooltip.classList.add("active");
      overlay.classList.add("active");
    };
    const openTooltipWithText = (text) => {
      if (tooltipText && text) {
        tooltipText.textContent = text;
      }
      openTooltip();
    };
    const closeTooltip = () => {
      tooltip.classList.remove("active");
      overlay.classList.remove("active");
    };

    itemComponents?.addEventListener("click", (e) => {
      e.stopPropagation();
      openTooltipWithText(defaultTooltipText);
    });

    tooltip.querySelector(".item-components-tooltip__close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTooltip();
    });

    overlay.addEventListener("click", closeTooltip);

    document.addEventListener("click", (e) => {
      const catalogIcon = e.target.closest(".catalog-item__icon");
      if (catalogIcon) {
        e.preventDefault();
        e.stopPropagation();
        openTooltipWithText(catalogIcon.dataset.text?.trim() || defaultTooltipText);
        return;
      }

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
}

function initScrollTopButton() {
  const scrollTopBtn = document.querySelector(".scroll-top-btn");
  if (!scrollTopBtn) return;

  const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);
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

function initDesktopStickyAddBar({ q, qa }) {
  const desktopStickyAddBar = document.querySelector(".desktop-sticky-add");
  const desktopAddBtnBox = document.querySelector(".product-item__add-btn .catalog-item__add-box");
  const desktopHeader = document.querySelector("header");
  if (!desktopStickyAddBar || !desktopAddBtnBox) return;

  const stickyTitle = q(".desktop-sticky-add__title", desktopStickyAddBar);
  const stickyPrice = q(".desktop-sticky-add__price", desktopStickyAddBar);
  const stickyColorText = q(".desktop-sticky-add__color span", desktopStickyAddBar);
  const stickySizeValue = q(".desktop-sticky-size-value", desktopStickyAddBar);
  const stickyThumbImg = q(".desktop-sticky-add__thumb img", desktopStickyAddBar);
  const productTitle = q(".product-info__title h1");
  const productPrice = q(".item-price__box .catalog-item__price h3");
  const productColorValue = q(".product-item__color .product-select__box span");
  const productSizeValue = q(".product-item__size .product-select__box span");

  const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);
  let isAddBtnVisible = true;

  const updateDesktopStickyTop = () => {
    const headerHeight = desktopHeader ? Math.round(desktopHeader.getBoundingClientRect().height) : 96;
    document.documentElement.style.setProperty("--desktop-sticky-add-top", `${headerHeight}px`);
  };

  const updateDesktopStickyVisibility = () => {
    const shouldShow = desktopMedia.matches && !isAddBtnVisible;
    desktopStickyAddBar.classList.toggle("active", shouldShow);
  };

  const syncDesktopStickyData = () => {
    if (stickyTitle && productTitle) stickyTitle.textContent = productTitle.textContent.trim();
    if (stickyPrice && productPrice) stickyPrice.innerHTML = productPrice.innerHTML;
    if (stickyColorText && productColorValue) stickyColorText.textContent = productColorValue.textContent.trim();
    if (stickySizeValue && productSizeValue) stickySizeValue.textContent = productSizeValue.textContent.trim();

    const checkedColorInput = q(".product-item__color input[name='color']:checked");
    const colorLabelImg = checkedColorInput
      ? q(`label[for="${checkedColorInput.id}"] img`)
      : q(".product-item__color .product-color__select label img");
    if (stickyThumbImg && colorLabelImg) {
      stickyThumbImg.src = colorLabelImg.src;
      stickyThumbImg.alt = colorLabelImg.alt || stickyThumbImg.alt;
    }

    const popupSizeButtons = qa("#desktop-size-select .add-size__box .btn");
    if (popupSizeButtons.length && stickySizeValue) {
      popupSizeButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.textContent.trim() === stickySizeValue.textContent.trim());
      });
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      isAddBtnVisible = entries[0]?.isIntersecting ?? false;
      updateDesktopStickyVisibility();
    },
    { threshold: 0.15 }
  );

  observer.observe(desktopAddBtnBox);
  window.addEventListener("resize", updateDesktopStickyTop);

  document.addEventListener("click", (e) => {
    const popupSizeBtn = e.target.closest("#desktop-size-select .add-size__box .btn.btn-border");
    if (popupSizeBtn) {
      const selectedSize = popupSizeBtn.textContent.trim();
      if (stickySizeValue) stickySizeValue.textContent = selectedSize;
      if (productSizeValue) productSizeValue.textContent = selectedSize;

      const productSizeButtons = qa(".product-item__size .add-size__box .btn.btn-border");
      if (productSizeButtons.length) {
        productSizeButtons.forEach((btn) => {
          btn.classList.toggle("active", btn.textContent.trim() === selectedSize);
        });
      }
    }

    if (e.target.closest(".add-size__box .btn, .product-color__select label")) {
      window.requestAnimationFrame(syncDesktopStickyData);
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.matches(".product-item__color input[name='color']")) {
      syncDesktopStickyData();
    }
  });

  if (desktopMedia.addEventListener) {
    desktopMedia.addEventListener("change", updateDesktopStickyVisibility);
  } else if (desktopMedia.addListener) {
    desktopMedia.addListener(updateDesktopStickyVisibility);
  }

  updateDesktopStickyTop();
  updateDesktopStickyVisibility();
  syncDesktopStickyData();
}

function initStickyBottomBar() {
  const stickyBar = document.querySelector(".sticky-bottom-bar");
  const tabber = document.querySelector(".tabber-menu__box");
  const header = document.querySelector(".page-header");
  const footerBottomBox = document.querySelector(".footer-bottom__box");
  const body = document.body;
  if (!stickyBar) return;

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
        const isFooterVisible = footerBottomBox ? footerBottomBox.getBoundingClientRect().top <= window.innerHeight : false;
        const shouldAttachTabberToFooter = isAtPageBottom || isFooterVisible;

        if (shouldAttachTabberToFooter) {
          tabber?.classList.remove("hidden");
          moveTabberAfterFooter();
          stickyBar.classList.remove("active");
          stickyBar.classList.remove("above-tabber");
          lastScrollY = currentScrollY;
          ticking = false;
          return;
        }

        restoreTabberPosition();

        if (currentScrollY > 400) {
          stickyBar.classList.add("active");
        } else {
          stickyBar.classList.remove("active");
          stickyBar.classList.remove("above-tabber");
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          tabber?.classList.add("hidden");
          header?.classList.add("hidden");
          stickyBar.classList.remove("above-tabber");
        } else {
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

document.addEventListener("DOMContentLoaded", () => {
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const { showInfoMessage } = initInfoMessage({ q });
  const popupSystem = initPopupSystem({ q, qa });
  const { updateFavoriteCounter } = initFavoriteCounter({ qa });
  const cartSystem = initCartSystem({ q, qa, popupSystem });

  initGlobalClickDelegation({
    q,
    qa,
    popupSystem,
    showInfoMessage,
    updateFavoriteCounter,
    cartSystem,
  });

  initSliders({ q, qa });
  initProductGallery({ q });
  initRelatedProductsPlacement();
  initItemComponentsPanel();
  initScrollTopButton();
  initDesktopStickyAddBar({ q, qa });
  initStickyBottomBar();

  updateFavoriteCounter();
});
