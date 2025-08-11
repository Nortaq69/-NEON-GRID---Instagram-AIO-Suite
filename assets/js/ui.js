// ===== UI CONTROLLER =====

class UIController {
    constructor() {
        this.isInitialized = false;
        this.currentTheme = 'dark';
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupHoverEffects();
        this.setupKeyboardShortcuts();
        this.setupParticleSystem();
        this.setupMatrixRain();
        this.setupCircuitPatterns();
        this.setupGlitchEffects();
        this.setupLoadingStates();
        this.setupTooltips();
        this.setupNotifications();
        this.isInitialized = true;
        console.log('🎨 UI controller initialized');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        const body = document.body;
        const isDark = !body.classList.contains('theme-light');
        
        if (isDark) {
            body.classList.add('theme-light');
            this.currentTheme = 'light';
            this.updateThemeColors('light');
        } else {
            body.classList.remove('theme-light');
            this.currentTheme = 'dark';
            this.updateThemeColors('dark');
        }
        
        this.playSound('click');
        this.showNotification(`Switched to ${this.currentTheme} theme`, 'success');
    }

    updateThemeColors(theme) {
        const root = document.documentElement;
        
        if (theme === 'light') {
            root.style.setProperty('--bg-primary', '#f0f0f0');
            root.style.setProperty('--bg-secondary', '#e0e0e0');
            root.style.setProperty('--bg-tertiary', '#d0d0d0');
            root.style.setProperty('--text-primary', '#000000');
            root.style.setProperty('--text-secondary', '#333333');
        } else {
            root.style.setProperty('--bg-primary', '#0a0a0a');
            root.style.setProperty('--bg-secondary', '#1a1a1a');
            root.style.setProperty('--bg-tertiary', '#2a2a2a');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b0b0b0');
        }
    }

    setupHoverEffects() {
        // Add hover effects to interactive elements
        document.querySelectorAll('.nav-item, .action-btn, .stat-card, .result-item').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playSound('hover');
                element.classList.add('hover-glow');
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('hover-glow');
            });

            element.addEventListener('click', () => {
                element.classList.add('button-press');
                setTimeout(() => element.classList.remove('button-press'), 150);
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + number keys for module switching
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const modules = ['dashboard', 'account-checker', 'follow-bot', 'like-bot', 'comment-bot', 'username-checker', 'grab-avatars', 'stories-viewer', 'downloads'];
                const moduleIndex = parseInt(e.key) - 1;
                if (modules[moduleIndex]) {
                    this.switchModule(modules[moduleIndex]);
                }
            }

            // Escape key to stop operations
            if (e.key === 'Escape') {
                this.stopAllOperations();
            }

            // F5 to refresh stats
            if (e.key === 'F5') {
                e.preventDefault();
                this.refreshStats();
            }

            // Ctrl/Cmd + T for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setupParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.3';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 30;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
                this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.005;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                if (this.life <= 0) {
                    this.reset();
                }
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.life = 1;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.life;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    setupMatrixRain() {
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-rain';
        document.body.appendChild(matrixContainer);

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columns = Math.floor(window.innerWidth / 20);

        for (let i = 0; i < columns; i++) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.left = `${i * 20}px`;
            char.style.animationDelay = `${Math.random() * 3}s`;
            matrixContainer.appendChild(char);
        }
    }

    setupCircuitPatterns() {
        const circuitSvg = `
            <svg class="circuit-svg" viewBox="0 0 100 100">
                <path class="circuit-path" d="M10,10 L30,10 L30,30 L50,30 L50,50 L70,50 L70,70 L90,70"/>
                <path class="circuit-path" d="M10,90 L30,90 L30,70 L50,70 L50,50 L70,50 L70,30 L90,30"/>
                <circle cx="30" cy="10" r="2" fill="var(--neon-cyan)"/>
                <circle cx="70" cy="30" r="2" fill="var(--neon-cyan)"/>
                <circle cx="50" cy="50" r="2" fill="var(--neon-cyan)"/>
                <circle cx="30" cy="70" r="2" fill="var(--neon-cyan)"/>
                <circle cx="70" cy="90" r="2" fill="var(--neon-cyan)"/>
            </svg>
        `;
        
        document.querySelectorAll('.content-area, .sidebar').forEach(container => {
            container.insertAdjacentHTML('beforeend', circuitSvg);
        });
    }

    setupGlitchEffects() {
        // Add glitch effect to title
        const appTitle = document.querySelector('.app-title');
        if (appTitle) {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    appTitle.classList.add('glitch');
                    setTimeout(() => appTitle.classList.remove('glitch'), 300);
                }
            }, 5000);
        }

        // Add glitch effect to status indicator
        const statusDot = document.querySelector('.status-dot');
        if (statusDot) {
            setInterval(() => {
                if (Math.random() > 0.98) {
                    statusDot.classList.add('glitch');
                    setTimeout(() => statusDot.classList.remove('glitch'), 200);
                }
            }, 10000);
        }
    }

    setupLoadingStates() {
        // Add loading states to buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    btn.classList.add('loading');
                    btn.disabled = true;
                    
                    // Remove loading state after operation completes
                    setTimeout(() => {
                        btn.classList.remove('loading');
                        btn.disabled = false;
                    }, 2000);
                }
            });
        });
    }

    setupTooltips() {
        // Add tooltips to elements with data-tooltip attribute
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.classList.add('tooltip');
        });
    }

    setupNotifications() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(notificationContainer);
    }

    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notification-container') || document.body;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.pointerEvents = 'auto';
        
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    switchModule(moduleName) {
        if (window.moduleController) {
            window.moduleController.switchModule(moduleName);
        }
    }

    stopAllOperations() {
        if (window.moduleController) {
            window.moduleController.isRunning = false;
            this.showNotification('All operations stopped', 'warning');
            this.playSound('error');
        }
    }

    refreshStats() {
        this.showNotification('Refreshing statistics...', 'info');
        // Trigger stats refresh
        document.querySelectorAll('.stat-value').forEach(stat => {
            stat.classList.add('flash');
            setTimeout(() => stat.classList.remove('flash'), 1000);
        });
    }

    playSound(type) {
        const audio = document.getElementById(`${type}Sound`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {}); // Ignore autoplay restrictions
        }
    }

    // ===== ANIMATION UTILITIES =====

    addFadeInEffect(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    addScaleEffect(element, delay = 0) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, delay);
    }

    addSlideEffect(element, direction = 'left', delay = 0) {
        const transform = direction === 'left' ? 'translateX(-100%)' : 
                         direction === 'right' ? 'translateX(100%)' :
                         direction === 'up' ? 'translateY(-100%)' : 'translateY(100%)';
        
        element.style.transform = transform;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.transform = 'translate(0, 0)';
            element.style.opacity = '1';
        }, delay);
    }

    // ===== INTERACTIVE EFFECTS =====

    addRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    addGlitchText(element, duration = 1000) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let interval = setInterval(() => {
            element.textContent = originalText.split('').map(char => 
                Math.random() > 0.8 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
            ).join('');
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            element.textContent = originalText;
        }, duration);
    }

    addTypewriterEffect(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===== RESPONSIVE HANDLERS =====

    setupResponsiveHandlers() {
        const handleResize = this.debounce(() => {
            this.updateLayout();
        }, 250);

        window.addEventListener('resize', handleResize);
        this.updateLayout();
    }

    updateLayout() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024;
        
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet && !isMobile);
        document.body.classList.toggle('desktop', !isMobile && !isTablet);
    }
}

// Initialize UI controller
document.addEventListener('DOMContentLoaded', () => {
    window.uiController = new UIController();
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .action-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style); 