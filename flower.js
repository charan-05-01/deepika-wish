// ======================================================
// FLOWER BACKGROUND
// ======================================================
//
// Draws floating flowers and glowing dots on the canvas behind
// the balloons. Wrapped in (function () { ... })(); so names like
// "width", "colors" and "init" cannot clash with script.js.

(function () {

    const canvas = document.getElementById('flowerCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let flowers = [];
    let particles = [];

    const colors = [
        { petal: 'rgba(255, 218, 185, 0.65)', center: '#fbc5a9' }, // Peach
        { petal: 'rgba(255, 192, 203, 0.65)', center: '#f8a5c2' }, // Pink
        { petal: 'rgba(230, 230, 250, 0.65)', center: '#dcdde1' }, // Lavender
        { petal: 'rgba(255, 250, 205, 0.65)', center: '#f7d794' }, // Yellow
        { petal: 'rgba(197, 239, 247, 0.65)', center: '#89ef8d' }  // Mint
    ];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Flower {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // spread across screen at start
        }
        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 200 + 50;
            this.size = Math.random() * 28 + 18;
            this.petals = Math.floor(Math.random() * 3) + 5;
            this.petalLength = this.size * (Math.random() * 0.8 + 1.2);
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 0.4 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.008;
            this.opacity = Math.random() * 0.5 + 0.5;
        }
        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.005) * 0.4 + this.speedX;
            this.rotation += this.rotSpeed;
            if (this.y < -100) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            for (let i = 0; i < this.petals; i++) {
                ctx.save();
                ctx.rotate((Math.PI * 2 / this.petals) * i);
                ctx.beginPath();
                ctx.fillStyle = this.color.petal;
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size * 0.6, this.petalLength * 0.5, -this.size * 0.4, this.petalLength, 0, this.petalLength);
                ctx.bezierCurveTo(this.size * 0.4, this.petalLength, this.size * 0.6, this.petalLength * 0.5, 0, 0);
                ctx.fill();
                ctx.restore();
            }

            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = this.color.center;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();

            ctx.restore();
        }
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2.5 + 1;
            this.alpha = Math.random() * 0.6 + 0.2;
            this.speedAlpha = Math.random() * 0.01 + 0.005;
            this.dir = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.alpha += this.speedAlpha * this.dir;
            if (this.alpha >= 0.8 || this.alpha <= 0.1) this.dir *= -1;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#fff4ce';
            ctx.shadowColor = '#ffeaa7';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
        }
    }

    function init() {
        flowers = [];
        particles = [];
        const flowerCount = Math.floor((width * height) / 25000) + 15;
        for (let i = 0; i < flowerCount; i++) flowers.push(new Flower());
        for (let i = 0; i < 40; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(function (p) { p.update(); p.draw(); });
        flowers.forEach(function (f) { f.update(); f.draw(); });
        requestAnimationFrame(animate);
    }

    init();
    animate();

})();