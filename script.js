// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('nav ul');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
});

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const modeLabel = document.querySelector('.mode-label');
    const modeIcon = document.querySelector('#dark-mode-toggle i');
    if (!darkModeToggle || !modeLabel || !modeIcon) return;

    const isDarkModeStored = localStorage.getItem('darkMode') === 'true';
    if (isDarkModeStored) {
        document.body.classList.add('dark-mode');
        modeIcon.className = 'fas fa-sun';
        modeLabel.textContent = 'Light';
    } else {
        modeIcon.className = 'fas fa-moon';
        modeLabel.textContent = 'Dark';
    }

    darkModeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        modeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        modeLabel.textContent = isDarkMode ? 'Light' : 'Dark';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href.length <= 1) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Fade-in on scroll
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => observer.observe(section));

// Media gallery controller
document.addEventListener('DOMContentLoaded', function() {
    const thumbsContainer = document.getElementById('gallery-thumbs');
    const videoEl = document.getElementById('gallery-video');
    const imageEl = document.getElementById('gallery-image');
    const titleEl = document.getElementById('gallery-title');
    const descEl = document.getElementById('gallery-desc');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');

    if (!thumbsContainer || !videoEl || !imageEl || !titleEl || !descEl) return;

    const items = Array.from(thumbsContainer.querySelectorAll('.gallery-thumb')).map((btn, index) => {
        btn.dataset.index = index;
        return {
            button: btn,
            type: btn.dataset.type,
            src: btn.dataset.src,
            title: btn.dataset.title || '',
            desc: btn.dataset.desc || ''
        };
    });

    if (!items.length) return;

    let currentIndex = 0;
    function render(index, via) {
        currentIndex = (index + items.length) % items.length;
        const item = items[currentIndex];

        videoEl.pause();
        videoEl.removeAttribute('src');
        imageEl.removeAttribute('src');
        videoEl.style.display = 'none';
        imageEl.style.display = 'none';

        if (item.type === 'video') {
            videoEl.src = item.src;
            videoEl.style.display = 'block';
            videoEl.load();
        } else {
            imageEl.src = item.src;
            imageEl.alt = item.title || 'Gallery image';
            imageEl.style.display = 'block';
        }

        titleEl.textContent = item.title;
        descEl.textContent = item.desc;

        items.forEach((entry, idx) => {
            if (idx === currentIndex) {
                entry.button.classList.add('active');
            } else {
                entry.button.classList.remove('active');
            }
        });

        // Only center the active thumbnail when user navigates (thumb/prev/next/keyboard), not on init
        if (via) {
            const activeBtn = items[currentIndex].button;
            // Scroll the thumbnail container directly to avoid page scroll jumps
            if (activeBtn && thumbsContainer && typeof thumbsContainer.scrollTo === 'function') {
                const targetCenter = activeBtn.offsetLeft + (activeBtn.offsetWidth / 2) - (thumbsContainer.clientWidth / 2);
                const left = Math.max(0, targetCenter);
                thumbsContainer.scrollTo({ left, behavior: 'smooth' });
            }
        }
    }

    items.forEach(item => {
        item.button.addEventListener('click', () => render(Number(item.button.dataset.index), 'thumb'));
    });

    if (prevBtn) prevBtn.addEventListener('click', () => render(currentIndex - 1, 'nav'));
    if (nextBtn) nextBtn.addEventListener('click', () => render(currentIndex + 1, 'nav'));

    // Scope arrow key navigation to when the gallery viewer is hovered or focused
    const viewer = document.querySelector('.gallery-viewer');
    let galleryHotkeys = false;
    if (viewer) {
        viewer.addEventListener('mouseenter', () => { galleryHotkeys = true; });
        viewer.addEventListener('mouseleave', () => { galleryHotkeys = false; });
        viewer.addEventListener('focusin', () => { galleryHotkeys = true; });
        viewer.addEventListener('focusout', () => { galleryHotkeys = viewer.contains(document.activeElement); });
    }

    document.addEventListener('keydown', function(e) {
        if (!galleryHotkeys) return;
        if (e.key === 'ArrowLeft') render(currentIndex - 1, 'key');
        if (e.key === 'ArrowRight') render(currentIndex + 1, 'key');
    });

    // Initial render without recentering the thumbnails
    render(0, null);
});
