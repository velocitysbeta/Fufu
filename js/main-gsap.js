// Main GSAP-Powered Animation System for GitHub Pages
// This file integrates GSAP, Lenis, and all animations for ultra-smooth experience

document.addEventListener('DOMContentLoaded', function() {
    // Check if required libraries are loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, Flip);
    
    // ===== CUSTOM EASING CURVES =====
    const easings = {
        smooth: "power3.out",
        smoothIn: "power3.in",
        smoothInOut: "power3.inOut",
        expo: "expo.out",
        elastic: "elastic.out(1, 0.5)",
        bounce: "bounce.out"
    };
    
    // ===== LENIS SMOOTH SCROLL SETUP (with fallback) =====
    let lenis = null;
    
    if (typeof Lenis !== 'undefined') {
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false
            });
            
            // Connect Lenis to ScrollTrigger
            lenis.on('scroll', ScrollTrigger.update);
            
            // Add Lenis to GSAP ticker
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            
            // Disable lag smoothing
            gsap.ticker.lagSmoothing(0);
            
        } catch (e) {
            console.warn('Lenis initialization failed, falling back to native scroll');
            lenis = null;
        }
    } else {
        console.warn('Lenis not loaded, using native scroll');
    }
    
    // Fallback scroll methods
    const scrollMethods = {
        stop: function() {
            if (lenis) {
                lenis.stop();
            } else {
                document.body.style.overflow = 'hidden';
            }
        },
        start: function() {
            if (lenis) {
                lenis.start();
            } else {
                document.body.style.overflow = '';
            }
        },
        scrollTo: function(target, options = {}) {
            if (lenis) {
                lenis.scrollTo(target, options);
            } else {
                // Native fallback
                if (typeof target === 'string') {
                    target = document.querySelector(target);
                }
                if (target) {
                    const offset = options.offset || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset + offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    };

    // ===== SCROLL-TRIGGERED ANIMATIONS =====
    
    // Hero section parallax
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        gsap.to('.hero-section', {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }

    // Reveal animations with stagger
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        gsap.utils.toArray('.reveal-on-scroll').forEach((element, index) => {
            gsap.fromTo(element, 
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    delay: index * 0.1,
                    ease: easings.smooth,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    // Evidence cards batch animation
    const evidenceCards = document.querySelectorAll('.evidence-card');
    if (evidenceCards.length > 0) {
        ScrollTrigger.batch('.evidence-card', {
            onEnter: (batch) => gsap.fromTo(batch, 
                {
                    opacity: 0,
                    y: 100,
                    scale: 0.9,
                    rotateY: -5
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateY: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: easings.smooth,
                    overwrite: true
                }
            ),
            onLeave: (batch) => gsap.to(batch, {
                opacity: 0,
                y: -100,
                scale: 0.9,
                duration: 0.5,
                stagger: 0.05,
                ease: easings.smoothIn
            }),
            onEnterBack: (batch) => gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: easings.smooth
            }),
            onLeaveBack: (batch) => gsap.to(batch, {
                opacity: 0,
                y: 100,
                scale: 0.9,
                duration: 0.5,
                stagger: 0.05,
                ease: easings.smoothIn
            }),
            start: 'top 90%',
            end: 'bottom 10%'
        });
    }

    // Text gradient animation
    const headings = document.querySelectorAll('h1, h2');
    if (headings.length > 0) {
        gsap.utils.toArray('h1, h2').forEach(heading => {
            gsap.to(heading, {
                backgroundPosition: '200% center',
                ease: "none",
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: 2
                }
            });
        });
    }

    // ===== NAVIGATION PILL ANIMATION =====
    const navPill = document.querySelector('#nav-pill');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navPill && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const rect = link.getBoundingClientRect();
                const parentRect = link.parentElement.getBoundingClientRect();
                gsap.to(navPill, {
                    x: rect.left - parentRect.left - 4,
                    width: rect.width + 8,
                    duration: 0.4,
                    ease: easings.smooth
                });
            });
        });
    }

    // ===== TAB ANIMATIONS =====
    const tabs = document.querySelectorAll('.tab-button');
    const panes = document.querySelectorAll('.tab-pane');
    
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.tab;
                const targetPane = document.getElementById(targetId);
                const currentPane = document.querySelector('.tab-pane.active');
                
                if (!targetPane || currentPane === targetPane) return;
                
                // Animate tab buttons
                tabs.forEach(t => {
                    if (t === tab) {
                        gsap.to(t, {
                            scale: 1,
                            backgroundColor: '#A0522D',
                            color: '#FFFFFF',
                            y: -3,
                            duration: 0.4,
                            ease: easings.bounce
                        });
                        t.classList.add('active');
                    } else {
                        gsap.to(t, {
                            scale: 1,
                            backgroundColor: 'transparent',
                            color: '#565656',
                            y: 0,
                            duration: 0.3,
                            ease: easings.smooth
                        });
                        t.classList.remove('active');
                    }
                });
                
                // Cross-fade tab panes
                if (currentPane) {
                    gsap.to(currentPane, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        ease: easings.smoothIn,
                        onComplete: () => {
                            currentPane.classList.remove('active');
                            currentPane.classList.add('hidden');
                        }
                    });
                }
                
                targetPane.classList.remove('hidden');
                gsap.fromTo(targetPane, 
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        delay: 0.1,
                        ease: easings.smooth,
                        onStart: () => {
                            targetPane.classList.add('active');
                        }
                    }
                );
            });

            // Press animation
            tab.addEventListener('mousedown', () => {
                gsap.to(tab, { scale: 0.95, duration: 0.1 });
            });
            
            tab.addEventListener('mouseup', () => {
                gsap.to(tab, { scale: 1, duration: 0.2, ease: easings.bounce });
            });
        });
    }

    // ===== MODAL WITH FLIP ANIMATION =====
    const modal = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    
    const modalData = {
        modal1: {
            title: "Koneksi 'Chilli Pari'",
            content: "Titik balik krusial dalam investigasi ini adalah penemuan unggahan paralel. Pada tanggal 3 November 2014, akun Kaskus 'fufufafa' dan akun Twitter '@Chilli_Pari' (yang diketahui sebagai akun bisnis katering milik Gibran) sama-sama mengunggah pertanyaan yang identik: di mana bisa membeli 'gunting yg kayak di Steak Gunting PIK'. Kesamaan yang spesifik dan terjadi pada waktu yang berdekatan ini menjadi pilar utama yang menghubungkan kedua identitas digital tersebut."
        },
        modal2: {
            title: "Peretasan Anonim dan Kebocoran Data",
            content: "Momen paling menentukan datang ketika kelompok peretas 'Anonymous Indonesia' mengklaim telah membocorkan informasi pribadi yang terkait dengan akun 'fufufafa' dan '@Chilli_Pari'. Data yang dibocorkan mencakup Nomor Induk Kependudukan (NIK), nomor telepon, dan alamat email. Warganet dengan cepat menelusuri detail ini dan menemukan bahwa data tersebut merujuk langsung kepada Gibran Rakabuming Raka."
        },
        modal3: {
            title: "Hubungan Nomor Telepon: Tautan Definitif",
            content: "Verifikasi silang menunjukkan bahwa nomor telepon yang bocor adalah nomor yang sama dengan yang digunakan Gibran saat mendaftar sebagai calon Walikota Surakarta pada Pilkada 2020 di KPU. Lebih jauh lagi, ketika warganet mencoba melakukan transaksi finansial menggunakan nomor tersebut melalui dompet digital, nama lengkap 'Gibran Rakabuming Raka' muncul sebagai pemiliknya. Ini adalah mata rantai bukti yang paling kuat dan sulit dibantah."
        }
    };
    
    let activeCard = null;
    
    if (evidenceCards.length > 0 && modal && modalContent && closeBtn && modalBody) {
        evidenceCards.forEach(card => {
            card.addEventListener('click', () => {
                activeCard = card;
                const modalId = card.dataset.modal;
                const data = modalData[modalId];
                
                if (!data) return;
                
                // Set modal content
                modalBody.innerHTML = `
                    <h3 class="text-2xl font-bold text-[#A0522D] mb-4">${data.title}</h3>
                    <p class="text-gray-700">${data.content}</p>
                `;
                
                // Get card position
                const cardRect = card.getBoundingClientRect();
                
                // Set initial modal position at card location
                gsap.set(modalContent, {
                    position: 'fixed',
                    top: cardRect.top,
                    left: cardRect.left,
                    width: cardRect.width,
                    height: cardRect.height,
                    opacity: 0,
                    scale: 1
                });
                
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                
                // Set modal opacity to 1
                gsap.set(modal, { opacity: 1 });
                
                // Animate modal to center using FLIP
                gsap.to(modalContent, {
                    top: '50%',
                    left: '50%',
                    xPercent: -50,
                    yPercent: -50,
                    width: '90vw',
                    maxWidth: '600px',
                    height: 'auto',
                    opacity: 1,
                    duration: 0.6,
                    ease: easings.smooth
                });
                
                // Stop scroll
                scrollMethods.stop();
            });
        });
        
        // Close modal animation
        const closeModal = () => {
            if (!activeCard) return;
            
            const cardRect = activeCard.getBoundingClientRect();
            
            // Animate back to card
            gsap.to(modalContent, {
                top: cardRect.top,
                left: cardRect.left,
                xPercent: 0,
                yPercent: 0,
                width: cardRect.width,
                height: cardRect.height,
                opacity: 0,
                duration: 0.5,
                ease: easings.smoothIn,
                onComplete: () => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    gsap.set(modal, { opacity: 0 });
                    activeCard = null;
                    scrollMethods.start();
                }
            });
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // ===== SIDEBAR NAVIGATION =====
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('menu-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && sidebarToggle && sidebarOverlay) {
        const toggleSidebar = () => {
            const isOpen = sidebar.classList.contains('open');
            
            if (isOpen) {
                // Close sidebar
                gsap.to(sidebar, {
                    x: '-100%',
                    duration: 0.5,
                    ease: easings.smooth,
                    onComplete: () => sidebar.classList.remove('open')
                });
                
                gsap.to(sidebarOverlay, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => sidebarOverlay.classList.remove('active')
                });
                
                // Animate hamburger to normal
                const lines = sidebarToggle.querySelectorAll('.hamburger-line');
                if (lines.length >= 3) {
                    gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3 });
                    gsap.to(lines[1], { opacity: 1, scaleX: 1, duration: 0.3 });
                    gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.3 });
                }
                
                sidebarToggle.classList.remove('open');
                scrollMethods.start();
            } else {
                // Open sidebar
                sidebar.classList.add('open');
                sidebarOverlay.classList.add('active');
                
                gsap.fromTo(sidebar,
                    { x: '-100%' },
                    { x: '0%', duration: 0.5, ease: easings.smooth }
                );
                
                gsap.fromTo(sidebarOverlay,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3 }
                );
                
                // Animate hamburger to X
                const lines = sidebarToggle.querySelectorAll('.hamburger-line');
                if (lines.length >= 3) {
                    gsap.to(lines[0], { rotation: 45, y: 7, duration: 0.3 });
                    gsap.to(lines[1], { opacity: 0, scaleX: 0, duration: 0.3 });
                    gsap.to(lines[2], { rotation: -45, y: -7, duration: 0.3 });
                }
                
                // Stagger sidebar links animation
                const sidebarLinks = document.querySelectorAll('.sidebar-link');
                if (sidebarLinks.length > 0) {
                    gsap.fromTo('.sidebar-link',
                        { x: -50, opacity: 0 },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.4,
                            stagger: 0.05,
                            delay: 0.2,
                            ease: easings.smooth
                        }
                    );
                }
                
                sidebarToggle.classList.add('open');
                scrollMethods.stop();
            }
        };
        
        sidebarToggle.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
        
        // Close sidebar on link click
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    toggleSidebar();
                }
                
                // Smooth scroll to section
                const targetId = link.getAttribute('data-scroll-to');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    scrollMethods.scrollTo(targetSection, {
                        offset: -80,
                        duration: 1.2
                    });
                }
            });
        });
    }

    // ===== 3D CARD TILT EFFECT =====
    if (evidenceCards.length > 0) {
        evidenceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                gsap.to(card, {
                    rotationX: -rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: easings.smooth
                });
                
                // Move glare effect
                const glare = card.querySelector('.card-glare');
                if (glare) {
                    gsap.to(glare, {
                        backgroundPosition: `${x}px ${y}px`,
                        duration: 0.3
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: easings.bounce
                });
                
                const glare = card.querySelector('.card-glare');
                if (glare) {
                    gsap.to(glare, {
                        backgroundPosition: '50% 50%',
                        duration: 0.5
                    });
                }
            });
        });
    }

    // ===== SMOOTH SCROLL FOR NAVIGATION =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-scroll-to');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                scrollMethods.scrollTo(targetSection, {
                    offset: -80,
                    duration: 1.2
                });
            }
        });
    });

    // ===== INITIAL PAGE ANIMATIONS =====
    document.body.classList.add('loaded');
    
    // Hero entrance animation
    const heroHeadline = document.querySelector('.hero-headline');
    const heroLead = document.querySelector('.hero-lead');
    
    if (heroHeadline || heroLead) {
        const tl = gsap.timeline();
        
        if (heroHeadline) {
            tl.fromTo('.hero-headline',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: easings.smooth }
            );
        }
        
        if (heroLead) {
            tl.fromTo('.hero-lead',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: easings.smooth },
                '-=0.5'
            );
        }
    }
    
    // Refresh ScrollTrigger on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
});