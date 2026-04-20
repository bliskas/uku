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
