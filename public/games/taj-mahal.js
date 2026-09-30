// public/games/taj-mahal.js
// "Spot the Flaw" — the Taj Mahal's marble facade is famous for perfect
// mirror symmetry. A few panels on the right half don't match their mirror
// on the left. Click each flawed panel to restore it. No timer, no penalty
// for clicking a correct panel — only genuine flaws respond.
//
// Rebuilt to use the shared .puzzle-wrap / .puzzle-sidebar / .puzzle-board /
// .puzzle-target / .puzzle-slot classes from games.css (the same ones every
// other monument game uses) instead of hand-rolled inline flex/pixel sizing,
// so it can't drift out of alignment inside the bounded #dom-host box.

window.tajMahalInstance = null;
window.onTajMahalEnd = null;

function startTajMahalGame(containerId, onComplete) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Taj Mahal Game: container not found!");
        if (onComplete) onComplete(false);
        return;
    }

    window.onTajMahalEnd = (success) => {
        if (window.tajMahalInstance) {
            window.tajMahalInstance.cleanup();
            window.tajMahalInstance = null;
        }
        if (onComplete) onComplete(success);
    };

    window.tajMahalInstance = new TajMahalFlawGame(container);
    window.tajMahalInstance.start();
}

const TAJ_MOTIFS = ['❁', '✦', '❖', '✿', '❋'];

class TajMahalFlawGame {
    constructor(container) {
        this.container = container;
        this.cols = 8; // 4 mirrored pairs
        this.rows = 5;
        this.round = 1;
        this.totalRounds = 2;
        this.flawsPerRound = [4, 6];
        this.fixed = 0;
        this.totalFlaws = 0;
        this.facts = [
            "The Taj Mahal took about 22 years to build, finishing around 1653.",
            "Shah Jahan built it as a tomb for his wife, Mumtaz Mahal.",
            "Its four minarets lean slightly outward — so if they ever fell, they'd fall away from the tomb.",
            "The marble changes color through the day: pinkish at dawn, white at noon, golden at dusk.",
            "Pietra dura inlay work uses semi-precious stones cut and fitted into the marble like a jigsaw.",
            "Every element of the complex — gardens, gateway, mosque — is mirrored on a central axis."
        ];
    }

    cleanup() {
        this.container.innerHTML = '';
    }

    start() {
        this.round = 1;
        this.startRound();
    }

    startRound() {
        this.buildPattern();
        this.render();
    }

