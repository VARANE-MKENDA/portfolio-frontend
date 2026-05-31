/**
 * Privance Mkenda Portfolio - Frontend JavaScript
 * Handles: Contact form, scroll reveal, nav, toasts, API calls
 */

// ============================================================
// BACKEND API URL — Render.com
// ============================================================
const API_BASE_URL = 'https://portifolio-backend.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initActiveNav();
    initMobileMenu();
    initContactForm();
});

// ============================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================
function showToast(message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// ============================================================
// SCROLL REVEAL ANIMATION
// ============================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.skill-category, .project-card, .service-card, .timeline-item .content, .stat-card'
    );
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
}

// ============================================================
// ACTIVE NAV HIGHLIGHTING
// ============================================================
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = '#6c63ff';
                } else {
                    link.style.color = '';
                }
            }
        });
    });
}

// ============================================================
// MOBILE MENU TOGGLE
// ============================================================
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// ============================================================
// CONTACT FORM - Sends to Flask API on Render
// ============================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const formMessage = document.getElementById('formMessage');

        const data = {
            name: form.querySelector('#contactName').value.trim(),
            email: form.querySelector('#contactEmail').value.trim(),
            subject: form.querySelector('#contactSubject').value.trim(),
            message: form.querySelector('#contactMessage').value.trim()
        };

        if (!data.name || !data.email || !data.message) {
            showFormMessage(formMessage, 'Please fill in all required fields.', 'error');
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showFormMessage(formMessage, 'Please enter a valid email address.', 'error');
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        hideFormMessage(formMessage);

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {  // ✅ Render URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showFormMessage(formMessage, result.message, 'success');
                showToast(result.message, 'success');
                form.reset();
            } else {
                showFormMessage(formMessage, result.message || 'Something went wrong.', 'error');
                showToast(result.message || 'Something went wrong.', 'error');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            showFormMessage(formMessage, 'Network error. Please try again later.', 'error');
            showToast('Network error. Please try again later.', 'error');
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = `form-message ${type}`;
}

function hideFormMessage(el) {
    if (!el) return;
    el.className = 'form-message';
    el.textContent = '';
}

// ============================================================
// API UTILITY
// ============================================================
const API = {
    async get(endpoint) {
        const res = await fetch(`${API_BASE_URL}/api/${endpoint}`);
        return res.json();
    },
    async post(endpoint, data) {
        const res = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};

window.PortfolioAPI = API;
