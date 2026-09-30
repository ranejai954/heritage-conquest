/* ============================================================
   CHARMINAR — BAZAAR TREASURE HUNT
   Fully isolated responsive version

   Supports:
   - Desktop keyboard
   - Mobile touch controls
   - Mouse controls
   - Responsive canvas
   - Portrait phones
   - Landscape phones
   - 2 rounds
   - Treasures
   - Guards
   - Timers
   ============================================================ */

window.charminarInstance = null;
window.onCharminarEnd = null;


/* ============================================================
   START GAME
   ============================================================ */

function startCharminarGame(canvasId, onComplete) {

    const oldGame = window.charminarInstance;

    if (oldGame) {
        oldGame.cleanup();
        window.charminarInstance = null;
    }

    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error(
            "Charminar Game: Canvas not found:",
            canvasId
        );

        if (onComplete) {
            onComplete(false);
        }

        return;
    }

    window.onCharminarEnd = (success) => {

        if (window.charminarInstance) {

            window.charminarInstance.cleanup();

            window.charminarInstance = null;
        }

        if (onComplete) {
            onComplete(success);
        }
    };

    window.charminarInstance =
        new CharminarGame(canvas);

    window.charminarInstance.startGame();
}


/* ============================================================
   GAME CLASS
   ============================================================ */

class CharminarGame {

    constructor(canvas) {

        this.canvas = canvas;

        this.ctx = canvas.getContext("2d");

        if (!this.ctx) {
            console.error(
                "Charminar Game: Canvas 2D context unavailable."
            );

            return;
        }


        /* ----------------------------------------------------
           COLORS
           ---------------------------------------------------- */

        this.COLORS = {

            BG: "#2a160c",

            SIDEBAR_BG: "#1c0f07",

            BORDER: "#c1502e",

            PATH: "#7a4a2a",

            WALL: "#3a1f10",

            PLAYER: "#ffcf70",

            TREASURE: "#8fffb0",

            GUARD: "#ff5252",

            TEXT: "#fdf3e2",

            TEXT_DIM: "#c9a97a"
        };


        /* ----------------------------------------------------
           ROUND CONFIG
           ---------------------------------------------------- */

        this.roundConfigs = [

            {
                cols: 8,
                rows: 6,

                cellSize: 54,

                treasureTotal: 4,

                timeLimit: 36,

                guards: 1,

                guardSpeed: 0.9
            },

            {
                cols: 11,
                rows: 7,

                cellSize: 46,

                treasureTotal: 6,

                timeLimit: 45,

                guards: 2,

                guardSpeed: 1.1
            }
        ];


        /* ----------------------------------------------------
           GAME STATE
           ---------------------------------------------------- */

        this.currentRound = 0;

        this.state = "MENU";

        this.isRunning = false;

        this.width = 1;

        this.height = 1;

        this.dpr = 1;

        this.sidebarWidth = 280;

        this.areaX = 280;

        this.areaW = 1;

        this.offsetX = 0;

        this.offsetY = 0;


        /* ----------------------------------------------------
           BIND EVENTS
           ---------------------------------------------------- */

        this.boundKey =
            (e) => this.handleKey(e);

        this.boundResize =
            () => this.resize();

        this.boundOrientation =
            () => this.resize();

        this.boundVisibility =
            () => this.handleVisibility();


        window.addEventListener(
            "keydown",
            this.boundKey
        );

        window.addEventListener(
            "resize",
            this.boundResize
        );

        window.addEventListener(
            "orientationchange",
            this.boundOrientation
        );

        document.addEventListener(
            "visibilitychange",
            this.boundVisibility
        );


        /* ----------------------------------------------------
           INITIAL SIZE
           ---------------------------------------------------- */

        this.resize();
    }


    /* ========================================================
       CLEANUP
       ======================================================== */

    cleanup() {

        this.isRunning = false;


        window.removeEventListener(
            "keydown",
            this.boundKey
        );

        window.removeEventListener(
            "resize",
            this.boundResize
        );

        window.removeEventListener(
            "orientationchange",
            this.boundOrientation
        );

        document.removeEventListener(
            "visibilitychange",
            this.boundVisibility
        );


        if (this.controlsEl) {

            this.controlsEl.remove();

            this.controlsEl = null;
        }


        if (this.roundTimeout) {

            clearTimeout(
                this.roundTimeout
            );

            this.roundTimeout = null;
        }


        if (this.finishTimeout) {

            clearTimeout(
                this.finishTimeout
            );

            this.finishTimeout = null;
        }
    }


    /* ========================================================
       VISIBILITY
       ======================================================== */

