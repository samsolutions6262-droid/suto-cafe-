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

    // ─── Navbar Scroll Effect  ────────────────────────────────
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

    // ─── Cart Logic ──────────────────────────────────────────
    let cartCount = 0;
    const cartBadge = document.querySelector('.cart-badge-circle');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    const updateCart = () => {
        cartCount++;
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.style.transform = 'scale(1.2)';
            setTimeout(() => cartBadge.style.transform = 'scale(1)', 200);
        }
    };

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            updateCart();
            // Optional: show a small toast or change button text
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Added! ✓';
            btn.style.backgroundColor = 'var(--color-primary-green)';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1000);
        });
    });

    const closeAll = () => {
        closeModal(cartOverlay);
        closeModal(mobileMenu);
        searchOverlay.classList.remove('active');
        siteOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    siteOverlay.addEventListener('click', closeAll);

    // ─── Cart ─────────────────────────────────────────────────
    openCartBtn.addEventListener('click', () => openModal(cartOverlay));
    closeCartBtn.addEventListener('click', () => closeModal(cartOverlay));
    document.querySelector('.close-cart-cta')?.addEventListener('click', () => closeModal(cartOverlay));

    // ─── Search Functionality ─────────────────────────────────
    const searchInput = searchOverlay.querySelector('.search-input');
    openSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput?.focus(), 300);
    });

    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // search logic: filter fav-cards and categories titles
        const searchItems = document.querySelectorAll('.product-title, .card-title, .value-title');
        searchItems.forEach(item => {
            const parent = item.closest('.product-card, .category-card, .value-card');
            if (item.textContent.toLowerCase().includes(query)) {
                if (parent) parent.style.display = '';
            } else {
                if (parent) parent.style.display = query.length > 2 ? 'none' : '';
            }
        });
    });

    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Reset visibility
        document.querySelectorAll('.product-card, .category-card, .value-card').forEach(el => el.style.display = '');
    });
    // Close search on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });

    // ─── Mobile Menu ──────────────────────────────────────────
    hamburgerBtn.addEventListener('click', () => openModal(mobileMenu));
    closeMobileMenuBtn.addEventListener('click', () => closeModal(mobileMenu));

    // Close mobile menu when a link is clicked
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
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── Newsletter Form ──────────────────────────────────────
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.form-input');
            const successMsg = document.querySelector('.success-msg');
            if (emailInput.value) {
                newsletterForm.style.display = 'none';
                successMsg.style.display = 'block';
                // Reset after 4s
                setTimeout(() => {
                    newsletterForm.style.display = 'flex';
                    successMsg.style.display = 'none';
                    emailInput.value = '';
                }, 4000);
            }
        });
    }

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

    document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
        animateObserver.observe(el);
    });

    // ─── Parallax on Scroll ───────────────────────────────────
    const parallaxElements = document.querySelectorAll('.parallax');
    const parallaxImages = document.querySelectorAll('.parallax-img');

    const handleParallax = () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.3;
                el.style.transform = `translateY(${scrolled * speed}px)`;
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

    // ─── Copyright Year ───────────────────────────────────────
    const yearEl = document.querySelector('.copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
