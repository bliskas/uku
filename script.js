(() => {
    'use strict';

    // ============ NAV: scroll shadow + mobile toggle ============
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav__links');

    const onScroll = () => {
        if (window.scrollY > 20) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open);
            toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        });

        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============ Scrollspy: resalta la sección actual en la nav ============
    const navAnchors = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
    const sectionMap = new Map();
    navAnchors.forEach(a => {
        const id = a.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        if (section) sectionMap.set(section, a);
    });

    if (sectionMap.size) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const link = sectionMap.get(entry.target);
                if (!link) return;
                if (entry.isIntersecting) {
                    navAnchors.forEach(a => a.classList.remove('is-active'));
                    link.classList.add('is-active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        sectionMap.forEach((_, section) => spy.observe(section));
    }

    // ============ Botón 'volver arriba' ============
    const backTop = document.getElementById('backToTop');
    if (backTop) {
        const toggleBackTop = () => {
            if (window.scrollY > 600) backTop.classList.add('is-visible');
            else backTop.classList.remove('is-visible');
        };
        window.addEventListener('scroll', toggleBackTop, { passive: true });
        backTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        toggleBackTop();
    }

    // ============ Reveal on scroll ============
    const revealTargets = document.querySelectorAll(
        '.hero__copy, .hero__visual, .value, .service, .gallery__item, .step, .about__image, .about__copy, .faq__item, .contact__copy, .contact__form, .section-head'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => io.observe(el));

    // ============ FAQ single-open behavior ============
    const faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item) other.open = false;
                });
            }
        });
    });

    // ============ Current year in footer ============
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ============ Lightbox para fotos de moldes ============
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && lightboxImg) {
        const openLightbox = (src, alt) => {
            lightboxImg.src = src;
            lightboxImg.alt = alt || '';
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            // limpia tras la transición
            setTimeout(() => { lightboxImg.src = ''; }, 250);
        };

        document.querySelectorAll('[data-lightbox]').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-lightbox');
                const alt = btn.getAttribute('aria-label') || '';
                openLightbox(src, alt);
            });
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
        });
    }

    // ============ Form: open WhatsApp with message ============
    const form = document.querySelector('.contact__form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = form.nombre.value.trim();
            const email = form.email.value.trim();
            const semana = form.semana.value.trim();
            const zona = form.zona.value.trim();
            const mensaje = form.mensaje.value.trim();

            if (!nombre || !email) {
                form.querySelector('[name="nombre"]').focus();
                return;
            }

            const text = [
                `Hola, soy ${nombre}.`,
                email ? `Email: ${email}` : null,
                semana ? `Semana: ${semana}` : null,
                zona ? `Zona: ${zona}` : null,
                mensaje ? `\n${mensaje}` : null
            ].filter(Boolean).join('\n');

            // IMPORTANT: actualiza este número en index.html y aquí
            const phone = '34689187877';
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
        });
    }
})();