    handleVisibility() {

        if (document.hidden) {

            this.lastTick = Date.now();
        }
    }


    /* ========================================================
       RESIZE
       ======================================================== */

    resize() {

        if (!this.canvas) {
            return;
        }


        const rect =
            this.canvas.getBoundingClientRect();


        let cssWidth =
            Math.floor(rect.width);

        let cssHeight =
            Math.floor(rect.height);


        /*
         * Fallback for unusual parent layouts.
         */

        if (cssWidth <= 0) {

            cssWidth =
                this.canvas.parentElement?.clientWidth ||
                window.innerWidth;
        }


        if (cssHeight <= 0) {

            cssHeight =
                this.canvas.parentElement?.clientHeight ||
                window.innerHeight;
        }


        this.width =
            Math.max(1, cssWidth);

        this.height =
            Math.max(1, cssHeight);


        this.dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        /*
         * Real canvas resolution.
         */

        this.canvas.width =
            Math.round(
                this.width * this.dpr
            );

        this.canvas.height =
            Math.round(
                this.height * this.dpr
            );


        /*
         * Draw using CSS pixels.
         */

        this.ctx.setTransform(
            this.dpr,
            0,
            0,
            this.dpr,
            0,
            0
        );


        /*
         * Mobile layout.
         *
         * IMPORTANT:
         * We don't actually draw a giant sidebar on mobile.
         * Instead, the sidebar becomes a compact HUD at top.
         */

        const mobile =
            this.width <= 700;


        if (mobile) {

            this.sidebarWidth = 0;

            this.areaX = 0;

            this.areaW = this.width;

        } else {

            this.sidebarWidth =
                Math.min(
                    280,
                    Math.max(
                        250,
                        this.width * 0.25
                    )
                );

            this.areaX =
                this.sidebarWidth;

            this.areaW =
                Math.max(
                    1,
                    this.width -
                    this.sidebarWidth
                );
        }


        if (this.cols) {

            this.calculateMobileCellSize();

            this.recalcOffsets();
        }
    }


    /* ========================================================
       CELL SIZE
       ======================================================== */

    calculateMobileCellSize() {

        if (!this.cols || !this.rows) {
            return;
        }


        const mobile =
            this.width <= 700;


        const cfg =
            this.roundConfigs[
                this.currentRound
            ];


        this.cellSize =
            cfg.cellSize;


        if (!mobile) {
            return;
        }


        /*
         * Keep enough room for the HUD.
         */

        const topReserved =
            this.height < 500
                ? 90
                : 115;


        /*
         * Keep the maze away from the
         * touch controller.
         */

        const horizontalPadding =
            this.width < 400
                ? 12
                : 18;


        const availableWidth =
            this.width -
            horizontalPadding * 2;


        const availableHeight =
            this.height -
            topReserved -
            18;


        const sizeByWidth =
            Math.floor(
                availableWidth /
                this.cols
            );


        const sizeByHeight =
            Math.floor(
                availableHeight /
                this.rows
            );


        this.cellSize =
            Math.max(
                22,
                Math.min(
                    cfg.cellSize,
                    sizeByWidth,
                    sizeByHeight
                )
            );
    }


    /* ========================================================
       OFFSET
       ======================================================== */

    recalcOffsets() {

        if (!this.cols || !this.rows) {
            return;
        }


        const mazeWidth =
            this.cols *
            this.cellSize;


        const mazeHeight =
            this.rows *
            this.cellSize;


        const mobile =
            this.width <= 700;


        if (mobile) {

            /*
             * Maze centered in the available canvas.
             */

            this.offsetX =
                Math.max(
                    8,
                    (this.width - mazeWidth) / 2
                );


            /*
             * Leave room for HUD.
             */

            const topSpace =
                this.height < 500
                    ? 90
                    : 110;


            const bottomSpace =
                this.height < 500
                    ? 15
                    : 20;


            const availableHeight =
                this.height -
                topSpace -
                bottomSpace;


            this.offsetY =
                topSpace +
                Math.max(
                    0,
                    (availableHeight -
                        mazeHeight) / 2
                );

        } else {

            this.offsetX =
                this.areaX +
                Math.max(
                    0,
                    (
                        this.areaW -
                        mazeWidth
                    ) / 2
                );


            this.offsetY =
                Math.max(
                    10,
                    (
                        this.height -
                        mazeHeight
                    ) / 2
                );
        }
    }


    /* ========================================================
       START
       ======================================================== */

    startGame() {

        if (!this.ctx) {
            return;
        }


        this.currentRound = 0;

        this.isRunning = true;


        this.buildTouchControls();


        this.loadRound(0);


        this.lastTick =
            Date.now();


        this.loop();
    }


