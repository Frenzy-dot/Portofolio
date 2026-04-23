document.addEventListener('DOMContentLoaded', () => {

  // ─── State ───
  let cart = [];
  try {
    const stored = JSON.parse(localStorage.getItem('cart'));
    if (Array.isArray(stored)) cart = stored;
  } catch (e) {
    cart = [];
    localStorage.removeItem('cart');
  }

  // ─── Elements ───
  const cartCount        = document.getElementById('cart-count');
  const cartItemsEl      = document.getElementById('cart-items');
  const cartModal        = document.getElementById('cart-modal');
  const cartOverlay      = document.getElementById('cart-overlay');
  const cartTotalPrice   = document.getElementById('cart-total-price');
  const checkoutBtn      = document.getElementById('checkout-btn');
  const toast            = document.getElementById('toast');
  const toastMsg         = document.getElementById('toast-msg');

  // ─── Add to Cart ───
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = btn.dataset.id;
      const name  = btn.dataset.name;
      const price = parseInt(btn.dataset.price);

      cart.push({ id, name, price });
      saveCart();
      updateCartUI();
      showToast(`✓ ${name} added to cart`);
    });
  });

  // ─── Save & Update ───
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCartUI() {
    // update count badge
    if (cartCount) cartCount.textContent = cart.length;

    // update total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartTotalPrice) cartTotalPrice.textContent = `$${total}`;

    // disable checkout if empty
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    renderCartItems();
  }

  function renderCartItems() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p>Your cart is empty 🛒</p>';
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">$${item.price}</span>
        <button class="cart-item-remove" data-index="${index}">Remove</button>
      `;
      cartItemsEl.appendChild(div);
    });

    // Remove buttons
    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.index);
        cart.splice(i, 1);
        saveCart();
        updateCartUI();
      });
    });
  }

  // ─── Toast ───
  let toastTimer = null;
  function showToast(msg) {
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ─── Cart Modal ───
  window.showCart = function () {
    cartModal.style.display  = 'flex';
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // slight delay for CSS transition to kick in
    requestAnimationFrame(() => cartModal.classList.add('open'));
  };

  window.closeCart = function () {
    cartModal.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { cartModal.style.display = 'none'; }, 200);
  };

  // ─── Hamburger Menu ───
  window.openMobileMenu = function () {
    document.getElementById('mobile-menu').classList.add('open');
    document.getElementById('mobile-menu-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeMobileMenu = function () {
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('mobile-menu-overlay').classList.remove('open');
    document.body.style.overflow = '';
  };

  // ─── Checkout ───
  window.handleCheckout = function () {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    // Placeholder — replace with Gumroad/Stripe redirect later
    alert(`Total: $${total}\n\nCheckout coming soon! DM us on Instagram @gloo.std to order now.`);
  };

  // ─── Init ───
  updateCartUI();

  // ─── Scroll Reveal (IntersectionObserver) ───
  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -40px 0px'
    });
    revealEls.forEach(el => observer.observe(el));
  }
  initReveal();

  // ─── Lightbox ───
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  window.openLightbox = function(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeCart();
      closeMobileMenu();
    }
  });

});