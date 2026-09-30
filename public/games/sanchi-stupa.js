// js/sanchi-stupa.js
// "Decode the Inscription" — Ancient symbol cipher decryption with historical terminology.

window.sanchiInstance = null;
window.onSanchiEnd = null;

function startSanchiStupaGame(containerId, onComplete) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Sanchi Stupa Game: container not found!");
        if (onComplete) onComplete(false);
        return;
    }

    window.onSanchiEnd = (success) => {
        if (window.sanchiInstance) {
            window.sanchiInstance.cleanup();
            window.sanchiInstance = null;
        }
        if (onComplete) onComplete(success);
    };

    window.sanchiInstance = new SanchiDecodeGame(container);
    window.sanchiInstance.start();
}

// Distinct, recognizable ancient symbols mapping to specific letters
const SANCHI_SYMBOLS = {
    A: {
        name: "Triratna (Three Jewels)",
        svg: `<svg viewBox="0 0 40 40"><circle cx="20" cy="11" r="5" fill="#e07a5f"/><circle cx="11" cy="27" r="5" fill="#e07a5f"/><circle cx="29" cy="27" r="5" fill="#e07a5f"/><path d="M 20 16 L 11 22 M 20 16 L 29 22 M 16 27 L 24 27" stroke="#e07a5f" stroke-width="2.5"/></svg>`
    },
    S: {
        name: "Dharmachakra (Wheel)",
        svg: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" stroke="#e07a5f" stroke-width="2.5" fill="none"/><circle cx="20" cy="20" r="4" fill="#e07a5f"/><line x1="20" y1="6" x2="20" y2="34" stroke="#e07a5f" stroke-width="2"/><line x1="6" y1="20" x2="34" y2="20" stroke="#e07a5f" stroke-width="2"/><line x1="10" y1="10" x2="30" y2="30" stroke="#e07a5f" stroke-width="2"/><line x1="10" y1="30" x2="30" y2="10" stroke="#e07a5f" stroke-width="2"/></svg>`
    },
    H: {
        name: "Ashoka Pillar Capital",
        svg: `<svg viewBox="0 0 40 40"><rect x="16" y="14" width="8" height="20" fill="#e07a5f"/><rect x="12" y="32" width="16" height="4" fill="#e07a5f"/><path d="M 10 14 L 30 14 L 20 5 Z" fill="#e07a5f"/></svg>`
    },
    O: {
        name: "Sun Chakra",
        svg: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="8" fill="#e07a5f"/><line x1="20" y1="4" x2="20" y2="9" stroke="#e07a5f" stroke-width="3"/><line x1="20" y1="31" x2="20" y2="36" stroke="#e07a5f" stroke-width="3"/><line x1="4" y1="20" x2="9" y2="20" stroke="#e07a5f" stroke-width="3"/><line x1="31" y1="20" x2="36" y2="20" stroke="#e07a5f" stroke-width="3"/></svg>`
    },
    K: {
        name: "Sacred Bodhi Leaf",
        svg: `<svg viewBox="0 0 40 40"><path d="M 20 6 C 32 14 32 30 20 34 C 8 30 8 14 20 6 Z" stroke="#e07a5f" stroke-width="2.5" fill="none"/><line x1="20" y1="6" x2="20" y2="34" stroke="#e07a5f" stroke-width="2"/></svg>`
    },
    T: {
        name: "Torana Gateway",
        svg: `<svg viewBox="0 0 40 40"><line x1="10" y1="8" x2="10" y2="34" stroke="#e07a5f" stroke-width="3"/><line x1="30" y1="8" x2="30" y2="34" stroke="#e07a5f" stroke-width="3"/><line x1="5" y1="12" x2="35" y2="12" stroke="#e07a5f" stroke-width="3"/><line x1="5" y1="18" x2="35" y2="18" stroke="#e07a5f" stroke-width="3"/></svg>`
    },
    R: {
        name: "Lotus Petal",
        svg: `<svg viewBox="0 0 40 40"><path d="M 20 8 C 12 18 12 28 20 34 C 28 28 28 18 20 8 Z" fill="#e07a5f"/><path d="M 20 14 C 6 22 10 32 20 34" stroke="#e07a5f" stroke-width="2" fill="none"/><path d="M 20 14 C 34 22 30 32 20 34" stroke="#e07a5f" stroke-width="2" fill="none"/></svg>`
    },
    N: {
        name: "Endless Knot",
        svg: `<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" rx="3" stroke="#e07a5f" stroke-width="2.5" fill="none" transform="rotate(45 20 20)"/><circle cx="20" cy="20" r="4" fill="#e07a5f"/></svg>`
    },
    U: {
        name: "Stupa Dome & Crescent",
        svg: `<svg viewBox="0 0 40 40"><path d="M 8 30 Q 20 10 32 30 Z" fill="#e07a5f"/><line x1="6" y1="32" x2="34" y2="32" stroke="#e07a5f" stroke-width="2.5"/><path d="M 14 10 Q 20 16 26 10" stroke="#e07a5f" stroke-width="2.5" fill="none"/></svg>`
    },
    P: {
        name: "Vajra Thunderbolt",
        svg: `<svg viewBox="0 0 40 40"><path d="M 20 5 L 25 15 L 20 20 L 15 15 Z M 20 35 L 25 25 L 20 20 L 15 25 Z" fill="#e07a5f"/><circle cx="20" cy="20" r="3" fill="#ffd166"/></svg>`
    },
    C: {
        name: "Conch Shell",
        svg: `<svg viewBox="0 0 40 40"><path d="M 20 8 Q 32 14 28 28 Q 20 36 12 28 Q 8 16 20 8 Z" stroke="#e07a5f" stroke-width="2.5" fill="none"/><path d="M 20 14 Q 24 20 20 28" stroke="#e07a5f" stroke-width="2" fill="none"/></svg>`
    },
    I: {
        name: "Sacred Flame",
        svg: `<svg viewBox="0 0 40 40"><path d="M 20 6 Q 28 16 24 26 Q 20 34 16 26 Q 12 18 20 6 Z" fill="#e07a5f"/><path d="M 20 16 Q 23 22 20 28 Q 17 22 20 16 Z" fill="#ffd166"/></svg>`
    },
    M: {
        name: "Mount Meru Peak",
        svg: `<svg viewBox="0 0 40 40"><polygon points="20,6 34,32 6,32" stroke="#e07a5f" stroke-width="2.5" fill="none"/><polygon points="20,16 28,32 12,32" fill="#e07a5f"/></svg>`
    },
    D: {
        name: "Sacred Bell (Ghanta)",
        svg: `<svg viewBox="0 0 40 40"><path d="M 12 28 C 12 16 28 16 28 28 Z" fill="#e07a5f"/><line x1="8" y1="30" x2="32" y2="30" stroke="#e07a5f" stroke-width="3"/><circle cx="20" cy="10" r="3" fill="#e07a5f"/></svg>`
    }
};