    /* ========================================================
       LOAD ROUND
       ======================================================== */

    loadRound(roundIdx) {

        if (
            roundIdx < 0 ||
            roundIdx >=
            this.roundConfigs.length
        ) {
            return;
        }


        this.currentRound =
            roundIdx;


        const cfg =
            this.roundConfigs[
                roundIdx
            ];


        this.cols =
            cfg.cols;

        this.rows =
            cfg.rows;

        this.cellSize =
            cfg.cellSize;


        this.treasureTotal =
            cfg.treasureTotal;


        this.timeLeft =
            cfg.timeLimit;


        this.guardInterval =
            cfg.guardSpeed;


        this.collected = 0;


        this.calculateMobileCellSize();

        this.recalcOffsets();


        this.generateOpenMaze();


        this.placeEntities(
            cfg.guards
        );


        this.state =
            "PREPARE";


        this.prepTimer =
            2.0;


        this.guardMoveTimer =
            0;


        this.lastTick =
            Date.now();
    }


    /* ========================================================
       MOBILE CONTROLS
       ======================================================== */

    buildTouchControls() {

        /*
         * Remove old controls.
         */

        if (this.controlsEl) {

            this.controlsEl.remove();
        }


        const root =
            document.getElementById(
                "charminar-game-root"
            );


        if (!root) {

            console.warn(
                "Charminar: #charminar-game-root not found."
            );

            return;
        }


        const controls =
            document.createElement("div");


        controls.className =
            "charminar-controls";


        controls.innerHTML = `

            <button
                class="charminar-control"
                data-dir="N"
                type="button"
                aria-label="Move up"
            >
                ▲
            </button>

            <button
                class="charminar-control"
                data-dir="W"
                type="button"
                aria-label="Move left"
            >
                ◀
            </button>

            <button
                class="charminar-control"
                data-dir="S"
                type="button"
                aria-label="Move down"
            >
                ▼
            </button>

            <button
                class="charminar-control"
                data-dir="E"
                type="button"
                aria-label="Move right"
            >
                ▶
            </button>

        `;


        root.appendChild(
            controls
        );


        this.controlsEl =
            controls;


        /*
         * Pointer events work for:
         *
         * - touch
         * - mouse
         * - stylus
         */

        controls
            .querySelectorAll(
                ".charminar-control"
            )
            .forEach((button) => {

                const move = (event) => {

                    event.preventDefault();

                    const dir =
                        button.dataset.dir;

                    button.classList.add(
                        "pressed"
                    );


                    this.tryMove(dir);


                    /*
                     * Remove visual pressed
                     * state shortly after.
                     */

                    setTimeout(() => {

                        button.classList.remove(
                            "pressed"
                        );

                    }, 90);
                };


                button.addEventListener(
                    "pointerdown",
                    move,
                    {
                        passive: false
                    }
                );


                button.addEventListener(
                    "contextmenu",
                    (e) => {
                        e.preventDefault();
                    }
                );
            });
    }


    /* ========================================================
       KEYBOARD
       ======================================================== */

    handleKey(e) {

        if (
            !this.isRunning ||
            this.state !== "PLAYING"
        ) {
            return;
        }


        const map = {

            ArrowUp: "N",

            ArrowDown: "S",

            ArrowLeft: "W",

            ArrowRight: "E",

            w: "N",
            W: "N",

            s: "S",
            S: "S",

            a: "W",
            A: "W",

            d: "E",
            D: "E"
        };


        const dir =
            map[e.key];


        if (dir) {

            e.preventDefault();

            this.tryMove(dir);
        }
    }


    /* ========================================================
       MOVE PLAYER
       ======================================================== */

    tryMove(dir) {

        if (
            !this.isRunning ||
            this.state !== "PLAYING"
        ) {
            return;
        }


        const cell =
            this.cells[
                this.player.y
            ][
                this.player.x
            ];


        /*
         * Wall exists.
         */

        if (cell[dir]) {
            return;
        }


        const deltas = {

            N: [0, -1],

            S: [0, 1],

            E: [1, 0],

            W: [-1, 0]
        };


        const delta =
            deltas[dir];


        if (!delta) {
            return;
        }


        const [dx, dy] =
            delta;


        const nx =
            this.player.x + dx;

        const ny =
            this.player.y + dy;


        /*
         * Safety check.
         */

        if (
            nx < 0 ||
            nx >= this.cols ||
            ny < 0 ||
            ny >= this.rows
        ) {
            return;
        }


        this.player.x =
            nx;

        this.player.y =
            ny;


        this.checkCollisions();
    }


    /* ========================================================
       MAZE GENERATION
       ======================================================== */

