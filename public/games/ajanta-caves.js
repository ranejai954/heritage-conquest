// js/ajanta-caves.js
// "Restore the Frescoes" — flip cards to find matching pairs of painting motifs.
// No timer, no penalty for a wrong guess beyond flipping back — pure memory play.

window.ajantaInstance = null;
window.onAjantaEnd = null;

function startAjantaCavesGame(containerId, onComplete) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Ajanta Caves Game: container not found!");
        if (onComplete) onComplete(false);
        return;
    }

    window.onAjantaEnd = (success) => {
        if (window.ajantaInstance) {
            window.ajantaInstance.cleanup();
            window.ajantaInstance = null;
        }
        if (onComplete) onComplete(success);
    };

    window.ajantaInstance = new AjantaMemoryGame(container);
    window.ajantaInstance.start();
}

// Original, simplified stylised motif icons (not reproductions of any real fresco)
const AJANTA_MOTIFS = [
    { id: 'lotus', label: 'Lotus', svg: `<svg viewBox="0 0 100 100"><g fill="#e0663f"><ellipse cx="50" cy="55" rx="14" ry="26" transform="rotate(0 50 55)"/><ellipse cx="50" cy="55" rx="14" ry="26" transform="rotate(60 50 55)"/><ellipse cx="50" cy="55" rx="14" ry="26" transform="rotate(120 50 55)"/><ellipse cx="50" cy="55" rx="14" ry="26" transform="rotate(180 50 55)"/><ellipse cx="50" cy="55" rx="14" ry="26" transform="rotate(240 50 55)"/><ellipse cx="50" cy="55" rx="14" ry="26" transform="rotate(300 50 55)"/></g><circle cx="50" cy="55" r="10" fill="#ffcf70"/></svg>` },
    { id: 'elephant', label: 'Elephant', svg: `<svg viewBox="0 0 100 100"><g fill="#8a5a2b"><ellipse cx="50" cy="55" rx="28" ry="20"/><path d="M74 50 q14 4 10 22 q-3 8 -10 4 z"/><circle cx="30" cy="42" r="8"/><rect x="20" y="70" width="8" height="18"/><rect x="40" y="70" width="8" height="18"/><rect x="58" y="70" width="8" height="18"/></g></svg>` },
    { id: 'peacock', label: 'Peacock', svg: `<svg viewBox="0 0 100 100"><g><circle cx="50" cy="45" r="14" fill="#2f8f6f"/><circle cx="50" cy="30" r="7" fill="#2f8f6f"/><g fill="none" stroke="#3aa88a" stroke-width="3"><path d="M50 45 q-25 5 -30 30"/><path d="M50 45 q0 30 0 40"/><path d="M50 45 q25 5 30 30"/></g><circle cx="20" cy="75" r="5" fill="#ffcf70"/><circle cx="50" cy="85" r="5" fill="#ffcf70"/><circle cx="80" cy="75" r="5" fill="#ffcf70"/></g></svg>` },
    { id: 'lamp', label: 'Oil Lamp', svg: `<svg viewBox="0 0 100 100"><g fill="#ffcf70"><ellipse cx="50" cy="65" rx="26" ry="12"/><rect x="46" y="45" width="8" height="20"/></g><path d="M50 45 q-6 -14 0 -22 q6 8 0 22" fill="#e0663f"/></svg>` },
    { id: 'mandala', label: 'Mandala', svg: `<svg viewBox="0 0 100 100"><g fill="none" stroke="#c1502e" stroke-width="3"><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="18"/></g><g fill="#ffcf70"><circle cx="50" cy="20" r="5"/><circle cx="80" cy="50" r="5"/><circle cx="50" cy="80" r="5"/><circle cx="20" cy="50" r="5"/></g></svg>` },
    { id: 'vine', label: 'Vine Border', svg: `<svg viewBox="0 0 100 100"><path d="M15 50 q17 -25 35 0 q17 25 35 0" fill="none" stroke="#3aa88a" stroke-width="4"/><g fill="#e0663f"><circle cx="25" cy="42" r="5"/><circle cx="50" cy="55" r="5"/><circle cx="75" cy="42" r="5"/></g></svg>` }
];

