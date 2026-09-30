// js/golden-temple.js
// "Piece Together the Golden Temple" — 2 rounds of jigsaw assembly.
// Shows the complete artwork preview first so players can memorize the composition
// before assembling on an empty grid.

window.goldenTempleInstance = null;
window.onGoldenTempleEnd = null;

function startGoldenTempleGame(containerId, onComplete) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Golden Temple Game: container not found!");
        if (onComplete) onComplete(false);
        return;
    }

    window.onGoldenTempleEnd = (success) => {
        if (window.goldenTempleInstance) {
            window.goldenTempleInstance.cleanup();
            window.goldenTempleInstance = null;
        }
        if (onComplete) onComplete(success);
    };

    window.goldenTempleInstance = new GoldenTemplePuzzle(container);
    window.goldenTempleInstance.start();
}

function createGoldenTempleArt(roundNum) {
    const isNight = roundNum === 2;

    if (!isNight) {
        // Round 1: Radiant Daylight at Harmandir Sahib
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" width="900" height="675">
            <defs>
                <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ff9a3c"/>
                    <stop offset="35%" stop-color="#f6c28b"/>
                    <stop offset="70%" stop-color="#fef6e4"/>
                    <stop offset="100%" stop-color="#bce7fd"/>
                </linearGradient>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#ffe259"/>
                    <stop offset="50%" stop-color="#ffa751"/>
                    <stop offset="100%" stop-color="#d48a27"/>
                </linearGradient>
                <linearGradient id="waterDay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2a7b9b"/>
                    <stop offset="50%" stop-color="#1b526b"/>
                    <stop offset="100%" stop-color="#0f3443"/>
                </linearGradient>
            </defs>
            <!-- Sky & Sun -->
            <rect width="900" height="420" fill="url(#skyDay)"/>
            <circle cx="200" cy="130" r="50" fill="#fff7d6" filter="drop-shadow(0 0 25px #ffba08)"/>
            <!-- Surrounding White Parikrama Colonnade -->
            <rect x="0" y="360" width="900" height="60" fill="#f8f9fa"/>
            <rect x="0" y="350" width="900" height="12" fill="#e9ecef"/>
            <line x1="0" y1="380" x2="900" y2="380" stroke="#dee2e6" stroke-width="2"/>
            <!-- Holy Water (Amrit Sarovar) -->
            <rect x="0" y="420" width="900" height="255" fill="url(#waterDay)"/>
            <!-- Marble Causeway (Bridge) -->
            <polygon points="100,420 460,420 440,490 120,490" fill="#e8eaed" stroke="#adb5bd" stroke-width="2"/>
            <polygon points="120,490 440,490 435,502 125,502" fill="#ced4da"/>
            <line x1="100" y1="420" x2="120" y2="490" stroke="#ffb703" stroke-width="4"/>
            <!-- Main Golden Temple (Harmandir Sahib) Lower Marble Tier -->
            <rect x="330" y="270" width="240" height="150" fill="#ffffff" rx="4" stroke="#cfd8dc" stroke-width="3"/>
            <!-- Inlaid Marble Patterns -->
            <rect x="345" y="325" width="45" height="75" fill="#37474f" rx="18"/>
            <rect x="510" y="325" width="45" height="75" fill="#37474f" rx="18"/>
            <!-- Center Main Archway -->
            <path d="M 420 420 L 420 340 Q 450 300 480 340 L 480 420 Z" fill="#d90429" stroke="#ffb703" stroke-width="3"/>
            <path d="M 432 420 L 432 355 Q 450 325 468 355 L 468 420 Z" fill="#2b2d42"/>
            <!-- Upper Gold Plated Sanctum Tier -->
            <rect x="340" y="210" width="220" height="65" fill="url(#goldGrad)" stroke="#b08968" stroke-width="2" rx="3"/>
            <line x1="340" y1="235" x2="560" y2="235" stroke="#fff" stroke-width="1.5" opacity="0.6"/>
            <!-- Central Golden Dome (Gumbad) -->
            <path d="M 380 210 Q 450 80 520 210 Z" fill="url(#goldGrad)" stroke="#cf8a17" stroke-width="3"/>
            <line x1="450" y1="85" x2="450" y2="35" stroke="#ffe259" stroke-width="6" stroke-linecap="round"/>
            <circle cx="450" cy="30" r="9" fill="#ffd166"/>
            <!-- Chhatris (Corner Kiosks) -->
            <path d="M 330 210 Q 345 165 360 210 Z" fill="url(#goldGrad)"/>
            <path d="M 540 210 Q 555 165 570 210 Z" fill="url(#goldGrad)"/>
            <!-- Nishan Sahib Flagpole in distance -->
            <line x1="280" y1="360" x2="280" y2="180" stroke="#ff9f1c" stroke-width="4"/>
            <polygon points="280,180 320,195 280,210" fill="#ff9f1c"/>
            <!-- Sarovar Ripples & Shimmering Gold Reflection -->
            <ellipse cx="450" cy="510" rx="150" ry="25" fill="#ffe259" opacity="0.35"/>
            <ellipse cx="450" cy="565" rx="120" ry="18" fill="#ffa751" opacity="0.25"/>
            <ellipse cx="450" cy="620" rx="90" ry="12" fill="#ffe259" opacity="0.18"/>
            <line x1="260" y1="460" x2="380" y2="460" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <line x1="520" y1="480" x2="680" y2="480" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
        </svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    } else {
        // Round 2: Illuminated Night Darbar Sahib
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675" width="900" height="675">
            <defs>
                <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#020817"/>
                    <stop offset="50%" stop-color="#0d1b2a"/>
                    <stop offset="100%" stop-color="#1b263b"/>
                </linearGradient>
                <linearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#fff3b0"/>
                    <stop offset="50%" stop-color="#ffd166"/>
                    <stop offset="100%" stop-color="#e09f3e"/>
                </linearGradient>
                <radialGradient id="templeLampGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffd166" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#ffd166" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="waterNight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0b132b"/>
                    <stop offset="60%" stop-color="#070d1e"/>
                    <stop offset="100%" stop-color="#02040a"/>
                </linearGradient>
            </defs>
            <!-- Night Sky with Stars & Luminous Moon -->
            <rect width="900" height="420" fill="url(#skyNight)"/>
            <circle cx="120" cy="80" r="1.5" fill="#fff"/><circle cx="280" cy="60" r="2" fill="#fff"/><circle cx="650" cy="90" r="1.5" fill="#fff"/><circle cx="780" cy="50" r="2" fill="#fff"/><circle cx="820" cy="110" r="1.5" fill="#fff"/>
            <circle cx="750" cy="100" r="42" fill="#fefae0" filter="drop-shadow(0 0 30px #fefae0)"/>
            <!-- Ambient Golden Aura behind Temple -->
            <circle cx="450" cy="280" r="260" fill="url(#templeLampGlow)"/>
            <!-- Perimeter Night Wall with Deepak Lamps -->
            <rect x="0" y="360" width="900" height="60" fill="#1b263b"/>
            <rect x="0" y="350" width="900" height="12" fill="#293241"/>
            <circle cx="220" cy="356" r="4" fill="#ffd166" filter="drop-shadow(0 0 6px #ffd166)"/>
            <circle cx="300" cy="356" r="4" fill="#ffd166" filter="drop-shadow(0 0 6px #ffd166)"/>
            <circle cx="600" cy="356" r="4" fill="#ffd166" filter="drop-shadow(0 0 6px #ffd166)"/>
            <circle cx="680" cy="356" r="4" fill="#ffd166" filter="drop-shadow(0 0 6px #ffd166)"/>
            <!-- Amrit Sarovar Dark Waters -->
            <rect x="0" y="420" width="900" height="255" fill="url(#waterNight)"/>
            <!-- Illuminated Causeway Bridge -->
            <polygon points="100,420 460,420 440,490 120,490" fill="#3d5a80" stroke="#ffd166" stroke-width="1.5"/>
            <!-- Lower Marble Tier Illuminated -->
            <rect x="330" y="270" width="240" height="150" fill="#e0e1dd" rx="4" filter="drop-shadow(0 0 15px rgba(255,209,102,0.4))"/>
            <rect x="345" y="325" width="45" height="75" fill="#0d1b2a" rx="18"/>
            <rect x="510" y="325" width="45" height="75" fill="#0d1b2a" rx="18"/>
            <path d="M 420 420 L 420 340 Q 450 300 480 340 L 480 420 Z" fill="#9d0208" stroke="#ffd166" stroke-width="2"/>
            <path d="M 432 420 L 432 355 Q 450 325 468 355 L 468 420 Z" fill="#ffd166" opacity="0.8"/>
            <!-- Upper Gold Sanctum Blazing with Light -->
            <rect x="340" y="210" width="220" height="65" fill="url(#goldGlow)" rx="3" filter="drop-shadow(0 0 20px #ffd166)"/>
            <path d="M 380 210 Q 450 80 520 210 Z" fill="url(#goldGlow)" stroke="#fff" stroke-width="2"/>
            <line x1="450" y1="85" x2="450" y2="35" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
            <circle cx="450" cy="30" r="10" fill="#ffffff" filter="drop-shadow(0 0 12px #ffffff)"/>
            <!-- Chhatris -->
            <path d="M 330 210 Q 345 165 360 210 Z" fill="url(#goldGlow)"/>
            <path d="M 540 210 Q 555 165 570 210 Z" fill="url(#goldGlow)"/>
            <!-- Deep Vivid Reflections on Lake Surface -->
            <ellipse cx="450" cy="490" rx="170" ry="30" fill="#ffd166" opacity="0.55" filter="drop-shadow(0 0 15px #ffd166)"/>
            <ellipse cx="450" cy="550" rx="130" ry="22" fill="#ffb703" opacity="0.4"/>
            <ellipse cx="450" cy="610" rx="90" ry="16" fill="#ffd166" opacity="0.3"/>
        </svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }
}