    generateOpenMaze() {

        const {
            cols,
            rows
        } = this;


        this.cells = [];


        for (
            let y = 0;
            y < rows;
            y++
        ) {

            const row = [];


            for (
                let x = 0;
                x < cols;
                x++
            ) {

                row.push({

                    N: true,

                    S: true,

                    E: true,

                    W: true,

                    visited: false
                });
            }


            this.cells.push(row);
        }


        /*
         * DFS maze generation.
         */

        const stack = [];


        let cx = 0;
        let cy = 0;


        this.cells[cy][cx]
            .visited = true;


        stack.push([
            cx,
            cy
        ]);


        const dirs = [

            ["N", 0, -1, "S"],

            ["S", 0, 1, "N"],

            ["E", 1, 0, "W"],

            ["W", -1, 0, "E"]
        ];


        while (stack.length) {

            [
                cx,
                cy
            ] =
                stack[
                    stack.length - 1
                ];


            const options = [];


            for (
                const [
                    dir,
                    dx,
                    dy,
                    opposite
                ] of dirs
            ) {

                const nx =
                    cx + dx;

                const ny =
                    cy + dy;


                if (
                    nx >= 0 &&
                    nx < cols &&
                    ny >= 0 &&
                    ny < rows &&
                    !this.cells[ny][nx].visited
                ) {

                    options.push([
                        dir,
                        nx,
                        ny,
                        opposite
                    ]);
                }
            }


            if (
                options.length === 0
            ) {

                stack.pop();

                continue;
            }


            const [
                dir,
                nx,
                ny,
                opposite
            ] =
                options[
                    Math.floor(
                        Math.random() *
                        options.length
                    )
                ];


            this.cells[cy][cx][dir] =
                false;


            this.cells[ny][nx][opposite] =
                false;


            this.cells[ny][nx].visited =
                true;


            stack.push([
                nx,
                ny
            ]);
        }


        /*
         * Add loops.
         */

        for (
            let y = 1;
            y < rows - 1;
            y++
        ) {

            for (
                let x = 1;
                x < cols - 1;
                x++
            ) {

                if (
                    Math.random() <
                    0.30
                ) {

                    this.cells[y][x].E =
                        false;

                    this.cells[y][x + 1].W =
                        false;
                }
            }
        }
    }


    /* ========================================================
       ENTITY PLACEMENT
       ======================================================== */

    placeEntities(guardCount) {

        this.player = {
            x: 0,
            y: 0
        };


        const candidates = [];


        for (
            let y = 0;
            y < this.rows;
            y++
        ) {

            for (
                let x = 0;
                x < this.cols;
                x++
            ) {

                if (
                    x === 0 &&
                    y === 0
                ) {
                    continue;
                }


                candidates.push({
                    x,
                    y
                });
            }
        }


        shuffleC(
            candidates
        );


        /*
         * Treasures.
         */

        this.treasures =
            candidates
                .slice(
                    0,
                    this.treasureTotal
                )
                .map((c) => ({
                    ...c,
                    found: false
                }));


        /*
         * Guards are placed away from
         * starting point.
         */

        this.guards = [];


        const guardSpawns =
            candidates.filter(
                (c) =>
                    c.x + c.y >=
                    Math.floor(
                        (
                            this.cols +
                            this.rows
                        ) * 0.6
                    )
            );


        for (
            let i = 0;
            i < guardCount;
            i++
        ) {

            if (guardSpawns[i]) {

                this.guards.push({

                    x:
                        guardSpawns[i].x,

                    y:
                        guardSpawns[i].y,

                    lastDir: null
                });
            }
        }
    }


    /* ========================================================
       COLLISIONS
       ======================================================== */

    checkCollisions() {

        /*
         * Treasures.
         */

        for (
            const treasure
            of this.treasures
        ) {

            if (
                !treasure.found &&
                treasure.x ===
                    this.player.x &&
                treasure.y ===
                    this.player.y
            ) {

                treasure.found = true;

                this.collected++;


                if (
                    this.collected ===
                    this.treasureTotal
                ) {

                    if (
                        this.currentRound + 1 <
                        this.roundConfigs.length
                    ) {

                        this.state =
                            "PREPARE";


                        this.prepTimer =
                            2.0;


                        this.roundTimeout =
                            setTimeout(
                                () => {

                                    this.loadRound(
                                        this.currentRound + 1
                                    );

                                },
                                500
                            );

                    } else {

                        this.finish(
                            true
                        );
                    }
                }
            }
        }


        /*
         * Guards.
         */

        for (
            const guard
            of this.guards
        ) {

            if (
                guard.x ===
                    this.player.x &&
                guard.y ===
                    this.player.y
            ) {

                this.finish(
                    false,
                    "Intercepted by a market guard!"
                );

                return;
            }
        }
    }


