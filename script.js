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
