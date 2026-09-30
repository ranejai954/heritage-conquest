window.gatewayIndiaInstance = null;
window.onGatewayIndiaEnd = null;

function startGatewayOfIndiaGame(canvasId, onComplete) {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error(
            "Gateway of India: Canvas not found:",
            canvasId
        );

        if (onComplete) {
            onComplete(false);
        }

        return;
    }

    /*
     * Remove any previous Gateway instance before
     * starting a new one.
     */
    if (window.gatewayIndiaInstance) {
        try {
            window.gatewayIndiaInstance.cleanup();
        } catch {
            // Previous instance was already cleaned up.
        }

        window.gatewayIndiaInstance = null;
    }

    /*
     * Global end hook used by React's Give Up button
     * and by the game itself.
     */
    window.onGatewayIndiaEnd = (success) => {
        const instance = window.gatewayIndiaInstance;

        /*
         * Clear the global reference BEFORE cleanup.
         * This prevents recursive cleanup problems.
         */
        window.gatewayIndiaInstance = null;

        if (instance) {
            try {
                instance.cleanup();
            } catch {
                // Instance was already cleaned up.
            }
        }

        if (onComplete) {
            onComplete(success);
        }
    };

    window.gatewayIndiaInstance =
        new GatewayIndiaGame(canvas);

    window.gatewayIndiaInstance.startGame();
}

class GatewayIndiaGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.COLORS = {
            SKY_TOP: "#071521",
            SKY_BOTTOM: "#16425a",
            SEA_TOP: "#15566c",
            SEA_BOTTOM: "#061923",
            GOLD: "#ffcf70",
            GOLD_LIGHT: "#ffe5a6",
            CREAM: "#fdf3e2",
            BROWN: "#6f4525",
            BROWN_DARK: "#241608",
            RED: "#c1502e",
            WHITE: "#ffffff",
            ENEMY: "#ff5252",
            GREEN: "#8fffb0"
        };

        this.running = false;
        this.state = "MENU";

        this.score = 0;
        this.distance = 0;
        this.timeLeft = 60;

        this.lastTime = 0;
        this.waveTime = 0;

        this.spawnTimer = 0;
        this.enemyTimer = 0;
        this.coinTimer = 0;

        this.width = 0;
        this.height = 0;

        this.player = {
            x: 0,
            y: 0,
            width: 74,
            height: 32,
            speed: 280,
            vx: 0,
            vy: 0
        };

        this.coins = [];
        this.enemies = [];
        this.particles = [];

        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        this.endSuccess = false;
        this.endMessage = "";

        this.boundKeyDown =
            (e) => this.handleKeyDown(e);

        this.boundKeyUp =
            (e) => this.handleKeyUp(e);

        this.boundResize =
            () => this.resize();

        window.addEventListener(
            "keydown",
            this.boundKeyDown
        );

        window.addEventListener(
            "keyup",
            this.boundKeyUp
        );

        window.addEventListener(
            "resize",
            this.boundResize
        );

        this.createDOM();
        this.resize();
    }

    createDOM() {
        const parent =
            this.canvas.parentElement ||
            document.body;

        this.root =
            document.createElement("div");

        this.root.className =
            "gateway-game-root";

        this.root.innerHTML = `
            <div class="gateway-canvas-wrap">
                <div class="gateway-hud">
                    <div class="gateway-hud-left">
                        <div class="gateway-hud-box gateway-title">
                            GATEWAY OF INDIA
                        </div>

                        <div
                            class="gateway-hud-box"
                            data-gateway-score
                        >
                            Gems: 0/15
                        </div>
                    </div>

                    <div class="gateway-hud-right">
                        <div
                            class="gateway-hud-box"
                            data-gateway-time
                        >
                            60s
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="gateway-touch-controls"
                data-gateway-touch
            >
                <div class="gateway-touch-row">
                    <button
                        class="gateway-touch-btn"
                        data-dir="up"
                    >
                        ▲
                    </button>
                </div>

                <div class="gateway-touch-row">
                    <button
                        class="gateway-touch-btn"
                        data-dir="left"
                    >
                        ◀
                    </button>

                    <button
                        class="gateway-touch-btn"
                        data-dir="down"
                    >
                        ▼
                    </button>

                    <button
                        class="gateway-touch-btn"
                        data-dir="right"
                    >
                        ▶
                    </button>
                </div>
            </div>

            <div class="gateway-action-buttons">
                <button
                    class="gateway-action-btn"
                    data-action="pause"
                >
                    PAUSE
                </button>
            </div>

            <div
                class="gateway-overlay"
                data-gateway-overlay
            >
                <div class="gateway-overlay-card">
                    <h2>Voyage of the Royal Dhow</h2>

                    <p>
                        Sail across Mumbai's harbour
                        and collect the glowing treasures.
                    </p>

                    <p>
                        Avoid the dangerous boats
                        and survive the voyage.
                    </p>

                    <button
                        class="gateway-start-btn"
                        data-action="start"
                    >
                        BEGIN VOYAGE
                    </button>
                </div>
            </div>
        `;

        /*
         * Insert the Gateway root before the original
         * canvas, then move the canvas into the game root.
         */
        parent.insertBefore(
            this.root,
            this.canvas
        );

        this.canvasWrap =
            this.root.querySelector(
                ".gateway-canvas-wrap"
            );

        this.canvasWrap.appendChild(
            this.canvas
        );

        this.canvas.className =
            "gateway-game-canvas";

        this.touchPad =
            this.root.querySelector(
                "[data-gateway-touch]"
            );

        this.overlay =
            this.root.querySelector(
                "[data-gateway-overlay]"
            );

        this.scoreEl =
            this.root.querySelector(
                "[data-gateway-score]"
            );

        this.timeEl =
            this.root.querySelector(
                "[data-gateway-time]"
            );

        /*
         * Touch / pointer controls.
         */
        this.root
            .querySelectorAll("[data-dir]")
            .forEach((button) => {
                const dir =
                    button.dataset.dir;

                const start = (e) => {
                    e.preventDefault();

                    if (dir) {
                        this.keys[dir] = true;
                    }
                };

                const end = (e) => {
                    e.preventDefault();

                    if (dir) {
                        this.keys[dir] = false;
                    }
                };

                button.addEventListener(
                    "pointerdown",
                    start
                );

                button.addEventListener(
                    "pointerup",
                    end
                );

                button.addEventListener(
                    "pointercancel",
                    end
                );

                button.addEventListener(
                    "pointerleave",
                    end
                );
            });

        /*
         * Game action buttons.
         */
        this.root
            .querySelectorAll("[data-action]")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    (e) => {
                        e.preventDefault();

                        const action =
                            button.dataset.action;

                        if (action === "start") {
                            this.startRound();
                        }

                        if (action === "pause") {
                            this.togglePause();
                        }
                    }
                );
            });
    }

    resize() {
        if (!this.canvas) {
            return;
        }

        const rect =
            this.canvas.getBoundingClientRect();

        this.width = Math.max(
            1,
            Math.floor(
                rect.width ||
                this.canvas.parentElement?.clientWidth ||
                800
            )
        );

        this.height = Math.max(
            1,
            Math.floor(
                rect.height ||
                this.canvas.parentElement?.clientHeight ||
                500
            )
        );

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        this.canvas.width =
            Math.floor(this.width * dpr);

        this.canvas.height =
            Math.floor(this.height * dpr);

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        const scale = Math.max(
            0.65,
            Math.min(1, this.width / 800)
        );

        this.player.width =
            74 * scale;

        this.player.height =
            32 * scale;

        if (
            this.player.y >
            this.height - 80
        ) {
            this.player.y =
                this.height - 80;
        }
    }

    startGame() {
        this.state = "MENU";
        this.running = true;

        this.lastTime =
            performance.now();

        this.loop();
    }

    startRound() {
        this.state = "PLAYING";

        this.score = 0;
        this.distance = 0;
        this.timeLeft = 60;

        this.coins = [];
        this.enemies = [];
        this.particles = [];

        this.spawnTimer = 0;
        this.enemyTimer = 0;
        this.coinTimer = 0;

        this.player.x =
            Math.max(
                40,
                this.width * 0.18
            );

        this.player.y =
            this.height * 0.5;

        this.player.vx = 0;
        this.player.vy = 0;

        this.overlay.style.display =
            "none";

        this.updateHUD();
    }

    handleKeyDown(e) {
        if (this.state !== "PLAYING") {
            if (
                e.key === "Enter" &&
                this.state === "MENU"
            ) {
                this.startRound();
            }

            return;
        }

        if (
            e.key === "ArrowUp" ||
            e.key.toLowerCase() === "w"
        ) {
            this.keys.up = true;
            e.preventDefault();
        }

        if (
            e.key === "ArrowDown" ||
            e.key.toLowerCase() === "s"
        ) {
            this.keys.down = true;
            e.preventDefault();
        }

        if (
            e.key === "ArrowLeft" ||
            e.key.toLowerCase() === "a"
        ) {
            this.keys.left = true;
            e.preventDefault();
        }

        if (
            e.key === "ArrowRight" ||
            e.key.toLowerCase() === "d"
        ) {
            this.keys.right = true;
            e.preventDefault();
        }

        if (e.key === " ") {
            this.togglePause();
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        if (
            e.key === "ArrowUp" ||
            e.key.toLowerCase() === "w"
        ) {
            this.keys.up = false;
        }

        if (
            e.key === "ArrowDown" ||
            e.key.toLowerCase() === "s"
        ) {
            this.keys.down = false;
        }

        if (
            e.key === "ArrowLeft" ||
            e.key.toLowerCase() === "a"
        ) {
            this.keys.left = false;
        }

        if (
            e.key === "ArrowRight" ||
            e.key.toLowerCase() === "d"
        ) {
            this.keys.right = false;
        }
    }

    togglePause() {
        if (this.state === "PLAYING") {
            this.state = "PAUSED";
        } else if (this.state === "PAUSED") {
            this.state = "PLAYING";
        }
    }

    update(dt) {
        if (this.state !== "PLAYING") {
            return;
        }

        this.timeLeft -= dt;
        this.distance += dt * 50;

        if (this.timeLeft <= 0) {
            this.timeLeft = 0;

            this.finish(
                false,
                "The royal voyage has run out of time."
            );

            return;
        }

        let dx = 0;
        let dy = 0;

        if (this.keys.left) {
            dx -= 1;
        }

        if (this.keys.right) {
            dx += 1;
        }

        if (this.keys.up) {
            dy -= 1;
        }

        if (this.keys.down) {
            dy += 1;
        }

        if (dx !== 0 || dy !== 0) {
            const length =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            dx /= length;
            dy /= length;
        }

        this.player.vx =
            dx * this.player.speed;

        this.player.vy =
            dy * this.player.speed;

        this.player.x +=
            this.player.vx * dt;

        this.player.y +=
            this.player.vy * dt;

        const margin = 12;

        this.player.x =
            Math.max(
                margin,
                Math.min(
                    this.width -
                    this.player.width -
                    margin,
                    this.player.x
                )
            );

        this.player.y =
            Math.max(
                70,
                Math.min(
                    this.height -
                    this.player.height -
                    15,
                    this.player.y
                )
            );

        this.coinTimer += dt;
        this.enemyTimer += dt;

        if (this.coinTimer >= 1.15) {
            this.coinTimer = 0;
            this.spawnCoin();
        }

        if (this.enemyTimer >= 2.0) {
            this.enemyTimer = 0;
            this.spawnEnemy();
        }

        for (const coin of this.coins) {
            coin.x -=
                coin.speed * dt;

            coin.angle +=
                dt * 4;
        }

        for (const enemy of this.enemies) {
            enemy.x -=
                enemy.speed * dt;

            enemy.y +=
                Math.sin(enemy.wave) *
                enemy.waveAmount *
                dt;

            enemy.wave +=
                dt * 3;
        }

        this.coins =
            this.coins.filter(
                (coin) =>
                    coin.x > -50 &&
                    !coin.collected
            );

        this.enemies =
            this.enemies.filter(
                (enemy) =>
                    enemy.x > -100
            );

        this.checkCollisions();
        this.updateParticles(dt);
        this.updateHUD();
    }

    spawnCoin() {
        const top = 90;

        const bottom =
            Math.max(
                top + 30,
                this.height - 40
            );

        this.coins.push({
            x: this.width + 30,
            y:
                top +
                Math.random() *
                (bottom - top),
            radius: 11,
            speed:
                130 +
                Math.random() * 70,
            angle:
                Math.random() *
                Math.PI *
                2,
            collected: false
        });
    }

    spawnEnemy() {
        const top = 80;

        const bottom =
            Math.max(
                top + 40,
                this.height - 60
            );

        this.enemies.push({
            x: this.width + 70,
            y:
                top +
                Math.random() *
                (bottom - top),
            width: 62,
            height: 28,
            speed:
                150 +
                Math.random() * 80,
            wave:
                Math.random() *
                Math.PI *
                2,
            waveAmount:
                20 +
                Math.random() * 20
        });
    }

    checkCollisions() {
        const px =
            this.player.x +
            this.player.width / 2;

        const py =
            this.player.y +
            this.player.height / 2;

        for (const coin of this.coins) {
            if (coin.collected) {
                continue;
            }

            const dx =
                px - coin.x;

            const dy =
                py - coin.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance <
                coin.radius +
                this.player.width * 0.35
            ) {
                coin.collected = true;

                this.score++;

                this.createParticles(
                    coin.x,
                    coin.y,
                    this.COLORS.GOLD
                );
            }
        }

        for (const enemy of this.enemies) {
            if (
                this.rectCollision(
                    this.player,
                    enemy
                )
            ) {
                this.finish(
                    false,
                    "A hostile boat intercepted the royal dhow!"
                );

                return;
            }
        }

        if (this.score >= 15) {
            this.finish(
                true,
                "The Royal Dhow reached the Gateway of India!"
            );
        }
    }

    rectCollision(a, b) {
        return (
            a.x <
                b.x + b.width &&
            a.x + a.width >
                b.x &&
            a.y <
                b.y + b.height &&
            a.y + a.height >
                b.y
        );
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 12; i++) {
            const angle =
                Math.random() *
                Math.PI *
                2;

            const speed =
                40 +
                Math.random() *
                100;

            this.particles.push({
                x,
                y,
                vx:
                    Math.cos(angle) *
                    speed,
                vy:
                    Math.sin(angle) *
                    speed,
                life: 0.6,
                color
            });
        }
    }

    updateParticles(dt) {
        for (const p of this.particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            p.vy +=
                80 * dt;

            p.life -= dt;
        }

        this.particles =
            this.particles.filter(
                (p) =>
                    p.life > 0
            );
    }

    updateHUD() {
        if (this.scoreEl) {
            this.scoreEl.textContent =
                `Gems: ${this.score}/15`;
        }

        if (this.timeEl) {
            this.timeEl.textContent =
                `${Math.ceil(this.timeLeft)}s`;
        }
    }

    draw() {
        const ctx = this.ctx;

        ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        this.drawSky();
        this.drawSea();
        this.drawGateway();
        this.drawWaves();
        this.drawCoins();
        this.drawEnemies();
        this.drawPlayer();
        this.drawParticles();

        if (this.state === "PAUSED") {
            this.drawPause();
        }

        if (this.state === "END") {
            this.drawEnd();
        }
    }

    drawSky() {
        const ctx = this.ctx;

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                this.height
            );

        gradient.addColorStop(
            0,
            this.COLORS.SKY_TOP
        );

        gradient.addColorStop(
            0.6,
            this.COLORS.SKY_BOTTOM
        );

        gradient.addColorStop(
            1,
            this.COLORS.SEA_TOP
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

        const sunX =
            this.width * 0.72;

        const sunY =
            this.height * 0.22;

        const sunGradient =
            ctx.createRadialGradient(
                sunX,
                sunY,
                5,
                sunX,
                sunY,
                100
            );

        sunGradient.addColorStop(
            0,
            "rgba(255,229,166,0.8)"
        );

        sunGradient.addColorStop(
            1,
            "rgba(255,207,112,0)"
        );

        ctx.fillStyle =
            sunGradient;

        ctx.beginPath();

        ctx.arc(
            sunX,
            sunY,
            100,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    drawSea() {
        const ctx = this.ctx;

        const seaY =
            this.height * 0.43;

        const gradient =
            ctx.createLinearGradient(
                0,
                seaY,
                0,
                this.height
            );

        gradient.addColorStop(
            0,
            this.COLORS.SEA_TOP
        );

        gradient.addColorStop(
            1,
            this.COLORS.SEA_BOTTOM
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            seaY,
            this.width,
            this.height - seaY
        );
    }

    drawGateway() {
        const ctx = this.ctx;

        const baseY =
            this.height * 0.48;

        const scale =
            Math.max(
                0.45,
                Math.min(
                    1,
                    this.width / 900
                )
            );

        const gx =
            this.width * 0.74;

        const width =
            220 * scale;

        const height =
            180 * scale;

        const left =
            gx - width / 2;

        const top =
            baseY - height;

        ctx.fillStyle =
            "#d3a45c";

        ctx.strokeStyle =
            "#f4c978";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            left + width * 0.08,
            baseY
        );

        ctx.lineTo(
            left + width * 0.14,
            top + height * 0.2
        );

        ctx.lineTo(
            left + width * 0.28,
            top
        );

        ctx.lineTo(
            left + width * 0.72,
            top
        );

        ctx.lineTo(
            left + width * 0.86,
            top + height * 0.2
        );

        ctx.lineTo(
            left + width * 0.92,
            baseY
        );

        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle =
            "#183344";

        ctx.beginPath();

        ctx.moveTo(
            gx - width * 0.22,
            baseY
        );

        ctx.lineTo(
            gx - width * 0.22,
            top + height * 0.48
        );

        ctx.quadraticCurveTo(
            gx,
            top + height * 0.15,
            gx + width * 0.22,
            top + height * 0.48
        );

        ctx.lineTo(
            gx + width * 0.22,
            baseY
        );

        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle =
            "#b98543";

        ctx.fillRect(
            left + width * 0.1,
            top + height * 0.25,
            width * 0.12,
            height * 0.75
        );

        ctx.fillRect(
            left + width * 0.78,
            top + height * 0.25,
            width * 0.12,
            height * 0.75
        );

        ctx.fillStyle =
            "#8f612e";

        ctx.beginPath();

        ctx.arc(
            left + width * 0.16,
            top + height * 0.23,
            width * 0.1,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            left + width * 0.84,
            top + height * 0.23,
            width * 0.1,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();

        ctx.globalAlpha = 0.18;

        ctx.fillStyle =
            "#ffcf70";

        ctx.fillRect(
            left + width * 0.15,
            baseY,
            width * 0.7,
            3
        );

        ctx.globalAlpha = 1;
    }

    drawWaves() {
        const ctx = this.ctx;

        const seaY =
            this.height * 0.43;

        ctx.strokeStyle =
            "rgba(255,255,255,0.16)";

        ctx.lineWidth = 1;

        for (let i = 0; i < 9; i++) {
            const y =
                seaY +
                25 +
                i * 30;

            ctx.beginPath();

            for (
                let x = -20;
                x < this.width + 30;
                x += 40
            ) {
                const wave =
                    Math.sin(
                        x * 0.025 +
                        this.waveTime +
                        i
                    ) * 4;

                if (x === -20) {
                    ctx.moveTo(
                        x,
                        y + wave
                    );
                } else {
                    ctx.lineTo(
                        x,
                        y + wave
                    );
                }
            }

            ctx.stroke();
        }
    }

    drawCoins() {
        const ctx = this.ctx;

        for (const coin of this.coins) {
            if (coin.collected) {
                continue;
            }

            ctx.save();

            ctx.translate(
                coin.x,
                coin.y
            );

            ctx.rotate(
                coin.angle
            );

            ctx.shadowColor =
                this.COLORS.GOLD;

            ctx.shadowBlur = 14;

            ctx.fillStyle =
                this.COLORS.GOLD;

            ctx.beginPath();

            ctx.moveTo(
                0,
                -coin.radius
            );

            ctx.lineTo(
                coin.radius,
                0
            );

            ctx.lineTo(
                0,
                coin.radius
            );

            ctx.lineTo(
                -coin.radius,
                0
            );

            ctx.closePath();

            ctx.fill();

            ctx.shadowBlur = 0;

            ctx.restore();
        }
    }

    drawEnemies() {
        const ctx = this.ctx;

        for (const enemy of this.enemies) {
            ctx.save();

            ctx.translate(
                enemy.x,
                enemy.y
            );

            ctx.fillStyle =
                "#431c17";

            ctx.beginPath();

            ctx.moveTo(
                0,
                enemy.height * 0.45
            );

            ctx.lineTo(
                enemy.width,
                enemy.height * 0.45
            );

            ctx.lineTo(
                enemy.width * 0.8,
                enemy.height
            );

            ctx.lineTo(
                enemy.width * 0.15,
                enemy.height
            );

            ctx.closePath();

            ctx.fill();

            ctx.fillStyle =
                this.COLORS.ENEMY;

            ctx.beginPath();

            ctx.moveTo(
                enemy.width * 0.45,
                enemy.height * 0.45
            );

            ctx.lineTo(
                enemy.width * 0.45,
                -enemy.height
            );

            ctx.lineTo(
                enemy.width * 0.78,
                enemy.height * 0.45
            );

            ctx.closePath();

            ctx.fill();

            ctx.restore();
        }
    }

    drawPlayer() {
        const ctx = this.ctx;
        const p = this.player;

        const cx =
            p.x + p.width / 2;

        const cy =
            p.y + p.height / 2;

        ctx.save();

        ctx.translate(
            cx,
            cy
        );

        ctx.fillStyle =
            "#4a2915";

        ctx.beginPath();

        ctx.moveTo(
            -p.width / 2,
            0
        );

        ctx.lineTo(
            p.width / 2,
            0
        );

        ctx.lineTo(
            p.width * 0.28,
            p.height / 2
        );

        ctx.lineTo(
            -p.width * 0.3,
            p.height / 2
        );

        ctx.closePath();

        ctx.fill();

        ctx.fillStyle =
            this.COLORS.GOLD;

        ctx.beginPath();

        ctx.moveTo(
            -5,
            0
        );

        ctx.lineTo(
            -5,
            -p.height * 1.7
        );

        ctx.lineTo(
            p.width * 0.3,
            0
        );

        ctx.closePath();

        ctx.fill();

        ctx.strokeStyle =
            this.COLORS.CREAM;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            -5,
            0
        );

        ctx.lineTo(
            -5,
            -p.height * 1.7
        );

        ctx.stroke();

        ctx.restore();
    }

    drawParticles() {
        const ctx = this.ctx;

        for (const p of this.particles) {
            ctx.globalAlpha =
                Math.max(
                    0,
                    p.life / 0.6
                );

            ctx.fillStyle =
                p.color;

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                2.5,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    drawPause() {
        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(0,0,0,0.55)";

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            this.COLORS.GOLD;

        ctx.font =
            "bold 32px Cinzel, serif";

        ctx.fillText(
            "PAUSED",
            this.width / 2,
            this.height / 2
        );

        ctx.font =
            "14px Poppins, sans-serif";

        ctx.fillStyle =
            this.COLORS.CREAM;

        ctx.fillText(
            "Press PAUSE again to continue",
            this.width / 2,
            this.height / 2 + 35
        );
    }

    finish(success, message) {
        if (this.state === "END") {
            return;
        }

        this.state = "END";

        this.endSuccess =
            success;

        this.endMessage =
            message ||
            (
                success
                    ? "Voyage complete!"
                    : "The voyage has ended."
            );

        /*
         * Give the player a moment to see
         * the result before returning to React.
         */
        setTimeout(() => {
            if (
                window.onGatewayIndiaEnd &&
                window.gatewayIndiaInstance === this
            ) {
                window.onGatewayIndiaEnd(
                    success
                );
            }
        }, 1800);
    }

    drawEnd() {
        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(0,0,0,0.72)";

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            this.endSuccess
                ? this.COLORS.GREEN
                : this.COLORS.ENEMY;

        ctx.font =
            "bold 26px Cinzel, serif";

        this.drawWrappedText(
            this.endMessage,
            this.width / 2,
            this.height / 2 - 10,
            Math.min(
                this.width - 40,
                500
            ),
            30
        );

        ctx.font =
            "14px Poppins, sans-serif";

        ctx.fillStyle =
            this.COLORS.CREAM;

        ctx.fillText(
            `Treasures collected: ${this.score}`,
            this.width / 2,
            this.height / 2 + 50
        );
    }

    drawWrappedText(
        text,
        x,
        y,
        maxWidth,
        lineHeight
    ) {
        const ctx = this.ctx;

        const words =
            text.split(" ");

        let line = "";
        let currentY = y;

        for (const word of words) {
            const test =
                line +
                word +
                " ";

            if (
                ctx.measureText(test).width >
                    maxWidth &&
                line
            ) {
                ctx.fillText(
                    line,
                    x,
                    currentY
                );

                line =
                    word + " ";

                currentY +=
                    lineHeight;
            } else {
                line = test;
            }
        }

        ctx.fillText(
            line,
            x,
            currentY
        );
    }

    loop() {
        if (!this.running) {
            return;
        }

        const now =
            performance.now();

        let dt =
            (now - this.lastTime) /
            1000;

        this.lastTime = now;

        dt = Math.min(
            dt,
            0.05
        );

        this.waveTime +=
            dt * 2;

        this.update(dt);
        this.draw();

        requestAnimationFrame(
            () => this.loop()
        );
    }

    cleanup() {
        this.running = false;

        window.removeEventListener(
            "keydown",
            this.boundKeyDown
        );

        window.removeEventListener(
            "keyup",
            this.boundKeyUp
        );

        window.removeEventListener(
            "resize",
            this.boundResize
        );

        this.keys.up = false;
        this.keys.down = false;
        this.keys.left = false;
        this.keys.right = false;

        if (this.root) {
            this.root.remove();
        }

        /*
         * Put the original canvas back into its
         * React container before removing the
         * Gateway DOM.
         *
         * This makes the component safe to mount again.
         */
        const gameContainer =
            document.getElementById("game");

        if (
            gameContainer &&
            this.canvas &&
            !gameContainer.contains(
                this.canvas
            )
        ) {
            gameContainer.appendChild(
                this.canvas
            );
        }

        this.root = null;
        this.canvasWrap = null;
        this.overlay = null;
        this.scoreEl = null;
        this.timeEl = null;
    }
}

window.GatewayIndiaGame =
    GatewayIndiaGame;

window.startGatewayOfIndiaGame =
    startGatewayOfIndiaGame;