    /* ========================================================
       GUARDS
       ======================================================== */

    updateGuards(dt) {

        this.guardMoveTimer += dt;


        if (
            this.guardMoveTimer <
            this.guardInterval
        ) {
            return;
        }


        this.guardMoveTimer =
            0;


        const dirs = [

            {
                dir: "N",
                dx: 0,
                dy: -1
            },

            {
                dir: "S",
                dx: 0,
                dy: 1
            },

            {
                dir: "E",
                dx: 1,
                dy: 0
            },

            {
                dir: "W",
                dx: -1,
                dy: 0
            }
        ];


        for (
            const guard
            of this.guards
        ) {

            const cell =
                this.cells[
                    guard.y
                ][
                    guard.x
                ];


            const possible =
                dirs.filter(
                    (d) =>
                        !cell[d.dir]
                );


            if (
                possible.length === 0
            ) {
                continue;
            }


            const choice =
                possible[
                    Math.floor(
                        Math.random() *
                        possible.length
                    )
                ];


            const nx =
                guard.x +
                choice.dx;

            const ny =
                guard.y +
                choice.dy;


            if (
                nx >= 0 &&
                nx < this.cols &&
                ny >= 0 &&
                ny < this.rows
            ) {

                guard.x =
                    nx;

                guard.y =
                    ny;
            }
        }


        this.checkCollisions();
    }


    /* ========================================================
       FINISH
       ======================================================== */

    finish(
        success,
        msg
    ) {

        if (
            this.state === "END"
        ) {
            return;
        }


        this.state =
            "END";


        this.endSuccess =
            success;


        this.endMsg =
            msg ||
            (
                success
                    ? "All bazaar treasures recovered!"
                    : "Out of time!"
            );


        this.finishTimeout =
            setTimeout(
                () => {

                    if (
                        window.onCharminarEnd
                    ) {

                        window.onCharminarEnd(
                            success
                        );
                    }

                },
                1500
            );
    }


    /* ========================================================
       UPDATE
       ======================================================== */

    update() {

        if (!this.isRunning) {
            return;
        }


        const now =
            Date.now();


        let dt =
            (
                now -
                this.lastTick
            ) / 1000;


        /*
         * Protect against tab switching /
         * phone backgrounding.
         */

        dt =
            Math.min(
                dt,
                0.1
            );


        this.lastTick =
            now;


        if (
            this.state ===
            "PREPARE"
        ) {

            this.prepTimer -= dt;


            if (
                this.prepTimer <= 0
            ) {

                this.prepTimer = 0;

                this.state =
                    "PLAYING";
            }


            return;
        }


        if (
            this.state !==
            "PLAYING"
        ) {
            return;
        }


        this.timeLeft -= dt;


        this.updateGuards(
            dt
        );


        if (
            this.timeLeft <= 0
        ) {

            this.timeLeft = 0;

            this.finish(
                false
            );
        }
    }


    /* ========================================================
       MAIN LOOP
       ======================================================== */

    loop() {

        if (
            !this.isRunning
        ) {
            return;
        }


        this.update();

        this.draw();


        requestAnimationFrame(
            () =>
                this.loop()
        );
    }


    /* ========================================================
       DRAW
       ======================================================== */

    draw() {

        const ctx =
            this.ctx;


        ctx.setTransform(
            this.dpr,
            0,
            0,
            this.dpr,
            0,
            0
        );


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


        if (
            this.width <= 700
        ) {

            this.drawMobileHUD();

        } else {

            this.drawSidebar();
        }


        this.drawMaze();

        this.drawTreasures();

        this.drawGuards();

        this.drawPlayer();


        if (
            this.state ===
            "PREPARE"
        ) {

            this.drawPrep();
        }


        if (
            this.state ===
            "END"
        ) {

            this.drawEnd();
        }
    }


    /* ========================================================
       DESKTOP SIDEBAR
       ======================================================== */

