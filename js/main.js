// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // ===== LOADER ===== 
    const loaderWrapper = document.getElementById('loader-wrapper');
    const enterBtn = document.getElementById('enter-btn');
    const loaderPercent = document.querySelector('.loader-percent');
    const mainContent = document.getElementById('main-content');

    // Set initial state
    if (mainContent) {
        mainContent.style.visibility = 'hidden';
        mainContent.style.opacity = '0';
    }

    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        if (loaderPercent) {
            loaderPercent.textContent = String(Math.floor(progress)).padStart(2, '0') + '%';
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            if (enterBtn) {
                enterBtn.disabled = false;
                enterBtn.style.cursor = 'pointer';
                enterBtn.style.opacity = '1';
            }
        }
    }, 300);

    // Enter button click handler
    if (enterBtn) {
        enterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideLoader();
        });
    }

    // Hide loader function
    function hideLoader() {
        if (loaderWrapper && mainContent) {
            loaderWrapper.classList.add('hidden');
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 0.6s ease';
        }
    }

    // ===== NAVIGATION ===== 
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ===== SCROLL SPY ===== 
    window.addEventListener('scroll', () => {
        let current = '';
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ===== SMOOTH SCROLL ===== 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== DYNAMIC YEAR ===== 
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS ===== 
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    document.querySelectorAll('.about-card, .work-card, .contact-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ===== BACKGROUND INTERACTION ===== 
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });

    // ===== AUDIO LOGIC ===== 
    const bgMusic = document.getElementById('bg-music');
    let isMusicStarted = false;

    if (bgMusic) {
        bgMusic.volume = 0.05; // Lock volume at 5%
        bgMusic.loop = true;   // Ensure looping is enabled
    }

    const startMusic = () => {
        if (!isMusicStarted && bgMusic) {
            bgMusic.play().then(() => {
                isMusicStarted = true;
                console.log("Ambient music started at 0% loading");
                // Cleanup interaction listeners once started
                document.removeEventListener('click', startMusic);
                document.removeEventListener('keydown', startMusic);
                document.removeEventListener('touchstart', startMusic);
            }).catch(error => {
                console.log("Immediate autoplay blocked, waiting for first interaction");
            });
        }
    };

    // 1. Attempt to start immediately (0% loading)
    startMusic();

    // 2. Fallback: Start on first interaction (required by browsers)
    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);
    document.addEventListener('touchstart', startMusic);

    // ===== CONTENT PROTECTION ===== 
    
    // Disable Right-Click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable Shortcuts
    document.addEventListener('keydown', (e) => {
        // Disable F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+Shift+I, J, C, U
        if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
    });
});
