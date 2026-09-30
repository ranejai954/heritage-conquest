// js/hawa-mahal.js
// "Catch the Breeze" — responsive Hawa Mahal minigame

window.hawaMahalInstance = null;
window.onHawaMahalEnd = null;

function startHawaMahalGame(canvasId, onComplete) {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error("Hawa Mahal Game: Canvas not found!");
        if (onComplete) onComplete(false);
        return;
    }

    window.onHawaMahalEnd = (success) => {
        if (window.hawaMahalInstance) {
            window.hawaMahalInstance.cleanup();
            window.hawaMahalInstance = null;
        }

        if (onComplete) onComplete(success);
    };

    window.hawaMahalInstance = new HawaMahalGame(canvas);
    window.hawaMahalInstance.startGame();
}

class HawaMahalGame {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.COLORS = {
            BG: "#3a1c2c",
            SIDEBAR_BG: "#280f1c",
            BORDER: "#e0663f",
            PLAYER: "#ffcf70",
            BREEZE: "#aef0ff",
            GUST: "rgba(224, 190, 150, 0.45)",
            TEXT: "#fdf3e2",
            TEXT_DIM: "#e2b8c9"
        };

        this.facts = [
            "Hawa Mahal means 'Palace of Winds' in Rajasthani.",
            "It has 953 small windows called jharokhas.",
            "The windows let cool breeze flow through even in summer heat.",
            "It was built in 1799 by Maharaja Sawai Pratap Singh.",
            "The honeycomb shape resembles the crown of Krishna."
        ];

        this.breezeTotal = 12;
        this.collected = 0;
        this.timeLeft = 30;

        this.isRunning = false;
        this.state = "MENU";

        this.keys = {};
        this.padKeys = {};

        this.boundKeyDown = (e) => {
            this.keys[e.key.toLowerCase()] = true;
        };

        this.boundKeyUp = (e) => {
            this.keys[e.key.toLowerCase()] = false;
        };

        this.boundResize = () => this.resize();

        window.addEventListener("keydown", this.boundKeyDown);
        window.addEventListener("keyup", this.boundKeyUp);
        window.addEventListener("resize", this.boundResize);

