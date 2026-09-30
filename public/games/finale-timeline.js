// js/finale-timeline.js
// "Paradox Calibrator" — Advanced Time Machine Finale with Clue Deduction, Chrono-Entropy, and Penalty Mechanics

window.finaleInstance = null;
window.onFinaleEnd = null;

function startFinaleGame(containerId, onComplete) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Finale Game: container not found!");
        if (onComplete) onComplete(false);
        return;
    }

    window.onFinaleEnd = (success) => {
        if (window.finaleInstance) {
            window.finaleInstance.cleanup();
            window.finaleInstance = null;
        }
        if (onComplete) onComplete(success);
    };

    window.finaleInstance = new FinaleTimelineGame(container);
    window.finaleInstance.start();
}

const TIMELINE_CHALLENGE = [
    { name: "Sanchi Stupa", clue: "Commissioned by Ashoka; ancient Buddhist hemisphere", era: "250 BCE", color: "#c1502e" },
    { name: "Ajanta Caves", clue: "Rock-cut monastic murals in the Sahyadri gorge", era: "200 BCE", color: "#8a5a2b" },
    { name: "Qutub Minar", clue: "Victory minaret begun by Qutb-ud-din Aibak", era: "1199 CE", color: "#ffcf70" },
    { name: "Charminar", clue: "Four-minaret monument founded after plague relief", era: "1591 CE", color: "#e0663f" },
    { name: "Golden Temple", clue: "Harmandir Sahib sanctorum surrounded by Amrit Sarovar", era: "1604 CE", color: "#ffcf70" },
    { name: "Red Fort", clue: "Lal Qila; seat of Mughal power in Shahjahanabad", era: "1648 CE", color: "#c1502e" },
    { name: "Taj Mahal", clue: "White marble mausoleum along the Yamuna river", era: "1653 CE", color: "#fdf3e2" },
    { name: "Hawa Mahal", clue: "Crown-shaped façade of 953 honeycomb jharokhas", era: "1799 CE", color: "#e0663f" },
    { name: "Mysore Palace", clue: "Wadiyar dynasty royal seat restored after 1897 fire", era: "1912 CE", color: "#c1502e" },
    { name: "Gateway of India", clue: "Apollo Bunder arch built for King George V's landing", era: "1924 CE", color: "#7a92a8" }
];

class FinaleTimelineGame {
    constructor(container) {
        this.container = container;
        this.total = TIMELINE_CHALLENGE.length;
        this.placed = 0;
        this.entropy = 100;
        this.dragState = null;
        this.timerInterval = null;

        this.boundMove = (e) => this.onPointerMove(e);
        this.boundUp = (e) => this.onPointerUp(e);
    }

