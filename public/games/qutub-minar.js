// ============================================================
// QUTUB MINAR — STABILIZE THE MINAR
// Responsive PC + Tablet + Mobile Version
// ============================================================

window.qutubInstance = null;
window.onQutubEnd = null;

function startQutubMinarGame(canvasId, onComplete) {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error("Qutub Minar Game: Canvas not found!");
        if (onComplete) onComplete(false);
        return;
    }

    window.onQutubEnd = (success) => {
        if (window.qutubInstance) {
            window.qutubInstance.cleanup();
            window.qutubInstance = null;
        }

        if (onComplete) {
            onComplete(success);
        }
    };

    window.qutubInstance = new QutubMinarGame(canvas);
    window.qutubInstance.startGame();
}


class QutubMinarGame {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        if (!this.ctx) {
            throw new Error(
                "Qutub Minar Game: Canvas 2D context unavailable."
            );
        }

        // --------------------------------------------------------
        // COLORS
        // --------------------------------------------------------

        this.COLORS = {
            BG: "#2a1a0c",
            SIDEBAR_BG: "#1c1006",
            SIDEBAR_BORDER: "#8a5a2b",
            TEXT: "#fdf3e2",
            TEXT_DIM: "#c9a97a",
            LOOSE: "#ffcf70",
            STABLE: "#6b4a2a",
            CRACKED: "#c1502e",
            SUCCESS: "#8fffb0",
            FAIL: "#ff8f6b"
        };

        // --------------------------------------------------------
        // ROUNDS
        // --------------------------------------------------------

        this.rounds = {

            1: {
                rows: 3,
                cols: 3,
                switchInterval: 3.2,
                survivalTime: 12,
                strainGain: 55,
                strainLoss: 45,
                crackedCount: 1,
                title: "Foundation — Ground Level",
                fact:
                    "Qutub Minar was begun in 1199 CE by Qutub-ud-din Aibak."
            },

            2: {
                rows: 3,
                cols: 3,
                switchInterval: 2.6,
                survivalTime: 14,
                strainGain: 70,
                strainLoss: 35,
                crackedCount: 1,
                title: "Mid Tower — Sandstone Bands",
                fact:
                    "The tower mixes red sandstone with marble across its five storeys."
            },

            3: {
                rows: 4,
                cols: 4,
                switchInterval: 2.1,
                survivalTime: 16,
                strainGain: 85,
                strainLoss: 28,
                crackedCount: 2,
                title: "Upper Tower — Near the Cupola",
                fact:
                    "At 73 metres, it's the tallest brick minaret in the world."
            }
        };

        // --------------------------------------------------------
        // GAME STATE
        // --------------------------------------------------------

        this.currentRound = 1;
        this.strain = 0;
        this.stones = [];

        this.isRunning = false;
        this.state = "MENU";

        this.prepTimer = 3;

        // --------------------------------------------------------
        // RESPONSIVE VALUES
        // --------------------------------------------------------

        this.width = 1;
        this.height = 1;

        this.dpr = 1;

        this.isMobile = false;

        this.sidebarWidth = 300;

        this.areaX = 300;
        this.areaW = 1;
        this.areaH = 1;

        this.lastTime = 0;

        this.instructionsSeen = false;

        // --------------------------------------------------------
        // EVENT HANDLERS
        // --------------------------------------------------------

        this.boundPointer = (event) => {
            this.handlePointer(event);
        };

        this.boundResize = () => {
            this.resize();
        };

        this.resizeObserver = null;

        // --------------------------------------------------------
        // POINTER EVENTS
        // --------------------------------------------------------

        this.canvas.addEventListener(
            "pointerdown",
            this.boundPointer,
            { passive: false }
        );

        // Prevent browser gestures while interacting with game
        this.canvas.style.touchAction = "none";

        window.addEventListener(
            "resize",
            this.boundResize
        );

        // --------------------------------------------------------
        // RESIZE OBSERVER
        // --------------------------------------------------------

        if (typeof ResizeObserver !== "undefined") {

            this.resizeObserver =
                new ResizeObserver(() => {
                    this.resize();
                });

            this.resizeObserver.observe(
                this.canvas
            );
        }

