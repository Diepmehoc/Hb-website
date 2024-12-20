const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];

class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 3;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.distanceToTarget = Math.sqrt(
            (targetX - x) ** 2 + (targetY - y) ** 2
        );
        this.distanceTraveled = 0;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update(index) {
        const velocityX = Math.cos(this.angle) * this.speed;
        const velocityY = Math.sin(this.angle) * this.speed;

        this.x += velocityX;
        this.y += velocityY;

        this.distanceTraveled += Math.sqrt(velocityX ** 2 + velocityY ** 2);

        if (this.distanceTraveled >= this.distanceToTarget) {
            this.createParticles();
            fireworks.splice(index, 1);
        }
    }

    createParticles() {
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(this.targetX, this.targetY, this.color));
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 3 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.alpha = 1;
        this.color = color;
        this.gravity = 0.05;
    }

    update(index) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= 0.02;

        if (this.alpha <= 0) {
            particles.splice(index, 1);
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update(index);
        firework.draw();
    });

    particles.forEach((particle, index) => {
        particle.update(index);
        particle.draw();
    });

    requestAnimationFrame(loop);
}

canvas.addEventListener("click", (e) => {
    const x = canvas.width / 2;
    const y = canvas.height;
    const targetX = e.clientX;
    const targetY = e.clientY;

    fireworks.push(new Firework(x, y, targetX, targetY));
});

loop();
                
