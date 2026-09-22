/**
 * ==========================================================================
 * RHEA PORTFOLIO - CORE APPLICATION LOGIC & MICRO-INTERACTIONS
 * Built with GSAP, ScrollTrigger, Swiper 11 & High-Fidelity UI Engineering
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
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

    if (hasFinePointer) {
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

    if (hasFinePointer && typeof gsap !== 'undefined' && !prefersReducedMotion) {
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
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                toggleMobileMenu(false);
            }
        }
    });

    // Close mobile menu on desktop breakpoint resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu(false);
        }
    }, { passive: true });

    // ==========================================================================
    // 6. SWIPER PROJECTS CAROUSEL
    // ==========================================================================
    if (typeof Swiper !== 'undefined') {
        new Swiper('.projects-swiper', {
            slidesPerView: 1.05,
            spaceBetween: 20,
            centeredSlides: true,
            grabCursor: true,
            slideToClickedSlide: true,
            watchSlidesProgress: true,
            navigation: {
                nextEl: '.swiper-next-btn',
                prevEl: '.swiper-prev-btn',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 1.35,
                    spaceBetween: 24,
                    centeredSlides: true,
                },
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 32,
                    centeredSlides: false,
                },
                1280: {
                    slidesPerView: 2.2,
                    spaceBetween: 36,
                    centeredSlides: false,
                }
            }
        });
    }


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
        document.body.classList.add('modal-open');
        requestAnimationFrame(() => {
            resumeModal.style.opacity = '1';
            const inner = resumeModal.querySelector('.glass-panel');
            if (inner) inner.classList.remove('scale-95');
        });
    };

    const closeResumeModal = () => {
        if (!resumeModal) return;
        resumeModal.style.opacity = '0';
        document.body.classList.remove('modal-open');
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
        document.body.classList.add('modal-open');
        requestAnimationFrame(() => {
            projectModal.style.opacity = '1';
            const inner = projectModal.querySelector('.glass-panel');
            if (inner) inner.classList.remove('scale-95');
        });
    };

    const closeProjectModal = () => {
        if (!projectModal) return;
        projectModal.style.opacity = '0';
        document.body.classList.remove('modal-open');
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
            if (terminalOverlay) {
                e.preventDefault();
                if (terminalOverlay.classList.contains('hidden')) {
                    openTerminal();
                } else {
                    hideTerminal();
                }
            }
        }
        if (e.key === 'Escape') {
            toggleMobileMenu(false);
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
                submitBtnText.innerText = 'Sending Message...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtnText.innerText = '✓ Message Sent!';
                    showToast('Message sent! Rhea will respond promptly.', 'success');

                    setTimeout(() => {
                        submitBtnText.innerText = 'Send Message 🌸';
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

        // Hero 3D Card Area Reveal
        tl.from('.gsap-hero-right', {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
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

        // Active Section Scrollspy using robust viewport intersection
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 260 && rect.bottom >= 140) {
                current = section.getAttribute('id');
            }
        });

        if (!current && sections.length > 0 && window.scrollY < 200) {
            current = sections[0].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        mobileNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('bg-pink-100', 'text-pink-600', 'font-semibold');
            } else {
                link.classList.remove('bg-pink-100', 'text-pink-600', 'font-semibold');
            }
        });
    }, { passive: true });

    // ==========================================================================
    // 14. INTERACTIVE HANGING ID BADGE WITH LANYARD PENDULUM SIMULATION
    // ==========================================================================
    const initHangingBadge = () => {
        const container = document.getElementById('hanging-id-container');
        const badge = document.getElementById('hanging-badge');
        const cardFlipper = document.getElementById('id-card-flipper');
        const anchorMount = document.getElementById('lanyard-anchor-mount');
        const shadowPath = document.getElementById('lanyard-shadow-path');
        const strapPath = document.getElementById('lanyard-strap-path');
        const seamPath = document.getElementById('lanyard-seam-path');
        const dragHint = document.getElementById('lanyard-drag-hint');
        const glareOverlay = badge ? badge.querySelector('.id-glare-overlay') : null;
        const hologramStrip = badge ? badge.querySelector('.id-hologram-strip') : null;
        const heroSection = document.getElementById('home');

        if (!container || !badge || !anchorMount || !strapPath || !heroSection) return;

        // Physical Parameters
        let anchorX = 0;
        let anchorY = 0;
        let restLength = 100; // Calibrated for responsive ID card container
        let currentLength = restLength;
        let lengthVelocity = 0;
        
        let theta = 0; // Current angle in radians
        let omega = 0; // Angular velocity in rad/s
        let twist = 0; // 3D yaw angle in degrees
        let twistVel = 0; // Yaw angular velocity
        let pitch = 0; // 3D pitch angle in degrees

        const gravity = 980; // px/s^2
        const dampingTheta = 3.0; // Angular damping in 1/s
        const springK = 180; // Radial cord elasticity
        const dampingR = 12; // Radial damping
        const twistK = 42; // Yaw spring stiffness
        const twistDamp = 8; // Yaw damping

        let isDragging = false;
        let isPointerActive = false;
        let isHovered = false;
        let hasInteracted = false;
        let pointerStart = { clientX: 0, clientY: 0, time: 0 };
        let activePointerId = null;
        let pointerHistory = [];
        let dragOffset = { x: 0, y: 0 };
        let pointerPos = { x: 0, y: 0 };

        let lastTime = performance.now();
        let isSectionVisible = true;

        // Calculate Responsive Anchor and Resting Position inside the dedicated container
        const updateAnchorPosition = () => {
            const containerRect = container.getBoundingClientRect();
            const width = containerRect.width;
            const isDesktop = window.innerWidth >= 1024;
            const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

            anchorX = width * 0.5;
            anchorY = 0; // Exactly at the top mount fixture of the container

            if (isDesktop) {
                restLength = 100;
            } else if (isTablet) {
                restLength = 76;
            } else {
                restLength = 52;
            }

            if (anchorMount) {
                anchorMount.style.left = `${anchorX}px`;
                anchorMount.style.top = `${anchorY}px`;
            }
        };

        updateAnchorPosition();
        window.addEventListener('resize', updateAnchorPosition, { passive: true });
        window.addEventListener('load', () => {
            updateAnchorPosition();
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
        setTimeout(updateAnchorPosition, 250);

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
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
            return {
                x: clientX - rect.left,
                y: clientY - rect.top,
                clientX,
                clientY
            };
        };

        // Pointer Interaction Handlers (Mouse + Touch + Pen)
        const onPointerDown = (e) => {
            if (e.button !== undefined && e.button !== 0) return; // Left click only
            if (e.cancelable) e.preventDefault();

            const coords = getContainerCoords(e);
            pointerPos = coords;
            pointerStart = {
                clientX: coords.clientX,
                clientY: coords.clientY,
                time: performance.now()
            };
            activePointerId = e.pointerId;

            // Current clip tip in container space
            const clipX = anchorX + currentLength * Math.sin(theta);
            const clipY = anchorY + currentLength * Math.cos(theta);

            dragOffset = {
                x: coords.x - clipX,
                y: coords.y - clipY
            };

            isPointerActive = true;
            isDragging = false; // Distinguish click from drag
            pointerHistory = [{ x: coords.x, y: coords.y, time: performance.now() }];

            if (badge.setPointerCapture && e.pointerId !== undefined) {
                try {
                    badge.setPointerCapture(e.pointerId);
                } catch (_) {}
            }
        };

        const onPointerMove = (e) => {
            if (!isPointerActive) return;
            if (e.cancelable) e.preventDefault();

            const coords = getContainerCoords(e);
            pointerPos = coords;

            const moveDist = Math.hypot(coords.clientX - pointerStart.clientX, coords.clientY - pointerStart.clientY);

            // Small 5px threshold to separate clicks/taps from drags
            if (!isDragging && moveDist > 5) {
                isDragging = true;
                badge.classList.add('is-dragging');

                if (!hasInteracted && dragHint) {
                    hasInteracted = true;
                    dragHint.style.opacity = '0';
                    setTimeout(() => {
                        if (dragHint && dragHint.parentNode) dragHint.remove();
                    }, 600);
                }
            }

            if (isDragging) {
                const now = performance.now();
                pointerHistory.push({ x: coords.x, y: coords.y, time: now });
                if (pointerHistory.length > 5) {
                    pointerHistory.shift();
                }
            }
        };

        const endDrag = (e) => {
            if (!isPointerActive) return;
            isPointerActive = false;

            if (activePointerId !== null && badge.releasePointerCapture) {
                try {
                    badge.releasePointerCapture(activePointerId);
                } catch (_) {}
                activePointerId = null;
            }

            if (isDragging) {
                isDragging = false;
                badge.classList.remove('is-dragging');

                // Calculate release impulse from rolling pointer history
                const now = performance.now();
                let vx = 0;
                let vy = 0;

                if (pointerHistory.length >= 2) {
                    const oldest = pointerHistory[0];
                    const dt = (now - oldest.time) / 1000;
                    if (dt > 0.01 && dt < 0.25) {
                        vx = (pointerPos.x - oldest.x) / dt;
                        vy = (pointerPos.y - oldest.y) / dt;
                    }
                }

                const cosT = Math.cos(theta);
                const sinT = Math.sin(theta);
                const L = Math.max(50, currentLength);

                // Tangential angular impulse (omega = (vx*cosT - vy*sinT) / L)
                const tangentialV = (vx * cosT - vy * sinT);
                omega = tangentialV / L;
                omega = Math.max(-4.5, Math.min(4.5, omega));

                // Radial velocity impulse
                lengthVelocity = (vx * sinT + vy * cosT) * 0.3;
                lengthVelocity = Math.max(-180, Math.min(180, lengthVelocity));

                // 3D yaw impulse from horizontal flick
                twistVel = -vx * 0.05;
                twistVel = Math.max(-60, Math.min(60, twistVel));
            } else {
                // Click / Tap triggered: Flip the card to show front or back!
                const duration = performance.now() - pointerStart.time;
                if (duration < 450 && cardFlipper) {
                    cardFlipper.classList.toggle('is-flipped');

                    // Subtle playful impulse on flip
                    omega += (cardFlipper.classList.contains('is-flipped') ? 0.35 : -0.35);
                    twistVel += (cardFlipper.classList.contains('is-flipped') ? 22 : -22);

                    if (!hasInteracted && dragHint) {
                        hasInteracted = true;
                        dragHint.style.opacity = '0';
                        setTimeout(() => {
                            if (dragHint && dragHint.parentNode) dragHint.remove();
                        }, 600);
                    }
                }
            }
        };

        // Attach pointer events to badge & fallback window
        badge.addEventListener('pointerdown', onPointerDown);
        badge.addEventListener('pointermove', onPointerMove, { passive: false });
        badge.addEventListener('pointerup', endDrag);
        badge.addEventListener('pointercancel', endDrag);
        badge.addEventListener('lostpointercapture', endDrag);
        badge.addEventListener('dragstart', (e) => e.preventDefault());

        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', endDrag, { passive: true });
        window.addEventListener('pointercancel', endDrag, { passive: true });

        // Hover Impulse Reactions
        badge.addEventListener('mouseenter', () => {
            isHovered = true;
            if (!isDragging && !prefersReducedMotion) {
                const nudge = (Math.random() > 0.5 ? 1 : -1) * (0.03 + Math.random() * 0.03);
                omega += nudge;
                twistVel += nudge * 45;
            }
        });

        badge.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Main Physics & Animation Loop
        const animate = (timestamp) => {
            requestAnimationFrame(animate);

            if (!isSectionVisible) return;

            // Clamped delta time to guarantee stability across 60Hz, 120Hz, and high-refresh screens
            const dt = Math.min(0.033, Math.max(0.008, (timestamp - lastTime) / 1000));
            lastTime = timestamp;
            const timeSec = timestamp / 1000;

            if (isDragging) {
                // Kinematic direct tracking during drag
                const targetX = pointerPos.x - dragOffset.x;
                const targetY = pointerPos.y - dragOffset.y;
                const dx = targetX - anchorX;

                // Cord always hangs downwards from ceiling mount: dy is clamped to >= 20px
                const dy = Math.max(20, targetY - anchorY);

                let targetTheta = Math.atan2(dx, dy);
                // Clamp maximum drag swing angle to +/- 75 degrees (+/- 1.31 rad)
                targetTheta = Math.max(-1.31, Math.min(1.31, targetTheta));

                const dist = Math.hypot(dx, dy);
                let targetLength;
                if (dist > restLength) {
                    // Elastic cord resistance damping
                    targetLength = restLength + (dist - restLength) * 0.4;
                } else {
                    // Cord slack
                    targetLength = Math.max(restLength * 0.55, dist);
                }

                // Shortest-arc angle lerp (absolutely avoids 360-degree flips)
                let diff = targetTheta - theta;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;

                theta += diff * 0.28;
                currentLength += (targetLength - currentLength) * 0.28;
                omega = 0;
                lengthVelocity = 0;

                // Dynamic 3D yaw and pitch during drag
                const targetTwist = Math.max(-25, Math.min(25, dx * 0.08));
                twist += (targetTwist - twist) * 0.2;

                const targetPitch = Math.max(-15, Math.min(15, (targetLength - restLength) * 0.05));
                pitch += (targetPitch - pitch) * 0.2;

            } else {
                // Free Physical Pendulum Simulation
                if (prefersReducedMotion) {
                    theta += (0 - theta) * 0.1;
                    currentLength += (restLength - currentLength) * 0.1;
                    twist += (0 - twist) * 0.1;
                    pitch += (0 - pitch) * 0.1;
                    omega = 0;
                    lengthVelocity = 0;
                } else {
                    // 1. Exact Angular Pendulum: alpha = -(g/L)*sin(theta) - dampingTheta*omega
                    const L = Math.max(45, currentLength);
                    let alpha = -(gravity / L) * Math.sin(theta) - dampingTheta * omega;

                    // Subtle organic ambient sway (calm and lifelike)
                    const ambient = 0.02 * Math.sin(timeSec * 1.35) + 0.01 * Math.sin(timeSec * 0.75 + 1.2);
                    alpha += ambient * (isHovered ? 2.2 : 0.7);

                    omega += alpha * dt;
                    omega = Math.max(-5.5, Math.min(5.5, omega));
                    theta += omega * dt;

                    // 2. Radial Elastic Cord Spring
                    const lengthDiff = currentLength - restLength;
                    const springForce = -springK * lengthDiff - dampingR * lengthVelocity;
                    const centrifugal = L * (omega * omega) * 0.15;
                    const radialAcc = springForce + centrifugal;

                    lengthVelocity += radialAcc * dt;
                    lengthVelocity = Math.max(-200, Math.min(200, lengthVelocity));
                    currentLength += lengthVelocity * dt;
                    currentLength = Math.max(restLength * 0.6, Math.min(restLength * 1.45, currentLength));

                    // 3. 3D Yaw Spring Settle
                    const ambientTwist = 1.2 * Math.sin(timeSec * 1.05);
                    const twistAcc = -twistK * (twist - ambientTwist) - twistDamp * twistVel;
                    twistVel += twistAcc * dt;
                    twist += twistVel * dt;

                    // 4. Subtle Pitch Settle
                    pitch += (0 - pitch) * 0.1;
                }
            }

            // Calculate Clip Tip Coordinates in Container Space
            const tipX = anchorX + currentLength * Math.sin(theta);
            const tipY = anchorY + currentLength * Math.cos(theta);
            const rotDeg = theta * (180 / Math.PI);

            // Apply 3D Transform to Badge
            badge.style.transform = `translate3d(${tipX}px, ${tipY}px, 0) translate(-50%, 0) rotateZ(${rotDeg}deg) rotateY(${twist}deg) rotateX(${pitch}deg)`;

            // SVG Lanyard Spline with realistic slack simulation
            const slack = Math.max(0, restLength - currentLength);
            const midX = (anchorX + tipX) * 0.5 + Math.sin(theta) * 10;
            const midY = (anchorY + tipY) * 0.5 + slack * 0.45;
            const d = `M ${anchorX} ${anchorY} Q ${midX} ${midY} ${tipX} ${tipY}`;

            strapPath.setAttribute('d', d);
            if (shadowPath) {
                shadowPath.setAttribute('d', `M ${anchorX + 5} ${anchorY + 6} Q ${midX + 7} ${midY + 10} ${tipX + 5} ${tipY + 12}`);
            }
            if (seamPath) {
                seamPath.setAttribute('d', d);
            }

            // Glare & Hologram updates based on 3D rotation
            if (glareOverlay) {
                const glareAngle = 45 + twist * 2 + rotDeg * 0.7;
                const glareOpacity = Math.max(0.12, Math.min(0.55, 0.28 + Math.abs(twist) * 0.012));
                glareOverlay.style.background = `linear-gradient(${glareAngle}deg, rgba(255, 255, 255, ${glareOpacity}) 0%, transparent 60%)`;
            }
            if (hologramStrip) {
                const hueShift = Math.floor((twist * 6 + rotDeg * 2.5 + 360) % 360);
                hologramStrip.style.filter = `hue-rotate(${hueShift}deg)`;
            }
        };

        requestAnimationFrame(animate);
    };

    // Initialize Hanging Badge Physics
    initHangingBadge();
});