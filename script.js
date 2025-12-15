// Navigation & Mobile Menu
document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
            const navLinks = document.querySelector(".nav-links");
            const menuToggle = document.getElementById("mobile-menu");
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
            }
        }
    });
});

const menuToggle = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });
}

// Scroll Animation Observer
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    // Select Manual Elements
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    // Auto-Select ALL Text Elements for Global Animation
    const textElements = document.querySelectorAll("p, h3, li, span, h2, a.btn");

    textElements.forEach(el => {
        // Avoid animating things that already have it or are UI
        if (!el.classList.contains("animate-on-scroll") && !el.closest('nav') && !el.closest('.music-toggle')) {
            el.classList.add("reveal-text");
            observer.observe(el);
        }
    });

    animatedElements.forEach((el) => observer.observe(el));

    // 4D Immersive Features
    initWarpBackground(); // Futuristic 4D
    initGlobalTilt();
    initCustomCursor();
    initChromaticHover();
    initMomentumScroll();
    initMusicPlayer();
});

// 2. Futuristic 4D Warp Background (True 3D Starfield)
function initWarpBackground() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height;
    let stars = [];
    const numStars = 1500; // Hyperdrive Density
    const speed = 0.8; // Faster Warp Speed
    let mouseX = 0, mouseY = 0;

    // 3D Star Class
    class Star {
        constructor() {
            this.init();
        }

        init() {
            this.x = (Math.random() - 0.5) * width * 2; // Wide spawn for rotation handling
            this.y = (Math.random() - 0.5) * height * 2;
            this.z = Math.random() * width; // Depth
            this.pz = this.z; // Previous Z for trails
        }

        update() {
            // Move through Z-space (towards camera)
            this.z -= speed * 10;

            // Interaction: Steer the warp
            this.x += (mouseX - width / 2) * 0.02;
            this.y += (mouseY - height / 2) * 0.02;

            // Reset if passed camera or out of bounds
            if (this.z < 1 || Math.abs(this.x) > width * 2 || Math.abs(this.y) > height * 2) {
                this.init();
                this.z = width; // Reset to back
                this.pz = this.z;
            }
        }

        draw() {
            // 3D Projection Math
            const sx = (this.x / this.z) * (width / 2) + width / 2;
            const sy = (this.y / this.z) * (width / 2) + height / 2;

            const px = (this.x / this.pz) * (width / 2) + width / 2;
            const py = (this.y / this.pz) * (width / 2) + height / 2;

            this.pz = this.z;

            if (sx < 0 || sx > width || sy < 0 || sy > height) return;

            // Draw Warp Trail (Line from prev Z to current Z)
            const size = (1 - this.z / width) * 2; // Closer = Bigger
            const opacity = (1 - this.z / width); // Closer = Brighter

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.lineWidth = size;
            ctx.strokeStyle = `rgba(79, 172, 254, ${opacity})`; // Neon Blue Trail
            ctx.stroke();

            // Draw Head
            ctx.beginPath();
            ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        stars = Array.from({ length: numStars }, () => new Star());
    }

    function animate() {
        // Clear with fade for motion blur effect
        ctx.fillStyle = "rgba(10, 10, 10, 0.3)"; // Background color + Trail fade
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    // Mouse Interaction
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener("resize", resize);
    resize();
    animate();
}

// 5. Music Player Logic
function initMusicPlayer() {
    const music = document.getElementById("bg-music");
    const toggle = document.getElementById("music-toggle");

    if (!music || !toggle) return;

    let isPlaying = false;

    // Function to handle play state
    const togglePlay = () => {
        if (isPlaying) {
            music.pause();
            toggle.classList.remove("music-playing");
            // Change icon to 'Play' (currently using a generic music note, could switch to Pause/Play icons if desired, but pulse effect serves as indicator)
        } else {
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    toggle.classList.add("music-playing");
                }).catch(error => {
                    console.log("Autoplay prevented:", error);
                    // Reset UI to paused state if failed
                    isPlaying = false;
                });
            }
        }
        isPlaying = !isPlaying;
    };

    toggle.addEventListener("click", togglePlay);

    // Attempt Autoplay
    // Most browsers block this, but we try anyway.
    const autoPlayPromise = music.play();
    if (autoPlayPromise !== undefined) {
        autoPlayPromise.then(() => {
            // Autoplay started!
            isPlaying = true;
            toggle.classList.add("music-playing");
        }).catch(error => {
            // Autoplay was prevented.
            console.log("Autoplay prevented. Waiting for user interaction.");
            // Add a one-time listener to the whole document to start music on first click
            const startMusicOnInteraction = () => {
                music.play().then(() => {
                    isPlaying = true;
                    toggle.classList.add("music-playing");
                });
                document.removeEventListener("click", startMusicOnInteraction);
            };
            document.addEventListener("click", startMusicOnInteraction);
        });
    }
}

// 1. Momentum Scroll (Simplistic)
function initMomentumScroll() {
    if (window.innerWidth < 768) return;

    let speed = 0;
    let lastScroll = window.scrollY;

    function skewEffect() {
        speed = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        // Skew effect on sections
        document.querySelectorAll('section').forEach(section => {
            section.style.transform = `skewY(${speed * 0.05}deg)`;
        });
        requestAnimationFrame(skewEffect);
    }
    requestAnimationFrame(skewEffect);
}



// 3. Global 3D Perspective Tilt
function initGlobalTilt() {
    const hero = document.querySelector('.hero-content');
    if (!hero) return;

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        hero.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
}

// 4. Chromatic Aberration on Hover
function initChromaticHover() {
    const targets = document.querySelectorAll('h1, h2, .service-item, .tool-item');
    targets.forEach(target => {
        target.addEventListener('mousemove', (e) => {
            const x = (e.clientX - target.getBoundingClientRect().left) / 10;
            const y = (e.clientY - target.getBoundingClientRect().top) / 10;
            target.style.textShadow = `${x}px ${y}px 2px rgba(255,0,0,0.5), ${-x}px ${-y}px 2px rgba(0,0,255,0.5)`;
        });
        target.addEventListener('mouseleave', () => {
            target.style.textShadow = 'none';
        });
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");
    if (!cursor || !follower) return;

    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 10 + "px";
        cursor.style.top = mouseY - 10 + "px";
    });

    setInterval(() => {
        posX += (mouseX - posX) / 6;
        posY += (mouseY - posY) / 6;
        follower.style.left = posX - 4 + "px";
        follower.style.top = posY - 4 + "px";
    }, 15);

    const linkElements = document.querySelectorAll("a, button, .service-item, .tool-item");
    linkElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("cursor-active");
            follower.classList.add("cursor-active");
        });
        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("cursor-active");
            follower.classList.remove("cursor-active");
        });
    });
}