class GoldenTemplePuzzle {
    constructor(container) {
        this.container = container;
        this.rounds = [
            { cols: 3, rows: 3, name: "Round 1: Golden Temple by Daylight (3x3)" },
            { cols: 4, rows: 3, name: "Round 2: Sacred Night Illumination (4x3)" }
        ];
        this.roundIndex = 0;
        this.imgW = 900;
        this.imgH = 675;

        this.facts = [
            "The dome is covered in over 500 kilograms of pure gold leaf.",
            "The surrounding Amrit Sarovar lake gives the city of Amritsar its name.",
            "The foundation stone was laid by the venerated Sufi Saint Mian Mir in 1589.",
            "Its Langar feeds more than 100,000 visitors every day without distinction."
        ];

        this.dragState = null;
        this.boundMove = (e) => this.onPointerMove(e);
        this.boundUp = (e) => this.onPointerUp(e);
    }

    cleanup() {
        window.removeEventListener('pointermove', this.boundMove);
        window.removeEventListener('pointerup', this.boundUp);
        this.container.innerHTML = '';
    }

    start() {
        this.roundIndex = 0;
        this.initRound();
    }

    initRound() {
        const round = this.rounds[this.roundIndex];
        this.cols = round.cols;
        this.rows = round.rows;
        this.currentDataUri = createGoldenTempleArt(this.roundIndex + 1);
        this.tileW = this.imgW / this.cols;
        this.tileH = this.imgH / this.rows;
        this.total = this.cols * this.rows;
        this.placed = 0;
        this.renderPreviewPhase();
    }

