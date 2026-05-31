/**
 * Privance Mkenda Portfolio - Frontend JavaScript
 */

// ============================================================
// BACKEND URL — Render.com (badilisha na URL yako halisi)
// ============================================================
const API_BASE_URL = 'https://portifolio-backend-oabw.onrender.com/';

document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    initScrollReveal();
    initActiveNav();
    initMobileMenu();
    initContactForm();
    document.getElementById('footerYear').textContent = new Date().getFullYear();
});

// ============================================================
// LOAD ALL DATA FROM RENDER API
// ============================================================
async function loadAllData() {
    try {
        const [profile, skills, projects, experience, services] = await Promise.all([
            fetch(`${API_BASE_URL}/api/profile`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/skills`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/projects`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/experience`).then(r => r.json()),
            fetch(`${API_BASE_URL}/api/services`).then(r => r.json()),
        ]);

        renderProfile(profile.data);
        renderSkills(skills.data);
        renderProjects(projects.data);
        renderExperience(experience.data);
        renderServices(services.data);

    } catch (err) {
        console.error('Failed to load data from API:', err);
    }
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================

function renderProfile(p) {
    const names = p.name.split(' ');
    document.title = `${p.name} | Data Scientist Portfolio`;
    document.getElementById('navName').textContent = names[0];
    document.getElementById('heroFirstName').textContent = names[0];
    document.getElementById('heroLastName').textContent = names[1] || '';
    document.getElementById('heroTitle').textContent = p.title;
    document.getElementById('heroImg').alt = p.name;

    // Bio
    const bioEl = document.getElementById('aboutBio');
    bioEl.innerHTML = p.bio.map(para => `<p>${para}</p>`).join('');

    // Stats
    document.getElementById('statYears').textContent    = p.stats.years_experience;
    document.getElementById('statProjects').textContent = p.stats.projects_completed;
    document.getElementById('statClients').textContent  = p.stats.happy_clients;
    document.getElementById('statModels').textContent   = p.stats.models_deployed;

    // Contact info
    document.getElementById('contactEmail').textContent    = p.email;
    document.getElementById('contactLocation').textContent = p.location;
    document.getElementById('contactPhone').textContent    = p.phone;

    // Footer name
    document.querySelector('footer .highlight').textContent = names[1] || '';
    document.querySelector('footer p').innerHTML =
        `&copy; ${new Date().getFullYear()} ${names[0]} <span class="highlight">${names[1] || ''}</span>. All rights reserved. | Built with 💜 &amp; Data`;

    // Social links
    const socials = [
        { key: 'github',   label: 'GitHub',   svg: '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>' },
        { key: 'linkedin', label: 'LinkedIn', svg: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>' },
        { key: 'twitter',  label: 'Twitter',  svg: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' },
        { key: 'kaggle',   label: 'Kaggle',   svg: '<path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.238-.036.27l-6.555 6.344 6.836 8.507c.095.104.117.208.075.303z"/>' },
    ];

    document.getElementById('socialLinks').innerHTML = socials
        .map(s => `<a href="${p.social[s.key]}" target="_blank" title="${s.label}">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">${s.svg}</svg>
        </a>`).join('');
}

function renderSkills(skills) {
    document.getElementById('skillsGrid').innerHTML = skills.map(s => `
        <div class="skill-category reveal">
            <div class="icon" style="background:${s.color};color:${s.accent};">${s.icon}</div>
            <h3>${s.category}</h3>
            <div class="skill-tags">
                ${s.skills.map(item => `<span>${item}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderProjects(projects) {
    document.getElementById('projectsGrid').innerHTML = projects.map(p => `
        <div class="project-card reveal">
            <div class="card-banner" style="background: ${p.banner};">
                <span style="filter:grayscale(0.3)">${p.icon}</span>
            </div>
            <div class="card-body">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div class="project-tags">
                    ${p.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <a href="#" class="project-link">View Case Study →</a>
            </div>
        </div>
    `).join('');
}

function renderExperience(experience) {
    document.getElementById('timeline').innerHTML = experience.map(e => `
        <div class="timeline-item">
            <div class="dot"></div>
            <div class="content reveal">
                <p class="year">${e.year}</p>
                <h3>${e.role}</h3>
                <p class="company">${e.company || ''}</p>
                <p>${e.description}</p>
            </div>
        </div>
    `).join('');
}

function renderServices(services) {
    document.getElementById('servicesGrid').innerHTML = services.map(s => `
        <div class="service-card reveal">
            <div class="icon-lg">${s.icon}</div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
        </div>
    `).join('');
}

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
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Also observe dynamically added elements
    const mutationObserver = new MutationObserver(() => {
        document.querySelectorAll('.reveal:not([data-observed])').forEach(el => {
            el.setAttribute('data-observed', '1');
            observer.observe(el);
        });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// ============================================================
// ACTIVE NAV
// ============================================================
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(sec => {
            const link = document.querySelector(`.nav-links a[href="#${sec.getAttribute('id')}"]`);
            if (link) {
                link.style.color = (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight)
                    ? '#6c63ff' : '';
            }
        });
    });
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const formMessage = document.getElementById('formMessage');

        const data = {
            name:    form.querySelector('#contactName').value.trim(),
            email:   form.querySelector('#contactFormEmail').value.trim(),
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
            return;
        }

        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        hideFormMessage(formMessage);

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
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
            }
        } catch (err) {
            showFormMessage(formMessage, 'Network error. Please try again later.', 'error');
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

// ============================================================
// HELPERS
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

window.PortfolioAPI = {
    async get(endpoint) {
        const res = await fetch(`${API_BASE_URL}/api/${endpoint}`);
        return res.json();
    }
};
