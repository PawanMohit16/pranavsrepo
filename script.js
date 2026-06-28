document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particles.js (if library is loaded)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 40,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": ["#3B82F6", "#8B5CF6", "#06B6D4"] },
                "shape": {
                    "type": "circle",
                    "stroke": { "width": 0, "color": "#000000" }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.1,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1.5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    // 2. Typing Effect
    const roles = [
        "AI Developer",
        "Backend Developer",
        "Unity Game Developer",
        "Cloud & Azure Enthusiast",
        "Networking Enthusiast",
        "Problem Solver"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingTextElement = document.getElementById('typing-text');
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenRoles = 2000;

    function type() {
        if(!typingTextElement) return;
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeTimeout = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            typeTimeout = delayBetweenRoles;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeTimeout = 500;
        }

        setTimeout(type, typeTimeout);
    }
    
    // Start typing effect
    if(typingTextElement) {
        setTimeout(type, 1000);
    }

    // 3. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if(navLinks.classList.contains('active')){
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    if(navLinksItems) {
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                if(navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 4. Scroll Progress Indicator & Sticky Navbar
    const scrollProgress = document.querySelector('.scroll-progress');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        // Scroll Progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if(scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Sticky Navbar effect
        if(navbar) {
            if(scrollTop > 50) {
                navbar.style.background = 'rgba(2, 6, 23, 0.95)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            } else {
                navbar.style.background = 'rgba(2, 6, 23, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // 5. Active Section Highlighting
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        if(navLinksItems) {
            navLinksItems.forEach(a => {
                a.classList.remove('active');
                if (current && a.getAttribute('href').includes(current)) {
                    a.classList.add('active');
                }
            });
        }
    });

    // 6. Intersection Observer for Fade Animations
    const fadeElements = document.querySelectorAll('.fade-up, .fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    if(fadeElements) {
        fadeElements.forEach(el => {
            appearOnScroll.observe(el);
        });
    }

    // 7. Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            // Loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
            btn.classList.add('glow-violet');
            btn.classList.remove('glow-cyan');
            
            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Transmission Successful';
                btn.classList.remove('glow-violet');
                btn.style.background = 'var(--accent-blue)';
                
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.add('glow-cyan');
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // 8. Resume Dropdown Toggle
    const resumeDropdownBtn = document.getElementById('resumeDropdownBtn');
    const resumeDropdown = document.getElementById('resumeDropdown');

    if (resumeDropdownBtn && resumeDropdown) {
        resumeDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resumeDropdown.classList.toggle('active');
            
            // Toggle icon
            const icon = resumeDropdownBtn.querySelector('i');
            if(resumeDropdown.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!resumeDropdown.contains(e.target) && !resumeDropdownBtn.contains(e.target)) {
                resumeDropdown.classList.remove('active');
                const icon = resumeDropdownBtn.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    }
});