    // Step 1: Display the full artwork so the player can study it
    renderPreviewPhase() {
        const c = this.container;
        c.innerHTML = '';
        c.classList.add('puzzle-wrap');

        const round = this.rounds[this.roundIndex];

        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'puzzle-complete-overlay';
        previewWrapper.style.position = 'relative';
        previewWrapper.style.width = '100%';
        previewWrapper.style.height = '100%';
        previewWrapper.style.background = 'radial-gradient(ellipse at top, #2b170c 0%, #120904 100%)';
        previewWrapper.style.display = 'flex';
        previewWrapper.style.flexDirection = 'column';
        previewWrapper.style.alignItems = 'center';
        previewWrapper.style.justifyContent = 'center';
        previewWrapper.style.gap = '14px';
        previewWrapper.style.padding = '20px';

        previewWrapper.innerHTML = `
            <h2 style="font-family:'Cinzel',serif; color:#ffcf70; margin:0; font-size:1.8rem;">MEMORIZE THE LANDMARK</h2>
            <p style="color:#d9a15b; margin:0; font-size:0.95rem; letter-spacing:1px;">${round.name} — Study the scene before assembling</p>
            <div class="golden-preview-art" style="width:${this.imgW / 1.75}px; height:${this.imgH / 1.75}px; border-radius:8px; overflow:hidden; border:3px solid #ffcf70; box-shadow:0 10px 30px rgba(0,0,0,0.7); background:url('${this.currentDataUri}') center/cover no-repeat;"></div>
            <button id="gt-start-puzzle-btn" style="margin-top:10px; padding:12px 32px; background:linear-gradient(135deg, #c1502e, #8a5a2b); border:1px solid #ffcf70; border-radius:8px; color:#fdf3e2; font-family:'Cinzel',serif; font-size:1.1rem; font-weight:bold; cursor:pointer; box-shadow:0 4px 15px rgba(255,207,112,0.3); transition:transform 0.2s ease;">START PUZZLE</button>
        `;

        c.appendChild(previewWrapper);

        const btn = document.getElementById('gt-start-puzzle-btn');
        btn.addEventListener('click', () => {
            this.renderGameBoard();
        });
    }

