document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
        });
    }

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', e => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .hamburger');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
        });
    }

    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Staggered Animation Delay ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el, i) => el.style.setProperty('--i', i));

    // --- Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    // --- Update Footer Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Header, Nav Highlighting, Back to Top ---
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section[id]');
    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', window.scrollY > 300);
        }
        let currentSectionId = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - (header.offsetHeight || 65) ) {
                currentSectionId = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(currentSectionId));
        });
    });

    // --- Hero Typing Animation ---
    if (typeof Typed !== 'undefined') {
        new Typed('#typing-target', { strings: ["Computer Science Student", "Web Developer", "UI/UX Enthusiast", "Creative Problem-Solver"], typeSpeed: 50, backSpeed: 25, backDelay: 1500, startDelay: 500, loop: true, cursorChar: '|' });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const applyTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            document.body.classList.toggle('light-theme', savedTheme === 'light');
            themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        };
        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
        applyTheme();
    }

    // --- 3D Project Card Tilt Effect ---
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.project-card'), { max: 15, speed: 400, glare: true, "max-glare": 0.5 });
    }
    
    // --- AJAX Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const status = document.getElementById('form-status');
            status.innerHTML = 'Sending...';
            status.style.display = 'block';
            status.className = 'pending';
            fetch(e.target.action, { method: 'POST', body: new FormData(e.target), headers: { 'Accept': 'application/json' } })
                .then(res => {
                    if (res.ok) {
                        status.innerHTML = "Thanks! I'll get back to you soon.";
                        status.className = 'success';
                        contactForm.reset();
                    } else {
                        res.json().then(data => {
                            status.innerHTML = data.errors?.map(e => e.message).join(', ') || "Oops! There was a problem.";
                            status.className = 'error';
                        });
                    }
                }).catch(() => {
                    status.innerHTML = "Oops! There was a problem.";
                    status.className = 'error';
                });
        });
    }

    // --- Email Copy Feedback ---
    const emailLink = document.querySelector('.email-direct a');
    if(emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(this.textContent).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = 'Email Copied! <i class="fas fa-check"></i>';
                this.style.color = 'var(--primary-color)';
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.color = '';
                }, 2000);
            });
        });
    }

    // --- Project Carousel Logic ---
    const carousel = document.querySelector('.project-carousel');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev-btn');
        const nextBtn = document.querySelector('.carousel-btn.next-btn');
        const scrollAmount = () => carousel.querySelector('.project-card').offsetWidth + 30;

        prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

        let isDown = false, startX, scrollLeft;
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener('mouseleave', () => { isDown = false; carousel.classList.remove('active'); });
        carousel.addEventListener('mouseup', () => { isDown = false; carousel.classList.remove('active'); });
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }
});