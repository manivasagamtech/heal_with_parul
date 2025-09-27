// DOM elements
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');

// Mobile Navigation
function showMenu() {
    navMenu.classList.add('show-menu');
}

function hideMenu() {
    navMenu.classList.remove('show-menu');
}

if (navToggle) {
    navToggle.addEventListener('click', showMenu);
}

if (navClose) {
    navClose.addEventListener('click', hideMenu);
}

// Close menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hideMenu();
    });
});

// Header scroll effect
function scrollHeader() {
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

// Active link highlighting
function highlightActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav__link[href*=${sectionId}]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            correspondingLink?.classList.add('active-link');
        } else {
            correspondingLink?.classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', highlightActiveLink);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.section__header, .service__card, .testimonial__card, .video__card, .about__content, .contact__container');
    
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        // Start animation when element is visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counterObserver.observe(counter);
    });
}

// Testimonials carousel - Fixed version
class TestimonialsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.testimonials = document.querySelectorAll('.testimonial__card');
        this.dots = document.querySelectorAll('.dot');
        this.autoPlayInterval = null;
        this.isAutoPlayActive = true;
        
        this.init();
    }
    
    init() {
        if (this.testimonials.length === 0) return;
        
        // Initialize first slide
        this.showSlide(0);
        
        this.setupDots();
        this.startAutoPlay();
        
        // Pause on hover
        const testimonialsContainer = document.querySelector('.testimonials__container');
        if (testimonialsContainer) {
            testimonialsContainer.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
                this.isAutoPlayActive = false;
            });
            testimonialsContainer.addEventListener('mouseleave', () => {
                this.isAutoPlayActive = true;
                this.startAutoPlay();
            });
        }
        
        console.log('Testimonials carousel initialized with', this.testimonials.length, 'slides');
    }
    
    showSlide(index) {
        // Ensure valid index
        if (index >= this.testimonials.length) {
            index = 0;
        } else if (index < 0) {
            index = this.testimonials.length - 1;
        }
        
        // Hide all testimonials
        this.testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (this.dots[i]) {
                this.dots[i].classList.remove('active');
            }
        });
        
        // Show current testimonial
        if (this.testimonials[index]) {
            this.testimonials[index].classList.add('active');
            console.log('Showing slide', index);
        }
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.testimonials.length;
        this.showSlide(nextIndex);
    }
    
    setupDots() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showSlide(index);
                this.pauseAutoPlay();
                this.isAutoPlayActive = false;
                
                // Restart autoplay after 3 seconds of inactivity
                setTimeout(() => {
                    if (!this.isAutoPlayActive) {
                        this.isAutoPlayActive = true;
                        this.startAutoPlay();
                    }
                }, 3000);
            });
        });
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        
        if (this.isAutoPlayActive && this.testimonials.length > 1) {
            this.autoPlayInterval = setInterval(() => {
                if (this.isAutoPlayActive) {
                    this.nextSlide();
                }
            }, 4000); // Change slide every 4 seconds
            
            console.log('Auto-play started');
        }
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            console.log('Auto-play paused');
        }
    }
}

