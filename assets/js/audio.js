// ===== AUDIO CONTROLLER =====

class AudioController {
    constructor() {
        this.isEnabled = true;
        this.volume = 0.3;
        this.sounds = {};
        this.audioContext = null;
        this.init();
    }

    init() {
        this.setupAudioContext();
        this.createSoundEffects();
        this.setupVolumeControl();
        this.setupMuteToggle();
        console.log('🔊 Audio controller initialized');
    }

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported, falling back to HTML5 audio');
        }
    }

    createSoundEffects() {
        // Create synthesized sound effects
        this.sounds = {
            hover: this.createHoverSound(),
            click: this.createClickSound(),
            success: this.createSuccessSound(),
            error: this.createErrorSound(),
            notification: this.createNotificationSound(),
            glitch: this.createGlitchSound(),
            startup: this.createStartupSound(),
            shutdown: this.createShutdownSound()
        };
    }

    createHoverSound() {
        if (this.audioContext) {
            return this.createTone(800, 0.1, 'sine', 0.1);
        } else {
            return this.createHTML5Audio('hover');
        }
    }

    createClickSound() {
        if (this.audioContext) {
            return this.createTone(1200, 0.15, 'square', 0.2);
        } else {
            return this.createHTML5Audio('click');
        }
    }

    createSuccessSound() {
        if (this.audioContext) {
            return this.createMelody([523, 659, 784], 0.2, 'sine', 0.3);
        } else {
            return this.createHTML5Audio('success');
        }
    }

    createErrorSound() {
        if (this.audioContext) {
            return this.createMelody([220, 196], 0.3, 'sawtooth', 0.4);
        } else {
            return this.createHTML5Audio('error');
        }
    }

    createNotificationSound() {
        if (this.audioContext) {
            return this.createTone(440, 0.2, 'triangle', 0.15);
        } else {
            return this.createHTML5Audio('notification');
        }
    }

    createGlitchSound() {
        if (this.audioContext) {
            return this.createGlitchEffect();
        } else {
            return this.createHTML5Audio('glitch');
        }
    }

    createStartupSound() {
        if (this.audioContext) {
            return this.createMelody([261, 329, 392, 523], 0.3, 'sine', 0.4);
        } else {
            return this.createHTML5Audio('startup');
        }
    }

    createShutdownSound() {
        if (this.audioContext) {
            return this.createMelody([523, 392, 329, 261], 0.3, 'sine', 0.4);
        } else {
            return this.createHTML5Audio('shutdown');
        }
    }

    createTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return null;

        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * this.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createMelody(frequencies, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return null;

        return () => {
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = type;

                const startTime = this.audioContext.currentTime + (index * duration * 0.5);
                const endTime = startTime + duration;

                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(volume * this.volume, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

                oscillator.start(startTime);
                oscillator.stop(endTime);
            });
        };
    }

    createGlitchEffect() {
        if (!this.audioContext) return null;

        return () => {
            const duration = 0.5;
            const startTime = this.audioContext.currentTime;

            // Create multiple oscillators with different frequencies
            for (let i = 0; i < 5; i++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                const freq = 200 + Math.random() * 800;
                const delay = Math.random() * 0.1;

                oscillator.frequency.setValueAtTime(freq, startTime + delay);
                oscillator.type = ['sine', 'square', 'sawtooth', 'triangle'][Math.floor(Math.random() * 4)];

                gainNode.gain.setValueAtTime(0, startTime + delay);
                gainNode.gain.linearRampToValueAtTime(0.1 * this.volume, startTime + delay + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + delay + duration);

                oscillator.start(startTime + delay);
                oscillator.stop(startTime + delay + duration);
            }
        };
    }

    createHTML5Audio(type) {
        return () => {
            const audio = document.getElementById(`${type}Sound`);
            if (audio) {
                audio.volume = this.volume;
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        };
    }

    setupVolumeControl() {
        // Create volume control UI
        const volumeControl = document.createElement('div');
        volumeControl.className = 'volume-control';
        volumeControl.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 10px;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const volumeIcon = document.createElement('div');
        volumeIcon.innerHTML = '🔊';
        volumeIcon.style.cursor = 'pointer';
        volumeIcon.onclick = () => this.toggleMute();

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '1';
        volumeSlider.step = '0.1';
        volumeSlider.value = this.volume;
        volumeSlider.style.width = '80px';
        volumeSlider.oninput = (e) => {
            this.volume = parseFloat(e.target.value);
            this.updateVolumeIcon();
        };

        volumeControl.appendChild(volumeIcon);
        volumeControl.appendChild(volumeSlider);
        document.body.appendChild(volumeControl);

        this.volumeIcon = volumeIcon;
        this.updateVolumeIcon();
    }

    setupMuteToggle() {
        // Add mute toggle to header
        const headerControls = document.querySelector('.header-controls');
        if (headerControls) {
            const muteButton = document.createElement('button');
            muteButton.className = 'theme-toggle';
            muteButton.innerHTML = '🔊';
            muteButton.title = 'Toggle Audio';
            muteButton.onclick = () => this.toggleMute();
            
            headerControls.appendChild(muteButton);
            this.muteButton = muteButton;
        }
    }

    toggleMute() {
        this.isEnabled = !this.isEnabled;
        this.updateVolumeIcon();
        
        if (this.isEnabled) {
            this.playSound('notification');
        }
    }

    updateVolumeIcon() {
        const icon = this.isEnabled ? '🔊' : '🔇';
        if (this.volumeIcon) this.volumeIcon.innerHTML = icon;
        if (this.muteButton) this.muteButton.innerHTML = icon;
    }

    playSound(type) {
        if (!this.isEnabled) return;

        if (this.sounds[type]) {
            this.sounds[type]();
        } else {
            // Fallback to HTML5 audio
            const audio = document.getElementById(`${type}Sound`);
            if (audio) {
                audio.volume = this.volume;
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        }
    }

    playHover() {
        this.playSound('hover');
    }

    playClick() {
        this.playSound('click');
    }

    playSuccess() {
        this.playSound('success');
    }

    playError() {
        this.playSound('error');
    }

    playNotification() {
        this.playSound('notification');
    }

    playGlitch() {
        this.playSound('glitch');
    }

    playStartup() {
        this.playSound('startup');
    }

    playShutdown() {
        this.playSound('shutdown');
    }

    // ===== AMBIENT AUDIO =====

    createAmbientAudio() {
        if (!this.audioContext) return;

        // Create ambient background sound
        const ambientOscillator = this.audioContext.createOscillator();
        const ambientGain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        ambientOscillator.connect(filter);
        filter.connect(ambientGain);
        ambientGain.connect(this.audioContext.destination);

        ambientOscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
        ambientOscillator.type = 'sine';

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);

        ambientGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0.05 * this.volume, this.audioContext.currentTime + 2);

        ambientOscillator.start();
        this.ambientOscillator = ambientOscillator;
        this.ambientGain = ambientGain;
    }

    stopAmbientAudio() {
        if (this.ambientGain) {
            this.ambientGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
            setTimeout(() => {
                if (this.ambientOscillator) {
                    this.ambientOscillator.stop();
                }
            }, 1000);
        }
    }

    // ===== AUDIO VISUALIZATION =====

    createAudioVisualizer() {
        if (!this.audioContext) return;

        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 60;
        canvas.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const analyser = this.audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Connect ambient audio to analyser
        if (this.ambientGain) {
            this.ambientGain.disconnect();
            this.ambientGain.connect(analyser);
            analyser.connect(this.audioContext.destination);
        }

        const draw = () => {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                ctx.fillStyle = `hsl(${180 + barHeight}, 100%, 70%)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();
    }

    // ===== AUDIO EFFECTS =====

    createEchoEffect(input, delay = 0.3, feedback = 0.3) {
        if (!this.audioContext) return input;

        const delayNode = this.audioContext.createDelay(delay);
        const feedbackGain = this.audioContext.createGain();
        const outputGain = this.audioContext.createGain();

        input.connect(delayNode);
        delayNode.connect(feedbackGain);
        feedbackGain.connect(delayNode);
        delayNode.connect(outputGain);
        input.connect(outputGain);

        feedbackGain.gain.value = feedback;
        outputGain.gain.value = 0.7;

        return outputGain;
    }

    createReverbEffect(input, duration = 2) {
        if (!this.audioContext) return input;

        const convolver = this.audioContext.createConvolver();
        const impulse = this.createImpulseResponse(duration);
        convolver.buffer = impulse;

        input.connect(convolver);
        return convolver;
    }

    createImpulseResponse(duration) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.1));
            }
        }

        return impulse;
    }

    // ===== AUDIO UTILITIES =====

    frequencyToNote(frequency) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const a4 = 440;
        const c0 = a4 * Math.pow(2, -4.75);
        const halfStepsBelowMiddleC = Math.round(12 * Math.log2(frequency / c0));
        const octave = Math.floor(halfStepsBelowMiddleC / 12);
        const noteIndex = (halfStepsBelowMiddleC % 12 + 12) % 12;
        return notes[noteIndex] + octave;
    }

    noteToFrequency(note) {
        const notes = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
        const noteName = note.slice(0, -1);
        const octave = parseInt(note.slice(-1));
        const halfSteps = notes[noteName] + (octave - 4) * 12;
        return 440 * Math.pow(2, halfSteps / 12);
    }

    // ===== AUDIO SEQUENCER =====

    createSequencer() {
        const sequence = [];
        let isPlaying = false;
        let currentStep = 0;
        let interval = null;

        return {
            addStep: (frequency, duration, type = 'sine') => {
                sequence.push({ frequency, duration, type });
            },
            play: () => {
                if (isPlaying) return;
                isPlaying = true;
                currentStep = 0;
                
                interval = setInterval(() => {
                    if (currentStep >= sequence.length) {
                        this.stop();
                        return;
                    }

                    const step = sequence[currentStep];
                    this.createTone(step.frequency, step.duration, step.type, 0.2)();
                    currentStep++;
                }, 200);
            },
            stop: () => {
                isPlaying = false;
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            },
            clear: () => {
                sequence.length = 0;
            }
        };
    }
}

// Initialize audio controller
document.addEventListener('DOMContentLoaded', () => {
    window.audioController = new AudioController();
    
    // Play startup sound
    setTimeout(() => {
        window.audioController.playStartup();
    }, 1000);
});

// Add audio styles
const audioStyles = document.createElement('style');
audioStyles.textContent = `
    .volume-control input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        background: var(--bg-tertiary);
        border-radius: 4px;
        outline: none;
    }

    .volume-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: var(--neon-cyan);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow-glow);
    }

    .volume-control input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: var(--neon-cyan);
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: var(--shadow-glow);
    }
`;
document.head.appendChild(audioStyles); 