        this.resize();
    }

    cleanup() {
        this.isRunning = false;

        window.removeEventListener("keydown", this.boundKeyDown);
        window.removeEventListener("keyup", this.boundKeyUp);
        window.removeEventListener("resize", this.boundResize);

        if (this.padEl) {
            this.padEl.remove();
            this.padEl = null;
        }
    }

    resize() {
        this.width = this.canvas.clientWidth || window.innerWidth;
        this.height = this.canvas.clientHeight || window.innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // ------------------------------------------------
        // RESPONSIVE LAYOUT
        // ------------------------------------------------

        this.isMobile = this.width < 700;

        if (this.isMobile) {
            // NO giant sidebar on mobile.
            this.sidebarWidth = 0;

            this.areaX = 0;
            this.areaW = this.width;
            this.areaH = this.height;

            this.hudHeight = Math.min(105, Math.max(80, this.height * 0.16));
        } else {
            // Desktop layout
            this.sidebarWidth = Math.max(
                240,
                Math.min(300, this.width * 0.26)
            );

            this.areaX = this.sidebarWidth;
            this.areaW = this.width - this.sidebarWidth;
            this.areaH = this.height;

            this.hudHeight = 0;
        }
    }

    startGame() {
        this.isRunning = true;

        this.player = {
            x: this.areaX + this.areaW / 2,
            y: this.isMobile
                ? this.hudHeight + (this.height - this.hudHeight) / 2
                : this.height / 2,

            baseSpeed: this.isMobile ? 230 : 280,
            speed: this.isMobile ? 230 : 280
        };

        this.spawnBreezes();

        this.gusts = [];
        this.gustTimer = 0;

        this.collected = 0;
        this.slowDuration = 0;

        this.buildTouchPad();

        this.state = "PREPARE";
        this.prepTimer = 2.0;

        this.timeLeft = 30;

        this.lastTick = Date.now();

        this.loop();
    }

    spawnBreezes() {
        this.breezes = [];

        const topPadding = this.isMobile
            ? this.hudHeight + 25
            : 60;

        const bottomPadding = this.isMobile
            ? 180
            : 60;

        const usableHeight = Math.max(
            100,
            this.areaH - topPadding - bottomPadding
        );

        const sidePadding = this.isMobile ? 35 : 60;

        const usableWidth = Math.max(
            80,
            this.areaW - sidePadding * 2
        );

        for (let i = 0; i < this.breezeTotal; i++) {

            this.breezes.push({
                x: this.areaX +
                    sidePadding +
                    Math.random() * usableWidth,

                y: topPadding +
                    Math.random() * usableHeight,

                vx: (Math.random() - 0.5) * 80,
                vy: (Math.random() - 0.5) * 80,

                r: this.isMobile ? 9 : 10,

                found: false,

                bob: Math.random() * Math.PI * 2
            });
        }
    }

    buildTouchPad() {

        const gameEl = document.getElementById("game");

        if (!gameEl) return;

        // Remove old pad if game restarts
        const oldPad = gameEl.querySelector(".arrow-pad");

        if (oldPad) {
            oldPad.remove();
        }

        const pad = document.createElement("div");

        pad.className = "arrow-pad";

        pad.innerHTML = `
            <div class="arrow-row">
                <button data-dir="up">▲</button>
            </div>

            <div class="arrow-row">
                <button data-dir="left">◀</button>
                <button data-dir="down">▼</button>
                <button data-dir="right">▶</button>
            </div>
        `;

        pad.querySelectorAll("button").forEach(btn => {

            const dir = btn.dataset.dir;

            const setKey = (value) => {
                this.padKeys[dir] = value;
            };

            btn.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                setKey(true);
            });

            btn.addEventListener("pointerup", (e) => {
                e.preventDefault();
                setKey(false);
            });

            btn.addEventListener("pointercancel", () => {
                setKey(false);
            });

            btn.addEventListener("pointerleave", () => {
                setKey(false);
            });
        });

        gameEl.appendChild(pad);

        this.padEl = pad;
    }

    update() {

        if (!this.isRunning) return;

        const now = Date.now();

        const dt = Math.min(
            0.05,
            (now - this.lastTick) / 1000
        );

        this.lastTick = now;

        // ---------------------------------------------
        // PREPARE
        // ---------------------------------------------

        if (this.state === "PREPARE") {

            this.prepTimer -= dt;

            if (this.prepTimer <= 0) {
                this.state = "PLAYING";
            }

            return;
        }

        if (this.state !== "PLAYING") return;

        // ---------------------------------------------
        // TIMER
        // ---------------------------------------------

        this.timeLeft -= dt;

        if (this.timeLeft <= 0) {

            this.timeLeft = 0;

            this.finish(false);

            return;
        }

        // ---------------------------------------------
        // SLOWDOWN
        // ---------------------------------------------

        if (this.slowDuration > 0) {

            this.slowDuration -= dt;

            this.player.speed =
                this.player.baseSpeed * 0.45;

        } else {

            this.player.speed =
                this.player.baseSpeed;
        }

        // ---------------------------------------------
        // MOVEMENT
        // ---------------------------------------------

        const pk = this.padKeys || {};

        let dx = 0;
        let dy = 0;

        if (
            this.keys["arrowup"] ||
            this.keys["w"] ||
            pk.up
        ) {
            dy -= 1;
        }

        if (
            this.keys["arrowdown"] ||
            this.keys["s"] ||
            pk.down
        ) {
            dy += 1;
        }

        if (
            this.keys["arrowleft"] ||
            this.keys["a"] ||
            pk.left
        ) {
            dx -= 1;
        }

        if (
            this.keys["arrowright"] ||
            this.keys["d"] ||
            pk.right
        ) {
            dx += 1;
        }

        const len = Math.hypot(dx, dy) || 1;

        this.player.x +=
            (dx / len) *
            this.player.speed *
            dt;

        this.player.y +=
            (dy / len) *
            this.player.speed *
            dt;

        // ---------------------------------------------
        // PLAYER BOUNDARIES
        // ---------------------------------------------

        const topLimit = this.isMobile
            ? this.hudHeight + 10
            : 20;

        const bottomLimit = this.isMobile
            ? this.height - 145
            : this.height - 20;

        this.player.x = Math.max(
            this.areaX + 20,
            Math.min(
                this.areaX + this.areaW - 20,
                this.player.x
            )
        );

        this.player.y = Math.max(
            topLimit,
            Math.min(bottomLimit, this.player.y)
        );

        // ---------------------------------------------
        // BREEZE PHYSICS
        // ---------------------------------------------

        for (const b of this.breezes) {

            if (b.found) continue;

            b.x += b.vx * dt;
            b.y += b.vy * dt;

            const leftBoundary =
                this.areaX + 20;

            const rightBoundary =
                this.areaX + this.areaW - 20;

            const topBoundary =
                this.isMobile
                    ? this.hudHeight + 20
                    : 20;

            const bottomBoundary =
                this.isMobile
                    ? this.height - 150
                    : this.height - 20;

            if (
                b.x < leftBoundary ||
                b.x > rightBoundary
            ) {
                b.vx *= -1;

                b.x = Math.max(
                    leftBoundary,
                    Math.min(rightBoundary, b.x)
                );
            }

            if (
                b.y < topBoundary ||
                b.y > bottomBoundary
            ) {
                b.vy *= -1;

                b.y = Math.max(
                    topBoundary,
                    Math.min(bottomBoundary, b.y)
                );
            }

            if (
                Math.hypot(
                    b.x - this.player.x,
                    b.y - this.player.y
                ) < b.r + 14
            ) {

                b.found = true;

                this.collected++;

                if (
                    this.collected ===
                    this.breezeTotal
                ) {

                    this.finish(true);

                    return;
                }
            }
        }

        // ---------------------------------------------
        // GUSTS
        // ---------------------------------------------

        this.gustTimer -= dt;

        if (this.gustTimer <= 0) {

            this.gustTimer = 1.2;

            const fromLeft =
                Math.random() < 0.5;

            this.gusts.push({

                x: fromLeft
                    ? this.areaX - 40
                    : this.areaX + this.areaW + 40,

                y:
                    (this.isMobile
                        ? this.hudHeight + 40
                        : 40) +
                    Math.random() *
                    (
                        this.areaH -
                        (this.isMobile
                            ? this.hudHeight + 190
                            : 80)
                    ),

                vx:
                    (fromLeft ? 1 : -1) *
                    (110 + Math.random() * 60),

                r:
                    32 + Math.random() * 18
            });
        }

        this.gusts.forEach(g => {
            g.x += g.vx * dt;
        });

        this.gusts = this.gusts.filter(
            g =>
                g.x > this.areaX - 80 &&
                g.x < this.areaX + this.areaW + 80
        );

        for (const g of this.gusts) {

            if (
                Math.hypot(
                    g.x - this.player.x,
                    g.y - this.player.y
                ) < g.r
            ) {

                this.slowDuration = 1.2;
            }
        }
    }

    finish(success) {

        if (this.state === "END") return;

        this.state = "END";
        this.endSuccess = success;

        setTimeout(() => {

            if (window.onHawaMahalEnd) {
                window.onHawaMahalEnd(success);
            }

        }, 1400);
    }

    loop() {

        if (
            !this.isRunning &&
            this.state !== "END"
        ) {
            return;
        }

        this.update();
        this.draw();

        if (this.isRunning) {
            requestAnimationFrame(
                () => this.loop()
            );
        }
    }

    // =================================================
    // RENDER
    // =================================================

    draw() {

        const ctx = this.ctx;

        ctx.fillStyle = this.COLORS.BG;

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

        this.drawJharokhaPattern();

        if (this.isMobile) {
            this.drawMobileHUD();
        } else {
            this.drawSidebar();
        }

        this.drawGusts();
        this.drawBreezes();
        this.drawPlayer();

        if (this.state === "PREPARE") {
            this.drawPrep();
        }

        if (this.state === "END") {
            this.drawEnd();
        }
    }

    drawJharokhaPattern() {

        const ctx = this.ctx;

        ctx.strokeStyle =
            "rgba(255, 207, 112, 0.08)";

        ctx.lineWidth = 2;

        const cell = this.isMobile ? 45 : 50;

        for (
            let x = this.areaX;
            x < this.width;
            x += cell
        ) {

            for (
                let y = this.isMobile
                    ? this.hudHeight
                    : 0;

                y < this.height;
                y += cell
            ) {

                ctx.strokeRect(
                    x + 4,
                    y + 4,
                    cell - 8,
                    cell - 8
                );
            }
        }
    }

    // =================================================
    // MOBILE HUD
    // =================================================

    drawMobileHUD() {

        const ctx = this.ctx;

        ctx.fillStyle =
            "rgba(40, 15, 28, 0.94)";

        ctx.fillRect(
            0,
            0,
            this.width,
            this.hudHeight
        );

        ctx.strokeStyle =
            this.COLORS.BORDER;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            0,
            this.hudHeight
        );

        ctx.lineTo(
            this.width,
            this.hudHeight
        );

        ctx.stroke();

        // Title
        ctx.textAlign = "left";

        ctx.fillStyle =
            this.COLORS.BREEZE;

        ctx.font =
            "bold 18px Cinzel, serif";

        ctx.fillText(
            "HAWA MAHAL",
            14,
            25
        );

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.font =
            "11px monospace";

        ctx.fillText(
            "CATCH THE BREEZE",
            14,
            43
        );

        // Orb counter
        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            "bold 13px monospace";

        ctx.fillText(
            `ORBS: ${this.collected}/${this.breezeTotal}`,
            14,
            68
        );

        // Timer
        ctx.textAlign = "right";

        ctx.fillStyle =
            this.timeLeft < 10
                ? "#ff5252"
                : this.COLORS.TEXT;

        ctx.fillText(
            `TIME: ${Math.ceil(this.timeLeft)}s`,
            this.width - 14,
            68
        );

        // Progress bar
        const barX = 14;
        const barY = 77;
        const barW = this.width - 28;
        const barH = 8;

        ctx.fillStyle = "#4a2438";

        ctx.fillRect(
            barX,
            barY,
            barW,
            barH
        );

        ctx.fillStyle =
            this.COLORS.BREEZE;

        ctx.fillRect(
            barX,
            barY,
            barW *
                (
                    this.collected /
                    this.breezeTotal
                ),
            barH
        );

        ctx.strokeStyle =
            this.COLORS.BORDER;

        ctx.strokeRect(
            barX,
            barY,
            barW,
            barH
        );
    }

    // =================================================
    // DESKTOP SIDEBAR
    // =================================================

    drawSidebar() {

        const ctx = this.ctx;

        const w = this.sidebarWidth;
        const h = this.height;
        const pad = 20;

        ctx.fillStyle =
            this.COLORS.SIDEBAR_BG;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        ctx.strokeStyle =
            this.COLORS.BORDER;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(w, 0);
        ctx.lineTo(w, h);

        ctx.stroke();

        let y = 55;

        ctx.textAlign = "left";

        ctx.fillStyle =
            this.COLORS.BREEZE;

        ctx.font =
            "bold 22px Cinzel, serif";

        ctx.fillText(
            "HAWA MAHAL",
            pad,
            y
        );

        y += 26;

        ctx.font = "14px monospace";

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.fillText(
            "Catch the Breeze",
            pad,
            y
        );

        y += 40;

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            "14px monospace";

        [
            "> Arrows / WASD to move",
            "> Fast moving breeze orbs",
            "> Sand gusts reduce speed!"
        ].forEach(line => {

            ctx.fillText(
                line,
                pad,
                y
            );

            y += 22;
        });

        y += 30;

        ctx.font =
            "bold 14px monospace";

        ctx.fillText(
            "ORBS CAPTURED:",
            pad,
            y
        );

        y += 10;

        const barW =
            w - pad * 2;

        const barH = 16;

        ctx.fillStyle =
            "#4a2438";

        ctx.fillRect(
            pad,
            y,
            barW,
            barH
        );

        ctx.fillStyle =
            this.COLORS.BREEZE;

        ctx.fillRect(
            pad,
            y,
            barW *
                (
                    this.collected /
                    this.breezeTotal
                ),
            barH
        );

        ctx.strokeStyle =
            this.COLORS.BORDER;

        ctx.strokeRect(
            pad,
            y,
            barW,
            barH
        );

        y += 30;

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            "16px monospace";

        ctx.fillText(
            `${this.collected} / ${this.breezeTotal}`,
            pad,
            y
        );

        y += 40;

        ctx.fillStyle =
            this.timeLeft < 10
                ? "#ff5252"
                : this.COLORS.TEXT_DIM;

        ctx.font =
            "bold 15px monospace";

        ctx.fillText(
            `Time Left: ${Math.max(
                0,
                Math.ceil(this.timeLeft)
            )}s`,
            pad,
            y
        );

        const fact =
            this.facts[
                Math.min(
                    this.collected,
                    this.facts.length - 1
                )
            ];

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.font =
            "italic 12px Poppins, sans-serif";

        wrapText4(
            ctx,
            fact,
            pad,
            h - 60,
            w - pad * 2,
            16
        );
    }

    drawGusts() {

        const ctx = this.ctx;

        for (const g of this.gusts) {

            ctx.beginPath();

            ctx.arc(
                g.x,
                g.y,
                g.r,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                this.COLORS.GUST;

            ctx.fill();
        }
    }

    drawBreezes() {

        const ctx = this.ctx;

        const t = Date.now() / 400;

        for (const b of this.breezes) {

            if (b.found) continue;

            const bobY =
                b.y +
                Math.sin(t + b.bob) * 3;

            ctx.shadowColor =
                this.COLORS.BREEZE;

            ctx.shadowBlur = 14;

            ctx.fillStyle =
                this.COLORS.BREEZE;

            ctx.beginPath();

            ctx.arc(
                b.x,
                bobY,
                b.r,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.shadowBlur = 0;
        }
    }

    drawPlayer() {

        if (!this.player) return;

        const ctx = this.ctx;

        ctx.shadowColor =
            this.COLORS.PLAYER;

        ctx.shadowBlur = 14;

        ctx.fillStyle =
            this.slowDuration > 0
                ? "#ff9e80"
                : this.COLORS.PLAYER;

        ctx.beginPath();

        ctx.arc(
            this.player.x,
            this.player.y,
            13,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
    }

    drawPrep() {

        const ctx = this.ctx;

        const cx =
            this.areaX +
            this.areaW / 2;

        const cy = this.isMobile
            ? this.hudHeight +
              (this.height - this.hudHeight) / 2
            : this.height / 2;

        ctx.fillStyle =
            "rgba(0,0,0,0.72)";

        ctx.fillRect(
            this.areaX,
            this.isMobile
                ? this.hudHeight
                : 0,
            this.areaW,
            this.isMobile
                ? this.height - this.hudHeight
                : this.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            this.isMobile
                ? "bold 21px Cinzel, serif"
                : "bold 26px Cinzel, serif";

        ctx.fillText(
            "Catch all 12 Breeze Orbs",
            cx,
            cy - 25
        );

        ctx.fillStyle =
            this.COLORS.BREEZE;

        ctx.font =
            "bold 56px monospace";

        ctx.fillText(
            Math.ceil(this.prepTimer),
            cx,
            cy + 45
        );
    }

    drawEnd() {

        const ctx = this.ctx;

        const cx =
            this.areaX +
            this.areaW / 2;

        const cy = this.isMobile
            ? this.hudHeight +
              (this.height - this.hudHeight) / 2
            : this.height / 2;

        ctx.fillStyle =
            "rgba(0,0,0,0.85)";

        ctx.fillRect(
            this.areaX,
            this.isMobile
                ? this.hudHeight
                : 0,
            this.areaW,
            this.isMobile
                ? this.height - this.hudHeight
                : this.height
        );

        ctx.textAlign = "center";

        ctx.fillStyle =
            this.endSuccess
                ? this.COLORS.BREEZE
                : "#ff5252";

        ctx.font =
            this.isMobile
                ? "bold 23px Cinzel, serif"
                : "bold 32px Cinzel, serif";

        const msg =
            this.endSuccess
                ? "All breeze orbs gathered!"
                : `Time ran out! ${this.collected}/${this.breezeTotal}`;

        ctx.fillText(
            msg,
            cx,
            cy
        );
    }
}

function wrapText4(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
) {

    const words = text.split(" ");

    let line = "";
    let curY = y;

    for (const word of words) {

        const test =
            line +
            word +
            " ";

        if (
            ctx.measureText(test).width >
                maxWidth &&
            line !== ""
        ) {

            ctx.fillText(
                line,
                x,
                curY
            );

            line =
                word + " ";

            curY += lineHeight;

        } else {

            line = test;
        }
    }

    ctx.fillText(
        line,
        x,
        curY
    );
}