class SanchiDecodeGame {
    constructor(container) {
        this.container = container;
        this.rounds = [
            { word: "TORANA", fact: "The Toranas are four ornate ceremonial gateways built at the cardinal directions of the Great Stupa." },
            { word: "STUPA", fact: "The Great Stupa at Sanchi is one of the oldest stone structures in India, commissioned by Emperor Ashoka." },
            { word: "ASHOKA", fact: "Emperor Ashoka embraced non-violence and erected pillars and stupas across India to spread Dharma." }
        ];
        this.roundIndex = 0;
        this.placed = 0;
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
        this.render();
        window.addEventListener('pointermove', this.boundMove);
        window.addEventListener('pointerup', this.boundUp);
    }

    currentWord() {
        return this.rounds[this.roundIndex].word;
    }

    render() {
        const c = this.container;
        c.innerHTML = '';
        c.classList.add('puzzle-wrap');

        const word = this.currentWord();
        this.placed = 0;

        // Sidebar displaying the Symbol Codex Ledger
        const sidebar = document.createElement('div');
        sidebar.className = 'puzzle-sidebar';
        sidebar.innerHTML = `
            <h2>SANCHI STUPA</h2>
            <p class="puzzle-sub">Inscription Ingot (${this.roundIndex + 1}/${this.rounds.length})</p>
            <p class="puzzle-instructions">Match the mystic symbols atop each column using the Codex key below, then drag the matching letter tile into place.</p>
            <div class="puzzle-progress-label">INSCRIPTION PROGRESS</div>
            <div class="puzzle-progress-track"><div class="puzzle-progress-fill" id="ss-progress"></div></div>
            <div class="puzzle-progress-count" id="ss-progress-count">0 / ${word.length}</div>
            <div class="sanchi-legend" id="ss-legend"></div>
            <p class="puzzle-fact" id="ss-fact">${this.rounds[this.roundIndex].fact}</p>
        `;
        c.appendChild(sidebar);
        this.buildCodexLedger(sidebar.querySelector('#ss-legend'));

        // Center puzzle board
        const board = document.createElement('div');
        board.className = 'puzzle-board';

        const glyphRow = document.createElement('div');
        glyphRow.className = 'sanchi-glyph-row';
        this.slots = [];
        [...word].forEach((letter, i) => {
            const slot = document.createElement('div');
            slot.className = 'sanchi-glyph-slot';
            slot.dataset.index = i;
            slot.dataset.letter = letter;
            const sym = SANCHI_SYMBOLS[letter] || { svg: '' };
            slot.innerHTML = `<div class="sanchi-glyph-icon" title="Ancient Symbol">${sym.svg}</div><div class="sanchi-drop-area"></div>`;
            glyphRow.appendChild(slot);
            this.slots.push(slot);
        });
        board.appendChild(glyphRow);

        const tray = document.createElement('div');
        tray.className = 'puzzle-tray sanchi-tray';
        board.appendChild(tray);
        this.tray = tray;

        c.appendChild(board);

        // Word letters + decoy tiles
        const letters = [...word];
        const allKeys = Object.keys(SANCHI_SYMBOLS);
        const decoys = allKeys.filter(k => !letters.includes(k)).slice(0, 4);
        const trayPool = [...letters, ...decoys];
        shuffleS(trayPool);

        this.tiles = trayPool.map(letter => {
            const tile = document.createElement('div');
            tile.className = 'sanchi-letter-tile';
            tile.textContent = letter;
            tile.dataset.letter = letter;
            tile.addEventListener('pointerdown', (e) => this.onPointerDown(e, tile));
            tray.appendChild(tile);
            return tile;
        });

        this.updateProgress();
    }