    buildPattern() {
        const half = this.cols / 2;
        this.leftPattern = [];
        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < half; c++) {
                row.push(TAJ_MOTIFS[Math.floor(Math.random() * TAJ_MOTIFS.length)]);
            }
            this.leftPattern.push(row);
        }

        // Right half starts as an exact mirror, then we deliberately corrupt
        // a handful of cells so they no longer match their mirrored partner.
        this.rightPattern = this.leftPattern.map((row) => [...row].reverse());
        this.flawed = [];
        for (let r = 0; r < this.rows; r++) {
            this.flawed.push(new Array(half).fill(false));
        }

        const flawCount = Math.min(this.flawsPerRound[this.round - 1], this.rows * half);
        const cells = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < half; c++) cells.push([r, c]);
        }
        shuffleTaj(cells);

        let placed = 0;
        for (const [r, c] of cells) {
            if (placed >= flawCount) break;
            const correct = this.leftPattern[r][half - 1 - c];
            const wrongOptions = TAJ_MOTIFS.filter((m) => m !== correct);
            this.rightPattern[r][c] = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
            this.flawed[r][c] = true;
            placed++;
        }

        this.totalFlaws = placed;
        this.fixed = 0;
    }

    render() {
        const c = this.container;
        c.innerHTML = '';
        c.classList.add('puzzle-wrap');

        const sidebar = document.createElement('div');
        sidebar.className = 'puzzle-sidebar';
        sidebar.innerHTML = `
            <h2>TAJ MAHAL</h2>
            <p class="puzzle-sub">Spot the Flaw — Round ${this.round} of ${this.totalRounds}</p>
            <p class="puzzle-instructions">The left panel is the original inlay. A few panels on the right don't match their mirror — click each one to fix it.</p>
            <div class="puzzle-progress-label">FLAWS FIXED</div>
            <div class="puzzle-progress-track"><div class="puzzle-progress-fill" id="taj-progress"></div></div>
            <div class="puzzle-progress-count" id="taj-progress-count">0 / ${this.totalFlaws}</div>
            <p class="puzzle-fact" id="taj-fact">${this.facts[0]}</p>
        `;
        c.appendChild(sidebar);

        const board = document.createElement('div');
        board.className = 'puzzle-board';

        const half = this.cols / 2;
        const target = document.createElement('div');
        target.className = 'puzzle-target';
        target.style.gridTemplateColumns = `repeat(${this.cols}, 44px)`;
        target.style.gridTemplateRows = `repeat(${this.rows}, 44px)`;

        this.cellEls = [];
        for (let r = 0; r < this.rows; r++) {
            this.cellEls.push([]);
            for (let col = 0; col < this.cols; col++) {
                const isRight = col >= half;
                const cell = document.createElement('div');
                cell.className = 'puzzle-slot taj-cell';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '1.2rem';

                if (!isRight) {
                    cell.classList.add('filled');
                    cell.style.background = 'var(--cream)';
                    cell.style.color = 'var(--sandstone-dark)';
                    cell.textContent = this.leftPattern[r][col];
                } else {
                    const rc = col - half;
                    const isFlawed = this.flawed[r][rc];
                    cell.style.background = 'rgba(253,243,226,0.16)';
                    cell.style.color = 'var(--gold)';
                    cell.textContent = this.rightPattern[r][rc];
                    if (isFlawed) {
                        cell.addEventListener('click', () => this.fixCell(r, rc, cell));
                        cell.style.cursor = 'pointer';
                    } else {
                        cell.classList.add('filled');
                        cell.style.background = 'var(--cream)';
                        cell.style.color = 'var(--sandstone-dark)';
                    }
                    this.cellEls[r][rc] = cell;
                }
                target.appendChild(cell);
            }
        }

        board.appendChild(target);
        c.appendChild(board);

        this.updateProgress();
    }

    fixCell(r, rc, cell) {
        if (!this.flawed[r][rc]) return;
        this.flawed[r][rc] = false;
        const half = this.cols / 2;
        const correct = this.leftPattern[r][half - 1 - rc];
        cell.textContent = correct;
        cell.classList.add('filled');
        cell.style.background = 'var(--cream)';
        cell.style.color = 'var(--sandstone-dark)';
        cell.style.cursor = 'default';
        cell.replaceWith(cell.cloneNode(true)); // drop the click listener, cheaply

        this.fixed++;
        this.updateProgress();
        if (this.fixed >= this.totalFlaws) this.onRoundComplete();
    }

    updateProgress() {
        const pct = this.totalFlaws ? (this.fixed / this.totalFlaws) * 100 : 100;
        const fill = document.getElementById('taj-progress');
        const count = document.getElementById('taj-progress-count');
        const fact = document.getElementById('taj-fact');
        if (fill) fill.style.width = pct + '%';
        if (count) count.textContent = `${this.fixed} / ${this.totalFlaws}`;
        if (fact) fact.textContent = this.facts[Math.min(this.fixed, this.facts.length - 1)];
    }

    onRoundComplete() {
        setTimeout(() => {
            if (this.round < this.totalRounds) {
                this.round++;
                this.startRound();
            } else {
                this.finish(true);
            }
        }, 500);
    }

    finish(success) {
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'puzzle-complete-overlay';
            overlay.innerHTML = `<h2>Perfect symmetry restored!</h2><p>${this.facts[this.facts.length - 1]}</p>`;
            this.container.appendChild(overlay);
            setTimeout(() => {
                if (window.onTajMahalEnd) window.onTajMahalEnd(success);
            }, 1600);
        }, 200);
    }
}

function shuffleTaj(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}