    cleanup() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        window.removeEventListener('pointermove', this.boundMove);
        window.removeEventListener('pointerup', this.boundUp);
        this.container.innerHTML = '';
    }

    start() {
        this.placed = 0;
        this.entropy = 100;
        this.render();
        window.addEventListener('pointermove', this.boundMove);
        window.addEventListener('pointerup', this.boundUp);

        // Entropy decay timer creates high stakes
        this.timerInterval = setInterval(() => {
            this.entropy -= 1;
            this.updateProgress();
            if (this.entropy <= 0) {
                clearInterval(this.timerInterval);
                this.onFail();
            }
        }, 1000);
    }

    render() {
        const c = this.container;
        c.innerHTML = '';
        c.classList.add('puzzle-wrap');

        const sidebar = document.createElement('div');
        sidebar.className = 'puzzle-sidebar';
        sidebar.innerHTML = `
            <h2>THE TIME MACHINE</h2>
            <p class="puzzle-sub">Temporal Paradox Calibrator</p>
            <p class="puzzle-instructions">Deduce chronology via architectural clues. Warning: Misplaced crystals cause chronal feedback (-12% stability)!</p>
            <div class="puzzle-progress-label">TEMPORAL INTEGRITY</div>
            <div class="puzzle-progress-track"><div class="puzzle-progress-fill" id="fin-progress" style="width: 100%"></div></div>
            <div class="puzzle-progress-count" id="fin-progress-count">INTEGRITY: 100% | PLACED: 0 / ${this.total}</div>
            <p class="puzzle-fact" id="fin-fact">Decipher archaeological records to restore the timeline before collapse.</p>
        `;
        c.appendChild(sidebar);

        const board = document.createElement('div');
        board.className = 'puzzle-board finale-board';

        const eraLine = document.createElement('div');
        eraLine.className = 'finale-era-line';
        eraLine.innerHTML = `<span>Ancient (300 BCE)</span><span>Medieval (1200-1600 CE)</span><span>Modern (1700-1900+ CE)</span>`;
        board.appendChild(eraLine);

        const strip = document.createElement('div');
        strip.className = 'finale-strip';
        this.slots = [];
        TIMELINE_CHALLENGE.forEach((m, i) => {
            const slot = document.createElement('div');
            slot.className = 'finale-slot';
            slot.dataset.index = i;
            slot.innerHTML = `<div class="finale-slot-drop"></div><div class="finale-slot-marker">Epoch ${i + 1}</div>`;
            strip.appendChild(slot);
            this.slots.push(slot);
        });
        board.appendChild(strip);

        const tray = document.createElement('div');
        tray.className = 'puzzle-tray finale-tray';
        board.appendChild(tray);
        this.tray = tray;

        c.appendChild(board);

        // Render shuffled mystery crystal tiles (era years hidden on unplaced tiles to demand deductive skill)
        const order = [...Array(this.total).keys()];
        shuffleF(order);
        this.tiles = order.map(correctIndex => {
            const m = TIMELINE_CHALLENGE[correctIndex];
            const tile = document.createElement('div');
            tile.className = 'finale-crystal';
            tile.dataset.correct = correctIndex;
            tile.style.setProperty('--crystal-color', m.color);
            tile.innerHTML = `
                <div class="finale-crystal-gem"></div>
                <div class="finale-crystal-name">${m.name}</div>
                <div class="finale-crystal-era" style="font-size:0.55rem; opacity:0.8;">${m.clue}</div>
            `;
            tile.addEventListener('pointerdown', (e) => this.onPointerDown(e, tile));
            tray.appendChild(tile);
            return tile;
        });

        this.updateProgress();
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

        const dropArea = dropSlot ? dropSlot.querySelector('.finale-slot-drop') : null;

        if (dropSlot && dropArea.childElementCount === 0) {
            if (Number(dropSlot.dataset.index) === Number(tile.dataset.correct)) {
                // Correct insertion locks era date
                dropArea.appendChild(tile);
                tile.classList.add('locked');
                const m = TIMELINE_CHALLENGE[tile.dataset.correct];
                tile.querySelector('.finale-crystal-era').textContent = `Era: ${m.era}`;
                this.placed++;
                this.entropy = Math.min(100, this.entropy + 5);
                this.updateProgress();

                if (this.placed === this.total) this.onComplete();
            } else {
                // Misplacement feedback penalty
                this.entropy -= 12;
                homeParent.insertBefore(tile, homeNext);
                const fact = document.getElementById('fin-fact');
                if (fact) fact.textContent = `⚠ Chrono-Paradox! Misplaced crystal destabilized the timeline.`;
                this.updateProgress();
            }
        } else {
            homeParent.insertBefore(tile, homeNext);
        }

        this.dragState = null;
    }

    updateProgress() {
        const fill = document.getElementById('fin-progress');
        const count = document.getElementById('fin-progress-count');
        const fact = document.getElementById('fin-fact');

        if (fill) {
            fill.style.width = Math.max(0, this.entropy) + '%';
            fill.style.background = this.entropy > 40 ? '#ffcf70' : '#ff7a7a';
        }
        if (count) count.textContent = `INTEGRITY: ${this.entropy}% | PLACED: ${this.placed} / ${this.total}`;

        if (fact && this.placed > 0 && this.placed <= this.total && this.entropy > 0) {
            const m = TIMELINE_CHALLENGE[this.placed - 1];
            fact.textContent = `✓ Calibrated: ${m.name} locked into ${m.era}.`;
        }
    }

    onFail() {
        const overlay = document.createElement('div');
        overlay.className = 'puzzle-complete-overlay';
        overlay.innerHTML = `<h2>Timeline Collapsed!</h2><p>Temporal paradoxes caused a systemic fracture. Resetting the time machine...</p>`;
        this.container.appendChild(overlay);
        setTimeout(() => {
            if (window.onFinaleEnd) window.onFinaleEnd(false);
        }, 2200);
    }

    onComplete() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'puzzle-complete-overlay';
            overlay.innerHTML = `<h2>Timeline Flawlessly Restored!</h2><p>All monuments from 250 BCE to 1924 CE are stabilized. Heritage Conquest Mastered!</p>`;
            this.container.appendChild(overlay);
            setTimeout(() => {
                if (window.onFinaleEnd) window.onFinaleEnd(true);
            }, 2400);
        }, 400);
    }
}

function shuffleF(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}