class AjantaMemoryGame {
    constructor(container) {
        this.container = container;
        this.matchedPairs = 0;
        this.totalPairs = AJANTA_MOTIFS.length;
        this.flipped = [];
        this.lock = false;
        this.facts = [
            "Ajanta's caves were carved out of solid rock starting around the 2nd century BCE.",
            "The paintings use natural pigments made from minerals and plants.",
            "There are 30 caves, mixing monasteries and prayer halls.",
            "The site was rediscovered in 1819 by a British officer out tiger hunting.",
            "Many paintings tell Jataka tales of the Buddha's past lives.",
            "The caves overlook a horseshoe-shaped gorge above the Waghora river."
        ];
    }

    cleanup() {
        this.container.innerHTML = '';
    }

    start() {
        this.matchedPairs = 0;
        this.flipped = [];
        this.render();
    }

    render() {
        const c = this.container;
        c.innerHTML = '';
        c.classList.add('memory-wrap');

        const sidebar = document.createElement('div');
        sidebar.className = 'puzzle-sidebar';
        sidebar.innerHTML = `
            <h2>AJANTA CAVES</h2>
            <p class="puzzle-sub">Restore the Frescoes</p>
            <p class="puzzle-instructions">Flip two cards at a time to find matching painting motifs.</p>
            <div class="puzzle-progress-label">PAIRS FOUND</div>
            <div class="puzzle-progress-track"><div class="puzzle-progress-fill" id="aj-progress"></div></div>
            <div class="puzzle-progress-count" id="aj-progress-count">0 / ${this.totalPairs}</div>
            <p class="puzzle-fact" id="aj-fact">${this.facts[0]}</p>
        `;
        c.appendChild(sidebar);

        const grid = document.createElement('div');
        grid.className = 'memory-grid';

        let cardData = [];
        AJANTA_MOTIFS.forEach(m => { cardData.push(m); cardData.push(m); });
        shuffleArr(cardData);

        this.cards = cardData.map((motif, i) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.motif = motif.id;
            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-back"></div>
                    <div class="memory-card-front">${motif.svg}</div>
                </div>
            `;
            card.addEventListener('click', () => this.onCardClick(card));
            grid.appendChild(card);
            return card;
        });

        c.appendChild(grid);
    }

    onCardClick(card) {
        if (this.lock) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        this.flipped.push(card);

        if (this.flipped.length === 2) {
            this.lock = true;
            const [a, b] = this.flipped;
            if (a.dataset.motif === b.dataset.motif) {
                setTimeout(() => {
                    a.classList.add('matched');
                    b.classList.add('matched');
                    this.matchedPairs++;
                    this.updateProgress();
                    this.flipped = [];
                    this.lock = false;
                    if (this.matchedPairs === this.totalPairs) this.onComplete();
                }, 350);
            } else {
                setTimeout(() => {
                    a.classList.remove('flipped');
                    b.classList.remove('flipped');
                    this.flipped = [];
                    this.lock = false;
                }, 800);
            }
        }
    }

    updateProgress() {
        const pct = (this.matchedPairs / this.totalPairs) * 100;
        const fill = document.getElementById('aj-progress');
        const count = document.getElementById('aj-progress-count');
        const fact = document.getElementById('aj-fact');
        if (fill) fill.style.width = pct + '%';
        if (count) count.textContent = `${this.matchedPairs} / ${this.totalPairs}`;
        if (fact) fact.textContent = this.facts[Math.min(this.matchedPairs, this.facts.length - 1)];
    }

    onComplete() {
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'puzzle-complete-overlay';
            overlay.innerHTML = `<h2>All the frescoes are restored!</h2><p>${this.facts[this.facts.length - 1]}</p>`;
            this.container.appendChild(overlay);
            setTimeout(() => {
                if (window.onAjantaEnd) window.onAjantaEnd(true);
            }, 1600);
        }, 400);
    }
}

function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
