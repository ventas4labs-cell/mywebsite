// Particle Network Animation
class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();

        window.addEventListener('resize', () => this.resize());

        // Mouse interaction
        this.mouse = { x: null, y: null, radius: 150 };
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    init() {
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        const numberOfParticles = (this.canvas.width * this.canvas.height) / 45000;

        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2 + 1;
            const x = Math.random() * ((this.canvas.width - size * 2) - (size * 2)) + size * 2;
            const y = Math.random() * ((this.canvas.height - size * 2) - (size * 2)) + size * 2;
            const directionX = (Math.random() * 2) - 1; // -1 to 1
            const directionY = (Math.random() * 2) - 1;
            const color = '#8C55AA'; // Purple-ish tint base

            this.particles.push({ x, y, directionX, directionY, size, color });
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // Movement
            p.x += p.directionX * 0.5;
            p.y += p.directionY * 0.5;

            // Bounce check
            if (p.x > this.canvas.width || p.x < 0) p.directionX = -p.directionX;
            if (p.y > this.canvas.height || p.y < 0) p.directionY = -p.directionY;

            // Mouse Interaction (Repel/Attract)
            let dx = this.mouse.x - p.x;
            let dy = this.mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const directionX = forceDirectionX * force * 3; // repel strength
                const directionY = forceDirectionY * force * 3;

                // Determine functionality: attract or repel? Let's subtly attract for "network" feel
                // Or repel for "disturbance". Let's do subtle attraction to cursor
                // p.x += directionX; // attract
                // p.y += directionY;

                // Let's actually do standard constellation connection logic instead of heavy force
            }

            // Draw Particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
            this.ctx.fillStyle = 'rgba(140, 85, 170, 0.5)'; // Muted purple
            this.ctx.fill();

            // Connecting Lines
            this.connect();
        }
    }

    connect() {
        let opacityValue = 1;
        const maxDist = (this.canvas.width / 7) * (this.canvas.height / 7);

        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                // Quick bounding box check
                if (Math.abs(this.particles[a].x - this.particles[b].x) > 200) continue;
                if (Math.abs(this.particles[a].y - this.particles[b].y) > 200) continue;

                let distance = ((this.particles[a].x - this.particles[b].x) * (this.particles[a].x - this.particles[b].x)) +
                    ((this.particles[a].y - this.particles[b].y) * (this.particles[a].y - this.particles[b].y));

                if (distance < maxDist) {
                    opacityValue = 1 - (distance / 20000);
                    this.ctx.strokeStyle = 'rgba(140, 85, 170,' + opacityValue * 0.15 + ')';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize things
    new ParticleNetwork('bg-canvas'); // Start the background

    // Smooth scrolling
    /* =========================================
       0. Lenis Smooth Scroll Setup (Ganify Tuning)
       ========================================= */
    const lenis = new Lenis({
        duration: 1.5, // Slower, heavier feel
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential decay
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8, // Less sensitive for weight
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Parallax Elements
    const parallaxItems = document.querySelectorAll('[data-speed]');

    function raf(time) {
        lenis.raf(time);

        // Parallax Logic inside RAF for performance
        parallaxItems.forEach(item => {
            const speed = parseFloat(item.getAttribute('data-speed'));
            const yPos = window.scrollY * speed;
            item.style.transform = `translateY(${yPos}px)`;
        });

        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    /* =========================================
       1. Intersection Observer for Scroll Animations
       ========================================= */
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target new Ganify elements
    const splitReveals = document.querySelectorAll('.hero-title, .reveal-clip, .reveal-text');
    splitReveals.forEach(el => observer.observe(el));

    // TYPEWRITER EFFECT OBSERVER
    const typeWriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (!el.hasAttribute('data-typed')) {
                    el.setAttribute('data-typed', 'true');
                    const text = el.getAttribute('data-text') || el.innerText;
                    el.innerText = ''; // Clear for typing

                    let i = 0;
                    const speed = 120; // ms per char (Epic Slow)

                    function type() {
                        if (i < text.length) {
                            el.innerText += text.charAt(i);
                            i++;
                            setTimeout(type, speed);
                        } else {
                            el.classList.add('typing-done');
                        }
                    }
                    type();
                }
                typeWriterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    const typeWriters = document.querySelectorAll('.type-writer');
    typeWriters.forEach(el => {
        // Store original text in data attribute to prevent layout shifts/loss
        el.setAttribute('data-text', el.innerText);
        // Optional: keep text visible until typing starts nicely? 
        // For now, let's let observer handle the clear-then-type to avoid FOUC
        typeWriterObserver.observe(el);
    });

    // Legacy Reveal Support (Bento cards, etc)
    const legacyReveals = document.querySelectorAll('.reveal');
    legacyReveals.forEach(el => observer.observe(el));

    /* =========================================
       2. Navbar Transparency Logic
       ========================================= */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* =========================================
       3. Chatbot Toggle & Logic (Lab)
       ========================================= */
    const mascotTrigger = document.getElementById('mascot-trigger');
    const closeChatBtn = document.getElementById('close-chat');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatInput = document.getElementById('chat-user-input');
    const sendBtn = document.getElementById('send-chat');
    const messagesContainer = document.getElementById('chat-messages');

    function toggleChat() {
        chatWindow.classList.toggle('chat-hidden');
    }

    if (mascotTrigger) mascotTrigger.addEventListener('click', toggleChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', () => chatWindow.classList.add('chat-hidden'));

    // Chat Interaction Logic
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg', sender === 'user' ? 'user-msg' : 'bot-msg');
        msgDiv.innerText = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleUserMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User Msg
        addMessage(text, 'user');
        chatInput.value = '';

        // Simulate Bot Response
        setTimeout(() => {
            const prompt = text.toLowerCase();
            let response = "Entiendo. Para darte una solución precisa, lo mejor es un diagnóstico rápido. ¿Te gustaría agendar una llamada con un ingeniero?";

            if (prompt.includes('hola') || prompt.includes('buen')) {
                response = "¡Hola! Soy Lab, tu asistente de automatización. ¿Buscas mejorar ventas, soporte o procesos internos?";
            } else if (prompt.includes('precio') || prompt.includes('costo') || prompt.includes('cuanto')) {
                response = "Nuestras implementaciones varían según la complejidad del flujo. Sin embargo, el ROI suele ser menor a 3 semanas. ¿Quieres que evaluemos tu caso?";
            } else if (prompt.includes('venta') || prompt.includes('lead')) {
                response = "El módulo de Ventas es nuestro best-seller. Califica leads en segundos y los agenda en tu CRM. ¿Te interesa ver cómo funciona?";
            } else if (prompt.includes('soporte') || prompt.includes('ticket')) {
                response = "Podemos reducir tu tiempo de respuesta en un 90%. El chatbot resuelve dudas frecuentes y escala solo lo complejo.";
            } else if (prompt.includes('humano') || prompt.includes('persona')) {
                response = "¡Claro! Mis creadores están listos. Puedes escribirles directamente al WhatsApp +506 7229 3518.";
            }

            addMessage(response, 'bot');
        }, 800);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleUserMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserMessage();
        });
    }

    // Dynamic Greetings & Engagement
    const greetings = [
        "¿Ventas lentas?",
        "Optimiza tu flujo 🚀",
        "¿Hablas con soporte?",
        "Automatiza hoy ⚡",
        "¿Te ayudo?"
    ];

    const bubble = document.querySelector('.robot-greeting-bubble');
    let greetingIndex = 0;

    function rotateGreeting() {
        if (!bubble) return;

        // Hide, change text, show
        bubble.classList.remove('visible');

        setTimeout(() => {
            greetingIndex = (greetingIndex + 1) % greetings.length;
            bubble.innerText = greetings[greetingIndex];
            bubble.classList.add('visible');
        }, 500);
    }

    // Start rotation
    if (bubble) {
        bubble.classList.add('visible'); // Show initial
        setInterval(rotateGreeting, 5000); // Change every 5s
    }

    // Auto-open logic (Disabled by user request)
    /*
    let hasAutoOpened = false;
    setTimeout(() => {
        if (!hasAutoOpened && chatWindow.classList.contains('chat-hidden')) {
            toggleChat();
            hasAutoOpened = true;

            // Simulating a fresh welcome message
            const messages = document.getElementById('chat-messages');
            if (messages) {
                // messages.innerHTML += `<div class="msg bot-msg" style="animation: fade-in 0.5s">👋 ¡Hola! Detecto interés en automatización. ¿Te gustaría un diagnóstico rápido?</div>`;
            }
        }
    }, 7000); // Open after 7 seconds
    */

    /* =========================================
       4. Canvas Particles (Updated Colors)
       ========================================= */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Brand Colors for particles
        const colors = ['rgba(112, 24, 255, 0.4)', 'rgba(0, 230, 168, 0.4)', 'rgba(10, 31, 68, 0.5)'];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around screen
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Create Particle Cluster
        for (let i = 0; i < 100; i++) { // More particles
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles (No lines)
            particles.forEach((p) => {
                p.update();

                // Draw 'Dust'
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2); // Smaller
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }
});