    // Step 2: Render blank grid and draggable tiles
    renderGameBoard() {
        const c = this.container;
        c.innerHTML = '';

        const round = this.rounds[this.roundIndex];

        // Sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'puzzle-sidebar';
        sidebar.innerHTML = `
            <h2>GOLDEN TEMPLE</h2>
            <p class="puzzle-sub">${round.name}</p>
            <p class="puzzle-instructions">Drag each scrambled tile onto its correct spot in the empty grid.</p>
            <div class="puzzle-progress-label">PIECES ASSEMBLED</div>
            <div class="puzzle-progress-track"><div class="puzzle-progress-fill" id="gt-progress"></div></div>
            <div class="puzzle-progress-count" id="gt-progress-count">0 / ${this.total}</div>
            <p class="puzzle-fact" id="gt-fact">${this.facts[this.roundIndex * 2]}</p>
        `;
        c.appendChild(sidebar);

        // Board
        const board = document.createElement('div');
        board.className = 'puzzle-board';

        const target = document.createElement('div');
        target.className = 'puzzle-target';
        target.style.width = (this.imgW / 1.6) + 'px';
        target.style.height = (this.imgH / 1.6) + 'px';
        target.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        target.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        target.style.backgroundImage = 'none';
        target.style.backgroundColor = '#150d06';

        this.slots = [];
        for (let i = 0; i < this.total; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = i;
            target.appendChild(slot);
            this.slots.push(slot);
        }
        board.appendChild(target);

        const tray = document.createElement('div');
        tray.className = 'puzzle-tray';
        board.appendChild(tray);
        this.tray = tray;

        c.appendChild(board);

        // Tiles
        const indices = [...Array(this.total).keys()];
        shuffleArray(indices);

        this.tiles = [];
        const trayScale = 2.2;
        const trayTileW = this.tileW / trayScale;
        const trayTileH = this.tileH / trayScale;

        indices.forEach(correctIndex => {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.dataset.correct = correctIndex;
            tile.style.width = trayTileW + 'px';
            tile.style.height = trayTileH + 'px';
            const col = correctIndex % this.cols;
            const row = Math.floor(correctIndex / this.cols);
            tile.style.backgroundImage = `url("${this.currentDataUri}")`;
            tile.style.backgroundSize = `${this.imgW / trayScale}px ${this.imgH / trayScale}px`;
            tile.style.backgroundPosition = `-${col * trayTileW}px -${row * trayTileH}px`;
            tile.addEventListener('pointerdown', (e) => this.onPointerDown(e, tile));
            tray.appendChild(tile);
            this.tiles.push(tile);
        });

        window.removeEventListener('pointermove', this.boundMove);
        window.removeEventListener('pointerup', this.boundUp);
        window.addEventListener('pointermove', this.boundMove);
        window.addEventListener('pointerup', this.boundUp);
    }