    drawSidebar() {

        const ctx =
            this.ctx;


        const w =
            this.sidebarWidth;


        const h =
            this.height;


        const pad =
            20;


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


        ctx.lineWidth =
            2;


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


        let y =
            50;


        ctx.textAlign =
            "left";


        ctx.fillStyle =
            this.COLORS.TREASURE;


        ctx.font =
            "bold 20px Cinzel, serif";


        ctx.fillText(
            `CHARMINAR (${this.currentRound + 1}/2)`,
            pad,
            y
        );


        y += 24;


        ctx.font =
            "13px monospace";


        ctx.fillStyle =
            this.COLORS.TEXT_DIM;


        ctx.fillText(
            `Bazaar Grid: ${this.cols}x${this.rows}`,
            pad,
            y
        );


        y += 35;


        ctx.fillStyle =
            this.COLORS.TEXT;


        ctx.font =
            "13px monospace";


        [
            "> Arrows or WASD to navigate",
            "> Snag all the glowing gems",
            "> Keep clear of red sentries"
        ].forEach(
            (line) => {

                ctx.fillText(
                    line,
                    pad,
                    y
                );

                y += 20;
            }
        );


        y += 25;


        ctx.font =
            "bold 13px monospace";


        ctx.fillText(
            "TREASURES COLLECTED:",
            pad,
            y
        );


        y += 10;


        const barW =
            w - pad * 2;


        const barH =
            16;


        ctx.fillStyle =
            "#3a2410";


        ctx.fillRect(
            pad,
            y,
            barW,
            barH
        );


        ctx.fillStyle =
            this.COLORS.TREASURE;


        ctx.fillRect(
            pad,
            y,
            barW *
                (
                    this.collected /
                    this.treasureTotal
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


        y += 28;


        ctx.fillStyle =
            this.COLORS.TEXT;


        ctx.font =
            "15px monospace";


        ctx.fillText(
            `${this.collected} / ${this.treasureTotal}`,
            pad,
            y
        );


        y += 35;


        ctx.fillStyle =
            this.timeLeft < 10
                ? this.COLORS.GUARD
                : this.COLORS.TEXT_DIM;


        ctx.font =
            "bold 16px monospace";


        const secs =
            Math.max(
                0,
                Math.ceil(
                    this.timeLeft
                )
            );


        ctx.fillText(
            `Time Left: ${secs}s`,
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
            "italic 11px Poppins, sans-serif";


        wrapText3(
            ctx,
            fact,
            pad,
            h - 50,
            w - pad * 2,
            15
        );
    }


    /* ========================================================
       MOBILE HUD
       ======================================================== */

    drawMobileHUD() {

        const ctx =
            this.ctx;


        /*
         * Top HUD background.
         */

        const hudHeight =
            this.height < 500
                ? 76
                : 94;


        ctx.fillStyle =
            "rgba(28,15,7,0.96)";


        ctx.fillRect(
            0,
            0,
            this.width,
            hudHeight
        );


        ctx.strokeStyle =
            this.COLORS.BORDER;


        ctx.lineWidth =
            1.5;


        ctx.beginPath();

        ctx.moveTo(
            0,
            hudHeight
        );

        ctx.lineTo(
            this.width,
            hudHeight
        );

        ctx.stroke();


        ctx.textAlign =
            "center";


        /*
         * Title.
         */

        ctx.fillStyle =
            this.COLORS.TREASURE;


        ctx.font =
            this.height < 500
                ? "bold 15px Cinzel, serif"
                : "bold 17px Cinzel, serif";


        ctx.fillText(
            `CHARMINAR • ROUND ${this.currentRound + 1}/2`,
            this.width / 2,
            23
        );


        /*
         * Stats.
         */

        const statsY =
            this.height < 500
                ? 50
                : 60;


        ctx.font =
            "bold 12px monospace";


        ctx.fillStyle =
            this.COLORS.TEXT;


        ctx.fillText(
            `💎 ${this.collected}/${this.treasureTotal}`,
            this.width * 0.25,
            statsY
        );


        ctx.fillStyle =
            this.timeLeft < 10
                ? this.COLORS.GUARD
                : this.COLORS.TEXT;


        const seconds =
            Math.max(
                0,
                Math.ceil(
                    this.timeLeft
                )
            );


        ctx.fillText(
            `⏱ ${seconds}s`,
            this.width * 0.75,
            statsY
        );


        /*
         * Progress bar.
         */

        const barWidth =
            Math.min(
                this.width - 30,
                360
            );


        const barX =
            (this.width - barWidth) / 2;


        const barY =
            statsY + 12;


        ctx.fillStyle =
            "#3a2410";


        ctx.fillRect(
            barX,
            barY,
            barWidth,
            7
        );


        ctx.fillStyle =
            this.COLORS.TREASURE;


        ctx.fillRect(
            barX,
            barY,
            barWidth *
                (
                    this.collected /
                    this.treasureTotal
                ),
            7
        );


        ctx.strokeStyle =
            "rgba(193,80,46,0.7)";


        ctx.strokeRect(
            barX,
            barY,
            barWidth,
            7
        );
    }


    /* ========================================================
       MAZE
       ======================================================== */

    drawMaze() {

        const ctx =
            this.ctx;


        const cs =
            this.cellSize;


        const mazeWidth =
            this.cols * cs;


        const mazeHeight =
            this.rows * cs;


        /*
         * Maze background.
         */

        ctx.fillStyle =
            this.COLORS.PATH;


        ctx.fillRect(
            this.offsetX,
            this.offsetY,
            mazeWidth,
            mazeHeight
        );


        /*
         * Subtle cell texture.
         */

        ctx.fillStyle =
            "rgba(255,207,112,0.025)";


        for (
            let y = 0;
            y < this.rows;
            y++
        ) {

            for (
                let x = 0;
                x < this.cols;
                x++
            ) {

                if (
                    (
                        x + y
                    ) % 2 === 0
                ) {

                    ctx.fillRect(
                        this.offsetX +
                            x * cs,
                        this.offsetY +
                            y * cs,
                        cs,
                        cs
                    );
                }
            }
        }


        /*
         * Walls.
         */

        ctx.strokeStyle =
            this.COLORS.WALL;


        ctx.lineWidth =
            Math.max(
                2,
                cs * 0.065
            );


        ctx.lineCap =
            "round";


        for (
            let y = 0;
            y < this.rows;
            y++
        ) {

            for (
                let x = 0;
                x < this.cols;
                x++
            ) {

                const cell =
                    this.cells[y][x];


                const px =
                    this.offsetX +
                    x * cs;


                const py =
                    this.offsetY +
                    y * cs;


                ctx.beginPath();


                if (cell.N) {

                    ctx.moveTo(
                        px,
                        py
                    );

                    ctx.lineTo(
                        px + cs,
                        py
                    );
                }


                if (cell.S) {

                    ctx.moveTo(
                        px,
                        py + cs
                    );

                    ctx.lineTo(
                        px + cs,
                        py + cs
                    );
                }


                if (cell.W) {

                    ctx.moveTo(
                        px,
                        py
                    );

                    ctx.lineTo(
                        px,
                        py + cs
                    );
                }


                if (cell.E) {

                    ctx.moveTo(
                        px + cs,
                        py
                    );

                    ctx.lineTo(
                        px + cs,
                        py + cs
                    );
                }


                ctx.stroke();
            }
        }


        /*
         * Outer border.
         */

        ctx.strokeStyle =
            this.COLORS.BORDER;


        ctx.lineWidth =
            Math.max(
                2,
                cs * 0.06
            );


        ctx.strokeRect(
            this.offsetX,
            this.offsetY,
            mazeWidth,
            mazeHeight
        );
    }


    /* ========================================================
       TREASURES
       ======================================================== */

    drawTreasures() {

        const ctx =
            this.ctx;


        const cs =
            this.cellSize;


        for (
            const treasure
            of this.treasures
        ) {

            if (
                treasure.found
            ) {
                continue;
            }


            const cx =
                this.offsetX +
                treasure.x * cs +
                cs / 2;


            const cy =
                this.offsetY +
                treasure.y * cs +
                cs / 2;


            const radius =
                Math.max(
                    5,
                    cs * 0.18
                );


            ctx.save();


            ctx.shadowColor =
                this.COLORS.TREASURE;


            ctx.shadowBlur =
                Math.max(
                    8,
                    cs * 0.3
                );


            ctx.fillStyle =
                this.COLORS.TREASURE;


            ctx.beginPath();


            ctx.arc(
                cx,
                cy,
                radius,
                0,
                Math.PI * 2
            );


            ctx.fill();


            ctx.restore();
        }
    }


    /* ========================================================
       GUARDS
       ======================================================== */

    drawGuards() {

        const ctx =
            this.ctx;


        const cs =
            this.cellSize;


        for (
            const guard
            of this.guards
        ) {

            const cx =
                this.offsetX +
                guard.x * cs +
                cs / 2;


            const cy =
                this.offsetY +
                guard.y * cs +
                cs / 2;


            const radius =
                Math.max(
                    6,
                    cs * 0.22
                );


            ctx.save();


            ctx.shadowColor =
                this.COLORS.GUARD;


            ctx.shadowBlur =
                Math.max(
                    8,
                    cs * 0.3
                );


            ctx.fillStyle =
                this.COLORS.GUARD;


            ctx.beginPath();


            ctx.arc(
                cx,
                cy,
                radius,
                0,
                Math.PI * 2
            );


            ctx.fill();


            ctx.restore();
        }
    }


    /* ========================================================
       PLAYER
       ======================================================== */

    drawPlayer() {

        const ctx =
            this.ctx;


        const cs =
            this.cellSize;


        const cx =
            this.offsetX +
            this.player.x * cs +
            cs / 2;


        const cy =
            this.offsetY +
            this.player.y * cs +
            cs / 2;


        const radius =
            Math.max(
                6,
                cs * 0.22
            );


        ctx.save();


        ctx.shadowColor =
            this.COLORS.PLAYER;


        ctx.shadowBlur =
            Math.max(
                8,
                cs * 0.35
            );


        ctx.fillStyle =
            this.COLORS.PLAYER;


        ctx.beginPath();


        ctx.arc(
            cx,
            cy,
            radius,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.restore();
    }


    /* ========================================================
       PREP SCREEN
       ======================================================== */

    drawPrep() {

        const ctx =
            this.ctx;


        const mobile =
            this.width <= 700;


        const cx =
            mobile
                ? this.width / 2
                : this.areaX +
                  this.areaW / 2;


        const cy =
            this.height / 2;


        ctx.fillStyle =
            "rgba(0,0,0,0.78)";


        if (mobile) {

            ctx.fillRect(
                0,
                0,
                this.width,
                this.height
            );

        } else {

            ctx.fillRect(
                this.areaX,
                0,
                this.areaW,
                this.height
            );
        }


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            this.COLORS.TEXT;


        ctx.font =
            mobile
                ? "bold 18px Cinzel, serif"
                : "bold 24px Cinzel, serif";


        ctx.fillText(
            `Round ${this.currentRound + 1}: Collect ${this.treasureTotal} Gems`,
            cx,
            cy - 20
        );


        ctx.fillStyle =
            this.COLORS.TREASURE;


        ctx.font =
            mobile
                ? "bold 42px monospace"
                : "bold 50px monospace";


        ctx.fillText(
            Math.ceil(
                this.prepTimer
            ),
            cx,
            cy + 40
        );
    }


    /* ========================================================
       END SCREEN
       ======================================================== */

    drawEnd() {

        const ctx =
            this.ctx;


        const mobile =
            this.width <= 700;


        const cx =
            mobile
                ? this.width / 2
                : this.areaX +
                  this.areaW / 2;


        const cy =
            this.height / 2;


        ctx.fillStyle =
            "rgba(0,0,0,0.86)";


        if (mobile) {

            ctx.fillRect(
                0,
                0,
                this.width,
                this.height
            );

        } else {

            ctx.fillRect(
                this.areaX,
                0,
                this.areaW,
                this.height
            );
        }


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            this.endSuccess
                ? this.COLORS.TREASURE
                : this.COLORS.GUARD;


        ctx.font =
            mobile
                ? "bold 21px Cinzel, serif"
                : "bold 28px Cinzel, serif";


        /*
         * Wrap long end messages on phones.
         */

        if (
            this.endMsg.length > 30 &&
            mobile
        ) {

            const words =
                this.endMsg.split(" ");


            let line = "";


            const lines = [];


            for (
                const word
                of words
            ) {

                const test =
                    line +
                    word +
                    " ";


                if (
                    ctx.measureText(
                        test
                    ).width >
                        this.width - 40
                ) {

                    lines.push(
                        line.trim()
                    );

                    line =
                        word + " ";

                } else {

                    line = test;
                }
            }


            if (line.trim()) {

                lines.push(
                    line.trim()
                );
            }


            lines.forEach(
                (text, index) => {

                    ctx.fillText(
                        text,
                        cx,
                        cy +
                            (
                                index -
                                (
                                    lines.length -
                                    1
                                ) / 2
                            ) *
                            30
                    );
                }
            );

        } else {

            ctx.fillText(
                this.endMsg,
                cx,
                cy
            );
        }
    }
}


/* ============================================================
   FACTS
   ============================================================ */

CharminarGame.prototype.facts = [

    "Charminar was built in 1591 by Muhammad Quli Qutb Shah.",

    "'Charminar' translates to 'Four Minarets' in Urdu.",

    "It once stood at the centre of a planned city, Hyderabad.",

    "The surrounding Laad Bazaar is famous for bangles and pearls.",

    "An underground tunnel is believed to connect it to Golconda Fort."
];


/* ============================================================
   SHUFFLE
   ============================================================ */

function shuffleC(arr) {

    for (
        let i = arr.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            arr[i],
            arr[j]
        ] =
        [
            arr[j],
            arr[i]
        ];
    }
}


/* ============================================================
   TEXT WRAPPER
   ============================================================ */

function wrapText3(
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

    let curY =
        y;


    for (
        const word
        of words
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
                curY
            );


            line =
                word + " ";


            curY +=
                lineHeight;

        } else {

            line =
                test;
        }
    }


    if (line) {

        ctx.fillText(
            line,
            x,
            curY
        );
    }
}