    // Build the decipher key ledger
    buildCodexLedger(el) {
        const sortedKeys = Object.keys(SANCHI_SYMBOLS).sort();
        el.innerHTML = '<div class="sanchi-legend-title">ANCIENT SYMBOL CODEX</div>' + sortedKeys.map(k => `
            <div class="sanchi-legend-item" style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <div class="sanchi-legend-glyph" style="width:26px; height:26px;">${SANCHI_SYMBOLS[k].svg}</div>
                <span style="color:#d9a15b; font-size:0.75rem; flex:1;">${SANCHI_SYMBOLS[k].name}</span>
                <strong class="sanchi-legend-letter" style="color:#ffcf70; font-size:1.05rem; font-family:monospace;">${k}</strong>
            </div>
        `).join('');
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

        const dropArea = dropSlot ? dropSlot.querySelector('.sanchi-drop-area') : null;

        if (dropSlot && dropSlot.dataset.letter === tile.dataset.letter && dropArea && dropArea.childElementCount === 0) {
            dropArea.appendChild(tile);
            tile.classList.add('locked');
            this.placed++;
            this.updateProgress();
            if (this.placed === this.currentWord().length) this.onWordComplete();
        } else {
            homeParent.insertBefore(tile, homeNext);
        }

        this.dragState = null;
    }

    updateProgress() {
        const word = this.currentWord();
        const pct = (this.placed / word.length) * 100;
        const fill = document.getElementById('ss-progress');
        const count = document.getElementById('ss-progress-count');
        if (fill) fill.style.width = pct + '%';
        if (count) count.textContent = `${this.placed} / ${word.length}`;
    }

    onWordComplete() {
        setTimeout(() => {
            if (this.roundIndex < this.rounds.length - 1) {
                this.roundIndex++;
                this.render();
            } else {
                const overlay = document.createElement('div');
                overlay.className = 'puzzle-complete-overlay';
                overlay.innerHTML = `<h2>All Inscriptions Decoded!</h2><p>${this.rounds[this.rounds.length - 1].fact}</p>`;
                this.container.appendChild(overlay);
                setTimeout(() => {
                    if (window.onSanchiEnd) window.onSanchiEnd(true);
                }, 1600);
            }
        }, 500);
    }
}

function shuffleS(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}