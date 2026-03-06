document.addEventListener('DOMContentLoaded', () => {
    // ─── DOM Elements ─────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    const siteOverlay = document.getElementById('siteOverlay');
    const cartOverlay = document.getElementById('cartOverlay');
    const openCartBtn = document.getElementById('openCart');
    const closeCartBtn = document.getElementById('closeCart');
    const searchOverlay = document.getElementById('searchOverlay');
    const openSearchBtn = document.getElementById('openSearch');
    const closeSearchBtn = document.getElementById('closeSearch');
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburgerBtn = document.getElementById('hamburger');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenu');

    // ─── Cart State ───────────────────────────────────────────
    let cart = [];

    const menuItems = [
        { id: 1, name: 'Thick Cold Coffee', price: 200, desc: 'Our Signature Drink', category: 'beverages' },
        { id: 2, name: 'Pesto & Cheese Sandwich', price: 250, desc: 'Fresh & Flavorful', category: 'sandwiches' },
        { id: 3, name: 'Veg Overloaded Pizza', price: 350, desc: 'Perfectly Made Every Time', category: 'italian' },
        { id: 4, name: 'Alfredo Spaghetti', price: 300, desc: 'Creamy & Delicious', category: 'italian' },
        { id: 5, name: 'Classic Waffle', price: 180, desc: 'Crispy & Sweet', category: 'quick-bites' },
        { id: 6, name: 'Hot Cappuccino', price: 150, desc: 'Rich & Aromatic', category: 'beverages' },
        { id: 7, name: 'Margherita Pizza', price: 280, desc: 'Classic Italian', category: 'italian' },
        { id: 8, name: 'Grilled Sandwich', price: 180, desc: 'Toasted Perfection', category: 'sandwiches' },
        { id: 9, name: 'French Fries', price: 120, desc: 'Crispy Golden', category: 'quick-bites' },
        { id: 10, name: 'Mango Smoothie', price: 220, desc: 'Tropical Delight', category: 'beverages' },
    ];

    // ─── Navbar Scroll Effect ────────────────────────────────
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ─── Active Nav Link on Scroll ───────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-left .nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    const setActiveSection = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', setActiveSection);

    // ─── Overlay Helpers ──────────────────────────────────────
    const openModal = (modal) => {
        modal.classList.add('active');
        siteOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        siteOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const closeAll = () => {
        cartOverlay.classList.remove('active');
        mobileMenu.classList.remove('active');
        searchOverlay.classList.remove('active');
        siteOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    siteOverlay.addEventListener('click', closeAll);

    // ─── Cart Functions ───────────────────────────────────────
    const addToCart = (itemId) => {
        const item = menuItems.find(m => m.id === itemId);
        if (!item) return;

        const existing = cart.find(c => c.id === itemId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        updateCartUI();
        showToast(`${item.name} added to cart!`);
    };

    const removeFromCart = (itemId) => {
        cart = cart.filter(c => c.id !== itemId);
        updateCartUI();
    };

    const updateQty = (itemId, delta) => {
        const item = cart.find(c => c.id === itemId);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartUI();
        }
    };

    const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

    const updateCartUI = () => {
        const cartBody = document.querySelector('.cart-body');
        const cartFooter = document.querySelector('.cart-footer');
        const badges = document.querySelectorAll('.cart-badge-circle');
        const count = getCartCount();
        const total = getCartTotal();

        // Update badge
        badges.forEach(b => {
            b.textContent = count;
            if (count > 0) {
                b.classList.add('has-items');
            } else {
                b.classList.remove('has-items');
            }
        });

        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="empty-state">
                    <span class="material-symbols-outlined large-icon">shopping_cart</span>
                    <p>Your cart is empty! Order something delicious.</p>
                    <button class="btn btn-primary close-cart-cta">Browse Menu</button>
                </div>
            `;
            cartBody.querySelector('.close-cart-cta')?.addEventListener('click', () => closeModal(cartOverlay));
            cartFooter.innerHTML = `
                <div class="subtotal">
                    <span>Subtotal</span>
                    <span>₹0</span>
                </div>
                <a href="#menu" class="btn btn-primary full-width" style="text-decoration:none; text-align:center;">Browse Menu</a>
            `;
        } else {
            cartBody.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">₹${item.price}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn minus" data-id="${item.id}">−</button>
                        <span class="qty-display">${item.qty}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-total">₹${item.price * item.qty}</div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
            `).join('');

            // Add event listeners to cart controls
            cartBody.querySelectorAll('.qty-btn.minus').forEach(btn => {
                btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), -1));
            });
            cartBody.querySelectorAll('.qty-btn.plus').forEach(btn => {
                btn.addEventListener('click', () => updateQty(parseInt(btn.dataset.id), 1));
            });
            cartBody.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
            });

            cartFooter.innerHTML = `
                <div class="subtotal">
                    <span>Subtotal</span>
                    <span>₹${total}</span>
                </div>
                <button class="btn btn-primary full-width checkout-btn">
                    <span class="material-symbols-outlined small-icon">shopping_bag</span>
                    Order on WhatsApp
                </button>
            `;

            cartFooter.querySelector('.checkout-btn')?.addEventListener('click', () => {
                const orderText = cart.map(i => `${i.name} x${i.qty} - ₹${i.price * i.qty}`).join('%0A');
                const msg = `Hi Suto Cafe! 🍕%0A%0AI'd like to order:%0A${orderText}%0A%0ATotal: ₹${total}`;
                window.open(`https://wa.me/919663257373?text=${msg}`, '_blank');
            });
        }
    };

    // ─── Cart Controls ────────────────────────────────────────
    openCartBtn.addEventListener('click', () => openModal(cartOverlay));
    closeCartBtn.addEventListener('click', () => closeModal(cartOverlay));

    // ─── Add to Cart Buttons ──────────────────────────────────
    document.querySelectorAll('.add-to-cart').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(index + 1); // IDs 1-4 for the 4 featured items

            // Button animation
            btn.classList.add('added');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined small-icon">check</span> Added!';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('added');
            }, 1500);
        });
    });

    // ─── Toast Notification ───────────────────────────────────
    const showToast = (message) => {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `<span class="material-symbols-outlined small-icon">check_circle</span> ${message}`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    };

    // ─── Search ───────────────────────────────────────────────
    openSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const input = searchOverlay.querySelector('.search-input');
            if (input) {
                input.focus();
                input.value = '';
            }
            // Clear previous results
            const resultsContainer = searchOverlay.querySelector('.search-results');
            if (resultsContainer) resultsContainer.innerHTML = '';
        }, 300);
    });
    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let resultsContainer = searchOverlay.querySelector('.search-results');
            if (!resultsContainer) {
                resultsContainer = document.createElement('div');
                resultsContainer.className = 'search-results';
                searchInput.parentElement.appendChild(resultsContainer);
            }

            if (query.length < 2) {
                resultsContainer.innerHTML = query.length > 0
                    ? '<p class="search-hint">Keep typing...</p>'
                    : '';
                return;
            }

            const results = menuItems.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.desc.toLowerCase().includes(query)
            );

            if (results.length === 0) {
                resultsContainer.innerHTML = '<p class="search-no-results">No items found. Try a different search.</p>';
            } else {
                resultsContainer.innerHTML = results.map(item => `
                    <div class="search-result-item" data-id="${item.id}">
                        <div class="search-result-info">
                            <h4>${item.name}</h4>
                            <p>${item.desc} • <span class="search-category">${item.category}</span></p>
                        </div>
                        <div class="search-result-action">
                            <span class="search-result-price">₹${item.price}</span>
                            <button class="btn btn-secondary search-add-btn" data-id="${item.id}">Add</button>
                        </div>
                    </div>
                `).join('');

                resultsContainer.querySelectorAll('.search-add-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        addToCart(parseInt(btn.dataset.id));
                        btn.textContent = 'Added!';
                        btn.disabled = true;
                        setTimeout(() => {
                            btn.textContent = 'Add';
                            btn.disabled = false;
                        }, 1500);
                    });
                });
            }
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });

    // ─── Mobile Menu ──────────────────────────────────────────
    hamburgerBtn.addEventListener('click', () => openModal(mobileMenu));
    closeMobileMenuBtn.addEventListener('click', () => closeModal(mobileMenu));

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => closeModal(mobileMenu));
    });

    // ─── Smooth Scroll for Anchor Links ──────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                closeAll(); // Close any open modals
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── Scroll Animations (IntersectionObserver) ─────────────
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        animateObserver.observe(el);
    });

    // ─── Parallax on Scroll ───────────────────────────────────
    const parallaxElements = document.querySelectorAll('.parallax');
    const parallaxImages = document.querySelectorAll('.parallax-img');

    const handleParallax = () => {
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.3;
                const offset = rect.top * speed;
                el.style.transform = `translateY(${offset}px)`;
            }
        });
        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.08;
                img.style.objectPosition = `50% ${50 + (rect.top * speed)}%`;
            }
        });
    };

    window.addEventListener('scroll', handleParallax, { passive: true });

    // ─── Counter Animation for Stats ──────────────────────────
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current) + '+';
                    }
                }, 20);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ─── Image Lazy Loading ───────────────────────────────────
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ─── Reveal on Load (hero elements) ───────────────────────
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.querySelectorAll('.fade-up').forEach((el, i) => {
            el.style.transitionDelay = `${0.2 + i * 0.15}s`;
            setTimeout(() => el.classList.add('visible'), 100);
        });
    }

    // ─── Back to Top Button ───────────────────────────────────
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Copyright Year ───────────────────────────────────────
    const yearEl = document.querySelector('.copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ─── Initialize Cart UI ───────────────────────────────────
    updateCartUI();

    // ─── Staggered section reveals ────────────────────────────
    document.querySelectorAll('.section').forEach(section => {
        const children = section.querySelectorAll('.fade-up');
        children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
        });
    });
});
