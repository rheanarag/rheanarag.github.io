/**
 * ==========================================================================
 * RHEA PORTFOLIO - CORE APPLICATION LOGIC & MICRO-INTERACTIONS
 * Built with GSAP, ScrollTrigger, Swiper 11 & High-Fidelity UI Engineering
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==========================================================================
    // 1. TOAST NOTIFICATION SYSTEM
    // ==========================================================================
    const toastContainer = document.getElementById('toast-container');

    const showToast = (message, type = 'info', duration = 3500) => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        let icon = '⚡';
        if (type === 'success') icon = '✓';
        if (type === 'copy') icon = '📋';
        if (type === 'error') icon = '✖';

        toast.innerHTML = `
            <span class="text-pink-500 font-bold text-base">${icon}</span>
            <span class="flex-1">${message}</span>
        `;
        toastContainer.appendChild(toast);

        // Force reflow and show
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    };

    // ==========================================================================
    // 2. THEME CONTROLLER (Dark / Light Mode)
    // ==========================================================================
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');

    const applyTheme = (isDark) => {
        if (isDark) {
            htmlElement.classList.add('dark');
            htmlElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    };

    // Initialize Theme: Default to aesthetic pastel Light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme(true);
    } else {
        applyTheme(false); // Default to clean, airy pastel light mode
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyDark = htmlElement.classList.contains('dark');
            applyTheme(!isCurrentlyDark);
            showToast(`Switched to ${!isCurrentlyDark ? 'Dark' : 'Light'} theme`, 'info', 2000);
        });
    }

    // ==========================================================================
    // 3. THEMED HEART CURSOR, TRAIL FOLLOWER & AMBIENT GLOW SYSTEM
    // ==========================================================================
    const cursorGlow = document.getElementById('cursor-glow');
    const heartCursor = document.getElementById('heart-cursor');
    const heartFollower = document.getElementById('heart-cursor-follower');
    const heartParticleLayer = document.getElementById('heart-particle-layer');

    if (!isTouchDevice && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.body.classList.add('custom-cursor-active');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let isCursorVisible = false;
        let lastParticleDist = { x: mouseX, y: mouseY };

        const showCursor = () => {
            if (!isCursorVisible) {
                isCursorVisible = true;
                if (heartCursor) heartCursor.style.opacity = '1';
                if (heartFollower) heartFollower.style.opacity = '1';
                if (cursorGlow && !prefersReducedMotion) cursorGlow.style.opacity = '1';
            }
        };

        const hideCursor = () => {
            isCursorVisible = false;
            if (heartCursor) heartCursor.style.opacity = '0';
            if (heartFollower) heartFollower.style.opacity = '0';
            if (cursorGlow) cursorGlow.style.opacity = '0';
        };

        // Micro-Heart Particle Emitter
        const emitHeartParticle = (x, y, isBurst = false) => {
            if (prefersReducedMotion || !heartParticleLayer) return;
            const particleCount = isBurst ? 5 : 1;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'micro-heart-particle';
                
                const size = isBurst ? (9 + Math.random() * 10) : (7 + Math.random() * 7);
                const rot = (Math.random() * 50 - 25) + 'deg';
                const spreadX = isBurst ? (Math.random() * 28 - 14) : 0;
                const spreadY = isBurst ? (Math.random() * 20 - 10) : 0;

                particle.style.left = `${x + spreadX}px`;
                particle.style.top = `${y + spreadY}px`;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.setProperty('--rot', rot);

                particle.innerHTML = `
                    <svg class="w-full h-full" viewBox="0 0 24 24" fill="#e85c78" style="filter: drop-shadow(0 0 4px rgba(232,92,120,0.45));">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                `;

                heartParticleLayer.appendChild(particle);
                setTimeout(() => particle.remove(), 750);
            }
        };

        // Pointer Movement Handling
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            showCursor();

            // Direct 1-to-1 tracking for high-precision heart cursor tip
            if (heartCursor) {
                heartCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }

            // Smooth dampened lagging follower
            if (heartFollower) {
                if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                    gsap.to(heartFollower, {
                        x: mouseX,
                        y: mouseY,
                        duration: 0.22,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                } else {
                    heartFollower.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
                }
            }

            // Ambient Cursor Glow
            if (cursorGlow && typeof gsap !== 'undefined' && !prefersReducedMotion) {
                gsap.to(cursorGlow, {
                    x: mouseX,
                    y: mouseY,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            }

            // Emit subtle floating micro-heart every ~50px of distance traveled
            const dx = mouseX - lastParticleDist.x;
            const dy = mouseY - lastParticleDist.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 48) {
                emitHeartParticle(mouseX, mouseY, false);
                lastParticleDist = { x: mouseX, y: mouseY };
            }
        });

        // Click / Mousedown & Pointer Up Effects
        window.addEventListener('mousedown', (e) => {
            if (heartCursor) heartCursor.classList.add('cursor-click');
            if (heartFollower) heartFollower.classList.add('cursor-click');
            emitHeartParticle(e.clientX, e.clientY, true);
        });

        window.addEventListener('mouseup', () => {
            if (heartCursor) heartCursor.classList.remove('cursor-click');
            if (heartFollower) heartFollower.classList.remove('cursor-click');
        });

        // Interactive Elements Hover Tracking (Links, Buttons, Cards, Inputs, Badge)
        const bindInteractiveHover = () => {
            const interactiveElements = document.querySelectorAll(
                'a, button, input, textarea, select, label, [role="button"], .tilt-card, #hanging-badge, .term-chip, .btn-primary, .btn-secondary, .nav-link, .modal-backdrop'
            );

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    if (heartCursor) heartCursor.classList.add('cursor-hover');
                    if (heartFollower) heartFollower.classList.add('cursor-hover');
                });
                el.addEventListener('mouseleave', () => {
                    if (heartCursor) heartCursor.classList.remove('cursor-hover');
                    if (heartFollower) heartFollower.classList.remove('cursor-hover');
                });
            });
        };

        bindInteractiveHover();

        // Hide when mouse exits window
        document.addEventListener('mouseleave', hideCursor);
        document.addEventListener('mouseenter', showCursor);
    }

    // ==========================================================================
    // 4. 3D PARALLAX TILT EFFECT (Dampened with Spring Return)
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    if (!isTouchDevice && typeof gsap !== 'undefined' && !prefersReducedMotion) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.35,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        });
    }

    // ==========================================================================
    // 5. MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeMenuIcon = document.getElementById('close-menu-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = (forceState) => {
        if (!mobileMenu) return;
        const isClosed = typeof forceState === 'boolean' ? !forceState : !mobileMenu.classList.contains('hidden');
        if (isClosed) {
            mobileMenu.classList.add('hidden');
            if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
            if (closeMenuIcon) closeMenuIcon.classList.add('hidden');
            if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        } else {
            mobileMenu.classList.remove('hidden');
            if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
            if (closeMenuIcon) closeMenuIcon.classList.remove('hidden');
            if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // ==========================================================================
    // 6. SWIPER PROJECTS CAROUSEL
    // ==========================================================================
    if (typeof Swiper !== 'undefined') {
        new Swiper('.projects-swiper', {
            slidesPerView: 1.15,
            spaceBetween: 24,
            centeredSlides: true,
            grabCursor: true,
            slideToClickedSlide: true,
            watchSlidesProgress: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 1.5,
                    spaceBetween: 28,
                    centeredSlides: true,
                },
                1024: {
                    slidesPerView: 2.1,
                    spaceBetween: 36,
                    centeredSlides: true,
                },
                1280: {
                    slidesPerView: 2.25,
                    spaceBetween: 40,
                    centeredSlides: true,
                }
            }
        });
    }

    // ==========================================================================
    // 7. INTERACTIVE SKILLS FILTER
    // ==========================================================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            // Update tab UI
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards with smooth scale
            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================================================
    // 8. RESUME MODAL & DOWNLOAD
    // ==========================================================================
    const resumeModal = document.getElementById('resume-modal');
    const openResumeBtn = document.getElementById('open-resume-btn');
    const mobileResumeBtn = document.getElementById('mobile-resume-btn');
    const closeResumeModalBtn = document.getElementById('close-resume-modal');
    const downloadResumeBtn = document.getElementById('download-resume-btn');

    const openResumeModal = () => {
        if (!resumeModal) return;
        resumeModal.classList.remove('hidden');
        resumeModal.classList.add('flex');
        requestAnimationFrame(() => {
            resumeModal.style.opacity = '1';
            const inner = resumeModal.querySelector('.glass-panel');
            if (inner) inner.classList.remove('scale-95');
        });
    };

    const closeResumeModal = () => {
        if (!resumeModal) return;
        resumeModal.style.opacity = '0';
        const inner = resumeModal.querySelector('.glass-panel');
        if (inner) inner.classList.add('scale-95');
        setTimeout(() => {
            resumeModal.classList.remove('flex');
            resumeModal.classList.add('hidden');
        }, 300);
    };

    if (openResumeBtn) openResumeBtn.addEventListener('click', openResumeModal);
    if (mobileResumeBtn) {
        mobileResumeBtn.addEventListener('click', () => {
            toggleMobileMenu(false);
            openResumeModal();
        });
    }
    if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResumeModal);
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', () => {
            showToast('Downloading Rhea_Mae_Narag_Resume.pdf...', 'success');
        });
    }

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeResumeModal();
        });
    }

    // ==========================================================================
    // 9. PROJECT CASE STUDY MODAL
    // ==========================================================================
    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectModalBadge = document.getElementById('project-modal-badge');
    const projectModalBody = document.getElementById('project-modal-body');
    const closeProjectModalBtn = document.getElementById('close-project-modal');
    const openCaseStudyBtns = document.querySelectorAll('.open-case-study-btn');

    const projectData = {
        'saln': {
            badge: 'FULL-STACK WEB APP',
            title: 'SALN Automated Calculation & Submission Portal',
            body: `
                <div class="space-y-5">
                    <div class="rounded-2xl overflow-hidden border border-pink-100 dark:border-white/10 shadow-sm max-h-64 bg-slate-950">
                        <img src="images/saln.jpg" alt="SALN Submission Portal Screenshot" class="w-full h-full object-cover object-top" onerror="this.src='assets/saln.jpg'">
                    </div>
                    <div>
                        <h4 class="text-pink-600 dark:text-pink-400 font-mono text-xs uppercase tracking-wider mb-1.5 font-bold">Context &amp; Challenge</h4>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">Government asset disclosure filings often encounter computational inconsistencies, manual math errors, and inefficient paper-based auditing.</p>
                    </div>
                    <div>
                        <h4 class="text-pink-600 dark:text-pink-400 font-mono text-xs uppercase tracking-wider mb-1.5 font-bold">Technical Architecture</h4>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">Engineered a full-stack web application using Python Flask, normalized MySQL relational tables, and real-time JavaScript balance logic that automatically calculates total assets and net worth before submission.</p>
                    </div>
                    <div class="glass-card p-4 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 border border-pink-200 dark:border-pink-500/20 bg-pink-50/40 dark:bg-slate-800/40">
                        <span class="text-pink-600 dark:text-pink-400 font-bold block mb-1">Stack:</span>
                        Python Flask, MySQL, JavaScript (ES6+), HTML5, CSS3
                    </div>
                </div>
            `
        },
        'room-booking': {
            badge: 'UI/UX & HCI DESIGN',
            title: 'University Facility & Room-Booking System',
            body: `
                <div class="space-y-5">
                    <div class="rounded-2xl overflow-hidden border border-pink-100 dark:border-white/10 shadow-sm max-h-64 bg-slate-950">
                        <img src="images/pupwesto.jpg" alt="PUPwesto UI/UX Prototype Screenshot" class="w-full h-full object-cover object-center" onerror="this.src='assets/pupwesto.jpg'">
                    </div>
                    <div>
                        <h4 class="text-pink-600 dark:text-pink-400 font-mono text-xs uppercase tracking-wider mb-1.5 font-bold">Context &amp; Challenge</h4>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">University departments faced ongoing scheduling conflicts and double-booking bottlenecks across multimedia laboratories and lecture spaces.</p>
                    </div>
                    <div>
                        <h4 class="text-pink-600 dark:text-pink-400 font-mono text-xs uppercase tracking-wider mb-1.5 font-bold">Human-Centered Solution</h4>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">Designed interactive component systems in Figma applying HCI heuristics, visual status color codes, and intuitive reservation workflows.</p>
                    </div>
                    <div class="glass-card p-4 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 border border-pink-200 dark:border-pink-500/20 bg-pink-50/40 dark:bg-slate-800/40">
                        <span class="text-pink-600 dark:text-pink-400 font-bold block mb-1">Tools &amp; Methods:</span>
                        Figma, HCI Heuristics, User-Centered Design, Wireframing
                    </div>
                </div>
            `
        },
        'network': {
            badge: 'SYSTEMS & INFRASTRUCTURE',
            title: 'High-Availability Enterprise Network Topology',
            body: `
                <div class="space-y-5">
                    <div class="rounded-2xl overflow-hidden border border-pink-100 dark:border-white/10 shadow-sm max-h-64 bg-slate-900 flex items-center justify-center p-2">
                        <img src="images/topology.png" alt="Cisco Packet Tracer Network Topology" class="w-full h-full object-contain" onerror="this.src='assets/topology.png'">
                    </div>
                    <div>
                        <h4 class="text-pink-600 dark:text-pink-400 font-mono text-xs uppercase tracking-wider mb-1.5 font-bold">Context &amp; Challenge</h4>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">Corporate infrastructure requiring 99.99% uptime, dynamic routing failover, and perimeter boundary firewall protection.</p>
                    </div>
                    <div>
                        <h4 class="text-pink-600 dark:text-pink-400 font-mono text-xs uppercase tracking-wider mb-1.5 font-bold">Topology Implementation</h4>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">Architected and simulated an enterprise network topology in Cisco Packet Tracer incorporating multi-area OSPF routing, redundant core switching, and perimeter filtering via a Cisco ASA 5506-X firewall.</p>
                    </div>
                    <div class="glass-card p-4 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 border border-pink-200 dark:border-pink-500/20 bg-pink-50/40 dark:bg-slate-800/40">
                        <span class="text-pink-600 dark:text-pink-400 font-bold block mb-1">Specifications:</span>
                        Cisco Packet Tracer, OSPF Routing, Layer 3 Switching, Cisco ASA 5506-X
                    </div>
                </div>
            `
        }
    };

    const openProjectModal = (projectId) => {
        const data = projectData[projectId];
        if (!data || !projectModal) return;

        projectModalBadge.innerText = data.badge;
        projectModalTitle.innerText = data.title;
        projectModalBody.innerHTML = data.body;

        projectModal.classList.remove('hidden');
        projectModal.classList.add('flex');
        requestAnimationFrame(() => {
            projectModal.style.opacity = '1';
            const inner = projectModal.querySelector('.glass-panel');
            if (inner) inner.classList.remove('scale-95');
        });
    };

    const closeProjectModal = () => {
        if (!projectModal) return;
        projectModal.style.opacity = '0';
        const inner = projectModal.querySelector('.glass-panel');
        if (inner) inner.classList.add('scale-95');
        setTimeout(() => {
            projectModal.classList.remove('flex');
            projectModal.classList.add('hidden');
        }, 300);
    };

    openCaseStudyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

    if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectModal();
        });
    }

    // ==========================================================================
    // 10. INTERACTIVE DEVELOPER TERMINAL
    // ==========================================================================
    const terminalOverlay = document.getElementById('terminal-overlay');
    const termBtn = document.getElementById('term-btn');
    const mobileTermBtn = document.getElementById('mobile-term-btn');
    const closeTerminal = document.getElementById('close-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalChips = document.querySelectorAll('.term-chip');

    const openTerminal = () => {
        if (!terminalOverlay) return;
        terminalOverlay.classList.remove('hidden');
        terminalOverlay.classList.add('flex');
        requestAnimationFrame(() => {
            terminalOverlay.style.opacity = '1';
            if (terminalInput) terminalInput.focus();
        });
    };

    const hideTerminal = () => {
        if (!terminalOverlay) return;
        terminalOverlay.style.opacity = '0';
        setTimeout(() => {
            terminalOverlay.classList.remove('flex');
            terminalOverlay.classList.add('hidden');
        }, 300);
    };

    if (termBtn) termBtn.addEventListener('click', openTerminal);
    if (mobileTermBtn) {
        mobileTermBtn.addEventListener('click', () => {
            toggleMobileMenu(false);
            openTerminal();
        });
    }
    if (closeTerminal) closeTerminal.addEventListener('click', hideTerminal);
    if (terminalOverlay) {
        terminalOverlay.addEventListener('click', (e) => {
            if (e.target === terminalOverlay) hideTerminal();
        });
    }

    // Keyboard Shortcut (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (terminalOverlay && terminalOverlay.classList.contains('hidden')) {
                openTerminal();
            } else {
                hideTerminal();
            }
        }
        if (e.key === 'Escape') {
            hideTerminal();
            closeResumeModal();
            closeProjectModal();
        }
    });

    const commands = {
        help: `Available commands:
  • about     - Learn about Rhea Mae Narag
  • skills    - Display core technical capabilities
  • projects  - List highlighted engineering projects
  • education - View PUP BSIT academic history & honors
  • resume    - Open the full resume modal
  • contact   - Direct contact channels
  • theme     - Toggle light/dark UI mode
  • matrix    - Initialize digital cyber stream
  • date      - Print current system timestamp
  • whoami    - Display guest session credentials
  • clear     - Purge terminal buffer
  • exit      - Terminate terminal session`,
        about: `RHEA MAE NARAG
Role: Aspiring Frontend Developer & AI Systems Engineer
Affiliation: Polytechnic University of the Philippines (PUP)
Status: Available for Technical Internships (2025-2026)
Mission: Engineering high-performance web systems and human-centered digital experiences.`,
        skills: `[PROGRAMMING] Python, JavaScript (ES6+), Java, C, SQL, R, COBOL
[FRONTEND & UI] HTML5, CSS3, Tailwind CSS, Figma, HCI Principles, UCD
[DATABASE] MySQL, Schema Normalization, ERD Modeling
[INFRASTRUCTURE] Cisco Packet Tracer, OSPF Routing, ASA 5506-X Firewall, Git`,
        projects: `1. SALN Submission Portal (Python Flask, MySQL, JavaScript)
2. University Room-Booking UI (Figma, HCI Heuristics)
3. Enterprise Network Topology (Cisco Packet Tracer, OSPF, Cisco ASA)`,
        education: `Degree: Bachelor of Science in Information Technology (BSIT)
University: Polytechnic University of the Philippines (PUP)
Distinctions: President's Lister (1st & 2nd Year) | SBFI Foundation Scholar
Expected Graduation: 2028`,
        contact: `Email: rhea.narag22@gmail.com
LinkedIn: https://linkedin.com/in/rhea-mae-narag-192891393
Location: Manila, Philippines (Open to Remote/Hybrid)`,
        whoami: `guest@portfolio-session-2026 [Permissions: READ-ONLY]`,
        date: () => new Date().toUTCString(),
        sudo: `Permission denied: Rhea's system integrity is strictly protected. 😉`
    };

    const executeTerminalCommand = (rawVal) => {
        const val = rawVal.trim().toLowerCase();
        if (!val) return;

        // Render command prompt line
        const cmdLine = document.createElement('div');
        cmdLine.className = 'text-slate-300 mt-2';
        cmdLine.innerHTML = `<span class="text-pink-500 font-bold">➜</span> <span class="text-pink-400">~</span> ${rawVal}`;
        terminalOutput.insertBefore(cmdLine, document.getElementById('terminal-prompt-row'));

        if (val === 'clear') {
            terminalOutput.innerHTML = '';
            const promptRow = document.createElement('div');
            promptRow.id = 'terminal-prompt-row';
            promptRow.className = 'flex items-center gap-2 mt-2';
            promptRow.innerHTML = `
                <span class="text-pink-500 font-bold">➜</span>
                <span class="text-pink-400">~</span>
                <input type="text" id="terminal-input" class="bg-transparent border-none outline-none flex-1 text-slate-100 font-mono caret-pink-500" autocomplete="off" spellcheck="false">
            `;
            terminalOutput.appendChild(promptRow);
            const newInput = document.getElementById('terminal-input');
            newInput.focus();
            newInput.addEventListener('keydown', handleInputKeyDown);
            return;
        }

        if (val === 'exit') {
            hideTerminal();
            return;
        }

        if (val === 'theme') {
            const isCurrentlyDark = htmlElement.classList.contains('dark');
            applyTheme(!isCurrentlyDark);
            const res = document.createElement('div');
            res.className = 'text-pink-400 mb-2';
            res.innerText = `[SUCCESS] Theme toggled to ${!isCurrentlyDark ? 'Dark' : 'Light'} mode.`;
            terminalOutput.insertBefore(res, document.getElementById('terminal-prompt-row'));
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            return;
        }

        if (val === 'resume') {
            openResumeModal();
            const res = document.createElement('div');
            res.className = 'text-pink-400 mb-2';
            res.innerText = `[SUCCESS] Opening curriculum vitae modal...`;
            terminalOutput.insertBefore(res, document.getElementById('terminal-prompt-row'));
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            return;
        }

        if (val === 'matrix') {
            const matrixDiv = document.createElement('div');
            matrixDiv.className = 'text-pink-400 font-mono text-xs my-2 leading-tight';
            matrixDiv.innerHTML = `
01010010 01001000 01000101 01000001<br>
INITIATING QUANTUM NEURAL INTERFACE...<br>
[OK] CORE SYSTEM INTEGRITY: 100%<br>
[OK] FRONTEND PROTOCOLS: ACTIVE<br>
Welcome to Rhea's digital matrix.
            `;
            terminalOutput.insertBefore(matrixDiv, document.getElementById('terminal-prompt-row'));
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            return;
        }

        // Generic output handler
        const outputDiv = document.createElement('div');
        outputDiv.className = 'text-slate-300 mb-2 whitespace-pre-line text-xs';

        if (typeof commands[val] === 'function') {
            outputDiv.innerText = commands[val]();
        } else if (commands[val]) {
            outputDiv.innerText = commands[val];
        } else {
            outputDiv.innerHTML = `<span class="text-rose-400">Command not found: '${rawVal}'</span>. Type <span class="text-pink-400 underline">help</span> for a list of commands.`;
        }

        terminalOutput.insertBefore(outputDiv, document.getElementById('terminal-prompt-row'));
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeTerminalCommand(e.target.value);
            e.target.value = '';
        }
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', handleInputKeyDown);
    }

    terminalChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) {
                executeTerminalCommand(cmd);
            }
        });
    });

    // ==========================================================================
    // 11. EMAIL CLIPBOARD & CONTACT FORM
    // ==========================================================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const heroCopyEmailBtn = document.getElementById('hero-copy-email-btn');
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');
    const charCounter = document.getElementById('char-counter');

    const copyToClipboard = () => {
        navigator.clipboard.writeText('rhea.narag22@gmail.com').then(() => {
            showToast('Email address copied to clipboard!', 'copy');
        }).catch(() => {
            showToast('rhea.narag22@gmail.com', 'copy');
        });
    };

    if (copyEmailBtn) copyEmailBtn.addEventListener('click', copyToClipboard);
    if (heroCopyEmailBtn) heroCopyEmailBtn.addEventListener('click', copyToClipboard);

    if (contactMessage && charCounter) {
        contactMessage.addEventListener('input', () => {
            const count = contactMessage.value.length;
            charCounter.innerText = `${count} / 500`;
            if (count >= 480) {
                charCounter.classList.add('text-rose-400');
            } else {
                charCounter.classList.remove('text-rose-400');
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-form-btn');
            const submitBtnText = document.getElementById('submit-btn-text');

            if (submitBtn && submitBtnText) {
                submitBtnText.innerText = 'TRANSMITTING PROTOCOL...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtnText.innerText = '✓ TRANSMISSION DELIVERED';
                    showToast('Message transmitted! Rhea will respond promptly.', 'success');

                    setTimeout(() => {
                        submitBtnText.innerText = 'SEND PROTOCOL TRANSMISSION';
                        submitBtn.disabled = false;
                        contactForm.reset();
                        if (charCounter) charCounter.innerText = '0 / 500';
                    }, 3000);
                }, 900);
            }
        });
    }

    // ==========================================================================
    // 12. GSAP ENTRANCE & SCROLLTRIGGER TIMELINES
    // ==========================================================================
    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        const tl = gsap.timeline();

        // Hero Left Elements Entrance Stagger
        tl.from('.gsap-hero-left > *', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Hero 3D Card Elastic Drop
        tl.from('.gsap-hero-right', {
            scale: 0.92,
            opacity: 0,
            duration: 0.9,
            ease: 'back.out(1.4)'
        }, '-=0.5');

        // Scroll Reveals for Sections
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            gsap.utils.toArray('.gsap-fade-right').forEach(el => {
                gsap.fromTo(el, { opacity: 0, x: -40 }, {
                    scrollTrigger: { trigger: el, start: 'top 82%' },
                    opacity: 1, x: 0, duration: 0.8, ease: 'power2.out'
                });
            });

            gsap.utils.toArray('.gsap-fade-left').forEach(el => {
                gsap.fromTo(el, { opacity: 0, x: 40 }, {
                    scrollTrigger: { trigger: el, start: 'top 82%' },
                    opacity: 1, x: 0, duration: 0.8, ease: 'power2.out'
                });
            });

            gsap.utils.toArray('.gsap-fade-up').forEach(el => {
                gsap.fromTo(el, { opacity: 0, y: 40 }, {
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                    opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
                });
            });
        }
    }

    // ==========================================================================
    // 13. ACTIVE NAVBAR SCROLLSPY & FLOATING TOPBAR STATE
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const floatingNav = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Toggle elevated border/shadow state on floating navbar
        if (floatingNav) {
            if (scrollY > 20) {
                floatingNav.classList.add('scrolled');
            } else {
                floatingNav.classList.remove('scrolled');
            }
        }

        // Active Section Scrollspy
        let current = '';
        const scrollPos = scrollY + 250;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // ==========================================================================
    // 14. INTERACTIVE HANGING ID BADGE WITH LANYARD PENDULUM SIMULATION
    // ==========================================================================
    const initHangingBadge = () => {
        const container = document.getElementById('hanging-id-container');
        const badge = document.getElementById('hanging-badge');
        const anchorMount = document.getElementById('lanyard-anchor-mount');
        const shadowPath = document.getElementById('lanyard-shadow-path');
        const strapPath = document.getElementById('lanyard-strap-path');
        const seamPath = document.getElementById('lanyard-seam-path');
        const dragHint = document.getElementById('lanyard-drag-hint');
        const glareOverlay = badge ? badge.querySelector('.id-glare-overlay') : null;
        const hologramStrip = badge ? badge.querySelector('.id-hologram-strip') : null;
        const heroSection = document.getElementById('home');
        const heroRightCard = heroSection ? heroSection.querySelector('.gsap-hero-right') : null;

        if (!container || !badge || !anchorMount || !strapPath || !heroSection) return;

        // Physical Parameters
        let anchorX = 0;
        let anchorY = 0;
        let restLength = 135; // Default rest lanyard length in px for enlarged badge
        let currentLength = restLength;
        let lengthVelocity = 0;
        
        let theta = 0; // Current angle in radians
        let omega = 0; // Angular velocity in rad/s
        let twist = 0; // 3D yaw angle in degrees
        let twistVel = 0; // Yaw angular velocity
        let pitch = 0; // 3D pitch angle in degrees

        const gravity = 980; // px/s^2
        const damping = 0.024; // Natural air resistance & pivot friction
        const springK = 190; // Radial cord elasticity
        const springDamp = 14; // Radial damping
        const twistK = 45; // Yaw spring stiffness
        const twistDamp = 6.5; // Yaw damping

        let isDragging = false;
        let isHovered = false;
        let hasInteracted = false;
        let pointerHistory = [];
        let dragOffset = { x: 0, y: 0 };
        let pointerPos = { x: 0, y: 0 };

        let lastTime = performance.now();
        let isSectionVisible = true;

        // Calculate Responsive Anchor and Resting Position
        const updateAnchorPosition = () => {
            const containerRect = container.getBoundingClientRect();
            const width = containerRect.width;
            const height = containerRect.height;
            const isDesktop = width >= 1024;
            const isTablet = width >= 640 && width < 1024;

            if (isDesktop && heroRightCard) {
                const rightCardRect = heroRightCard.getBoundingClientRect();
                // Position anchor cleanly aligned with the center of the hero right column
                const targetX = (rightCardRect.left - containerRect.left) + rightCardRect.width * 0.5;
                anchorX = Math.max(width * 0.52, Math.min(width - 170, targetX));
                anchorY = 0;
                restLength = Math.min(160, Math.max(115, height * 0.16));
            } else if (isTablet) {
                anchorX = width * 0.76;
                anchorY = 0;
                restLength = 110;
            } else {
                // Mobile
                anchorX = width * 0.74;
                anchorY = 0;
                restLength = 85;
            }

            // Update top mounting bracket position
            if (anchorMount) {
                anchorMount.style.left = `${anchorX}px`;
                anchorMount.style.top = `${anchorY}px`;
            }
        };

        updateAnchorPosition();
        window.addEventListener('resize', updateAnchorPosition, { passive: true });

        // Visibility Observer to pause physics when offscreen
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isSectionVisible = entry.isIntersecting;
                    if (isSectionVisible) {
                        lastTime = performance.now();
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(heroSection);
        }

        // Pointer Event Coordinates Relative to Container
        const getContainerCoords = (e) => {
            const rect = container.getBoundingClientRect();
            const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        // Pointer Interaction Handlers (Mouse + Touch)
        const onPointerDown = (e) => {
            if (e.button !== undefined && e.button !== 0) return; // Left click only
            isDragging = true;
            if (badge.setPointerCapture && e.pointerId) {
                badge.setPointerCapture(e.pointerId);
            }

            const coords = getContainerCoords(e);
            pointerPos = coords;

            // Current clip center
            const clipX = anchorX + currentLength * Math.sin(theta);
            const clipY = anchorY + currentLength * Math.cos(theta);

            dragOffset = {
                x: coords.x - clipX,
                y: coords.y - clipY
            };

            pointerHistory = [{ x: coords.x, y: coords.y, time: performance.now() }];
            badge.classList.add('is-dragging');

            if (!hasInteracted && dragHint) {
                hasInteracted = true;
                dragHint.style.opacity = '0';
                setTimeout(() => dragHint.remove(), 600);
            }
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            const coords = getContainerCoords(e);
            pointerPos = coords;

            const now = performance.now();
            pointerHistory.push({ x: coords.x, y: coords.y, time: now });
            if (pointerHistory.length > 6) {
                pointerHistory.shift();
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            badge.classList.remove('is-dragging');

            if (badge.releasePointerCapture && e.pointerId) {
                try { badge.releasePointerCapture(e.pointerId); } catch (_) {}
            }

            // Calculate release velocity from rolling pointer history
            const now = performance.now();
            let vx = 0;
            let vy = 0;

            if (pointerHistory.length >= 2) {
                const oldest = pointerHistory[0];
                const dt = (now - oldest.time) / 1000;
                if (dt > 0.01 && dt < 0.3) {
                    vx = (pointerPos.x - oldest.x) / dt;
                    vy = (pointerPos.y - oldest.y) / dt;
                }
            }

            // Convert Cartesian velocity to Pendulum polar coordinates
            const cosT = Math.cos(theta);
            const sinT = Math.sin(theta);
            const r = Math.max(60, currentLength);

            // Tangential angular impulse (omega = (vx*cos(theta) - vy*sin(theta)) / r)
            const tangentialV = (vx * cosT - vy * sinT);
            omega = tangentialV / r;

            // Clamp max initial angular speed for smooth believable swings
            omega = Math.max(-9, Math.min(9, omega));

            // Radial velocity impulse
            lengthVelocity = (vx * sinT + vy * cosT) * 0.4;

            // Yaw twist impulse from horizontal throw
            twistVel = -vx * 0.08;
            twistVel = Math.max(-120, Math.min(120, twistVel));
        };

        badge.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        window.addEventListener('pointercancel', onPointerUp, { passive: true });

        // Hover Impulse Reactions
        badge.addEventListener('mouseenter', () => {
            isHovered = true;
            if (!isDragging && !prefersReducedMotion) {
                const nudge = (Math.random() > 0.5 ? 1 : -1) * (0.04 + Math.random() * 0.04);
                omega += nudge;
                twistVel += nudge * 60;
            }
        });

        badge.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Main Physics & Animation Loop
        const animate = (timestamp) => {
            requestAnimationFrame(animate);

            if (!isSectionVisible) return;

            const dt = Math.min(0.033, Math.max(0.008, (timestamp - lastTime) / 1000));
            lastTime = timestamp;
            const timeSec = timestamp / 1000;

            if (isDragging) {
                // Direct kinematic tracking during drag
                const targetX = pointerPos.x - dragOffset.x;
                const targetY = pointerPos.y - dragOffset.y;
                const dx = targetX - anchorX;
                const dy = targetY - anchorY;

                const targetTheta = Math.atan2(dx, dy);
                const targetLength = Math.max(40, Math.sqrt(dx * dx + dy * dy));

                // Smooth responsive lerp
                theta += (targetTheta - theta) * 0.45;
                currentLength += (targetLength - currentLength) * 0.45;
                omega = 0;
                lengthVelocity = 0;

                const targetTwist = Math.max(-30, Math.min(30, dx * 0.12));
                twist += (targetTwist - twist) * 0.3;

                const targetPitch = Math.max(-18, Math.min(18, (targetLength - restLength) * 0.08));
                pitch += (targetPitch - pitch) * 0.3;

            } else {
                // Free Pendulum Physics Simulation
                if (prefersReducedMotion) {
                    // Minimal soft settle for users who prefer reduced motion
                    theta += (0 - theta) * 0.1;
                    currentLength += (restLength - currentLength) * 0.1;
                    twist += (0 - twist) * 0.1;
                    pitch += (0 - pitch) * 0.1;
                    omega = 0;
                } else {
                    // 1. Angular Pendulum Equation: alpha = -(g/r)*sin(theta) - damping*omega + ambient
                    const r = Math.max(50, currentLength);
                    let alpha = -(gravity / r) * Math.sin(theta) - (damping * 60) * omega;

                    // Organic compound ambient oscillation (prevents robotic repetition)
                    const ambientTorque = 0.00038 * Math.sin(timeSec * 1.25) +
                                         0.00020 * Math.sin(timeSec * 0.72 + 1.4) +
                                         0.00012 * Math.cos(timeSec * 1.88 + 2.1);
                    alpha += ambientTorque * (isHovered ? 2.2 : 1.0);

                    omega += alpha * dt * 60;
                    theta += omega * dt;

                    // 2. Radial Elastic Spring Equation
                    const lengthDisplacement = currentLength - restLength;
                    const springForce = -springK * lengthDisplacement - springDamp * lengthVelocity;
                    const centrifugalForce = r * (omega * omega);
                    const gravityAlongCord = gravity * Math.cos(theta) * 0.15;
                    const radialAcc = springForce + centrifugalForce + gravityAlongCord;

                    lengthVelocity += radialAcc * dt;
                    currentLength += lengthVelocity * dt;

                    // 3. 3D Yaw Twist Harmonic Spring
                    let ambientTwist = 2.4 * Math.sin(timeSec * 0.9 + 0.5);
                    const twistAcc = -twistK * (twist - ambientTwist) - twistDamp * twistVel;
                    twistVel += twistAcc * dt;
                    twist += twistVel * dt;

                    // 4. Subtle Pitch Reaction
                    const targetPitch = -Math.sin(theta) * 14;
                    pitch += (targetPitch - pitch) * 0.15;
                }
            }

            // Calculate Clip Tip Coordinates in Container Space
            const tipX = anchorX + currentLength * Math.sin(theta);
            const tipY = anchorY + currentLength * Math.cos(theta);
            const rotDeg = theta * (180 / Math.PI);

            // Apply 3D Transform to Badge
            badge.style.transform = `translate3d(${tipX}px, ${tipY}px, 0) translate(-50%, 0) rotateZ(${rotDeg}deg) rotateY(${twist}deg) rotateX(${pitch}deg)`;

            // Update Dynamic SVG Lanyard Spline
            const midX = (anchorX + tipX) * 0.5 + Math.sin(theta) * 16;
            const midY = (anchorY + tipY) * 0.5;
            const d = `M ${anchorX} ${anchorY} Q ${midX} ${midY} ${tipX} ${tipY}`;

            strapPath.setAttribute('d', d);
            if (shadowPath) {
                shadowPath.setAttribute('d', `M ${anchorX + 10} ${anchorY + 16} Q ${midX + 12} ${midY + 22} ${tipX + 10} ${tipY + 26}`);
            }
            if (seamPath) {
                seamPath.setAttribute('d', d);
            }

            // Dynamic Glare & Sheen Effect based on Yaw & Roll
            if (glareOverlay) {
                const glareAngle = 45 + twist * 1.5 + rotDeg * 0.8;
                const glareOpacity = Math.max(0.1, Math.min(0.65, 0.3 + Math.abs(twist) * 0.012));
                glareOverlay.style.background = `linear-gradient(${glareAngle}deg, rgba(255, 255, 255, ${glareOpacity}) 0%, transparent 60%)`;
            }
        };

        requestAnimationFrame(animate);
    };

    // Initialize Hanging Badge Physics
    initHangingBadge();
});