    onPointerDown(e, tile) {
        if (tile.classList.contains('locked')) return;
        e.preventDefault();
        const rect = tile.getBoundingClientRect();
        this.dragState = {
            tile,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
            homeParent: tile.parentElement,
            homeNext: tile.nextSibling
        };
        tile.classList.add('dragging');
        tile.style.position = 'fixed';
        tile.style.left = rect.left + 'px';
        tile.style.top = rect.top + 'px';
        tile.style.zIndex = 1000;
        document.body.appendChild(tile);
    }

    onPointerMove(e) {
        if (!this.dragState) return;
        const { tile, offsetX, offsetY } = this.dragState;
        tile.style.left = (e.clientX - offsetX) + 'px';
        tile.style.top = (e.clientY - offsetY) + 'px';
    }

    onPointerUp(e) {
        if (!this.dragState) return;
        const { tile, homeParent, homeNext } = this.dragState;
        tile.classList.remove('dragging');

        let dropSlot = null;
        for (const slot of this.slots) {
            const r = slot.getBoundingClientRect();
            if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
                dropSlot = slot;
                break;
            }
        }

        tile.style.position = '';
        tile.style.left = '';
        tile.style.top = '';
        tile.style.zIndex = '';

        if (dropSlot && Number(dropSlot.dataset.index) === Number(tile.dataset.correct) && !dropSlot.classList.contains('filled')) {
            dropSlot.classList.add('filled');
            dropSlot.appendChild(tile);
            tile.style.width = '100%';
            tile.style.height = '100%';
            tile.style.backgroundSize = `${this.imgW / 1.6}px ${this.imgH / 1.6}px`;
            const idx = Number(tile.dataset.correct);
            const col = idx % this.cols, row = Math.floor(idx / this.cols);
            tile.style.backgroundPosition = `-${col * (this.imgW / 1.6 / this.cols)}px -${row * (this.imgH / 1.6 / this.rows)}px`;
            tile.classList.add('locked');
            this.placed++;
            this.updateProgress();
            if (this.placed === this.total) this.onRoundComplete();
        } else {
            homeParent.insertBefore(tile, homeNext);
        }

        this.dragState = null;
    }

    updateProgress() {
        const pct = (this.placed / this.total) * 100;
        const fill = document.getElementById('gt-progress');
        const count = document.getElementById('gt-progress-count');
        const fact = document.getElementById('gt-fact');
        if (fill) fill.style.width = pct + '%';
        if (count) count.textContent = `${this.placed} / ${this.total}`;
        if (fact) fact.textContent = this.facts[Math.min(this.placed, this.facts.length - 1)];
    }

    onRoundComplete() {
        if (this.roundIndex < this.rounds.length - 1) {
            this.roundIndex++;
            setTimeout(() => {
                const overlay = document.createElement('div');
                overlay.className = 'puzzle-complete-overlay';
                overlay.innerHTML = `<h2>Round 1 Assembled!</h2><p>Prepare for the Night Illumination round...</p>`;
                this.container.appendChild(overlay);
                setTimeout(() => this.initRound(), 1400);
            }, 300);
        } else {
            setTimeout(() => {
                const overlay = document.createElement('div');
                overlay.className = 'puzzle-complete-overlay';
                overlay.innerHTML = `<h2>Grand Master Architect!</h2><p>${this.facts[this.facts.length - 1]}</p>`;
                this.container.appendChild(overlay);
                setTimeout(() => {
                    if (window.onGoldenTempleEnd) window.onGoldenTempleEnd(true);
                }, 1600);
            }, 400);
        }
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}