        this.resize();
    }


    // ============================================================
    // CLEANUP
    // ============================================================

    cleanup() {

        this.isRunning = false;

        this.canvas.removeEventListener(
            "pointerdown",
            this.boundPointer
        );

        window.removeEventListener(
            "resize",
            this.boundResize
        );

        if (this.resizeObserver) {

            this.resizeObserver.disconnect();

            this.resizeObserver = null;
        }
    }


    // ============================================================
    // RESPONSIVE RESIZE
    // ============================================================

    resize() {

        const rect =
            this.canvas.getBoundingClientRect();

        let width =
            Math.floor(rect.width);

        let height =
            Math.floor(rect.height);

        if (width <= 0 || height <= 0) {
            return;
        }

        this.width = width;
        this.height = height;

        // --------------------------------------------------------
        // DETECT MOBILE / TABLET
        // --------------------------------------------------------

        this.isMobile =
            width <= 700 ||
            window.innerWidth <= 700;

        // --------------------------------------------------------
        // DEVICE PIXEL RATIO
        // --------------------------------------------------------

        this.dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        const internalWidth =
            Math.floor(width * this.dpr);

        const internalHeight =
            Math.floor(height * this.dpr);

        if (
            this.canvas.width !== internalWidth ||
            this.canvas.height !== internalHeight
        ) {

            this.canvas.width =
                internalWidth;

            this.canvas.height =
                internalHeight;
        }

        // Draw using CSS-pixel coordinates
        this.ctx.setTransform(
            this.dpr,
            0,
            0,
            this.dpr,
            0,
            0
        );

        // --------------------------------------------------------
        // RESPONSIVE GAME AREA
        // --------------------------------------------------------

        if (this.isMobile) {

            // On mobile the sidebar becomes a compact HUD
            this.sidebarWidth = 0;

            this.areaX = 0;

            this.areaW = width;

            this.areaH = height;

        } else {

            // Desktop / tablet sidebar
            this.sidebarWidth =
                Math.max(
                    240,
                    Math.min(
                        320,
                        width * 0.28
                    )
                );

            this.areaX =
                this.sidebarWidth;

            this.areaW =
                Math.max(
                    1,
                    width - this.sidebarWidth
                );

            this.areaH =
                height;
        }

        // Rebuild stone positions after resize
        if (this.config) {
            this.generateStones();
        }

        if (this.ctx) {
            this.draw();
        }
    }


    // ============================================================
    // START GAME
    // ============================================================

    startGame() {

        this.isRunning = true;

        this.currentRound = 1;

        this.startRound(1);

        this.lastTime =
            Date.now();

        this.loop();
    }


    // ============================================================
    // START ROUND
    // ============================================================

    startRound(n) {

        this.currentRound = n;

        this.config =
            this.rounds[n];

        this.strain = 0;

        this.stones = [];

        this.generateStones();

        if (!this.instructionsSeen) {

            this.state = "PREPARING";

            this.prepTimer = 3;

            this.lastTime =
                Date.now();

            this.instructionsSeen = true;

        } else {

            this.beginPlay();
        }
    }


    // ============================================================
    // BEGIN PLAY
    // ============================================================

    beginPlay() {

        this.state = "PLAYING";

        this.startTime =
            Date.now() / 1000;

        this.lastChangeTime =
            Date.now() / 1000;

        this.lastTime =
            Date.now();

        this.generateStones();
    }


    // ============================================================
    // GENERATE STONES
    // ============================================================

    generateStones() {

        if (!this.config) {
            return;
        }

        const {
            rows,
            cols,
            crackedCount
        } = this.config;

        this.stones = [];

        // --------------------------------------------------------
        // RESPONSIVE BOARD SIZE
        // --------------------------------------------------------

        const padding =
            this.isMobile ? 24 : 70;

        const topPadding =
            this.isMobile ? 90 : 50;

        const bottomPadding =
            this.isMobile ? 30 : 60;

        const availableW =
            this.areaW - padding * 2;

        const availableH =
            this.areaH -
            topPadding -
            bottomPadding;

        // Board should fit both dimensions
        const maxBoardSize =
            Math.min(
                availableW,
                availableH
            );

        const boardSize =
            Math.max(
                180,
                Math.min(
                    this.isMobile
                        ? 430
                        : 560,
                    maxBoardSize
                )
            );

        const gridW =
            boardSize;

        const gridH =
            boardSize;

        const startX =
            this.areaX +
            (this.areaW - gridW) / 2;

        const startY =
            topPadding +
            Math.max(
                0,
                (availableH - gridH) / 2
            );

        const cellW =
            gridW / cols;

        const cellH =
            gridH / rows;

        // Larger stones on mobile
        const size =
            Math.min(
                cellW,
                cellH
            ) *
            (this.isMobile
                ? 0.78
                : 0.72);

        const total =
            rows * cols;

        const crackedIdx =
            new Set();

        while (
            crackedIdx.size <
            crackedCount
        ) {

            crackedIdx.add(
                Math.floor(
                    Math.random() *
                    total
                )
            );
        }

        for (
            let i = 0;
            i < total;
            i++
        ) {

            const r =
                Math.floor(
                    i / cols
                );

            const c =
                i % cols;

            const cx =
                startX +
                c * cellW +
                cellW / 2;

            const cy =
                startY +
                r * cellH +
                cellH / 2;

            this.stones.push({

                x:
                    cx - size / 2,

                y:
                    cy - size / 2,

                w:
                    size,

                h:
                    size,

                loose:
                    Math.random() < 0.5,

                repaired: false,

                cracked:
                    crackedIdx.has(i),

                flashTime: 0
            });
        }
    }


    // ============================================================
    // POINTER INPUT
    // Works on PC + Mobile + Tablet
    // ============================================================

    handlePointer(event) {

        event.preventDefault();

        if (
            !this.isRunning ||
            this.state !== "PLAYING"
        ) {
            return;
        }

        const rect =
            this.canvas.getBoundingClientRect();

        // Pointer coordinates are already CSS pixels
        const mx =
            event.clientX -
            rect.left;

        const my =
            event.clientY -
            rect.top;

        if (mx < this.areaX) {
            return;
        }

        // --------------------------------------------------------
        // MOBILE TOUCH AREA
        // Slightly larger hitbox for fingers
        // --------------------------------------------------------

        const hitPadding =
            this.isMobile
                ? 10
                : 4;

        for (
            const stone of this.stones
        ) {

            if (
                mx >=
                    stone.x -
                    hitPadding &&

                mx <=
                    stone.x +
                    stone.w +
                    hitPadding &&

                my >=
                    stone.y -
                    hitPadding &&

                my <=
                    stone.y +
                    stone.h +
                    hitPadding &&

                !stone.repaired
            ) {

                stone.flashTime =
                    Date.now() /
                    1000;

                const mult =
                    stone.cracked
                        ? 1.5
                        : 1.0;

                if (!stone.loose) {

                    this.strain +=
                        this.config
                            .strainGain *
                        mult;

                } else {

                    this.strain =
                        Math.max(
                            0,
                            this.strain -
                                this.config
                                    .strainLoss *
                                mult
                        );

                    stone.repaired =
                        true;
                }

                break;
            }
        }
    }


    // ============================================================
    // CHECK CLEAR
    // ============================================================

    checkClear() {

        const looseOnes =
            this.stones.filter(
                (stone) =>
                    stone.loose
            );

        if (
            looseOnes.length === 0
        ) {
            return;
        }

        const allDone =
            looseOnes.every(
                (stone) =>
                    stone.repaired
            );

        if (!allDone) {

            this.strain +=
                60 +
                this.currentRound * 8;
        }
    }


    // ============================================================
    // UPDATE
    // ============================================================

    update() {

        if (!this.isRunning) {
            return;
        }

        const now =
            Date.now();

        const dt =
            Math.min(
                (now - this.lastTime) /
                    1000,
                0.1
            );

        this.lastTime =
            now;

        // --------------------------------------------------------
        // PREPARING
        // --------------------------------------------------------

        if (
            this.state ===
            "PREPARING"
        ) {

            this.prepTimer -= dt;

            if (
                this.prepTimer <= 0
            ) {

                this.beginPlay();
            }

            return;
        }

        if (
            this.state !==
            "PLAYING"
        ) {
            return;
        }

        const t =
            now / 1000;

        // --------------------------------------------------------
        // STONE SWITCH
        // --------------------------------------------------------

        if (
            t -
                this.lastChangeTime >=
            this.config
                .switchInterval
        ) {

            this.checkClear();

            this.generateStones();

            this.lastChangeTime =
                t;
        }

        // --------------------------------------------------------
        // TIMER
        // --------------------------------------------------------

        const elapsed =
            t -
            this.startTime;

        this.strain =
            Math.max(
                0,
                Math.min(
                    this.strain,
                    300
                )
            );

        if (
            this.strain >=
            300
        ) {

            this.finishRound(
                false
            );

        } else if (
            elapsed >=
            this.config
                .survivalTime
        ) {

            this.finishRound(
                true
            );
        }
    }


    // ============================================================
    // FINISH ROUND
    // ============================================================

    finishRound(success) {

        this.state =
            "TRANSITION";

        setTimeout(() => {

            if (!this.isRunning) {
                return;
            }

            if (success) {

                if (
                    this.currentRound <
                    3
                ) {

                    this.startRound(
                        this.currentRound +
                        1
                    );

                } else {

                    this.endGame(
                        true
                    );
                }

            } else {

                this.endGame(
                    false
                );
            }

        }, 1300);
    }


    // ============================================================
    // END GAME
    // ============================================================

    endGame(success) {

        this.state =
            "END";

        setTimeout(() => {

            if (
                this.isRunning &&
                window.onQutubEnd
            ) {

                window.onQutubEnd(
                    success
                );
            }

        }, 900);
    }


    // ============================================================
    // GAME LOOP
    // ============================================================

    loop() {

        if (!this.isRunning) {
            return;
        }

        this.update();

        this.draw();

        requestAnimationFrame(
            () =>
                this.loop()
        );
    }


    // ============================================================
    // RENDER
    // ============================================================

    draw() {

        const ctx =
            this.ctx;

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

        // Mobile uses compact HUD
        if (this.isMobile) {

            this.drawMobileHUD();

        } else {

            this.drawSidebar();
        }

        this.drawFrame();

        if (
            this.state ===
            "PREPARING"
        ) {

            this.drawStones(true);

            this.drawPrepOverlay();

        } else if (
            this.state ===
            "PLAYING"
        ) {

            this.drawStones(false);

            if (
                this.strain > 240
            ) {

                this.drawWarning();
            }

        } else if (
            this.state === "TRANSITION" ||
            this.state === "END"
        ) {

            this.drawMessage(
                this.strain >= 300
                    ? "The tower shifted — try again"
                    : "Stones secured!"
            );
        }
    }


    // ============================================================
    // MOBILE HUD
    // ============================================================

    drawMobileHUD() {

        const ctx =
            this.ctx;

        const h = 82;

        // HUD background
        ctx.fillStyle =
            this.COLORS.SIDEBAR_BG;

        ctx.fillRect(
            0,
            0,
            this.width,
            h
        );

        ctx.strokeStyle =
            this.COLORS.SIDEBAR_BORDER;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            0,
            h
        );

        ctx.lineTo(
            this.width,
            h
        );

        ctx.stroke();

        // --------------------------------------------------------
        // TITLE
        // --------------------------------------------------------

        ctx.textAlign =
            "left";

        ctx.fillStyle =
            this.COLORS.LOOSE;

        ctx.font =
            "bold 17px 'Cinzel', serif";

        ctx.fillText(
            "QUTUB MINAR",
            14,
            25
        );

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.font =
            "11px monospace";

        ctx.fillText(
            `LEVEL ${this.currentRound}/3`,
            14,
            43
        );

        // --------------------------------------------------------
        // TIMER
        // --------------------------------------------------------

        let timeText =
            "0.0s";

        if (
            this.state ===
                "PLAYING" &&
            this.config
        ) {

            const elapsed =
                Date.now() /
                    1000 -
                this.startTime;

            timeText =
                Math.max(
                    0,
                    this.config
                        .survivalTime -
                        elapsed
                ).toFixed(1) +
                "s";
        }

        if (
            this.state ===
            "PREPARING"
        ) {

            timeText =
                "READY";
        }

        ctx.textAlign =
            "right";

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.font =
            "bold 10px monospace";

        ctx.fillText(
            "TIME",
            this.width - 14,
            20
        );

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            "bold 19px monospace";

        ctx.fillText(
            timeText,
            this.width - 14,
            40
        );

        // --------------------------------------------------------
        // STRAIN
        // --------------------------------------------------------

        const barW =
            Math.min(
                150,
                this.width * 0.35
            );

        const barH =
            10;

        const barX =
            this.width -
            barW -
            14;

        const barY =
            53;

        const pct =
            Math.min(
                1,
                this.strain / 300
            );

        ctx.fillStyle =
            "#3a2410";

        ctx.fillRect(
            barX,
            barY,
            barW,
            barH
        );

        ctx.fillStyle =
            pct > 0.8
                ? this.COLORS.FAIL
                : pct > 0.5
                    ? this.COLORS.CRACKED
                    : this.COLORS.SUCCESS;

        ctx.fillRect(
            barX,
            barY,
            barW * pct,
            barH
        );

        ctx.strokeStyle =
            "#8a5a2b";

        ctx.strokeRect(
            barX,
            barY,
            barW,
            barH
        );
    }


    // ============================================================
    // DESKTOP SIDEBAR
    // ============================================================

    drawSidebar() {

        const ctx =
            this.ctx;

        const w =
            this.sidebarWidth;

        const h =
            this.height;

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
            this.COLORS.SIDEBAR_BORDER;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            w,
            0
        );

        ctx.lineTo(
            w,
            h
        );

        ctx.stroke();

        let y = 60;

        ctx.fillStyle =
            this.COLORS.LOOSE;

        ctx.font =
            "bold 22px 'Cinzel', serif";

        ctx.textAlign =
            "left";

        ctx.fillText(
            "QUTUB MINAR",
            pad,
            y
        );

        y += 26;

        ctx.font =
            "14px monospace";

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        wrapText(
            ctx,
            this.config
                ? this.config.title
                : "",
            pad,
            y,
            w - pad * 2,
            18
        );

        y += 42;

        ctx.fillText(
            `Level ${this.currentRound}/3`,
            pad,
            y
        );

        y += 45;

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            "bold 16px monospace";

        ctx.fillText(
            "> HOW TO REPAIR",
            pad,
            y
        );

        y += 26;

        ctx.font =
            "14px monospace";

        ctx.fillStyle =
            this.COLORS.LOOSE;

        wrapText(
            ctx,
            "Click glowing (loose) stones",
            pad,
            y,
            w - pad * 2,
            18
        );

        y += 38;

        ctx.fillStyle =
            this.COLORS.STABLE;

        wrapText(
            ctx,
            "Leave settled stones alone",
            pad,
            y,
            w - pad * 2,
            18
        );

        y += 38;

        ctx.fillStyle =
            this.COLORS.CRACKED;

        wrapText(
            ctx,
            "Cracked stones count double",
            pad,
            y,
            w - pad * 2,
            18
        );

        y += 55;

        // --------------------------------------------------------
        // TIMER
        // --------------------------------------------------------

        let timeText =
            "0.0s";

        if (
            this.state ===
                "PLAYING" &&
            this.config
        ) {

            const elapsed =
                Date.now() /
                    1000 -
                this.startTime;

            timeText =
                Math.max(
                    0,
                    this.config
                        .survivalTime -
                        elapsed
                ).toFixed(1) +
                "s";

        } else if (
            this.state ===
            "PREPARING"
        ) {

            timeText =
                "READY?";
        }

        ctx.fillStyle =
            this.COLORS.TEXT_DIM;

        ctx.font =
            "bold 14px monospace";

        ctx.fillText(
            "TIME LEFT:",
            pad,
            y
        );

        ctx.font =
            "bold 30px monospace";

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.fillText(
            timeText,
            pad,
            y + 34
        );

        y += 90;

        // --------------------------------------------------------
        // STRAIN
        // --------------------------------------------------------

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            "bold 14px monospace";

        ctx.fillText(
            "STRUCTURAL STRAIN:",
            pad,
            y
        );

        y += 12;

        const barW =
            Math.max(
                40,
                w - pad * 2
            );

        const barH = 18;

        ctx.fillStyle =
            "#3a2410";

        ctx.fillRect(
            pad,
            y,
            barW,
            barH
        );

        const pct =
            Math.min(
                1,
                this.strain / 300
            );

        ctx.fillStyle =
            pct > 0.8
                ? this.COLORS.FAIL
                : pct > 0.5
                    ? this.COLORS.CRACKED
                    : this.COLORS.SUCCESS;

        ctx.fillRect(
            pad,
            y,
            barW * pct,
            barH
        );

        ctx.strokeStyle =
            "#8a5a2b";

        ctx.strokeRect(
            pad,
            y,
            barW,
            barH
        );

        // --------------------------------------------------------
        // FACT
        // --------------------------------------------------------

        if (this.config) {

            const factY =
                Math.max(
                    40,
                    h - 70
                );

            ctx.fillStyle =
                this.COLORS.TEXT_DIM;

            ctx.font =
                "italic 12px 'Poppins', sans-serif";

            wrapText(
                ctx,
                this.config.fact,
                pad,
                factY,
                Math.max(
                    40,
                    w - pad * 2
                ),
                16
            );
        }
    }


    // ============================================================
    // FRAME
    // ============================================================

    drawFrame() {

        const ctx =
            this.ctx;

        ctx.save();

        ctx.strokeStyle =
            this.COLORS.SIDEBAR_BORDER;

        ctx.lineWidth = 3;

        const margin =
            this.isMobile
                ? 8
                : 6;

        ctx.strokeRect(
            this.areaX + margin,
            this.isMobile
                ? 88
                : margin,
            Math.max(
                1,
                this.areaW -
                    margin * 2
            ),
            Math.max(
                1,
                this.height -
                    (this.isMobile
                        ? 96
                        : margin * 2)
            )
        );

        ctx.restore();
    }


    // ============================================================
    // PREP OVERLAY
    // ============================================================

    drawPrepOverlay() {

        const ctx =
            this.ctx;

        const cx =
            this.areaX +
            this.areaW / 2;

        const cy =
            this.isMobile
                ? this.height * 0.55
                : this.height / 2;

        ctx.fillStyle =
            "rgba(0,0,0,0.75)";

        ctx.fillRect(
            this.areaX,
            this.isMobile
                ? 82
                : 0,
            this.areaW,
            this.isMobile
                ? this.height - 82
                : this.height
        );

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            this.COLORS.TEXT;

        ctx.font =
            `bold ${
                this.isMobile
                    ? 24
                    : 30
            }px 'Cinzel', serif`;

        ctx.fillText(
            "Get Ready",
            cx,
            cy - 40
        );

        ctx.fillStyle =
            this.COLORS.LOOSE;

        ctx.font =
            `bold ${
                this.isMobile
                    ? 64
                    : 80
            }px monospace`;

        ctx.fillText(
            Math.ceil(
                this.prepTimer
            ),
            cx,
            cy + 40
        );
    }


    // ============================================================
    // STONES
    // ============================================================

    drawStones(dimmed) {

        const ctx =
            this.ctx;

        const opacity =
            dimmed
                ? 0.35
                : 1.0;

        for (
            const stone of this.stones
        ) {

            ctx.fillStyle =
                `rgba(40, 26, 12, ${opacity})`;

            ctx.fillRect(
                stone.x,
                stone.y,
                stone.w,
                stone.h
            );

            ctx.strokeStyle =
                `rgba(138, 90, 43, ${opacity})`;

            ctx.lineWidth = 2;

            ctx.strokeRect(
                stone.x,
                stone.y,
                stone.w,
                stone.h
            );

            let color =
                stone.repaired
                    ? "#2a1a0c"
                    : stone.loose
                        ? this.COLORS.LOOSE
                        : this.COLORS.STABLE;

            if (
                stone.cracked &&
                !stone.repaired
            ) {

                color =
                    this.COLORS.CRACKED;
            }

            if (
                Date.now() / 1000 -
                    stone.flashTime <
                0.12
            ) {

                color = "#fff";
            }

            ctx.globalAlpha =
                opacity;

            ctx.fillStyle =
                color;

            if (
                !dimmed &&
                stone.loose &&
                !stone.repaired
            ) {

                ctx.shadowColor =
                    color;

                ctx.shadowBlur =
                    this.isMobile
                        ? 12
                        : 18;
            }

            const innerPadding =
                this.isMobile
                    ? 5
                    : 6;

            ctx.fillRect(
                stone.x +
                    innerPadding,

                stone.y +
                    innerPadding,

                Math.max(
                    1,
                    stone.w -
                        innerPadding * 2
                ),

                Math.max(
                    1,
                    stone.h -
                        innerPadding * 2
                )
            );

            ctx.shadowBlur = 0;

            ctx.globalAlpha = 1;
        }
    }


    // ============================================================
    // WARNING
    // ============================================================

    drawWarning() {

        const ctx =
            this.ctx;

        const cx =
            this.areaX +
            this.areaW / 2;

        ctx.textAlign =
            "center";

        ctx.font =
            `bold ${
                this.isMobile
                    ? 17
                    : 24
            }px 'Cinzel', serif`;

        const pulse =
            Math.sin(
                Date.now() *
                0.01
            ) *
                0.4 +
            0.6;

        ctx.fillStyle =
            `rgba(255, 143, 107, ${pulse})`;

        ctx.fillText(
            "⚠ The tower is straining!",
            cx,
            this.isMobile
                ? 110
                : 60
        );
    }


    // ============================================================
    // MESSAGE
    // ============================================================

    drawMessage(message) {

        const ctx =
            this.ctx;

        const cx =
            this.areaX +
            this.areaW / 2;

        const cy =
            this.isMobile
                ? this.height * 0.55
                : this.height / 2;

        ctx.fillStyle =
            "rgba(0,0,0,0.85)";

        ctx.fillRect(
            this.areaX,
            this.isMobile
                ? 82
                : 0,
            this.areaW,
            this.isMobile
                ? this.height - 82
                : this.height
        );

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            this.COLORS.TEXT;

        // Wrap long message on mobile
        ctx.font =
            `bold ${
                this.isMobile
                    ? 25
                    : 40
            }px 'Cinzel', serif`;

        wrapTextCentered(
            ctx,
            message,
            cx,
            cy,
            this.areaW -
                (this.isMobile
                    ? 40
                    : 80),
            this.isMobile
                ? 32
                : 48
        );
    }
}


// ============================================================
// TEXT WRAPPING
// ============================================================

function wrapText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
) {

    const words =
        text.split(" ");

    let line = "";

    let currentY =
        y;

    for (
        const word of words
    ) {

        const test =
            line +
            word +
            " ";

        if (
            ctx.measureText(
                test
            ).width >
                maxWidth &&
            line !== ""
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

            line =
                test;
        }
    }

    ctx.fillText(
        line,
        x,
        currentY
    );
}


// ============================================================
// CENTERED TEXT WRAPPING
// ============================================================

function wrapTextCentered(
    ctx,
    text,
    centerX,
    y,
    maxWidth,
    lineHeight
) {

    const words =
        text.split(" ");

    let line = "";

    let currentY =
        y;

    for (
        const word of words
    ) {

        const test =
            line +
            word +
            " ";

        if (
            ctx.measureText(
                test
            ).width >
                maxWidth &&
            line !== ""
        ) {

            ctx.fillText(
                line.trim(),
                centerX,
                currentY
            );

            line =
                word + " ";

            currentY +=
                lineHeight;

        } else {

            line =
                test;
        }
    }

    ctx.fillText(
        line.trim(),
        centerX,
        currentY
    );
}