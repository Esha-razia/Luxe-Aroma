/**
 * Luxe Aroma - Main Application Script
 * Implements SPA Router, State Management,
 * Countdown Timer, and Page Rendering Controllers.
 */

// --- Global Application State ---
const state = {
    cart: JSON.parse(localStorage.getItem('luxe_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('luxe_wishlist')) || [],
    currentUser: JSON.parse(localStorage.getItem('luxe_user')) || null,
    activeCoupon: JSON.parse(localStorage.getItem('luxe_coupon')) || null,
    activePage: 'home',
    detailSelectedProduct: null,
    shopFilters: {
        search: "",
        collection: [],
        gender: [],
        minPrice: 50,
        maxPrice: 300,
        sort: "featured"
    }
};

// Available coupon codes
const VALID_COUPONS = {
    "LUXURY20": 20,
    "GOLDEN30": 30,
    "LUXEAROMA10": 10
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initRouter();
    initScrollNavbar();
    initBackToTop();
    initGlobalEventListeners();
    initFooterAccordion();
    updateCartIconCount();
    updateWishlistIconCount();
});

function initFooterAccordion() {
    document.addEventListener('click', (e) => {
        const title = e.target.closest('.footer-accordion-head');
        if (!title) return;
        const links = title.nextElementSibling;
        if (links && links.classList.contains('footer-links')) {
            const isOpen = links.classList.contains('footer-open');
            links.classList.toggle('footer-open', !isOpen);
            const icon = title.querySelector('.footer-acc-icon i');
            if (icon) icon.className = isOpen ? 'fas fa-plus' : 'fas fa-minus';
        }
    });
}

// --- Preloader Controller ---
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                // Trigger typing animation in hero after loader fades
                startHeroTyping();
                // Initialize AOS
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 1000,
                        easing: 'ease-out-quad',
                        once: true
                    });
                }
            }, 1000);
        });
        
        // Fallback in case load event takes too long
        setTimeout(() => {
            preloader.classList.add('fade-out');
            startHeroTyping();
        }, 3000);
    }
}

// --- Typing Animation ---
let typingTimer = null;
function startHeroTyping() {
    const textElement = document.querySelector('.typing-text');
    if (!textElement) return;

    const fullText = "Discover Your Signature Scent";
    textElement.textContent = "";
    let i = 0;

    if (typingTimer) clearInterval(typingTimer);

    typingTimer = setInterval(() => {
        if (i < fullText.length) {
            textElement.textContent += fullText.charAt(i);
            i++;
        } else {
            clearInterval(typingTimer);
        }
    }, 100);
}

// --- Navigation Controller ---
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar-luxe');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }
    });
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Ambient audio removed per user preference

// --- Client-Side Router ---
function initRouter() {
    // Listen to hash shifts
    window.addEventListener('hashchange', handleRoute);
    // Initial route handling
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash || '#home';
    const mainContainer = document.getElementById('app-content');
    if (!mainContainer) return;

    // Reset scroll and prepare transition
    window.scrollTo({ top: 0, behavior: 'instant' });
    mainContainer.innerHTML = ''; // Clear page content
    mainContainer.className = "container-fluid p-0 view-fade-in"; // trigger css animation

    // Highlight navbar links matching route
    document.querySelectorAll('.nav-link-luxe').forEach(link => {
        const linkHash = link.getAttribute('href');
        if (hash.startsWith(linkHash)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Automatically close the mobile hamburger menu if open
    const navbarCollapse = document.getElementById('luxeNavbar');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
            bsCollapse.hide();
        } else {
            navbarCollapse.classList.remove('show');
        }
    }

    // Parse dynamic routes (e.g. #product-details/1)
    if (hash.startsWith('#product-details/')) {
        const productId = parseInt(hash.split('/')[1]);
        state.activePage = `product-details`;
        renderProductDetailPage(mainContainer, productId);
        return;
    }

    // Direct routing matching hashes
    switch (hash) {
        case '#home':
            state.activePage = 'home';
            renderHomePage(mainContainer);
            break;
        case '#shop':
            state.activePage = 'shop';
            renderShopPage(mainContainer);
            break;
        case '#cart':
            state.activePage = 'cart';
            renderCartPage(mainContainer);
            break;
        case '#checkout':
            state.activePage = 'checkout';
            renderCheckoutPage(mainContainer);
            break;
        case '#login':
            state.activePage = 'login';
            renderLoginPage(mainContainer);
            break;
        case '#register':
            state.activePage = 'register';
            renderRegisterPage(mainContainer);
            break;
        case '#contact':
            state.activePage = 'contact';
            renderContactPage(mainContainer);
            break;
        case '#track-order':
            state.activePage = 'track-order';
            renderTrackOrderPage(mainContainer);
            break;
        default:
            state.activePage = 'home';
            renderHomePage(mainContainer);
    }
    
    // Append global reviews section to every page
    appendGlobalReviewsSection(mainContainer);

    // Trigger AOS refresh for dynamic items
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// --- Global DOM Events Handler ---
function initGlobalEventListeners() {
    // Reserved for future global click delegation
}

// --- Toast Notification Handler ---
function showToast(title, message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'luxe-toast';
    toast.innerHTML = `
        <div class="toast-body-content">
            <i class="fas fa-gem"></i>
            <div>
                <strong>${title}</strong>
                <p class="mb-0 text-muted" style="font-size: 0.75rem;">${message}</p>
            </div>
        </div>
        <button class="toast-close-btn"><i class="fas fa-times"></i></button>
    `;

    toastContainer.appendChild(toast);

    // Fade and translate in
    setTimeout(() => toast.classList.add('show'), 50);

    // Auto dismiss after 3.5s
    const dismissTimer = setTimeout(() => {
        dismissToast(toast);
    }, 3500);

    // Dismiss manually on close btn click
    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
        clearTimeout(dismissTimer);
        dismissToast(toast);
    });
}

function dismissToast(toast) {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
        toast.remove();
    });
}

// --- E-commerce Functions & Calculations ---

function addToCart(productId, size = '50ml', quantity = 1) {
    const product = window.LUXE_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Size price multiplier calculations
    let finalPrice = product.price;
    if (size === '30ml') finalPrice = Math.round(product.price * 0.8);
    else if (size === '100ml') finalPrice = Math.round(product.price * 1.4);

    // Apply any discounts
    if (product.discount > 0) {
        finalPrice = Math.round(finalPrice * (1 - product.discount / 100));
    }

    // Check if duplicate item exists in cart
    const existingIndex = state.cart.findIndex(item => item.id === productId && item.size === size);
    
    if (existingIndex > -1) {
        state.cart[existingIndex].quantity += quantity;
    } else {
        state.cart.push({
            id: productId,
            name: product.name,
            brand: product.brand,
            image: product.image,
            size: size,
            price: finalPrice,
            quantity: quantity
        });
    }

    localStorage.setItem('luxe_cart', JSON.stringify(state.cart));
    updateCartIconCount();
    showToast("Added to Cart", `${product.name} (${size}) has been added.`);
}

function toggleWishlist(productId) {
    const product = window.LUXE_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const index = state.wishlist.indexOf(productId);
    let message = "";
    
    if (index > -1) {
        state.wishlist.splice(index, 1);
        message = `${product.name} removed from Wishlist.`;
    } else {
        state.wishlist.push(productId);
        message = `${product.name} added to Wishlist.`;
    }

    localStorage.setItem('luxe_wishlist', JSON.stringify(state.wishlist));
    updateWishlistIconCount();
    showToast("Wishlist Updated", message);
    
    // Re-render components holding wishlist status if applicable
    if (state.activePage === 'home') {
        // Redraw list to preserve status
        renderFeaturedAndBestSellers();
    } else if (state.activePage === 'shop') {
        renderShopGrid();
    }
}

function updateCartIconCount() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalCount = state.cart.reduce((total, item) => total + item.quantity, 0);
    badges.forEach(b => {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'flex' : 'none';
    });
}

function updateWishlistIconCount() {
    const badges = document.querySelectorAll('.wishlist-badge');
    const totalCount = state.wishlist.length;
    badges.forEach(b => {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'flex' : 'none';
    });
}

