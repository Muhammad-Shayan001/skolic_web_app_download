document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. FLOATING HEADER SCROLL EFFECT
    // ==========================================================================
    const siteHeader = document.getElementById('siteHeader');
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        // Throttle scroll events for better performance
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }

            highlightNavOnScroll();
        }, 10);
    }, { passive: true });

    // ==========================================================================
    // 2. MOBILE MENU DRAWER TOGGLE
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navItems = document.querySelectorAll('.nav-item');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('mobile-active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('mobile-active');
            });
        });
    }

    // Navigation highlight mechanism
    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    // ==========================================================================
    // 3. PHONE MOCKUP SCREEN SCREEN SLIDER (AUTO & MANUAL)
    // ==========================================================================
    const phoneSliderTrack = document.getElementById('phoneSliderTrack');
    const phoneDots = document.querySelectorAll('.phone-dots .phone-dot');
    let currentSlide = 0;
    const totalSlides = phoneDots.length;
    let slideInterval;

    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= totalSlides) return;

        currentSlide = slideIndex;

        // Calculate offset percentage (each slide occupies 33.333% of track)
        const offset = -slideIndex * 33.333;
        phoneSliderTrack.style.transform = `translateX(${offset}%)`;

        // Update active dots
        phoneDots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % totalSlides;
            goToSlide(nextSlide);
        }, 4000); // Shift screen every 4 seconds
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Set up click listeners for dots
    phoneDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            stopAutoSlide();
            const slideTarget = parseInt(e.target.getAttribute('data-slide'));
            goToSlide(slideTarget);
            // Restart after inactivity
            startAutoSlide();
        });
    });

    // Start sliding loops
    if (phoneSliderTrack && phoneDots.length > 0) {
        startAutoSlide();
    }

    // ==========================================================================
    // 4. ABOUT ACCORDIONS (AUDIENCE TARGET CHANGER)
    // ==========================================================================
    const audienceItems = document.querySelectorAll('.audience-item');

    audienceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active status from others
            audienceItems.forEach(card => card.classList.remove('active'));
            // Add active status to clicked item
            item.classList.add('active');
        });
    });

    // ==========================================================================
    // 5. INSTALL GUIDE MOCK TOGGLE CONTROLS
    // ==========================================================================
    const mockToggle = document.getElementById('mockToggle');
    if (mockToggle) {
        mockToggle.addEventListener('click', () => {
            mockToggle.classList.toggle('active');
        });
    }

    // ==========================================================================
    // 6. FAQ ACCORDION EXPANSIONS
    // ==========================================================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const card = question.parentElement;
            const isActive = card.classList.contains('active');

            // Close all other FAQs (exclusive drawer behavior)
            document.querySelectorAll('.faq-card').forEach(item => {
                item.classList.remove('active');
                const ans = item.querySelector('.faq-answer');
                ans.style.maxHeight = '0px';
            });

            if (!isActive) {
                card.classList.add('active');
                const answer = card.querySelector('.faq-answer');
                // Adjust height dynamically based on scrollHeight
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ==========================================================================
    // 7. DYNAMIC QR CODE DISTRIBUTION SYSTEM
    // ==========================================================================
    const qrContainer = document.getElementById('qrcode');
    const qrSpinner = document.getElementById('qrSpinner');

    if (qrContainer) {
        // Use the Vercel app URL for QR code
        const downloadUrl = 'https://skolic-schools-management-app.vercel.app/';

        // Trigger QR load
        generateQRImage(downloadUrl);
    }

    function generateQRImage(url) {
        if (qrSpinner) qrSpinner.style.display = 'block';

        const size = '150x150';
        const apiEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(url)}`;

        const img = new Image();
        img.src = apiEndpoint;
        img.alt = 'Download APK QR Link';
        img.className = 'qr-image-rendered';

        img.onload = () => {
            if (qrSpinner) qrSpinner.style.display = 'none';
            // Replace fallback vector content with custom loaded QR image
            qrContainer.innerHTML = '';
            qrContainer.appendChild(img);
        };

        img.onerror = () => {
            if (qrSpinner) qrSpinner.style.display = 'none';
        };
    }
});
