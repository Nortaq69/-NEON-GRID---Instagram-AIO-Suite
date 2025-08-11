// ===== MODULES CONTROLLER =====

class ModuleController {
    constructor() {
        this.currentModule = 'dashboard';
        this.isRunning = false;
        this.activeOperations = new Set();
        this.init();
    }

    init() {
        this.setupModuleSwitching();
        this.setupFileHandlers();
        this.setupActionButtons();
        this.setupTabSwitching();
        console.log('🔧 Module controller initialized');
    }

    setupModuleSwitching() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const module = item.dataset.module;
                this.switchModule(module);
            });
        });
    }

    switchModule(moduleName) {
        // Hide all modules
        document.querySelectorAll('.module-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active from nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show target module
        const targetModule = document.getElementById(moduleName);
        const targetNavItem = document.querySelector(`[data-module="${moduleName}"]`);

        if (targetModule) {
            targetModule.classList.add('active');
            this.currentModule = moduleName;
        }

        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }

        // Play sound and log
        this.playSound('click');
        this.addActivityLog(`Switched to ${moduleName.replace('-', ' ')} module`);
    }

    setupFileHandlers() {
        // Combo file handler
        const comboFile = document.getElementById('comboFile');
        const comboPreview = document.getElementById('comboPreview');
        
        if (comboFile && comboPreview) {
            comboFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    comboPreview.textContent = `📁 ${file.name} (${this.formatFileSize(file.size)})`;
                    comboPreview.classList.add('has-file');
                    this.playSound('success');
                }
            });
            comboPreview.addEventListener('click', () => comboFile.click());
        }

        // Proxy file handler
        const proxyFile = document.getElementById('proxyList');
        const proxyPreview = document.getElementById('proxyPreview');
        
        if (proxyFile && proxyPreview) {
            proxyFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    proxyPreview.textContent = `📁 ${file.name} (${this.formatFileSize(file.size)})`;
                    proxyPreview.classList.add('has-file');
                    this.playSound('success');
                }
            });
            proxyPreview.addEventListener('click', () => proxyFile.click());
        }
    }

    setupActionButtons() {
        // Account Checker
        const startChecker = document.getElementById('startChecker');
        if (startChecker) {
            startChecker.addEventListener('click', () => this.startAccountChecker());
        }

        // Follow Bot
        const startFollowBot = document.getElementById('startFollowBot');
        if (startFollowBot) {
            startFollowBot.addEventListener('click', () => this.startFollowBot());
        }

        // Like Bot
        const startLikeBot = document.getElementById('startLikeBot');
        if (startLikeBot) {
            startLikeBot.addEventListener('click', () => this.startLikeBot());
        }

        // Comment Bot
        const startCommentBot = document.getElementById('startCommentBot');
        if (startCommentBot) {
            startCommentBot.addEventListener('click', () => this.startCommentBot());
        }

        // Username Checker
        const startUsernameCheck = document.getElementById('startUsernameCheck');
        if (startUsernameCheck) {
            startUsernameCheck.addEventListener('click', () => this.startUsernameChecker());
        }

        // Avatar Grabber
        const startAvatarGrab = document.getElementById('startAvatarGrab');
        if (startAvatarGrab) {
            startAvatarGrab.addEventListener('click', () => this.startAvatarGrabber());
        }

        // Stories Viewer
        const startStoryView = document.getElementById('startStoryView');
        if (startStoryView) {
            startStoryView.addEventListener('click', () => this.startStoriesViewer());
        }

        // Downloads
        const startDownload = document.getElementById('startDownload');
        if (startDownload) {
            startDownload.addEventListener('click', () => this.startDownloader());
        }
    }

    setupTabSwitching() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                const tabContainer = e.target.closest('.results-tabs');
                
                // Remove active from all tabs
                tabContainer.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                
                // Add active to clicked tab
                e.target.classList.add('active');
                
                // Hide all tab contents
                const resultsContent = tabContainer.nextElementSibling;
                resultsContent.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show selected content
                const targetContent = resultsContent.querySelector(`#${tabName}Results`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // ===== MODULE OPERATIONS =====

    startAccountChecker() {
        if (this.isRunning) {
            this.showNotification('Another operation is already running', 'warning');
            return;
        }

        this.isRunning = true;
        this.playSound('click');
        this.addActivityLog('Starting account checker...', 'info');

        const comboFile = document.getElementById('comboFile').files[0];
        if (!comboFile) {
            this.showNotification('Please select a combo file', 'error');
            this.isRunning = false;
            return;
        }

        this.simulateAccountChecking(comboFile);
    }

    simulateAccountChecking(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const lines = e.target.result.split('\n').filter(line => line.trim());
            let checked = 0;
            let valid = 0;
            let invalid = 0;

            const checkInterval = setInterval(() => {
                if (checked >= lines.length || !this.isRunning) {
                    clearInterval(checkInterval);
                    this.isRunning = false;
                    this.addActivityLog(`Account checking completed. Valid: ${valid}, Invalid: ${invalid}`, 'success');
                    this.updateStats('checkCount', checked);
                    return;
                }

                const line = lines[checked];
                const isValid = Math.random() > 0.7;

                if (isValid) {
                    valid++;
                    this.addResult('validList', line, 'success');
                } else {
                    invalid++;
                    this.addResult('invalidList', line, 'error');
                }

                this.addResult('checkedList', line, 'info');
                checked++;
            }, 100);
        };

        reader.readAsText(file);
    }

    startFollowBot() {
        if (this.isRunning) {
            this.showNotification('Another operation is already running', 'warning');
            return;
        }

        this.isRunning = true;
        this.playSound('click');
        this.addActivityLog('Starting follow bot...', 'info');

        const usernames = document.getElementById('targetUsernames').value.split('\n').filter(u => u.trim());
        if (usernames.length === 0) {
            this.showNotification('Please enter target usernames', 'error');
            this.isRunning = false;
            return;
        }

        this.simulateFollowBot(usernames);
    }

    simulateFollowBot(usernames) {
        let followed = 0;
        const maxFollows = parseInt(document.getElementById('maxFollows').value) || 50;
        const delay = parseInt(document.getElementById('followDelay').value) || 30;

        const followInterval = setInterval(() => {
            if (followed >= Math.min(usernames.length, maxFollows) || !this.isRunning) {
                clearInterval(followInterval);
                this.isRunning = false;
                this.addActivityLog(`Follow bot completed. Followed: ${followed} accounts`, 'success');
                this.updateStats('followCount', followed);
                return;
            }

            const username = usernames[followed];
            const success = Math.random() > 0.2;

            if (success) {
                this.addLogEntry('followLog', `Successfully followed @${username}`, 'success');
            } else {
                this.addLogEntry('followLog', `Failed to follow @${username}`, 'error');
            }

            followed++;
            this.updateProgress('followProgress', followed, Math.min(usernames.length, maxFollows));
        }, delay * 1000);
    }

    startLikeBot() {
        if (this.isRunning) {
            this.showNotification('Another operation is already running', 'warning');
            return;
        }

        this.isRunning = true;
        this.playSound('click');
        this.addActivityLog('Starting like bot...', 'info');

        const hashtags = document.getElementById('targetHashtags').value.split('\n').filter(h => h.trim());
        if (hashtags.length === 0) {
            this.showNotification('Please enter target hashtags', 'error');
            this.isRunning = false;
            return;
        }

        this.simulateLikeBot(hashtags);
    }

    simulateLikeBot(hashtags) {
        let liked = 0;
        const maxLikes = parseInt(document.getElementById('maxLikes').value) || 100;
        const delay = parseInt(document.getElementById('likeDelay').value) || 15;

        const likeInterval = setInterval(() => {
            if (liked >= maxLikes || !this.isRunning) {
                clearInterval(likeInterval);
                this.isRunning = false;
                this.addActivityLog(`Like bot completed. Liked: ${liked} posts`, 'success');
                this.updateStats('likeCount', liked);
                return;
            }

            const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
            const success = Math.random() > 0.15;

            if (success) {
                this.addLogEntry('likeLog', `Liked post from #${hashtag}`, 'success');
            } else {
                this.addLogEntry('likeLog', `Failed to like post from #${hashtag}`, 'error');
            }

            liked++;
            this.updateProgress('likeProgress', liked, maxLikes);
        }, delay * 1000);
    }

    startCommentBot() {
        if (this.isRunning) {
            this.showNotification('Another operation is already running', 'warning');
            return;
        }

        this.isRunning = true;
        this.playSound('click');
        this.addActivityLog('Starting comment bot...', 'info');

        const templates = document.getElementById('commentTemplates').value.split('\n').filter(t => t.trim());
        const posts = document.getElementById('targetPosts').value.split('\n').filter(p => p.trim());

        if (templates.length === 0 || posts.length === 0) {
            this.showNotification('Please enter comment templates and target posts', 'error');
            this.isRunning = false;
            return;
        }

        this.simulateCommentBot(templates, posts);
    }

    simulateCommentBot(templates, posts) {
        let commented = 0;
        const delay = parseInt(document.getElementById('commentDelay').value) || 60;

        const commentInterval = setInterval(() => {
            if (commented >= posts.length || !this.isRunning) {
                clearInterval(commentInterval);
                this.isRunning = false;
                this.addActivityLog(`Comment bot completed. Commented: ${commented} posts`, 'success');
                this.updateStats('commentCount', commented);
                return;
            }

            const template = templates[Math.floor(Math.random() * templates.length)];
            const post = posts[commented];
            const success = Math.random() > 0.25;

            if (success) {
                this.addLogEntry('commentLog', `Commented "${template}" on post`, 'success');
            } else {
                this.addLogEntry('commentLog', `Failed to comment on post`, 'error');
            }

            commented++;
            this.updateProgress('commentProgress', commented, posts.length);
        }, delay * 1000);
    }

    startUsernameChecker() {
        this.playSound('click');
        this.addActivityLog('Starting username checker...', 'info');

        const usernames = document.getElementById('usernameList').value.split('\n').filter(u => u.trim());
        if (usernames.length === 0) {
            this.showNotification('Please enter usernames to check', 'error');
            return;
        }

        this.simulateUsernameChecking(usernames);
    }

    simulateUsernameChecking(usernames) {
        usernames.forEach((username, index) => {
            setTimeout(() => {
                const isAvailable = Math.random() > 0.8;
                
                if (isAvailable) {
                    this.addResult('availableList', username, 'success');
                } else {
                    this.addResult('takenList', username, 'error');
                }
            }, index * 100);
        });

        this.addActivityLog(`Username checking completed. Checked: ${usernames.length} usernames`, 'success');
    }

    startAvatarGrabber() {
        this.playSound('click');
        this.addActivityLog('Starting avatar grabber...', 'info');

        const usernames = document.getElementById('avatarUsernames').value.split('\n').filter(u => u.trim());
        if (usernames.length === 0) {
            this.showNotification('Please enter usernames', 'error');
            return;
        }

        this.simulateAvatarGrabbing(usernames);
    }

    simulateAvatarGrabbing(usernames) {
        const avatarGrid = document.getElementById('avatarGrid');
        avatarGrid.innerHTML = '';

        usernames.forEach((username, index) => {
            setTimeout(() => {
                const avatarItem = document.createElement('div');
                avatarItem.className = 'avatar-item fade-in-up';
                avatarItem.style.animationDelay = `${index * 0.1}s`;
                
                avatarItem.innerHTML = `
                    <img src="https://via.placeholder.com/60x60/00ffff/000000?text=${username.charAt(0).toUpperCase()}" 
                         alt="${username}" class="avatar-image">
                    <div class="avatar-username">${username}</div>
                `;
                
                avatarGrid.appendChild(avatarItem);
            }, index * 200);
        });

        this.addActivityLog(`Avatar grabbing completed. Downloaded: ${usernames.length} avatars`, 'success');
    }

    startStoriesViewer() {
        this.playSound('click');
        this.addActivityLog('Starting stories viewer...', 'info');

        const usernames = document.getElementById('storyUsernames').value.split('\n').filter(u => u.trim());
        if (usernames.length === 0) {
            this.showNotification('Please enter usernames', 'error');
            return;
        }

        this.simulateStoriesViewing(usernames);
    }

    simulateStoriesViewing(usernames) {
        const storiesContainer = document.getElementById('storiesContainer');
        storiesContainer.innerHTML = '';

        usernames.forEach((username, index) => {
            setTimeout(() => {
                const storyItem = document.createElement('div');
                storyItem.className = 'story-item fade-in-up';
                storyItem.style.animationDelay = `${index * 0.1}s`;
                
                storyItem.innerHTML = `
                    <div class="story-header">
                        <img src="https://via.placeholder.com/32x32/00ffff/000000?text=${username.charAt(0).toUpperCase()}" 
                             alt="${username}" class="story-avatar">
                        <div class="story-username">@${username}</div>
                    </div>
                    <div class="story-content">Viewed story successfully</div>
                `;
                
                storiesContainer.appendChild(storyItem);
            }, index * 200);
        });

        this.addActivityLog(`Stories viewing completed. Viewed: ${usernames.length} stories`, 'success');
    }

    startDownloader() {
        this.playSound('click');
        this.addActivityLog('Starting media downloader...', 'info');

        const urls = document.getElementById('mediaUrls').value.split('\n').filter(u => u.trim());
        if (urls.length === 0) {
            this.showNotification('Please enter media URLs', 'error');
            return;
        }

        this.simulateMediaDownloading(urls);
    }

    simulateMediaDownloading(urls) {
        const downloadQueue = document.getElementById('downloadQueue');
        downloadQueue.innerHTML = '';

        urls.forEach((url, index) => {
            const downloadItem = document.createElement('div');
            downloadItem.className = 'download-item fade-in-up';
            downloadItem.style.animationDelay = `${index * 0.1}s`;
            
            downloadItem.innerHTML = `
                <div class="download-info">
                    <div class="download-url">${url}</div>
                    <div class="download-status pending">Pending</div>
                </div>
                <div class="download-progress">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            `;
            
            downloadQueue.appendChild(downloadItem);

            // Simulate download progress
            setTimeout(() => {
                const progressBar = downloadItem.querySelector('.progress-bar');
                const status = downloadItem.querySelector('.download-status');
                
                status.textContent = 'Downloading';
                status.className = 'download-status downloading';
                
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += Math.random() * 20;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(progressInterval);
                        status.textContent = 'Completed';
                        status.className = 'download-status completed';
                    }
                    progressBar.style.width = `${progress}%`;
                }, 200);
            }, index * 1000);
        });

        this.addActivityLog(`Media downloading completed. Downloaded: ${urls.length} files`, 'success');
    }

    // ===== UTILITY METHODS =====

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

    addResult(containerId, text, type = 'info') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${type} fade-in-up`;
        resultItem.textContent = text;

        container.appendChild(resultItem);
    }

    addLogEntry(containerId, message, type = 'info') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry fade-in-up';
        
        logEntry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="log-message">${message}</span>
            <span class="log-status ${type}">${type.toUpperCase()}</span>
        `;

        container.appendChild(logEntry);
        container.scrollTop = container.scrollHeight;
    }

    updateProgress(elementId, current, total) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `${current}/${total}`;
        }
    }

    updateStats(type, value) {
        const element = document.getElementById(type);
        if (element) {
            const currentValue = parseInt(element.textContent) || 0;
            element.textContent = currentValue + value;
            element.classList.add('flash');
            setTimeout(() => element.classList.remove('flash'), 1000);
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    playSound(type) {
        const audio = document.getElementById(`${type}Sound`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }
}

// Initialize module controller
document.addEventListener('DOMContentLoaded', () => {
    window.moduleController = new ModuleController();
}); 