// --- Home Page Renderer ---
function renderHomePage(container) {
    container.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-wrapper">
            <div class="container relative z-3">
                <div class="row align-items-center">
                    <div class="col-lg-6 order-2 order-lg-1" data-aos="fade-right">
                        <span class="section-subtitle">Exquisite Fragrance</span>
                        <h1 class="hero-title"><span class="typing-text">Discover Your Signature Scent</span></h1>
                        <p class="hero-sub">Luxury fragrances crafted to express your unique personality, sophistication, and pure elegance. Inspired by timeless classics and rare ingredients.</p>
                        <div class="d-flex gap-3">
                            <a href="#shop" class="btn btn-luxe-primary">Shop Now</a>
                            <a href="#shop" class="btn btn-luxe-outline">Explore Collection</a>
                        </div>
                    </div>
                    <div class="col-lg-6 text-center order-1 order-lg-2" data-aos="fade-left" data-aos-delay="200">
                        <div class="hero-bottle-container">
                            <div class="hero-bottle-glow"></div>
                            <img src="images/hero_perfume.png" alt="Luxury Perfume Bottle" class="hero-bottle-img">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Perfumes Section -->
        <section class="section-padding">
            <div class="container relative">
                <div class="section-title-wrap text-center" data-aos="fade-up">
                    <span class="section-subtitle">Curated Luxury</span>
                    <h2 class="section-title">Featured Scents</h2>
                </div>
                
                <div class="luxe-carousel-wrap">
                    <button class="carousel-control-btn carousel-control-prev" id="featured-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="luxe-carousel-track" id="home-featured-grid"></div>
                    <button class="carousel-control-btn carousel-control-next" id="featured-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </section>

        <!-- Brand Carousel Section -->
        <section class="brand-carousel-container">
            <div class="brand-track" id="brand-loop-track"></div>
        </section>

        <!-- Best Sellers Section -->
        <section class="section-padding bg-charcoal">
            <div class="container relative">
                <div class="section-title-wrap text-center" data-aos="fade-up">
                    <span class="section-subtitle">Highly Requested</span>
                    <h2 class="section-title">Best Sellers</h2>
                </div>
                
                <div class="luxe-carousel-wrap">
                    <button class="carousel-control-btn carousel-control-prev" id="best-seller-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="luxe-carousel-track" id="home-best-sellers-track"></div>
                    <button class="carousel-control-btn carousel-control-next" id="best-seller-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </section>

        <!-- New Arrivals Section -->
        <section class="section-padding">
            <div class="container relative">
                <div class="section-title-wrap text-center" data-aos="fade-up">
                    <span class="section-subtitle">Fresh Creations</span>
                    <h2 class="section-title">New Arrivals</h2>
                </div>
                
                <div class="luxe-carousel-wrap">
                    <button class="carousel-control-btn carousel-control-prev" id="new-arrival-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="luxe-carousel-track" id="home-new-arrivals-grid"></div>
                    <button class="carousel-control-btn carousel-control-next" id="new-arrival-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </section>

        <!-- Why Choose Us Section -->
        <section class="section-padding bg-charcoal">
            <div class="container">
                <div class="section-title-wrap text-center" data-aos="fade-up">
                    <span class="section-subtitle">The Luxe Experience</span>
                    <h2 class="section-title">Why Choose Us</h2>
                </div>
                <div class="row g-4">
                    <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                        <div class="why-us-card">
                            <i class="fas fa-gem why-us-icon"></i>
                            <h3 class="why-us-title">Premium Quality</h3>
                            <p class="why-us-desc">We extract essences from rare, luxury ingredients sourced globally from France to Arabia.</p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                        <div class="why-us-card">
                            <i class="fas fa-hourglass-half why-us-icon"></i>
                            <h3 class="why-us-title">Long Lasting</h3>
                            <p class="why-us-desc">High concentrations of fragrance oil ensure scents linger elegantly for over 12 hours.</p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                        <div class="why-us-card">
                            <i class="fas fa-globe-americas why-us-icon"></i>
                            <h3 class="why-us-title">Worldwide Delivery</h3>
                            <p class="why-us-desc">Gorgeous padded luxury boxes shipped safely and swiftly across the globe.</p>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="400">
                        <div class="why-us-card">
                            <i class="fas fa-shield-alt why-us-icon"></i>
                            <h3 class="why-us-title">Secure Payments</h3>
                            <p class="why-us-desc">State of the art encrypted payment pathways protecting your luxury purchases.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>



        <!-- Special Offer Countdown Section -->
        <section class="section-padding bg-charcoal">
            <div class="container">
                <div class="offer-banner">
                    <div class="row align-items-center">
                        <div class="col-lg-6" data-aos="fade-right">
                            <span class="section-subtitle">Exquisite Offer</span>
                            <h2 class="font-heading mb-3" style="font-size: 2.2rem; font-weight:700;">Imperial Gift Set</h2>
                            <p class="text-muted">Acquire our masterclass gift set comprising Oud Royale, La Fleur d'Or, and Rose Absolute at 30% off. Includes premium black wood gift packaging and free global transport.</p>
                            
                            <!-- Countdown timer -->
                            <div class="countdown-container">
                                <div class="countdown-box">
                                    <div class="countdown-number" id="timer-days">00</div>
                                    <div class="countdown-label">Days</div>
                                </div>
                                <div class="countdown-box">
                                    <div class="countdown-number" id="timer-hours">00</div>
                                    <div class="countdown-label">Hrs</div>
                                </div>
                                <div class="countdown-box">
                                    <div class="countdown-number" id="timer-minutes">00</div>
                                    <div class="countdown-label">Mins</div>
                                </div>
                                <div class="countdown-box">
                                    <div class="countdown-number" id="timer-seconds">00</div>
                                    <div class="countdown-label">Secs</div>
                                </div>
                            </div>
                            
                            <a href="#shop" class="btn btn-luxe-primary">Claim Privilege</a>
                        </div>
                        <div class="col-lg-6 text-center mt-5 mt-lg-0" data-aos="fade-left" data-aos-delay="200">
                            <div class="offer-img-wrap">
                                <div class="hero-bottle-glow"></div>
                                <img src="images/perfume_french.png" alt="Luxury Gift Box" class="offer-img">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    `;

    renderFeaturedAndBestSellers();
    renderBrandCarousel();
    startCountdownTimer();

    // Trigger typing text in case it missed load event
    startHeroTyping();
}

function renderFeaturedAndBestSellers() {
    const featuredGrid = document.getElementById('home-featured-grid');
    const bestSellersTrack = document.getElementById('home-best-sellers-track');
    const newArrivalsGrid = document.getElementById('home-new-arrivals-grid');

    if (!featuredGrid || !bestSellersTrack || !newArrivalsGrid) return;

    // 1. Featured - Get 4 items
    const featuredProducts = window.LUXE_PRODUCTS.slice(0, 4);
    featuredGrid.innerHTML = featuredProducts.map(p => `
        <div class="luxe-carousel-item">
            ${createProductCardHTML(p, '')}
        </div>
    `).join('');

    // 2. Best Sellers - Filter best sellers
    const bestSellers = window.LUXE_PRODUCTS.filter(p => p.isBestSeller);
    bestSellersTrack.innerHTML = bestSellers.map(p => `
        <div class="luxe-carousel-item">
            ${createProductCardHTML(p, '')}
        </div>
    `).join('');

    // 3. New Arrivals - Filter new arrivals
    const newArrivals = window.LUXE_PRODUCTS.filter(p => p.isNewArrival);
    newArrivalsGrid.innerHTML = newArrivals.map(p => `
        <div class="luxe-carousel-item">
            ${createProductCardHTML(p, '')}
        </div>
    `).join('');

    // Initialize all 3 product carousels
    window.initLuxeCarousel('home-featured-grid', 'featured-prev', 'featured-next');
    window.initLuxeCarousel('home-best-sellers-track', 'best-seller-prev', 'best-seller-next');
    window.initLuxeCarousel('home-new-arrivals-grid', 'new-arrival-prev', 'new-arrival-next');
}

function renderBrandCarousel() {
    const track = document.getElementById('brand-loop-track');
    if (!track) return;

    const collections = [
        { name: "French Collection", sub: "Sophistication" },
        { name: "Arabian Collection", sub: "Opulence" },
        { name: "Floral Collection", sub: "Sensuality" },
        { name: "Men Collection", sub: "Distinction" },
        { name: "Women Collection", sub: "Grace" }
    ];

    // Double lists to make infinite auto-scroll seamless
    const doubleCollections = [...collections, ...collections];

    track.innerHTML = doubleCollections.map(c => `
        <div class="brand-logo-card" onclick="filterByCollection('${c.name}')">
            <span class="brand-logo-name">${c.name.split(' ')[0]}</span>
            <span class="brand-logo-sub">${c.sub}</span>
        </div>
    `).join('');
}

// Global filter helper for brand carousel clicks
window.filterByCollection = function(collectionName) {
    state.shopFilters.collection = [collectionName];
    window.location.hash = "#shop";
};

// Countdown Timer Controller
let countdownInterval = null;
function startCountdownTimer() {
    // 2 days countdown
    const targetDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
    
    if (countdownInterval) clearInterval(countdownInterval);

    function updateTimer() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('timer-days');
        const hEl = document.getElementById('timer-hours');
        const mEl = document.getElementById('timer-minutes');
        const sEl = document.getElementById('timer-seconds');

        if (dEl && hEl && mEl && sEl) {
            dEl.textContent = days.toString().padStart(2, '0');
            hEl.textContent = hours.toString().padStart(2, '0');
            mEl.textContent = minutes.toString().padStart(2, '0');
            sEl.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Elements removed from DOM, cancel loop
            clearInterval(countdownInterval);
        }
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
}

// --- Shop Page Renderer ---
function renderShopPage(container) {
    container.innerHTML = `
        <section class="section-padding" style="padding-top: 140px;">
            <div class="container">
                <div class="section-title-wrap text-center mb-5" data-aos="fade-up">
                    <span class="section-subtitle">Explore Scent Library</span>
                    <h1 class="section-title">The Boutique</h1>
                </div>
                
                <div class="row">
                    <!-- Sidebar Filters -->
                    <div class="col-lg-3 mb-5 mb-lg-0" data-aos="fade-right">
                        <div class="shop-sidebar">
                            
                            <!-- Search -->
                            <div class="filter-widget">
                                <h3 class="filter-title">Search</h3>
                                <div class="filter-search-box">
                                    <input type="text" id="shop-search" placeholder="Find a fragrance..." class="filter-search-input" value="${state.shopFilters.search}">
                                    <button class="filter-search-btn" id="shop-search-btn"><i class="fas fa-search"></i></button>
                                </div>
                            </div>

                            <!-- Collections Accordion -->
                            <div class="filter-widget filter-accordion">
                                <h3 class="filter-title filter-accordion-title" id="filter-collection-title">
                                    Collections
                                    <span class="filter-accordion-icon"><i class="fas fa-plus"></i></span>
                                </h3>
                                <ul class="filter-list filter-accordion-body" id="filter-collection-body" style="display:none;">
                                    ${["French Collection", "Arabian Collection", "Floral Collection", "Men Collection", "Women Collection"].map(c => `
                                        <li>
                                            <label class="filter-checkbox-label">
                                                <input type="checkbox" class="collection-filter-checkbox" value="${c}" ${state.shopFilters.collection.includes(c) ? 'checked' : ''}>
                                                ${c}
                                            </label>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>

                            <!-- Gender Accordion -->
                            <div class="filter-widget filter-accordion">
                                <h3 class="filter-title filter-accordion-title" id="filter-gender-title">
                                    Gender
                                    <span class="filter-accordion-icon"><i class="fas fa-plus"></i></span>
                                </h3>
                                <ul class="filter-list filter-accordion-body" id="filter-gender-body" style="display:none;">
                                    ${["men", "women", "unisex"].map(g => `
                                        <li>
                                            <label class="filter-checkbox-label text-capitalize">
                                                <input type="checkbox" class="gender-filter-checkbox" value="${g}" ${state.shopFilters.gender.includes(g) ? 'checked' : ''}>
                                                ${g}
                                            </label>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>

                        </div>
                    </div>

                    <!-- Products Grid -->
                    <div class="col-lg-9" data-aos="fade-left">
                        <!-- Sort Header -->
                        <div class="shop-sort-wrap d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <span class="text-muted" id="shop-results-count">Showing 0 products</span>
                            <div class="d-flex align-items-center gap-2">
                                <span class="text-muted" style="font-size:0.85rem;">Sort By:</span>
                                <select class="shop-sort-select" id="shop-sort">
                                    <option value="featured" ${state.shopFilters.sort === 'featured' ? 'selected' : ''}>Featured</option>
                                    <option value="low-high" ${state.shopFilters.sort === 'low-high' ? 'selected' : ''}>Price: Low to High</option>
                                    <option value="high-low" ${state.shopFilters.sort === 'high-low' ? 'selected' : ''}>Price: High to Low</option>
                                    <option value="rating" ${state.shopFilters.sort === 'rating' ? 'selected' : ''}>Rating</option>
                                </select>
                            </div>
                        </div>

                        <!-- Product Grid Container -->
                        <div class="row g-4" id="shop-grid"></div>
                    </div>
                </div>
            </div>
        </section>
    `;

    renderShopGrid();
    setupShopEventListeners();
    initShopFilterAccordions();
}

function renderShopGrid() {
    const grid = document.getElementById('shop-grid');
    const resultsText = document.getElementById('shop-results-count');
    if (!grid) return;

    let filtered = [...window.LUXE_PRODUCTS];

    // 1. Search Filter
    if (state.shopFilters.search) {
        const query = state.shopFilters.search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
    }

    // 2. Collection Filter
    if (state.shopFilters.collection.length > 0) {
        filtered = filtered.filter(p => state.shopFilters.collection.includes(p.collection));
    }

    // 3. Gender Filter
    if (state.shopFilters.gender.length > 0) {
        filtered = filtered.filter(p => state.shopFilters.gender.includes(p.gender));
    }

    // 4. Price Limit
    filtered = filtered.filter(p => p.price <= state.shopFilters.maxPrice);

    // 5. Sorting
    if (state.shopFilters.sort === "low-high") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (state.shopFilters.sort === "high-low") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (state.shopFilters.sort === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    resultsText.textContent = `Showing ${filtered.length} products`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search mb-3" style="font-size: 3rem; color: var(--primary-blue); opacity: 0.5;"></i>
                <h3>No Scent Found</h3>
                <p class="text-muted">Try adjusting your filtration criteria.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => createProductCardHTML(p, 'col-6 col-md-6 col-lg-4')).join('');
}

function setupShopEventListeners() {
    const searchInput = document.getElementById('shop-search');
    const sortSelect = document.getElementById('shop-sort');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.shopFilters.search = e.target.value;
            renderShopGrid();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.shopFilters.sort = e.target.value;
            renderShopGrid();
        });
    }

    // Collection Checkbox Listeners
    document.querySelectorAll('.collection-filter-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
            const val = cb.value;
            if (cb.checked) {
                state.shopFilters.collection.push(val);
            } else {
                state.shopFilters.collection = state.shopFilters.collection.filter(c => c !== val);
            }
            renderShopGrid();
        });
    });

    // Gender Checkbox Listeners
    document.querySelectorAll('.gender-filter-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
            const val = cb.value;
            if (cb.checked) {
                state.shopFilters.gender.push(val);
            } else {
                state.shopFilters.gender = state.shopFilters.gender.filter(g => g !== val);
            }
            renderShopGrid();
        });
    });
}

function initShopFilterAccordions() {
    ['collection', 'gender'].forEach(key => {
        const title = document.getElementById(`filter-${key}-title`);
        const body  = document.getElementById(`filter-${key}-body`);
        if (!title || !body) return;

        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
            const isOpen = body.style.display !== 'none';
            body.style.display = isOpen ? 'none' : 'block';
            const icon = title.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-plus' : 'fas fa-minus';
            }
        });
    });
}

// --- Product Details Renderer ---
function renderProductDetailPage(container, productId) {
    const product = window.LUXE_PRODUCTS.find(p => p.id === productId);
    if (!product) {
        container.innerHTML = `
            <div class="container text-center py-5" style="padding-top: 150px;">
                <h2>Fragrance Not Found</h2>
                <a href="#shop" class="btn btn-luxe-primary mt-3">Back to Shop</a>
            </div>
        `;
        return;
    }

    let selectedSize = '50ml';
    let basePrice = product.price;
    if (product.discount > 0) {
        basePrice = Math.round(product.price * (1 - product.discount / 100));
    }

    container.innerHTML = `
        <section class="section-padding" style="padding-top: 150px;">
            <div class="container">
                <div class="row">
                    <!-- Left Images Showcase -->
                    <div class="col-lg-6" data-aos="fade-right">
                        <div class="detail-img-showcase">
                            <img src="${product.image}" alt="${product.name}" class="detail-img" id="main-detail-img">
                        </div>
                    </div>

                    <!-- Right Product Information -->
                    <div class="col-lg-6 mt-5 mt-lg-0" data-aos="fade-left">
                        <div class="detail-info">
                            <span class="detail-brand">${product.brand}</span>
                            <h1 class="detail-title">${product.name}</h1>
                            
                            <div class="product-card-rating mb-3">
                                ${Array(Math.floor(product.rating)).fill('<i class="fas fa-star"></i>').join('')}
                                ${product.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                                <span class="ms-2">(${product.reviewCount} customer reviews)</span>
                            </div>

                            <div class="detail-price-wrap">
                                <span class="detail-price" id="detail-price-display">$${basePrice}</span>
                                ${product.discount > 0 ? `<span class="badge bg-danger">${product.discount}% OFF</span>` : ''}
                            </div>

                            <p class="text-muted mb-4">${product.description}</p>

                            <!-- Size Selector -->
                            <div class="mb-4">
                                <span class="form-label-luxe d-block">Available Sizes</span>
                                <div class="detail-size-selector">
                                    <button class="btn size-btn" onclick="selectDetailSize('30ml', ${product.price}, ${product.discount}, this)">30ml</button>
                                    <button class="btn size-btn active" onclick="selectDetailSize('50ml', ${product.price}, ${product.discount}, this)">50ml</button>
                                    <button class="btn size-btn" onclick="selectDetailSize('100ml', ${product.price}, ${product.discount}, this)">100ml</button>
                                </div>
                            </div>

                            <!-- Qty & Buttons -->
                            <div class="d-flex align-items-center gap-3 mb-5 flex-wrap">
                                <div class="quantity-control">
                                    <button class="qty-btn" onclick="adjustDetailQty(-1)"><i class="fas fa-minus"></i></button>
                                    <input type="number" id="detail-qty-input" class="qty-input" value="1" min="1" readonly>
                                    <button class="qty-btn" onclick="adjustDetailQty(1)"><i class="fas fa-plus"></i></button>
                                </div>
                                <button class="btn btn-luxe-primary" id="detail-add-btn">Add to Cart</button>
                                <button class="btn btn-luxe-outline" id="detail-wish-btn"><i class="${state.wishlist.includes(product.id) ? 'fas' : 'far'} fa-heart"></i></button>
                            </div>

                            <!-- Details Accordion -->
                            <div class="detail-accordion">
                                <div class="accordion-item-luxe">
                                    <button class="accordion-header-luxe" onclick="toggleAccordion('acc-notes')">
                                        Fragrance Notes <i class="fas fa-chevron-down" id="acc-notes-icon"></i>
                                    </button>
                                    <div class="accordion-body-luxe d-none" id="acc-notes">
                                        <pre style="font-family: inherit; background: transparent; color: inherit; border:none; margin: 0; padding: 0; white-space: pre-line;">${product.details}</pre>
                                    </div>
                                </div>
                                <div class="accordion-item-luxe">
                                    <button class="accordion-header-luxe" onclick="toggleAccordion('acc-ing')">
                                        Ingredients List <i class="fas fa-chevron-down" id="acc-ing-icon"></i>
                                    </button>
                                    <div class="accordion-body-luxe d-none" id="acc-ing">
                                        <p>${product.ingredients}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Related Products Section -->
                <div class="row mt-5 pt-5">
                    <div class="col-12 mb-4" data-aos="fade-up">
                        <h3 class="font-heading border-bottom pb-3">Related Fragrances</h3>
                    </div>
                    <div class="row g-4" id="related-grid" data-aos="fade-up"></div>
                </div>

                <!-- Customer Reviews Section -->
                <div class="row mt-5 pt-5">
                    <div class="col-lg-10" data-aos="fade-up">
                        <h3 class="font-heading border-bottom pb-3 mb-4">Customer Reviews</h3>

                        <!-- Existing Reviews -->
                        <div id="reviews-list">
                            ${product.reviews.map(r => `
                                <div class="review-card mb-4">
                                    <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                                        <div class="d-flex align-items-center gap-3">
                                            <div class="review-avatar-circle">${r.author.charAt(0)}</div>
                                            <div>
                                                <h5 class="mb-0" style="font-size: 0.95rem; font-weight: 600;">${r.author}</h5>
                                                <span class="text-muted" style="font-size: 0.75rem;">${r.date}</span>
                                            </div>
                                        </div>
                                        <div class="product-card-rating m-0">
                                            ${Array(r.rating).fill('<i class="fas fa-star"></i>').join('')}
                                            ${Array(5 - r.rating).fill('<i class="far fa-star"></i>').join('')}
                                        </div>
                                    </div>
                                    <p class="mb-0" style="font-size: 0.88rem; color: var(--text-body); line-height: 1.6;">${r.text}</p>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Write a Review Toggle Button -->
                        <div class="text-center mt-5">
                            <button class="btn btn-luxe-primary" id="toggle-prod-review-form-btn"><i class="fas fa-pen-nib me-2"></i>Write a Review</button>
                        </div>

                        <!-- Write a Review Form (hidden by default) -->
                        <div class="write-review-card mt-4" id="prod-review-form-wrapper" style="display:none;">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h4 class="font-heading mb-0" style="font-size:1.2rem;"><i class="fas fa-pen-nib me-2"></i>Write a Review</h4>
                                <button class="btn-close-review" id="close-prod-review-form-btn" title="Close"><i class="fas fa-times"></i></button>
                            </div>
                            <form id="review-submit-form">
                                <div class="row">
                                    <div class="col-md-6 form-group-luxe">
                                        <label class="form-label-luxe">Your Name</label>
                                        <input type="text" id="review-name" class="form-control form-control-luxe" placeholder="Enter your name" required>
                                    </div>
                                    <div class="col-md-6 form-group-luxe">
                                        <label class="form-label-luxe">Your Rating</label>
                                        <div class="star-rating-selector" id="star-selector">
                                            ${[1,2,3,4,5].map(n => `<i class="far fa-star review-star" data-val="${n}" onclick="selectReviewStar(${n})"></i>`).join('')}
                                        </div>
                                        <input type="hidden" id="review-rating" value="5">
                                    </div>
                                </div>
                                <div class="form-group-luxe">
                                    <label class="form-label-luxe">Your Review</label>
                                    <textarea id="review-text" class="form-control form-control-luxe" rows="4" placeholder="Share your experience with this fragrance..." required style="resize:vertical;"></textarea>
                                </div>
                                <button type="submit" class="btn btn-luxe-primary mt-2"><i class="fas fa-paper-plane me-2"></i>Submit Review</button>
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    `;

    // Render Related Products (same collection, excluding current)
    const related = window.LUXE_PRODUCTS.filter(p => p.collection === product.collection && p.id !== product.id).slice(0, 3);
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) {
        relatedGrid.innerHTML = related.map(p => createProductCardHTML(p, 'col-6 col-md-4')).join('');
    }

    // Interactive gallery callbacks
    window.setDetailImage = function(src, thumbElement) {
        document.getElementById('main-detail-img').src = src;
        document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
        thumbElement.classList.add('active');
    };

    window.selectDetailSize = function(size, price, discount, button) {
        selectedSize = size;
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        // Update displayed price
        let finalPrice = price;
        if (size === '30ml') finalPrice = Math.round(price * 0.8);
        else if (size === '100ml') finalPrice = Math.round(price * 1.4);

        if (discount > 0) {
            finalPrice = Math.round(finalPrice * (1 - discount / 100));
        }
        document.getElementById('detail-price-display').textContent = `$${finalPrice}`;
    };

    window.adjustDetailQty = function(val) {
        const input = document.getElementById('detail-qty-input');
        let currentVal = parseInt(input.value);
        currentVal = Math.max(1, currentVal + val);
        input.value = currentVal;
    };

    window.toggleAccordion = function(id) {
        const item = document.getElementById(id);
        const icon = document.getElementById(`${id}-icon`);
        if (item.classList.contains('d-none')) {
            item.classList.remove('d-none');
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        } else {
            item.classList.add('d-none');
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
    };

    // Add buttons click events
    document.getElementById('detail-add-btn').addEventListener('click', () => {
        const qty = parseInt(document.getElementById('detail-qty-input').value);
        addToCart(product.id, selectedSize, qty);
    });

    document.getElementById('detail-wish-btn').addEventListener('click', () => {
        toggleWishlist(product.id);
        // Refresh heart icon
        const icon = document.querySelector('#detail-wish-btn i');
        if (state.wishlist.includes(product.id)) {
            icon.className = 'fas fa-heart';
        } else {
            icon.className = 'far fa-heart';
        }
    });

    // --- Star Rating Selector for Review Form ---
    let currentReviewRating = 5;

    // Default: highlight all 5 stars
    setTimeout(() => {
        selectReviewStar(5);
    }, 50);

    window.selectReviewStar = function(val) {
        currentReviewRating = val;
        const ratingInput = document.getElementById('review-rating');
        if (ratingInput) ratingInput.value = val;
        document.querySelectorAll('.review-star').forEach(star => {
            const starVal = parseInt(star.getAttribute('data-val'));
            star.className = starVal <= val ? 'fas fa-star review-star' : 'far fa-star review-star';
        });
    };

    // --- Review Submit Handler ---
    const reviewForm = document.getElementById('review-submit-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('review-name').value.trim();
            const text = document.getElementById('review-text').value.trim();
            const rating = parseInt(document.getElementById('review-rating').value);

            if (!name || !text) return;

            const reviewsList = document.getElementById('reviews-list');
            if (reviewsList) {
                const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const newCard = document.createElement('div');
                newCard.className = 'review-card mb-4';
                newCard.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-3">
                            <div class="review-avatar-circle">${name.charAt(0).toUpperCase()}</div>
                            <div>
                                <h5 class="mb-0" style="font-size: 0.95rem; font-weight: 600;">${name}</h5>
                                <span class="text-muted" style="font-size: 0.75rem;">${now}</span>
                            </div>
                        </div>
                        <div class="product-card-rating m-0">
                            ${Array(rating).fill('<i class="fas fa-star"></i>').join('')}
                            ${Array(5 - rating).fill('<i class="far fa-star"></i>').join('')}
                        </div>
                    </div>
                    <p class="mb-0" style="font-size: 0.88rem; color: var(--text-body); line-height: 1.6;">${text}</p>
                `;
                reviewsList.insertBefore(newCard, reviewsList.firstChild);
            }

            // Hide form and show write review button again
            const formWrapper = document.getElementById('prod-review-form-wrapper');
            const toggleBtn = document.getElementById('toggle-prod-review-form-btn');
            if (formWrapper) formWrapper.style.display = 'none';
            if (toggleBtn) toggleBtn.style.display = 'inline-block';

            reviewForm.reset();
            selectReviewStar(5);
            showToast('Review Posted', 'Thank you! Your review has been added.');
        });
    }

    // Toggle product review form visibility
    const toggleBtn = document.getElementById('toggle-prod-review-form-btn');
    const closeBtn = document.getElementById('close-prod-review-form-btn');
    const formWrapper = document.getElementById('prod-review-form-wrapper');

    if (toggleBtn && formWrapper) {
        toggleBtn.addEventListener('click', () => {
            formWrapper.style.display = 'block';
            toggleBtn.style.display = 'none';
            formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    if (closeBtn && formWrapper && toggleBtn) {
        closeBtn.addEventListener('click', () => {
            formWrapper.style.display = 'none';
            toggleBtn.style.display = 'inline-block';
        });
    }
}

// --- Cart Page Renderer ---
function renderCartPage(container) {
    if (state.cart.length === 0) {
        container.innerHTML = `
            <section class="section-padding text-center" style="padding-top: 150px;">
                <div class="container py-5">
                    <i class="fas fa-shopping-bag mb-4" style="font-size: 4rem; color: var(--primary-blue); opacity: 0.5;"></i>
                    <h2 class="font-heading">Your Cart is Empty</h2>
                    <p class="text-muted mt-2">Discover premium aromas and add elegance to your cart.</p>
                    <a href="#shop" class="btn btn-luxe-primary mt-4">Discover Scents</a>
                </div>
            </section>
        `;
        return;
    }

    container.innerHTML = `
        <section class="section-padding" style="padding-top: 150px;">
            <div class="container">
                <div class="section-title-wrap text-center mb-5" data-aos="fade-up">
                    <span class="section-subtitle">Your Selections</span>
                    <h1 class="section-title">The Cart</h1>
                </div>

                <div class="row g-5">
                    <!-- Products Table -->
                    <div class="col-lg-8" data-aos="fade-right">
                        <div class="cart-table-wrap table-responsive">
                            <table class="cart-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th class="text-end">Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="cart-items-body"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Summary Card -->
                    <div class="col-lg-4" data-aos="fade-left">
                        <div class="cart-summary-wrap">
                            <h3 class="summary-title">Order Summary</h3>
                            
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span id="cart-subtotal">$0</span>
                            </div>
                            
                            <div class="summary-row" id="coupon-discount-row" style="display: none;">
                                <span>Promo Discount (<span id="coupon-code-span"></span>)</span>
                                <span class="text-danger" id="cart-discount">-$0</span>
                            </div>

                            <div class="summary-row">
                                <span>Shipping</span>
                                <span class="text-success">Complimentary</span>
                            </div>

                            <div class="summary-row total">
                                <span>Total Price</span>
                                <span id="cart-total">$0</span>
                            </div>

                            <!-- Coupon Code -->
                            <div class="coupon-input-wrap">
                                <input type="text" placeholder="Promo Code (e.g. LUXURY20)" id="coupon-input" class="coupon-input" value="${state.activeCoupon ? state.activeCoupon.code : ''}">
                                <button class="coupon-btn" id="coupon-btn">Apply</button>
                            </div>

                            <a href="#checkout" class="btn btn-luxe-primary w-100 mt-2 text-center">Proceed to Checkout</a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    `;

    renderCartItemsList();
    calculateCartTotals();
    setupCartEventListeners();
}

function renderCartItemsList() {
    const tbody = document.getElementById('cart-items-body');
    if (!tbody) return;

    tbody.innerHTML = state.cart.map((item, index) => `
        <tr>
            <td>
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div>
                        <h4 class="cart-item-name">${item.name}</h4>
                        <span class="cart-item-size">${item.size} | ${item.brand}</span>
                    </div>
                </div>
            </td>
            <td>$${item.price}</td>
            <td>
                <div class="quantity-control" style="max-width: 110px;">
                    <button class="qty-btn" onclick="updateCartQty(${index}, -1)"><i class="fas fa-minus"></i></button>
                    <span class="d-flex align-items-center justify-content-center px-2" style="font-weight: 600; font-size: 0.9rem; min-width: 30px;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQty(${index}, 1)"><i class="fas fa-plus"></i></button>
                </div>
            </td>
            <td class="text-end font-heading" style="font-weight: 600;">$${item.price * item.quantity}</td>
            <td>
                <button class="cart-remove-btn" onclick="removeCartItem(${index})"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
    `).join('');
}

window.updateCartQty = function(index, delta) {
    if (state.cart[index]) {
        state.cart[index].quantity = Math.max(1, state.cart[index].quantity + delta);
        localStorage.setItem('luxe_cart', JSON.stringify(state.cart));
        renderCartItemsList();
        calculateCartTotals();
        updateCartIconCount();
    }
};

window.removeCartItem = function(index) {
    if (state.cart[index]) {
        const removedItem = state.cart[index];
        state.cart.splice(index, 1);
        localStorage.setItem('luxe_cart', JSON.stringify(state.cart));
        
        // Check if empty, reload cart page
        if (state.cart.length === 0) {
            renderCartPage(document.getElementById('app-content'));
        } else {
            renderCartItemsList();
            calculateCartTotals();
        }
        updateCartIconCount();
        showToast("Cart Updated", `${removedItem.name} removed from your selections.`);
    }
};

function calculateCartTotals() {
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');
    const discountRow = document.getElementById('coupon-discount-row');
    const couponSpan = document.getElementById('coupon-code-span');

    if (!subtotalEl || !totalEl) return;

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${subtotal}`;

    let discount = 0;
    if (state.activeCoupon) {
        discount = Math.round(subtotal * (state.activeCoupon.discountPercent / 100));
        discountEl.textContent = `-$${discount}`;
        couponSpan.textContent = `${state.activeCoupon.code} (${state.activeCoupon.discountPercent}%)`;
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }

    const total = subtotal - discount;
    totalEl.textContent = `$${total}`;
}

function setupCartEventListeners() {
    const couponBtn = document.getElementById('coupon-btn');
    const couponInput = document.getElementById('coupon-input');

    if (couponBtn && couponInput) {
        couponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();
            if (!code) {
                state.activeCoupon = null;
                localStorage.removeItem('luxe_coupon');
                calculateCartTotals();
                showToast("Promo Code Cleared", "Coupon removed from cart.");
                return;
            }

            if (VALID_COUPONS[code]) {
                state.activeCoupon = {
                    code: code,
                    discountPercent: VALID_COUPONS[code]
                };
                localStorage.setItem('luxe_coupon', JSON.stringify(state.activeCoupon));
                calculateCartTotals();
                showToast("Promo Code Applied", `Code ${code} saved ${VALID_COUPONS[code]}% discount.`);
            } else {
                showToast("Error", "Invalid coupon code.");
            }
        });
    }
}

// --- Checkout Page Renderer ---
function renderCheckoutPage(container) {
    if (state.cart.length === 0) {
        window.location.hash = "#cart";
        return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    if (state.activeCoupon) {
        discount = Math.round(subtotal * (state.activeCoupon.discountPercent / 100));
    }
    const total = subtotal - discount;

    let activePayment = 'cod'; // Default: Cash on Delivery

    container.innerHTML = `
        <section class="section-padding" style="padding-top: 150px;">
            <div class="container">
                <div class="section-title-wrap text-center mb-5" data-aos="fade-up">
                    <span class="section-subtitle">Completing Order</span>
                    <h1 class="section-title">The Checkout</h1>
                </div>

                <div class="row g-5">
                    <!-- Checkout Details Form -->
                    <div class="col-lg-7" data-aos="fade-right">
                        <div class="checkout-panel">
                            <h3 class="checkout-title">Billing & Delivery Details</h3>
                            <form id="checkout-form">
                                <div class="row">
                                    <div class="col-md-6 form-group-luxe">
                                        <label class="form-label-luxe">First Name</label>
                                        <input type="text" class="form-control form-control-luxe" required placeholder="Lord/Lady">
                                    </div>
                                    <div class="col-md-6 form-group-luxe">
                                        <label class="form-label-luxe">Last Name</label>
                                        <input type="text" class="form-control form-control-luxe" required placeholder="Surname">
                                    </div>
                                </div>
                                <div class="form-group-luxe">
                                    <label class="form-label-luxe">Email Address</label>
                                    <input type="email" class="form-control form-control-luxe" required placeholder="you@luxury.com" value="${state.currentUser ? state.currentUser.email : ''}">
                                </div>
                                <div class="form-group-luxe">
                                    <label class="form-label-luxe">Delivery Address</label>
                                    <input type="text" class="form-control form-control-luxe mb-2" required placeholder="Apartment, Street Name">
                                    <input type="text" class="form-control form-control-luxe" placeholder="City, Country">
                                </div>
                                <div class="form-group-luxe">
                                    <label class="form-label-luxe">Phone Number</label>
                                    <input type="tel" class="form-control form-control-luxe" required placeholder="+1 (555) 000-0000">
                                </div>

                                <h3 class="checkout-title mt-5">Payment Preference</h3>
                                <div class="payment-tab-container">
                                    <div class="payment-tab active" id="pay-cod-tab" onclick="setPaymentMethod('cod')">
                                        <i class="fas fa-shipping-fast"></i>
                                        Cash on Delivery
                                    </div>
                                    <div class="payment-tab" id="pay-card-tab" onclick="setPaymentMethod('card')">
                                        <i class="fas fa-credit-card"></i>
                                        Credit Card
                                    </div>
                                </div>

                                <!-- Card Details Area -->
                                <div id="card-details-panel" class="d-none">
                                    <div class="form-group-luxe">
                                        <label class="form-label-luxe">Cardholder Name</label>
                                        <input type="text" class="form-control form-control-luxe" id="card-name" placeholder="Johnathan Doe">
                                    </div>
                                    <div class="form-group-luxe">
                                        <label class="form-label-luxe">Card Number</label>
                                        <input type="text" class="form-control form-control-luxe" id="card-num" placeholder="XXXX XXXX XXXX XXXX">
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 form-group-luxe">
                                            <label class="form-label-luxe">Expiry Date</label>
                                            <input type="text" class="form-control form-control-luxe" id="card-expiry" placeholder="MM/YY">
                                        </div>
                                        <div class="col-md-6 form-group-luxe">
                                            <label class="form-label-luxe">CVV</label>
                                            <input type="text" class="form-control form-control-luxe" id="card-cvv" placeholder="XXX">
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-luxe-primary w-100 mt-4">Place Order</button>
                            </form>
                        </div>
                    </div>

                    <!-- Summary & Review Column -->
                    <div class="col-lg-5" data-aos="fade-left">
                        <div class="cart-summary-wrap">
                            <h3 class="summary-title">Order Review</h3>
                            
                            <div class="mb-4" style="max-height: 250px; overflow-y: auto;">
                                ${state.cart.map(item => `
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div class="d-flex align-items-center gap-3">
                                            <img src="${item.image}" alt="Item" style="width: 40px; height: 40px; object-fit: contain; background: rgba(11, 15, 25, 0.5); padding: 2px; border: 1px solid var(--glass-border-white);">
                                            <div>
                                                <h6 class="mb-0" style="font-size: 0.85rem;">${item.name}</h6>
                                                <small class="text-muted" style="font-size: 0.75rem;">${item.size} x ${item.quantity}</small>
                                            </div>
                                        </div>
                                        <span class="font-heading" style="font-size: 0.9rem;">$${item.price * item.quantity}</span>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>$${subtotal}</span>
                            </div>
                            
                            ${state.activeCoupon ? `
                                <div class="summary-row">
                                    <span>Discount (${state.activeCoupon.code})</span>
                                    <span class="text-danger">-$${discount}</span>
                                </div>
                            ` : ''}

                            <div class="summary-row">
                                <span>Shipping</span>
                                <span class="text-success">Complimentary</span>
                            </div>

                            <div class="summary-row total">
                                <span>Total Price</span>
                                <span>$${total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    // Payment Selection Callbacks
    window.setPaymentMethod = function(method) {
        activePayment = method;
        const codTab = document.getElementById('pay-cod-tab');
        const cardTab = document.getElementById('pay-card-tab');
        const cardPanel = document.getElementById('card-details-panel');

        // Required inputs tracking
        const cardInputs = ['card-name', 'card-num', 'card-expiry', 'card-cvv'];

        if (method === 'cod') {
            codTab.classList.add('active');
            cardTab.classList.remove('active');
            cardPanel.classList.add('d-none');
            cardInputs.forEach(id => document.getElementById(id).required = false);
        } else {
            cardTab.classList.add('active');
            codTab.classList.remove('active');
            cardPanel.classList.remove('d-none');
            cardInputs.forEach(id => document.getElementById(id).required = true);
        }
    };

    // Form submission
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Generate order info
            const orderId = 'LXA-' + Math.random().toString(36).substr(2, 8).toUpperCase();
            const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const orderedItems = [...state.cart];
            const orderTotal = total;

            // Empty local cart
            state.cart = [];
            state.activeCoupon = null;
            localStorage.removeItem('luxe_cart');
            localStorage.removeItem('luxe_coupon');
            updateCartIconCount();

            // Build rich success overlay
            const successOverlay = document.getElementById('success-overlay');
            if (successOverlay) {
                successOverlay.innerHTML = `
                    <div class="success-card">
                        <div class="success-icon"><i class="fas fa-circle-check"></i></div>
                        <h2 class="font-heading mb-1">Order Confirmed!</h2>
                        <p class="text-muted mb-4">Thank you for your purchase. Your order is being prepared.</p>

                        <!-- Order Details -->
                        <div class="order-confirm-box">
                            <div class="order-confirm-row">
                                <span><i class="fas fa-hashtag me-2"></i>Order ID</span>
                                <strong>${orderId}</strong>
                            </div>
                            <div class="order-confirm-row">
                                <span><i class="fas fa-calendar me-2"></i>Order Date</span>
                                <strong>${orderDate}</strong>
                            </div>
                            <div class="order-confirm-row">
                                <span><i class="fas fa-truck me-2"></i>Est. Delivery</span>
                                <strong>${estimatedDelivery}</strong>
                            </div>
                            <div class="order-confirm-row">
                                <span><i class="fas fa-receipt me-2"></i>Total Paid</span>
                                <strong>$${orderTotal}</strong>
                            </div>
                        </div>

                        <!-- Items Ordered -->
                        <div class="order-items-mini">
                            ${orderedItems.map(item => `
                                <div class="order-item-row">
                                    <img src="${item.image}" alt="${item.name}">
                                    <span>${item.name} <small>(${item.size} x${item.quantity})</small></span>
                                    <span>$${item.price * item.quantity}</span>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Tracking Timeline -->
                        <h5 class="font-heading mt-4 mb-3" style="font-size:1rem;"><i class="fas fa-map-marker-alt me-2"></i>Track Your Order</h5>
                        <div class="order-track-timeline">
                            <div class="track-step done">
                                <div class="track-dot"><i class="fas fa-check"></i></div>
                                <div class="track-info">
                                    <strong>Order Placed</strong>
                                    <span>${orderDate}</span>
                                </div>
                            </div>
                            <div class="track-step active">
                                <div class="track-dot"><i class="fas fa-box-open"></i></div>
                                <div class="track-info">
                                    <strong>Packaging</strong>
                                    <span>In progress</span>
                                </div>
                            </div>
                            <div class="track-step">
                                <div class="track-dot"><i class="fas fa-shipping-fast"></i></div>
                                <div class="track-info">
                                    <strong>Shipped</strong>
                                    <span>Pending</span>
                                </div>
                            </div>
                            <div class="track-step">
                                <div class="track-dot"><i class="fas fa-home"></i></div>
                                <div class="track-info">
                                    <strong>Delivered</strong>
                                    <span>${estimatedDelivery}</span>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-luxe-primary mt-4 px-5" onclick="closeSuccessOverlay()">Continue Shopping</button>
                    </div>
                `;
                successOverlay.classList.add('show');
            }
        });
    }
}

// Global helper to close success checkout overlay
window.closeSuccessOverlay = function() {
    const successOverlay = document.getElementById('success-overlay');
    if (successOverlay) {
        successOverlay.classList.remove('show');
        successOverlay.innerHTML = '';
    }
    window.location.hash = "#home";
};

// --- Login & Register Page Renderers ---
function renderLoginPage(container) {
    container.innerHTML = `
        <div class="auth-wrapper">
            <div class="auth-card" data-aos="zoom-in">
                <span class="section-subtitle d-block text-center">Privileged Access</span>
                <h1 class="auth-title">Sign In</h1>
                <p class="auth-subtitle">Unlock personalized scent recommendations and order tracking.</p>
                
                <form id="login-form">
                    <div class="form-group-luxe">
                        <label class="form-label-luxe">Email Address</label>
                        <input type="email" id="login-email" class="form-control form-control-luxe" required placeholder="you@luxury.com">
                    </div>
                    <div class="form-group-luxe">
                        <label class="form-label-luxe">Password</label>
                        <input type="password" id="login-password" class="form-control form-control-luxe" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn btn-luxe-primary w-100 mt-4">Sign In</button>
                </form>

                <div class="auth-switch">
                    Don't have an account? <a href="#register">Register Here</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        
        state.currentUser = { email: email };
        localStorage.setItem('luxe_user', JSON.stringify(state.currentUser));
        
        showToast("Welcome Back", `Successfully signed in as ${email}.`);
        window.location.hash = "#home";
    });
}

function renderRegisterPage(container) {
    container.innerHTML = `
        <div class="auth-wrapper">
            <div class="auth-card" data-aos="zoom-in">
                <span class="section-subtitle d-block text-center">Join The Circle</span>
                <h1 class="auth-title">Register</h1>
                <p class="auth-subtitle">Become a member to receive exclusive drops and customized services.</p>
                
                <form id="register-form">
                    <div class="form-group-luxe">
                        <label class="form-label-luxe">Full Name</label>
                        <input type="text" class="form-control form-control-luxe" required placeholder="Lord/Lady Name">
                    </div>
                    <div class="form-group-luxe">
                        <label class="form-label-luxe">Email Address</label>
                        <input type="email" id="reg-email" class="form-control form-control-luxe" required placeholder="you@luxury.com">
                    </div>
                    <div class="form-group-luxe">
                        <label class="form-label-luxe">Password</label>
                        <input type="password" id="reg-pass" class="form-control form-control-luxe" required placeholder="Min 6 characters">
                    </div>
                    <div class="form-group-luxe">
                        <label class="form-label-luxe">Confirm Password</label>
                        <input type="password" id="reg-pass-confirm" class="form-control form-control-luxe" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn btn-luxe-primary w-100 mt-4">Create Account</button>
                </form>

                <div class="auth-switch">
                    Already a member? <a href="#login">Sign In</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;
        const confirm = document.getElementById('reg-pass-confirm').value;

        if (pass.length < 6) {
            showToast("Error", "Password must be at least 6 characters.");
            return;
        }

        if (pass !== confirm) {
            showToast("Error", "Passwords do not match.");
            return;
        }

        state.currentUser = { email: email };
        localStorage.setItem('luxe_user', JSON.stringify(state.currentUser));

        showToast("Account Created", "Your membership is now active.");
        window.location.hash = "#home";
    });
}

// --- Contact Page Renderer ---
function renderContactPage(container) {
    container.innerHTML = `
        <section class="section-padding" style="padding-top: 150px;">
            <div class="container">
                <div class="section-title-wrap text-center mb-5" data-aos="fade-up">
                    <span class="section-subtitle">Get In Touch</span>
                    <h1 class="section-title">Contact Us</h1>
                </div>

                <div class="row g-5">
                    <!-- Contact Information Details -->
                    <div class="col-lg-5" data-aos="fade-right">
                        <div class="contact-info-card">
                            <div class="contact-info-icon"><i class="fas fa-map-marker-alt"></i></div>
                            <div>
                                <h4 class="contact-info-title">Luxe Aroma Headquarters</h4>
                                <p class="contact-info-desc mb-0">Johar Town, Lahore, Pakistan</p>
                            </div>
                        </div>

                        <div class="contact-info-card">
                            <div class="contact-info-icon"><i class="fas fa-phone-alt"></i></div>
                            <div>
                                <h4 class="contact-info-title">Phone Numbers</h4>
                                <p class="contact-info-desc mb-0">General: +92 42 1234 5678<br>Orders: +92 300 1234567</p>
                            </div>
                        </div>

                        <div class="contact-info-card">
                            <div class="contact-info-icon"><i class="fas fa-envelope"></i></div>
                            <div>
                                <h4 class="contact-info-title">Email</h4>
                                <p class="contact-info-desc mb-0">info@luxearoma.com<br>orders@luxearoma.com</p>
                            </div>
                        </div>

                        <div class="contact-info-card">
                            <div class="contact-info-icon"><i class="fas fa-clock"></i></div>
                            <div>
                                <h4 class="contact-info-title">Business Hours</h4>
                                <p class="contact-info-desc mb-0">Monday – Saturday: 10:00 AM – 7:00 PM<br>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Form & Map -->
                    <div class="col-lg-7" data-aos="fade-left">
                        <div class="checkout-panel">
                            <h3 class="checkout-title">Send a Message</h3>
                            <form id="contact-form">
                                <div class="row">
                                    <div class="col-md-6 form-group-luxe">
                                        <label class="form-label-luxe">Your Name</label>
                                        <input type="text" class="form-control form-control-luxe" required placeholder="Name">
                                    </div>
                                    <div class="col-md-6 form-group-luxe">
                                        <label class="form-label-luxe">Email Address</label>
                                        <input type="email" class="form-control form-control-luxe" required placeholder="Email">
                                    </div>
                                </div>
                                <div class="form-group-luxe">
                                    <label class="form-label-luxe">Subject</label>
                                    <input type="text" class="form-control form-control-luxe" required placeholder="Fragrance Inquiry">
                                </div>
                                <div class="form-group-luxe">
                                    <label class="form-label-luxe">Message Body</label>
                                    <textarea rows="5" class="form-control form-control-luxe" required placeholder="Describe your inquiry..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-luxe-primary w-100 mt-2">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Custom Styled Map Section -->
                <div class="row mt-5 pt-4" data-aos="zoom-in">
                    <div class="col-12">
                        <div class="map-placeholder">
                            <i class="fas fa-compass"></i>
                            <h3 class="font-heading mb-2">Luxe Aroma Store Location</h3>
                            <p class="text-muted max-width-600 mb-3">Visit us at Johar Town, Lahore. Walk-in customers are welcome during business hours.</p>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13611.311898699498!2d74.2716783!3d31.4697009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919017e3cd60e6d%3A0x2b0a6e0f3c74a613!2sJohar%20Town%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1721200000000!5m2!1sen!2s" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    `;

    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('contact-form').reset();
        showToast("Message Sent", "We will get back to you shortly.");
    });
}

// =============================================
// --- Global Reviews Section (appended to every page) ---
// =============================================

// Shared reviews store (survives page navigation within same session)
if (!window.LUXE_REVIEWS) {
    window.LUXE_REVIEWS = [
        { name: "Lady Catherine", rating: 5, date: "June 12, 2025", product: "Oud Royale", text: "Luxe Aroma has transformed my fragrance game. The Oud Royale is spectacular — rich, complex, and lasts all day. Best boutique shop online!" },
        { name: "Lord Julian",    rating: 4, date: "May 28, 2025",  product: "La Fleur d'Or", text: "Unbelievable presentation and depth. The French collection smells incredibly sophisticated. I recommend it to everyone who appreciates fine aesthetics." },
        { name: "Sofia M.",       rating: 5, date: "July 2, 2025",  product: "Rose Absolute", text: "The Rose Absolute is pure elegance in a bottle. Stays fresh and floral for hours. Packaging is stunning — arrived as a gift and looked incredible." }
    ];
}

function appendGlobalReviewsSection(container) {
    // Build HTML for reviews + toggle button + hidden write form
    const reviewsSectionHTML = `
        <section class="section-padding" id="global-reviews-section">
            <div class="container">
                <div class="section-title-wrap text-center mb-4">
                    <span class="section-subtitle">Community Voices</span>
                    <h2 class="section-title">Customer Reviews</h2>
                    <p class="text-muted mt-2" style="max-width:520px;margin:0 auto;">See what others are saying about Luxe Aroma fragrances.</p>
                </div>

                <!-- Reviews List Slider -->
                <div class="luxe-carousel-wrap">
                    <button class="carousel-control-btn carousel-control-prev" id="reviews-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="luxe-carousel-track" id="global-reviews-grid"></div>
                    <button class="carousel-control-btn carousel-control-next" id="reviews-next"><i class="fas fa-chevron-right"></i></button>
                </div>

                <!-- Write a Review Toggle Button -->
                <div class="text-center mt-5">
                    <button class="btn btn-luxe-primary" id="toggle-review-form-btn"><i class="fas fa-pen-nib me-2"></i>Write a Review</button>
                </div>

                <!-- Write Review Form (hidden by default) -->
                <div class="row mt-4" id="review-form-wrapper" style="display:none;">
                    <div class="col-lg-8 mx-auto">
                        <div class="write-review-card">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h4 class="font-heading mb-0" style="font-size:1.2rem;"><i class="fas fa-pen-nib me-2"></i>Write a Review</h4>
                                <button class="btn-close-review" id="close-review-form-btn" title="Close"><i class="fas fa-times"></i></button>
                            </div>
                            <form id="global-review-form">
                                <div class="row">
                                    <div class="col-md-6 form-group-luxe">
                                        <label class="form-label-luxe">Your Name</label>
                                        <input type="text" id="gr-name" class="form-control form-control-luxe" placeholder="Your full name" required>
                                    </div>
                                    <div class="col-md-6 form-group-luxe">
                                        <label class="form-label-luxe">Product</label>
                                        <select id="gr-product" class="form-control form-control-luxe">
                                            ${window.LUXE_PRODUCTS.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group-luxe">
                                    <label class="form-label-luxe">Your Rating</label>
                                    <div class="star-rating-selector" id="gr-star-selector">
                                        ${[1,2,3,4,5].map(n => `<i class="far fa-star review-star" data-val="${n}" onclick="grSelectStar(${n})"></i>`).join('')}
                                    </div>
                                    <input type="hidden" id="gr-rating" value="5">
                                </div>
                                <div class="form-group-luxe">
                                    <label class="form-label-luxe">Your Review</label>
                                    <textarea id="gr-text" class="form-control form-control-luxe" rows="4" placeholder="Describe your experience with this fragrance..." required style="resize:vertical;"></textarea>
                                </div>
                                <button type="submit" class="btn btn-luxe-primary mt-2"><i class="fas fa-paper-plane me-2"></i>Submit Review</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    `;

    // Newsletter section HTML (appears after reviews, before footer)
    const newsletterHTML = `
        <section class="section-padding" id="global-newsletter-section">
            <div class="container">
                <div class="newsletter-card">
                    <span class="section-subtitle">Privileged Circle</span>
                    <h2 class="newsletter-title">Subscribe to the Aroma Club</h2>
                    <p class="newsletter-desc">Be notified of limited-edition drops, private sales, and perfumery guides. Enter your email to join the elite perfume community.</p>
                    <form class="newsletter-form" id="global-newsletter-form">
                        <input type="email" placeholder="Enter your email address" class="newsletter-input" required>
                        <button type="submit" class="newsletter-btn">Subscribe</button>
                    </form>
                </div>
            </div>
        </section>
    `;

    // Append to page container
    container.insertAdjacentHTML('beforeend', reviewsSectionHTML);
    container.insertAdjacentHTML('beforeend', newsletterHTML);

    // Populate reviews grid
    const grid = document.getElementById('global-reviews-grid');
    function renderGlobalReviews() {
        if (!grid) return;
        grid.innerHTML = [...window.LUXE_REVIEWS].reverse().map(r => `
            <div class="luxe-carousel-item review-slider-item">
                <div class="review-card" style="height: 100%;">
                    <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-3">
                            <div class="review-avatar-circle">${r.name.charAt(0).toUpperCase()}</div>
                            <div>
                                <h5 class="mb-0" style="font-size:0.95rem;font-weight:600;">${r.name}</h5>
                                <span class="text-muted" style="font-size:0.75rem;">${r.date} &bull; ${r.product}</span>
                            </div>
                        </div>
                        <div class="product-card-rating m-0">
                            ${Array(r.rating).fill('<i class="fas fa-star"></i>').join('')}
                            ${Array(5 - r.rating).fill('<i class="far fa-star"></i>').join('')}
                        </div>
                    </div>
                    <p class="mb-0" style="font-size:0.88rem;color:var(--text-body);line-height:1.6;">${r.text}</p>
                </div>
            </div>
        `).join('');
        
        // Initialize reviews carousel
        window.initLuxeCarousel('global-reviews-grid', 'reviews-prev', 'reviews-next');
    }
    renderGlobalReviews();

    // Toggle review form open/close
    const toggleBtn = document.getElementById('toggle-review-form-btn');
    const closeBtn = document.getElementById('close-review-form-btn');
    const formWrapper = document.getElementById('review-form-wrapper');

    if (toggleBtn && formWrapper) {
        toggleBtn.addEventListener('click', () => {
            formWrapper.style.display = 'flex';
            toggleBtn.style.display = 'none';
            formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    if (closeBtn && formWrapper && toggleBtn) {
        closeBtn.addEventListener('click', () => {
            formWrapper.style.display = 'none';
            toggleBtn.style.display = 'inline-flex';
        });
    }

    // Star selector
    window.grSelectStar = function(val) {
        const ratingInput = document.getElementById('gr-rating');
        if (ratingInput) ratingInput.value = val;
        document.querySelectorAll('#gr-star-selector .review-star').forEach(s => {
            s.className = parseInt(s.getAttribute('data-val')) <= val ? 'fas fa-star review-star' : 'far fa-star review-star';
        });
    };
    setTimeout(() => grSelectStar(5), 50);

    // Form submit
    const reviewForm = document.getElementById('global-review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name    = document.getElementById('gr-name').value.trim();
            const product = document.getElementById('gr-product').value;
            const rating  = parseInt(document.getElementById('gr-rating').value);
            const text    = document.getElementById('gr-text').value.trim();
            if (!name || !text) return;

            const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            window.LUXE_REVIEWS.push({ name, rating, date: now, product, text });

            renderGlobalReviews();
            reviewForm.reset();
            grSelectStar(5);

            // Hide form and show button again
            if (formWrapper) formWrapper.style.display = 'none';
            if (toggleBtn) toggleBtn.style.display = 'inline-flex';

            showToast('Review Posted', 'Thank you! Your review is now live.');
        });
    }

    // Newsletter form submit
    const newsletterForm = document.getElementById('global-newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            newsletterForm.reset();
            showToast("Subscribed", "You have joined the Luxe Aroma privileges list.");
        });
    }
}

// =============================================
// --- Track Order Page Renderer ---
// =============================================
function renderTrackOrderPage(container) {
    container.innerHTML = `
        <section class="section-padding" style="padding-top: 150px;">
            <div class="container">
                <div class="section-title-wrap text-center mb-5" data-aos="fade-up">
                    <span class="section-subtitle">Order Status</span>
                    <h1 class="section-title">Track Your Order</h1>
                    <p class="text-muted mt-2" style="max-width:500px;margin:0 auto;">Enter your Order ID to see the live status of your Luxe Aroma shipment.</p>
                </div>

                <!-- Order ID Input -->
                <div class="row justify-content-center" data-aos="fade-up">
                    <div class="col-lg-6">
                        <div class="write-review-card">
                            <form id="track-order-form" class="d-flex flex-column flex-sm-row gap-3">
                                <input type="text" id="track-order-input" class="form-control form-control-luxe flex-grow-1" placeholder="e.g. LXA-A1B2C3D4" required style="letter-spacing:1px;">
                                <button type="submit" class="btn btn-luxe-primary w-100 w-sm-auto" style="white-space:nowrap;"><i class="fas fa-search me-2"></i>Track</button>
                            </form>
                            <p class="text-muted mt-3 mb-0" style="font-size:0.8rem;"><i class="fas fa-info-circle me-1"></i>Your Order ID was shown after placing your order and sent to your email.</p>
                        </div>
                    </div>
                </div>

                <!-- Tracking Result (hidden initially) -->
                <div class="row justify-content-center mt-5" id="track-result-wrap" style="display:none !important;">
                    <div class="col-lg-7" data-aos="fade-up">
                        <div class="track-result-card">

                            <!-- Order Summary Header -->
                            <div class="track-result-header">
                                <div>
                                    <span class="section-subtitle d-block mb-1">Order Found</span>
                                    <h3 class="font-heading mb-0" id="track-order-id-display"></h3>
                                </div>
                                <span class="track-status-badge" id="track-status-badge">In Transit</span>
                            </div>

                            <!-- Order Info Rows -->
                            <div class="order-confirm-box mt-4">
                                <div class="order-confirm-row">
                                    <span><i class="fas fa-calendar me-2"></i>Order Date</span>
                                    <strong id="track-order-date"></strong>
                                </div>
                                <div class="order-confirm-row">
                                    <span><i class="fas fa-map-marker-alt me-2"></i>Shipping To</span>
                                    <strong id="track-order-address"></strong>
                                </div>
                                <div class="order-confirm-row">
                                    <span><i class="fas fa-truck me-2"></i>Est. Delivery</span>
                                    <strong id="track-est-delivery"></strong>
                                </div>
                            </div>

                            <!-- Timeline -->
                            <h5 class="font-heading mt-4 mb-3" style="font-size:1rem;">Shipment Timeline</h5>
                            <div class="track-timeline-vertical" id="track-timeline-vertical"></div>

                        </div>
                    </div>
                </div>

                <!-- Not Found Result -->
                <div class="row justify-content-center mt-4" id="track-notfound-wrap" style="display:none !important;">
                    <div class="col-lg-6 text-center">
                        <div class="write-review-card">
                            <i class="fas fa-search-minus mb-3" style="font-size:2.5rem;color:var(--text-muted);"></i>
                            <h4 class="font-heading">Order Not Found</h4>
                            <p class="text-muted">We could not find an order with that ID. Please double-check the ID from your confirmation email and try again.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    `;

    document.getElementById('track-order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('track-order-input').value.trim().toUpperCase();
        const resultWrap   = document.getElementById('track-result-wrap');
        const notFoundWrap = document.getElementById('track-notfound-wrap');

        // Simulate: any input starting with LXA- is valid
        const isValid = input.startsWith('LXA-') && input.length >= 8;

        if (isValid) {
            // Hide not found, show result
            notFoundWrap.style.display = 'none';
            resultWrap.style.removeProperty('display');
            resultWrap.style.display = 'flex';

            // Populate order info
            const orderDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                .toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
            const estDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                .toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

            document.getElementById('track-order-id-display').textContent = input;
            document.getElementById('track-order-date').textContent    = orderDate;
            document.getElementById('track-order-address').textContent  = 'Confirmed at Checkout';
            document.getElementById('track-est-delivery').textContent   = estDelivery;

            // Build vertical timeline
            const steps = [
                { icon: 'fa-check',         label: 'Order Placed',       sub: orderDate,               done: true,  active: false },
                { icon: 'fa-box-open',      label: 'Packaging',          sub: 'Completed',              done: true,  active: false },
                { icon: 'fa-shipping-fast', label: 'Shipped',            sub: 'In Transit',             done: false, active: true  },
                { icon: 'fa-home',          label: 'Out for Delivery',   sub: 'Expected soon',          done: false, active: false },
                { icon: 'fa-smile',         label: 'Delivered',          sub: estDelivery,              done: false, active: false },
            ];

            document.getElementById('track-timeline-vertical').innerHTML = steps.map(s => `
                <div class="track-timeline-item ${s.done ? 'done' : ''} ${s.active ? 'active' : ''}">
                    <div class="track-vdot"><i class="fas ${s.icon}"></i></div>
                    <div class="track-vinfo">
                        <strong>${s.label}</strong>
                        <span>${s.sub}</span>
                    </div>
                </div>
            `).join('');

        } else {
            resultWrap.style.display = 'none';
            notFoundWrap.style.removeProperty('display');
            notFoundWrap.style.display = 'flex';
        }
    });
}

// --- Card HTML Generator Utility ---
function createProductCardHTML(p, gridClass = 'col-lg-3 col-md-6') {
    const isWishlisted = state.wishlist.includes(p.id);
    const starHTML = Array(Math.floor(p.rating)).fill('<i class="fas fa-star"></i>').join('');
    const halfStarHTML = p.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : '';
    
    // Apply discount if exists
    let finalPrice = p.price;
    let oldPriceHTML = "";
    if (p.discount > 0) {
        finalPrice = Math.round(p.price * (1 - p.discount / 100));
        oldPriceHTML = `<span class="product-card-price discounted">$${p.price}</span>`;
    }

    return `
        <div class="${gridClass}" data-aos="fade-up">
            <div class="product-card">
                ${p.discount > 0 ? `<div class="product-card-badge">Sale -${p.discount}%</div>` : ''}
                
                <button class="product-card-wishlist ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${p.id})">
                    <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
                </button>
                
                <a href="#product-details/${p.id}">
                    <div class="product-card-img-wrap">
                        <img src="${p.image}" alt="${p.name}" class="product-card-img">
                    </div>
                    <span class="product-card-brand">${p.brand}</span>
                    <h3 class="product-card-title">${p.name}</h3>
                </a>

                <div class="product-card-rating">
                    ${starHTML}${halfStarHTML}
                    <span>(${p.rating})</span>
                </div>

                <div class="product-card-footer">
                    <div>
                        ${oldPriceHTML}
                        <span class="product-card-price">$${finalPrice}</span>
                    </div>
                    <button class="product-card-btn" onclick="addToCart(${p.id}, '50ml', 1)"><i class="fas fa-shopping-cart"></i></button>
                </div>
            </div>
        </div>
    `;
}

// Global user profile toggle helper (in navbar)
window.handleUserProfileClick = function() {
    if (state.currentUser) {
        // Sign out
        state.currentUser = null;
        localStorage.removeItem('luxe_user');
        showToast("Signed Out", "You have signed out of your account.");
        window.location.hash = "#home";
    } else {
        window.location.hash = "#login";
    }
};

// Reusable Luxury Carousel Initialization with Controls & Touch Swiping
window.initLuxeCarousel = function(trackId, prevBtnId, nextBtnId) {
    const track = document.getElementById(trackId);
    let prevBtn = document.getElementById(prevBtnId);
    let nextBtn = document.getElementById(nextBtnId);
    if (!track || !prevBtn || !nextBtn) return;

    // Clone buttons to strip old event listeners and prevent stacking
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    prevBtn = newPrevBtn;
    nextBtn = newNextBtn;

    let scrollPos = 0;

    
    // Swipe support variables
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    const getCardWidth = () => {
        const firstItem = track.querySelector('.luxe-carousel-item');
        if (!firstItem) return 300;
        const computedStyle = window.getComputedStyle(track);
        const gapVal = parseFloat(computedStyle.gap) || 0;
        return firstItem.offsetWidth + gapVal;
    };

    const updateSliderPosition = () => {
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(-${scrollPos}px)`;
    };

    nextBtn.addEventListener('click', () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) return;
        const step = getCardWidth();
        scrollPos = Math.min(scrollPos + step, maxScroll);
        updateSliderPosition();
    });

    prevBtn.addEventListener('click', () => {
        const step = getCardWidth();
        scrollPos = Math.max(scrollPos - step, 0);
        updateSliderPosition();
    });

    // Touch swiping logic for touchscreens
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslate = -scrollPos + diff;

        // Add edge resistance
        const maxScroll = -(track.scrollWidth - track.clientWidth);
        if (currentTranslate > 0) {
            currentTranslate = currentTranslate * 0.3;
        } else if (currentTranslate < maxScroll) {
            currentTranslate = maxScroll + (currentTranslate - maxScroll) * 0.3;
        }

        track.style.transform = `translateX(${currentTranslate}px)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        // Calculate ending scroll position based on where dragging stopped
        const maxScroll = track.scrollWidth - track.clientWidth;
        const currentScroll = -currentTranslate;

        // Snap to nearest item width boundary
        const step = getCardWidth();
        let index = Math.round(currentScroll / step);
        scrollPos = Math.max(0, Math.min(index * step, maxScroll));
        
        updateSliderPosition();
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        scrollPos = 0;
        track.style.transform = `translateX(0px)`;
    });
};

