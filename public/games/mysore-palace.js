// js/mysore-palace.js
// "The Golden Howdah Procession"
// 3-Round Timed Dasara Elephant Escort

window.mysoreInstance = null;
window.onMysoreEnd = null;

function startMysorePalaceGame(canvasId, onComplete) {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error("Mysore Palace Game: Canvas not found!");
        if (onComplete) onComplete(false);
        return;
    }

    if (window.mysoreInstance) {
        try {
            window.mysoreInstance.cleanup();
        } catch (error) {
            console.warn("Could not clean previous Mysore game:", error);
        }
        window.mysoreInstance = null;
    }

    window.onMysoreEnd = (success) => {
        if (window.mysoreInstance) {
            window.mysoreInstance.cleanup();
            window.mysoreInstance = null;
        }

        if (onComplete) {
            onComplete(success);
        }
    };

    window.mysoreInstance = new MysorePalaceGame(canvas);
    window.mysoreInstance.startGame();
}

class MysorePalaceGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        if (!this.ctx) {
            throw new Error(
                "Mysore Palace Game: Could not get 2D canvas context."
            );
        }

        this.COLORS = {
            BG: "#160920",
            SIDEBAR_BG: "#110619",
            BORDER: "#c1502e",
            BORDER_GOLD: "#ffcf70",
            ROAD: "#251233",
            ROAD_LINE: "#4a2562",
            GOLD: "#ffd15c",
            MARIGOLD_PETAL_DARK: "#e65c00",
            MARIGOLD_PETAL_MID: "#ff8c00",
            MARIGOLD_PETAL_BRIGHT: "#ffcc00",
            MARIGOLD_LEAF: "#2d8a4e",
            FIRECRACKER: "#ff4d4d",
            ELEPHANT: "#566070",
            CAPARISON: "#b32426",
            TEXT: "#fdf3e2",
            TEXT_DIM: "#ccaed6"
        };

        this.facts = [
            "The Jumbo Savari procession features lead elephants carrying the 750 kg golden idol throne.",
            "The parade path is showered with fresh marigold petals (Genda phool) considered sacred and auspicious.",
            "Royal musicians playing the Nadaswaram lead the procession under illuminated palace gates.",
            "Celebrated since the Vijayanagara kings, Mysore Dasara symbolizes the victory of good over evil."
        ];

        // ============================================================
        // GAME SETTINGS
        // ============================================================

        this.totalRounds = 3;
        this.roundTimes = [30, 25, 20];

        this.currentRound = 1;
        this.timeRemaining = this.roundTimes[0];

        this.targetPerRound = 8;

        // ============================================================
        // SCORE / PROGRESS
        // ============================================================

        this.marigoldsCollected = 0;
        this.marigoldsThisRound = 0;
        this.paradeHarmony = 100;

        // ============================================================
        // GAME OBJECTS
        // ============================================================

        this.items = [];
        this.particles = [];

        this.isRunning = false;
        this.state = "MENU";

        this.roadOffset = 0;
        this.spawnTimer = 0;

        this.animFrameId = null;
        this.lastTick = 0;

        // ============================================================
        // ELEPHANT
        // ============================================================

        this.elephantX = 0;
        this.elephantTargetX = 0;
        this.elephantY = 0;

        // ============================================================
        // RESPONSIVE
        // ============================================================

        this.isMobile = false;
        this.sidebarWidth = 300;
        this.playArea = null;

        // ============================================================
        // EVENTS
        // ============================================================

        this.boundMove = (e) => this.handlePointerMove(e);
        this.boundKey = (e) => this.handleKey(e);
        this.boundResize = () => this.resize();

        this.canvas.addEventListener(
            "mousemove",
            this.boundMove
        );

        this.canvas.addEventListener(
            "touchmove",
            this.boundMove,
            { passive: false }
        );

        this.canvas.addEventListener(
            "touchstart",
            this.boundMove,
            { passive: false }
        );

        window.addEventListener(
            "keydown",
            this.boundKey
        );

        window.addEventListener(
            "resize",
            this.boundResize
        );

        this.resize();
    }

    // ============================================================
    // CLEANUP
    // ============================================================

    cleanup() {
        this.isRunning = false;
        this.state = "END";

        if (this.animFrameId !== null) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }

        this.canvas.removeEventListener(
            "mousemove",
            this.boundMove
        );

        this.canvas.removeEventListener(
            "touchmove",
            this.boundMove
        );

        this.canvas.removeEventListener(
            "touchstart",
            this.boundMove
        );

        window.removeEventListener(
            "keydown",
            this.boundKey
        );

        window.removeEventListener(
            "resize",
            this.boundResize
        );

        this.items = [];
        this.particles = [];
    }

    // ============================================================
    // RESIZE
    // ============================================================

    resize() {
        const rect = this.canvas.getBoundingClientRect();

        this.width =
            rect.width ||
            this.canvas.clientWidth ||
            window.innerWidth;

        this.height =
            rect.height ||
            this.canvas.clientHeight ||
            Math.max(500, window.innerHeight);

        this.width = Math.max(280, this.width);
        this.height = Math.max(420, this.height);

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        this.canvas.width = Math.round(
            this.width * dpr
        );

        this.canvas.height = Math.round(
            this.height * dpr
        );

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        this.isMobile = this.width < 700;

        if (this.isMobile) {
            this.sidebarWidth = 0;

            this.playArea = {
                x: 10,
                y: 118,
                w: Math.max(
                    260,
                    this.width - 20
                ),
                h: Math.max(
                    260,
                    this.height - 128
                )
            };
        } else {
            this.sidebarWidth = Math.max(
                270,
                Math.min(
                    320,
                    this.width * 0.26
                )
            );

            this.playArea = {
                x: this.sidebarWidth + 24,
                y: 24,
                w: Math.max(
                    180,
                    this.width -
                        this.sidebarWidth -
                        48
                ),
                h: Math.max(
                    220,
                    this.height - 48
                )
            };
        }

        const leftBound =
            this.playArea.x + 48;

        const rightBound =
            this.playArea.x +
            this.playArea.w -
            48;

        if (!Number.isFinite(this.elephantX)) {
            this.elephantX =
                this.playArea.x +
                this.playArea.w / 2;

            this.elephantTargetX =
                this.elephantX;
        } else {
            this.elephantX = Math.max(
                leftBound,
                Math.min(
                    rightBound,
                    this.elephantX
                )
            );

            this.elephantTargetX =
                Math.max(
                    leftBound,
                    Math.min(
                        rightBound,
                        this.elephantTargetX
                    )
                );
        }

        this.elephantY =
            this.playArea.y +
            this.playArea.h -
            (this.isMobile ? 72 : 85);
    }

    // ============================================================
    // START GAME
    // ============================================================

    startGame() {
        if (this.animFrameId !== null) {
            cancelAnimationFrame(
                this.animFrameId
            );

            this.animFrameId = null;
        }

        this.isRunning = true;
        this.state = "PLAYING";

        this.currentRound = 1;

        this.marigoldsCollected = 0;
        this.marigoldsThisRound = 0;
        this.paradeHarmony = 100;

        this.items = [];
        this.particles = [];

        this.roadOffset = 0;
        this.spawnTimer = 0;

        this.initRound(
            this.currentRound
        );

        this.lastTick =
            performance.now();

        this.loop();
    }

    // ============================================================
    // ROUND
    // ============================================================

    initRound(roundNum) {
        const safeRound = Math.max(
            1,
            Math.min(
                this.totalRounds,
                Number(roundNum) || 1
            )
        );

        this.marigoldsThisRound = 0;

        this.timeRemaining =
            this.roundTimes[
                safeRound - 1
            ];

        this.items = [];
        this.spawnTimer = 0;
    }

    // ============================================================
    // POINTER CONTROL
    // ============================================================

    handlePointerMove(e) {
        if (
            this.state !== "PLAYING" ||
            !this.playArea
        ) {
            return;
        }

        if (e.cancelable) {
            e.preventDefault();
        }

        let clientX = null;

        if (
            e.touches &&
            e.touches.length > 0
        ) {
            clientX =
                e.touches[0].clientX;
        } else if (
            Number.isFinite(e.clientX)
        ) {
            clientX = e.clientX;
        }

        if (!Number.isFinite(clientX)) {
            return;
        }

        const rect =
            this.canvas.getBoundingClientRect();

        const mx =
            clientX - rect.left;

        const minX =
            this.playArea.x + 48;

        const maxX =
            this.playArea.x +
            this.playArea.w -
            48;

        this.elephantTargetX =
            Math.max(
                minX,
                Math.min(
                    maxX,
                    mx
                )
            );
    }

    // ============================================================
    // KEYBOARD
    // ============================================================

    handleKey(e) {
        if (
            this.state !== "PLAYING" ||
            !this.playArea
        ) {
            return;
        }

        const minX =
            this.playArea.x + 48;

        const maxX =
            this.playArea.x +
            this.playArea.w -
            48;

        if (
            e.key === "ArrowLeft" ||
            e.key === "a" ||
            e.key === "A"
        ) {
            e.preventDefault();

            this.elephantTargetX =
                Math.max(
                    minX,
                    this.elephantTargetX - 60
                );
        }

        if (
            e.key === "ArrowRight" ||
            e.key === "d" ||
            e.key === "D"
        ) {
            e.preventDefault();

            this.elephantTargetX =
                Math.min(
                    maxX,
                    this.elephantTargetX + 60
                );
        }
    }

    // ============================================================
    // UPDATE
    // ============================================================

    update(dt) {
        if (
            this.state !== "PLAYING"
        ) {
            return;
        }

        if (
            !Number.isFinite(dt) ||
            dt < 0
        ) {
            dt = 0;
        }

        dt = Math.min(dt, 0.1);

        // --------------------------------------------------------
        // TIMER
        // --------------------------------------------------------

        this.timeRemaining -= dt;

        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.finish(false);
            return;
        }

        // --------------------------------------------------------
        // ROAD
        // --------------------------------------------------------

        this.roadOffset +=
            dt *
            (
                180 +
                this.currentRound * 30
            );

        // --------------------------------------------------------
        // ELEPHANT
        // --------------------------------------------------------

        if (
            Number.isFinite(
                this.elephantTargetX
            ) &&
            Number.isFinite(
                this.elephantX
            )
        ) {
            this.elephantX +=
                (
                    this.elephantTargetX -
                    this.elephantX
                ) * 0.16;
        }

        // --------------------------------------------------------
        // SPAWN
        // --------------------------------------------------------

        this.spawnTimer += dt;

        const spawnInterval =
            Math.max(
                0.2,
                0.60 -
                this.currentRound * 0.09
            );

        if (
            this.spawnTimer >=
            spawnInterval
        ) {
            this.spawnTimer = 0;

            const isHazard =
                Math.random() <
                (
                    0.35 +
                    this.currentRound * 0.08
                );

            const pa = this.playArea;

            if (
                pa &&
                pa.w > 100
            ) {
                const item = {
                    x:
                        pa.x +
                        45 +
                        Math.random() *
                        Math.max(
                            1,
                            pa.w - 90
                        ),

                    y:
                        pa.y - 30,

                    speed:
                        170 +
                        Math.random() * 70 +
                        this.currentRound * 35,

                    radius:
                        isHazard
                            ? 18
                            : 22,

                    rotation:
                        Math.random() *
                        Math.PI *
                        2,

                    rotSpeed:
                        (
                            Math.random() -
                            0.5
                        ) * 3,

                    type:
                        isHazard
                            ? "FIRECRACKER"
                            : "MARIGOLD"
                };

                this.items.push(item);
            }
        }

        // --------------------------------------------------------
        // ITEMS
        // --------------------------------------------------------

        const currentItems =
            Array.isArray(this.items)
                ? this.items
                : [];

        for (
            let i =
                currentItems.length - 1;
            i >= 0;
            i--
        ) {
            const item =
                currentItems[i];

            if (
                !item ||
                typeof item !== "object"
            ) {
                currentItems.splice(i, 1);
                continue;
            }

            if (
                !Number.isFinite(item.x) ||
                !Number.isFinite(item.y) ||
                !Number.isFinite(item.speed)
            ) {
                currentItems.splice(i, 1);
                continue;
            }

            item.y +=
                item.speed * dt;

            item.rotation =
                Number.isFinite(
                    item.rotation
                )
                    ? item.rotation +
                      (
                          Number.isFinite(
                              item.rotSpeed
                          )
                              ? item.rotSpeed
                              : 0
                      ) * dt
                    : 0;

            // ----------------------------------------------------
            // COLLISION
            // ----------------------------------------------------

            const dist =
                Math.hypot(
                    this.elephantX -
                    item.x,

                    this.elephantY -
                    item.y
                );

            if (
                Number.isFinite(dist) &&
                dist <
                    40 +
                    (
                        Number.isFinite(
                            item.radius
                        )
                            ? item.radius
                            : 0
                    )
            ) {
                if (
                    item.type ===
                    "MARIGOLD"
                ) {
                    this.marigoldsCollected++;
                    this.marigoldsThisRound++;

                    this.paradeHarmony =
                        Math.min(
                            100,
                            this.paradeHarmony + 5
                        );

                    this.createPetalBurst(
                        item.x,
                        item.y,
                        this.COLORS
                            .MARIGOLD_PETAL_BRIGHT,
                        14
                    );

                    if (
                        this.marigoldsThisRound >=
                        this.targetPerRound
                    ) {
                        if (
                            this.currentRound <
                            this.totalRounds
                        ) {
                            this.currentRound++;

                            this.initRound(
                                this.currentRound
                            );

                            this.createPetalBurst(
                                this.elephantX,
                                this.elephantY,
                                this.COLORS.GOLD,
                                25
                            );

                            return;
                        }

                        this.finish(true);
                        return;
                    }
                } else {
                    this.paradeHarmony =
                        Math.max(
                            0,
                            this.paradeHarmony - 22
                        );

                    this.createPetalBurst(
                        item.x,
                        item.y,
                        this.COLORS.FIRECRACKER,
                        18
                    );

                    if (
                        this.paradeHarmony <= 0
                    ) {
                        this.finish(false);
                        return;
                    }
                }

                currentItems.splice(i, 1);
                continue;
            }

            // ----------------------------------------------------
            // OFF SCREEN
            // ----------------------------------------------------

            if (
                this.playArea &&
                item.y >
                    this.playArea.y +
                    this.playArea.h +
                    50
            ) {
                currentItems.splice(
                    i,
                    1
                );
            }
        }

        // --------------------------------------------------------
        // PARTICLES
        // --------------------------------------------------------

        if (
            !Array.isArray(
                this.particles
            )
        ) {
            this.particles = [];
        }

        for (
            let i =
                this.particles.length - 1;
            i >= 0;
            i--
        ) {
            const p =
                this.particles[i];

            if (
                !p ||
                typeof p !== "object"
            ) {
                this.particles.splice(i, 1);
                continue;
            }

            if (
                !Number.isFinite(p.x) ||
                !Number.isFinite(p.y)
            ) {
                this.particles.splice(i, 1);
                continue;
            }

            p.x +=
                (
                    Number.isFinite(p.vx)
                        ? p.vx
                        : 0
                ) * dt;

            p.y +=
                (
                    Number.isFinite(p.vy)
                        ? p.vy
                        : 0
                ) * dt;

            p.life -= dt;

            if (p.life <= 0) {
                this.particles.splice(
                    i,
                    1
                );
            }
        }
    }

    // ============================================================
    // PARTICLES
    // ============================================================

    createPetalBurst(
        x,
        y,
        color,
        count = 12
    ) {
        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y)
        ) {
            return;
        }

        for (
            let i = 0;
            i < count;
            i++
        ) {
            this.particles.push({
                x,
                y,

                vx:
                    (
                        Math.random() -
                        0.5
                    ) * 180,

                vy:
                    (
                        Math.random() -
                        0.5
                    ) * 180,

                life:
                    0.45 +
                    Math.random() * 0.35,

                maxLife: 0.8,

                color
            });
        }
    }

    // ============================================================
    // FINISH
    // ============================================================

    finish(success) {
        if (
            this.state === "END"
        ) {
            return;
        }

        this.state = "END";
        this.isRunning = false;

        if (
            this.animFrameId !== null
        ) {
            cancelAnimationFrame(
                this.animFrameId
            );

            this.animFrameId = null;
        }

        setTimeout(() => {
            if (
                window.onMysoreEnd
            ) {
                window.onMysoreEnd(
                    success
                );
            }
        }, 2200);
    }

    // ============================================================
    // LOOP
    // ============================================================

    loop() {
        if (!this.isRunning) {
            return;
        }

        const now =
            performance.now();

        let dt =
            (
                now -
                this.lastTick
            ) / 1000;

        this.lastTick = now;

        if (
            !Number.isFinite(dt) ||
            dt < 0
        ) {
            dt = 0;
        }

        dt = Math.min(dt, 0.1);

        try {
            if (
                this.state === "PLAYING"
            ) {
                this.update(dt);
            }

            if (
                this.ctx &&
                this.canvas
            ) {
                this.draw();
            }
        } catch (error) {
            console.error(
                "Mysore Palace Game runtime error:",
                error
            );

            this.finish(false);
            return;
        }

        if (this.isRunning) {
            this.animFrameId =
                requestAnimationFrame(
                    () => this.loop()
                );
        }
    }

    // ============================================================
    // DRAW
    // ============================================================

    draw() {
        const ctx = this.ctx;

        if (!ctx) {
            return;
        }

        ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        ctx.fillStyle =
            this.COLORS.BG;

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

        if (this.isMobile) {
            this.drawMobileHUD();
        } else {
            this.drawSidebar();
        }

        this.drawProcessionRoad();
        this.drawItems();
        this.drawRoyalElephant();
        this.drawParticles();

        if (
            this.state === "END"
        ) {
            this.drawEnd();
        }
    }

    // ============================================================
    // MOBILE HUD
    // ============================================================

    drawMobileHUD() {
        const ctx = this.ctx;

        const pad = 14;

        // Header
        ctx.fillStyle =
            this.COLORS.SIDEBAR_BG;

        ctx.fillRect(
            0,
            0,
            this.width,
            104
        );

        ctx.strokeStyle =
            this.COLORS.BORDER;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            0,
            104
        );

        ctx.lineTo(
            this.width,
            104
        );

        ctx.stroke();

        // Title
        ctx.textAlign = "left";

        ctx.fillStyle =
            this.COLORS.GOLD;

        ctx.font =
            "bold 17px Cinzel, serif";

        ctx.fillText(
            "MYSORE PALACE",
            pad,
            25
        );

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.font =
            "10px monospace";

        ctx.fillText(
            "THE GOLDEN HOWDAH ESCORT",
            pad,
            42
        );

        // Round
        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            "bold 11px monospace";

        ctx.fillText(
            `ROUND ${this.currentRound} / ${this.totalRounds}`,
            pad,
            62
        );

        // Timer
        ctx.fillStyle =
            this.timeRemaining < 6
                ? "#ff7a7a"
                : this.COLORS.GOLD;

        ctx.textAlign = "right";

        ctx.font =
            "bold 14px monospace";

        ctx.fillText(
            `${Math.ceil(this.timeRemaining)}s`,
            this.width - pad,
            62
        );

        // Flower
        ctx.textAlign = "left";

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.font =
            "10px monospace";

        ctx.fillText(
            `FLOWERS ${this.marigoldsThisRound}/${this.targetPerRound}`,
            pad,
            84
        );

        // Harmony
        ctx.textAlign = "right";

        ctx.fillText(
            `HARMONY ${Math.ceil(this.paradeHarmony)}%`,
            this.width - pad,
            84
        );

        // Progress bars
        const barY = 92;
        const barH = 5;
        const gap = 8;
        const barW =
            (this.width - pad * 2 - gap) / 2;

        // Flowers
        ctx.fillStyle = "#27132e";

        ctx.fillRect(
            pad,
            barY,
            barW,
            barH
        );

        ctx.fillStyle =
            this.COLORS.MARIGOLD_PETAL_BRIGHT;

        ctx.fillRect(
            pad,
            barY,
            barW *
                Math.min(
                    1,
                    this.marigoldsThisRound /
                        this.targetPerRound
                ),
            barH
        );

        // Harmony
        const harmonyX =
            pad + barW + gap;

        ctx.fillStyle = "#27132e";

        ctx.fillRect(
            harmonyX,
            barY,
            barW,
            barH
        );

        ctx.fillStyle =
            this.paradeHarmony > 35
                ? "#8fffb0"
                : "#ff5e5e";

        ctx.fillRect(
            harmonyX,
            barY,
            barW *
                Math.max(
                    0,
                    Math.min(
                        1,
                        this.paradeHarmony / 100
                    )
                ),
            barH
        );
    }

    // ============================================================
    // DESKTOP SIDEBAR
    // ============================================================

    drawSidebar() {
        const ctx = this.ctx;

        const w =
            this.sidebarWidth;

        const h =
            this.height;

        const pad = 22;

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

        let y = 46;

        ctx.textAlign = "left";

        ctx.fillStyle =
            this.COLORS.GOLD;

        ctx.font =
            "bold 20px Cinzel, serif";

        ctx.fillText(
            "MYSORE PALACE",
            pad,
            y
        );

        y += 24;

        ctx.font =
            "12px monospace";

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.fillText(
            "The Golden Howdah Escort",
            pad,
            y
        );

        y += 30;

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            "bold 13px monospace";

        ctx.fillText(
            `DASARA PROCESSION: ROUND ${this.currentRound} / ${this.totalRounds}`,
            pad,
            y
        );

        y += 22;

        ctx.font =
            "12px Poppins, sans-serif";

        [
            "• Steer Balarama carrying the golden throne",
            "• Collect falling sacred marigolds (Genda)",
            "• Dodge sudden rogue firecracker sparks",
            "• Complete all 3 timed festival rounds!"
        ].forEach((line) => {
            ctx.fillText(
                line,
                pad,
                y
            );

            y += 19;
        });

        // TIMER

        y += 22;

        ctx.font =
            "bold 13px monospace";

        ctx.fillStyle =
            this.COLORS.GOLD;

        ctx.fillText(
            `ROUND TIMER: ${Math.ceil(
                this.timeRemaining
            )}s`,
            pad,
            y
        );

        y += 10;

        this.drawBar(
            pad,
            y,
            w - pad * 2,
            9,
            this.timeRemaining /
                (
                    this.roundTimes[
                        this.currentRound - 1
                    ] || 1
                ),
            this.timeRemaining < 6
                ? "#ff7a7a"
                : this.COLORS.GOLD
        );

        // FLOWERS

        y += 26;

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.fillText(
            `ROUND FLOWERS: ${this.marigoldsThisRound} / ${this.targetPerRound}`,
            pad,
            y
        );

        y += 10;

        this.drawBar(
            pad,
            y,
            w - pad * 2,
            9,
            this.marigoldsThisRound /
                this.targetPerRound,
            this.COLORS
                .MARIGOLD_PETAL_BRIGHT
        );

        // HARMONY

        y += 28;

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.fillText(
            `PARADE HARMONY: ${Math.ceil(
                this.paradeHarmony
            )}%`,
            pad,
            y
        );

        y += 10;

        this.drawBar(
            pad,
            y,
            w - pad * 2,
            9,
            this.paradeHarmony / 100,
            this.paradeHarmony > 35
                ? "#8fffb0"
                : "#ff5e5e"
        );

        // FACT

        const fact =
            this.facts[
                this.currentRound - 1
            ] ||
            this.facts[0];

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.font =
            "italic 11px Poppins, sans-serif";

        wrapTextMy(
            ctx,
            fact,
            pad,
            h - 55,
            w - pad * 2,
            15
        );
    }

    // ============================================================
    // BAR
    // ============================================================

    drawBar(
        x,
        y,
        width,
        height,
        progress,
        color
    ) {
        const ctx = this.ctx;

        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(progress) || 0
                )
            );

        ctx.fillStyle =
            "#1c0c24";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        ctx.fillStyle =
            color;

        ctx.fillRect(
            x,
            y,
            width * progress,
            height
        );

        ctx.strokeStyle =
            this.COLORS.BORDER;

        ctx.lineWidth = 1;

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );
    }

    // ============================================================
    // PROCESSION ROAD
    // ============================================================

    drawProcessionRoad() {
        const ctx = this.ctx;
        const pa = this.playArea;

        if (!pa) {
            return;
        }

        const roadGrad =
            ctx.createLinearGradient(
                pa.x,
                pa.y,
                pa.x + pa.w,
                pa.y
            );

        roadGrad.addColorStop(
            0,
            "#1c0c26"
        );

        roadGrad.addColorStop(
            0.5,
            "#2c143d"
        );

        roadGrad.addColorStop(
            1,
            "#1c0c26"
        );

        ctx.fillStyle =
            roadGrad;

        ctx.fillRect(
            pa.x,
            pa.y,
            pa.w,
            pa.h
        );

        ctx.strokeStyle =
            this.COLORS.BORDER_GOLD;

        ctx.lineWidth = 2;

        ctx.strokeRect(
            pa.x,
            pa.y,
            pa.w,
            pa.h
        );

        // Lane guides

        ctx.strokeStyle =
            this.COLORS.ROAD_LINE;

        ctx.lineWidth = 2;

        ctx.setLineDash([
            14,
            18
        ]);

        ctx.lineDashOffset =
            -this.roadOffset;

        ctx.beginPath();

        if (pa.w > 220) {
            ctx.moveTo(
                pa.x + pa.w * 0.33,
                pa.y
            );

            ctx.lineTo(
                pa.x + pa.w * 0.33,
                pa.y + pa.h
            );

            ctx.moveTo(
                pa.x + pa.w * 0.66,
                pa.y
            );

            ctx.lineTo(
                pa.x + pa.w * 0.66,
                pa.y + pa.h
            );
        } else {
            ctx.moveTo(
                pa.x + pa.w * 0.5,
                pa.y
            );

            ctx.lineTo(
                pa.x + pa.w * 0.5,
                pa.y + pa.h
            );
        }

        ctx.stroke();

        ctx.setLineDash([]);

        // Mobile instruction

        if (this.isMobile) {
            ctx.textAlign = "center";

            ctx.fillStyle =
                "rgba(253,243,226,0.55)";

            ctx.font =
                "10px Poppins, sans-serif";

            ctx.fillText(
                "DRAG / TOUCH TO STEER • ← → OR A / D",
                pa.x + pa.w / 2,
                pa.y + 18
            );
        }
    }

    // ============================================================
    // ITEMS
    // ============================================================

    drawItems() {
        const ctx = this.ctx;

        if (
            !Array.isArray(
                this.items
            )
        ) {
            return;
        }

        this.items.forEach((it) => {
            if (
                !it ||
                typeof it !== "object" ||
                !Number.isFinite(it.x) ||
                !Number.isFinite(it.y) ||
                !Number.isFinite(it.radius)
            ) {
                return;
            }

            if (
                it.type ===
                "MARIGOLD"
            ) {
                ctx.save();

                ctx.translate(
                    it.x,
                    it.y
                );

                ctx.rotate(
                    Number.isFinite(
                        it.rotation
                    )
                        ? it.rotation
                        : 0
                );

                // Leaves

                ctx.fillStyle =
                    this.COLORS
                        .MARIGOLD_LEAF;

                for (
                    let i = 0;
                    i < 4;
                    i++
                ) {
                    ctx.beginPath();

                    ctx.ellipse(
                        0,
                        0,
                        it.radius * 0.5,
                        it.radius * 1.1,
                        (
                            i * 45
                        ) *
                            Math.PI /
                            180,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();
                }

                // Outer petals

                ctx.fillStyle =
                    this.COLORS
                        .MARIGOLD_PETAL_DARK;

                for (
                    let i = 0;
                    i < 10;
                    i++
                ) {
                    const ang =
                        (
                            i * 36
                        ) *
                            Math.PI /
                            180;

                    ctx.beginPath();

                    ctx.arc(
                        Math.cos(ang) *
                            (
                                it.radius *
                                0.65
                            ),

                        Math.sin(ang) *
                            (
                                it.radius *
                                0.65
                            ),

                        it.radius * 0.45,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();
                }

                // Middle petals

                ctx.fillStyle =
                    this.COLORS
                        .MARIGOLD_PETAL_MID;

                for (
                    let i = 0;
                    i < 8;
                    i++
                ) {
                    const ang =
                        (
                            i * 45 + 20
                        ) *
                            Math.PI /
                            180;

                    ctx.beginPath();

                    ctx.arc(
                        Math.cos(ang) *
                            (
                                it.radius *
                                0.4
                            ),

                        Math.sin(ang) *
                            (
                                it.radius *
                                0.4
                            ),

                        it.radius * 0.35,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();
                }

                // Center

                ctx.fillStyle =
                    this.COLORS
                        .MARIGOLD_PETAL_BRIGHT;

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    it.radius * 0.35,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.restore();
            } else {
                // FIRECRACKER

                ctx.save();

                ctx.translate(
                    it.x,
                    it.y
                );

                ctx.fillStyle =
                    this.COLORS.FIRECRACKER;

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    it.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.fillStyle =
                    "#ffcf70";

                ctx.font =
                    "bold 13px sans-serif";

                ctx.textAlign =
                    "center";

                ctx.fillText(
                    "💥",
                    0,
                    5
                );

                ctx.restore();
            }
        });
    }

    // ============================================================
    // ELEPHANT
    // ============================================================

    drawRoyalElephant() {
        const ctx = this.ctx;

        const ex =
            Number.isFinite(
                this.elephantX
            )
                ? this.elephantX
                : 0;

        const ey =
            Number.isFinite(
                this.elephantY
            )
                ? this.elephantY
                : 0;

        const scale =
            this.isMobile
                ? 0.88
                : 1;

        ctx.save();

        // Body

        ctx.fillStyle =
            this.COLORS.ELEPHANT;

        ctx.beginPath();

        ctx.arc(
            ex,
            ey,
            32 * scale,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Ears

        ctx.beginPath();

        ctx.ellipse(
            ex - 28 * scale,
            ey - 4 * scale,
            12 * scale,
            18 * scale,
            -0.3,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            ex + 28 * scale,
            ey - 4 * scale,
            12 * scale,
            18 * scale,
            0.3,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Caparison

        ctx.fillStyle =
            this.COLORS.CAPARISON;

        ctx.fillRect(
            ex - 24 * scale,
            ey - 24 * scale,
            48 * scale,
            42 * scale
        );

        ctx.strokeStyle =
            this.COLORS.GOLD;

        ctx.lineWidth =
            2.5 * scale;

        ctx.strokeRect(
            ex - 24 * scale,
            ey - 24 * scale,
            48 * scale,
            42 * scale
        );

        // Golden Howdah

        ctx.fillStyle =
            this.COLORS.GOLD;

        ctx.beginPath();

        ctx.arc(
            ex,
            ey - 22 * scale,
            16 * scale,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#160920";

        ctx.font =
            `${Math.max(
                9,
                Math.round(12 * scale)
            )}px sans-serif`;

        ctx.textAlign =
            "center";

        ctx.fillText(
            "👑",
            ex,
            ey - 18 * scale
        );

        // Tilak

        ctx.fillStyle =
            "#ffd15c";

        ctx.beginPath();

        ctx.moveTo(
            ex,
            ey + 4 * scale
        );

        ctx.lineTo(
            ex - 6 * scale,
            ey + 18 * scale
        );

        ctx.lineTo(
            ex + 6 * scale,
            ey + 18 * scale
        );

        ctx.closePath();

        ctx.fill();

        // Tusks

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth =
            3.5 * scale;

        ctx.beginPath();

        ctx.moveTo(
            ex - 10 * scale,
            ey + 24 * scale
        );

        ctx.lineTo(
            ex - 16 * scale,
            ey + 38 * scale
        );

        ctx.moveTo(
            ex + 10 * scale,
            ey + 24 * scale
        );

        ctx.lineTo(
            ex + 16 * scale,
            ey + 38 * scale
        );

        ctx.stroke();

        ctx.restore();
    }

    // ============================================================
    // PARTICLES
    // ============================================================

    drawParticles() {
        const ctx = this.ctx;

        if (
            !Array.isArray(
                this.particles
            )
        ) {
            return;
        }

        this.particles.forEach((p) => {
            if (
                !p ||
                !Number.isFinite(p.x) ||
                !Number.isFinite(p.y)
            ) {
                return;
            }

            ctx.fillStyle =
                p.color ||
                "#ffd15c";

            ctx.globalAlpha =
                Math.max(
                    0,
                    Math.min(
                        1,
                        Number.isFinite(
                            p.life
                        ) &&
                        Number.isFinite(
                            p.maxLife
                        ) &&
                        p.maxLife > 0
                            ? p.life /
                              p.maxLife
                            : 1
                    )
                );

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                3.5,
                0,
                Math.PI * 2
            );

            ctx.fill();
        });

        ctx.globalAlpha = 1;
    }

    // ============================================================
    // END SCREEN
    // ============================================================

    drawEnd() {
        const ctx = this.ctx;

        let startX = this.isMobile
            ? 0
            : this.sidebarWidth;

        let availableWidth =
            this.width - startX;

        const cx =
            startX +
            availableWidth / 2;

        const cy =
            this.isMobile
                ? this.height / 2
                : this.height / 2;

        const won =
            this.paradeHarmony > 0 &&
            this.currentRound >=
                this.totalRounds;

        ctx.fillStyle =
            "rgba(17, 6, 25, 0.94)";

        ctx.fillRect(
            startX,
            0,
            availableWidth,
            this.height
        );

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            won
                ? this.COLORS.GOLD
                : "#ff7a7a";

        ctx.font =
            this.isMobile
                ? "bold 21px Cinzel, serif"
                : "bold 28px Cinzel, serif";

        ctx.fillText(
            won
                ? "Grand Dasara Procession Complete!"
                : "Procession Disrupted!",
            cx,
            cy - 18
        );

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            this.isMobile
                ? "12px Poppins, sans-serif"
                : "14px Poppins, sans-serif";

        const message =
            won
                ? "The Golden Howdah entered the palace gates in triumph."
                : "Harmony was depleted before reaching the palace.";

        wrapTextMy(
            ctx,
            message,
            cx,
            cy + 15,
            Math.min(
                availableWidth - 40,
                480
            ),
            18,
            true
        );
    }
}

// ================================================================
// TEXT WRAPPER
// ================================================================

function wrapTextMy(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    centered = false
) {
    if (
        !text ||
        !ctx
    ) {
        return;
    }

    const words =
        String(text).split(" ");

    let line = "";
    let curY = y;

    const previousAlign =
        ctx.textAlign;

    if (centered) {
        ctx.textAlign = "center";
    }

    for (
        const word of words
    ) {
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

    if (line) {
        ctx.fillText(
            line,
            x,
            curY
        );
    }

    ctx.textAlign =
        previousAlign;
}