// ===== NEON GRID - Main Application Controller =====

class NeonGridApp {
    constructor() {
        this.isInitialized = false;
        this.stats = {
            followCount: 0,
            likeCount: 0,
            commentCount: 0,
            checkCount: 0
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeControllers();
        this.startBackgroundEffects();
        this.addActivityLog('System initialized successfully', 'success');
        this.isInitialized = true;
        console.log('🚀 NEON GRID initialized');
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    initializeControllers() {
        // Initialize all controllers
        if (window.moduleController) {
            console.log('✅ Module controller ready');
        }
        if (window.uiController) {
            console.log('✅ UI controller ready');
        }
        if (window.audioController) {
            console.log('✅ Audio controller ready');
        }
    }

    startBackgroundEffects() {
        // Start particle system
        this.createParticleSystem();
        
        // Start matrix rain
        this.createMatrixRain();
        
        // Start circuit patterns
        this.createCircuitPatterns();
    }

    createParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
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

    createMatrixRain() {
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

    createCircuitPatterns() {
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

    toggleTheme() {
        const body = document.body;
        const isDark = !body.classList.contains('theme-light');
        
        if (isDark) {
            body.classList.add('theme-light');
            this.updateThemeColors('light');
        } else {
            body.classList.remove('theme-light');
            this.updateThemeColors('dark');
        }
        
        this.playSound('click');
        this.showNotification(`Switched to ${isDark ? 'light' : 'dark'} theme`, 'success');
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

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + number keys for module switching
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const modules = ['dashboard', 'account-checker', 'follow-bot', 'like-bot', 'comment-bot', 'username-checker', 'grab-avatars', 'stories-viewer', 'downloads'];
            const moduleIndex = parseInt(e.key) - 1;
            if (modules[moduleIndex] && window.moduleController) {
                window.moduleController.switchModule(modules[moduleIndex]);
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
        document.querySelectorAll('.stat-value').forEach(stat => {
            stat.classList.add('flash');
            setTimeout(() => stat.classList.remove('flash'), 1000);
        });
    }

    handleResize() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024;
        
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet && !isMobile);
        document.body.classList.toggle('desktop', !isMobile && !isTablet);
    }

    addActivityLog(message, type = 'info') {
        const activityLog = document.getElementById('activityLog');
        if (!activityLog) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry fade-in-up';
        
        logEntry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="log-message">${message}</span>
        `;

        activityLog.insertBefore(logEntry, activityLog.firstChild);

        // Keep only last 50 entries
        while (activityLog.children.length > 50) {
            activityLog.removeChild(activityLog.lastChild);
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 10px 15px;
            font-family: var(--font-secondary);
            font-size: 0.875rem;
            color: var(--text-primary);
            box-shadow: var(--shadow-dark);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10000;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    playSound(type) {
        if (window.audioController) {
            window.audioController.playSound(type);
        }
    }

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

    // ===== UTILITY METHODS =====

    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    updateStats(type, value) {
        this.stats[type] += value;
        const element = document.getElementById(type);
        if (element) {
            element.textContent = this.stats[type];
            element.classList.add('flash');
            setTimeout(() => element.classList.remove('flash'), 1000);
        }
    }
}

// Initialize main application
document.addEventListener('DOMContentLoaded', () => {
    window.neonGridApp = new NeonGridApp();
    
    // Add startup animation
    document.body.classList.add('fade-in');
    
    // Play startup sound after a delay
    setTimeout(() => {
        if (window.audioController) {
            window.audioController.playStartup();
        }
    }, 1000);
});

// Add startup styles
const startupStyles = document.createElement('style');
startupStyles.textContent = `
    body {
        opacity: 0;
        transition: opacity 1s ease-in;
    }
    
    body.fade-in {
        opacity: 1;
    }
    
    .notification.success {
        border-color: var(--neon-green);
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    }
    
    .notification.error {
        border-color: var(--neon-crimson);
        box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
    }
    
    .notification.warning {
        border-color: var(--neon-yellow);
        box-shadow: 0 0 20px rgba(255, 255, 0, 0.3);
    }
`;
document.head.appendChild(startupStyles); 