// Video modal functionality
class VideoModal {
    constructor() {
        this.modal = document.getElementById('video-modal');
        this.closeBtn = document.getElementById('modal-close');
        this.overlay = document.querySelector('.video-modal__overlay');
        this.videoThumbnails = document.querySelectorAll('.video__thumbnail');
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Add click listeners to video thumbnails
        this.videoThumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                this.openModal(index);
            });
        });
        
        // Close modal listeners
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeModal());
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    openModal(videoIndex) {
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Here you would typically load the actual video
        // For demo purposes, we'll just show a placeholder
        const videoPlayer = document.querySelector('.video-modal__player');
        if (videoPlayer) {
            videoPlayer.innerHTML = `
                <div style="background: #f0f0f0; padding: 60px; text-align: center; border-radius: 8px;">
                    <i class="fas fa-play-circle" style="font-size: 60px; color: var(--healing-green); margin-bottom: 20px;"></i>
                    <p style="font-size: 18px; color: #666; margin: 0;">Video testimonial ${videoIndex + 1} would play here</p>
                    <p style="font-size: 14px; color: #999; margin-top: 10px;">In a real implementation, this would be a video player</p>
                </div>
            `;
        }
    }
    
    closeModal() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Contact form handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageDiv = document.getElementById('form-message');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.service) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.form.querySelector('.form__submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (in real implementation, this would be an API call)
            await this.simulateFormSubmission(data);
            
            this.showMessage('Thank you for your message! I\'ll get back to you soon. 🙏', 'success');
            this.form.reset();
            
        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful submission
                console.log('Form submitted:', data);
                resolve();
            }, 1500);
        });
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showMessage(message, type) {
        if (!this.messageDiv) return;
        
        this.messageDiv.textContent = message;
        this.messageDiv.className = `form__message ${type}`;
        this.messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            this.messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Service card hover effects
function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service__card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Parallax effect for hero section (simplified for better performance)
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (!hero || window.innerWidth <= 768) return; // Disable on mobile
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestParallax() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallax);
}

// Floating elements animation enhancement
function enhanceFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add random movement
        const randomDelay = Math.random() * 2;
        const randomDuration = 4 + Math.random() * 4;
        
        element.style.animationDelay = `${randomDelay}s`;
        element.style.animationDuration = `${randomDuration}s`;
        
        // Add mouse interaction
        element.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.2)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = 'scale(1)';
        });
    });
}

// Loading animation
function showLoadingAnimation() {
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    });
}

// WhatsApp integration helper
function initWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-float');
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function(e) {
            // Track click for analytics (if needed)
            console.log('WhatsApp button clicked');
        });
    }
}

// Social media link enhancements
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.footer__social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track social media clicks (if needed)
            const platform = this.querySelector('i').classList.contains('fa-instagram') ? 'Instagram' : 'WhatsApp';
            console.log(`${platform} link clicked`);
        });
    });
}

// Performance optimization: Lazy loading
function initLazyLoading() {
    // Since we're using placeholders, we don't need actual lazy loading
    // But this function could be used to lazy load images in a real implementation
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Theme detection (for future dark mode implementation)
function detectTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // For now, we'll force light mode since the design is bright/healing themed
    document.documentElement.setAttribute('data-color-scheme', 'light');
    
    prefersDark.addEventListener('change', (e) => {
        // Keep light mode for healing aesthetic
        document.documentElement.setAttribute('data-color-scheme', 'light');
    });
}

// Accessibility enhancements
function initAccessibility() {
    // Focus trap for modal
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // Basic focus trap implementation
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.addEventListener('focus', function() {
        this.style.left = '0';
        this.style.top = '0';
        this.style.background = 'var(--healing-green)';
        this.style.color = 'white';
        this.style.padding = '10px';
        this.style.zIndex = '9999';
    });
    skipLink.addEventListener('blur', function() {
        this.style.left = '-9999px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Global testimonials carousel instance
let testimonialsCarousel;

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Heal with Parul website...');
    
    // Show loading animation
    showLoadingAnimation();
    
    // Initialize all components
    initScrollAnimations();
    animateCounters();
    
    // Initialize testimonials carousel with logging
    testimonialsCarousel = new TestimonialsCarousel();
    
    new VideoModal();
    new ContactForm();
    initServiceCardEffects();
    initParallax();
    enhanceFloatingElements();
    initWhatsAppButton();
    initSocialLinks();
    initLazyLoading();
    detectTheme();
    initAccessibility();
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
    
    console.log('Heal with Parul website initialized successfully!');
});

// Resize handler for responsive adjustments
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    hideMenu();
    
    // Recalculate animations if needed
    if (window.innerWidth > 768) {
        document.body.style.overflow = '';
    }
});

// Export functions for potential external use
window.HealWithParul = {
    showMenu,
    hideMenu,
    TestimonialsCarousel,
    VideoModal,
    ContactForm,
    testimonialsCarousel
};
