const emojis = ['🦄', '🦊', '🐼', '🦁', '🤖', '🚀', '🍕', '🥑'];
const cardsArray = [...emojis, ...emojis];

let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let score = 0;
let isLockBoard = false;
let seenCards = new Set();

const grid = document.getElementById('grid');
const movesDisplay = document.getElementById('moves');
const scoreDisplay = document.getElementById('score');
const winModal = document.getElementById('winModal');
const winMessage = document.getElementById('winMessage');
const resetButton = document.getElementById('resetButton');
const closeModalButton = document.getElementById('closeModalButton');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function createBoard() {
    grid.innerHTML = '';
    shuffle(cardsArray);

    cardsArray.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.id = index;

        card.innerHTML = `
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">${emoji}</div>
        `;

        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (isLockBoard) return;
    if (this === flippedCards[0]) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.innerText = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.emoji === card2.dataset.emoji;

    if (isMatch) {
        disableCards(card1, card2);
    } else {
        unflipCards(card1, card2);
    }
}

function disableCards(card1, card2) {
    card1.classList.add('matched');
    card2.classList.add('matched');

    score += 10;
    scoreDisplay.innerText = score;

    matchedCount += 2;
    resetTurn();

    if (matchedCount === cardsArray.length) {
        setTimeout(endGame, 600);
    }
}

function unflipCards(card1, card2) {
    isLockBoard = true;

    if (seenCards.has(card1.dataset.id) || seenCards.has(card2.dataset.id)) {
        score = Math.max(0, score - 2);
        scoreDisplay.innerText = score;
    }

    seenCards.add(card1.dataset.id);
    seenCards.add(card2.dataset.id);

    setTimeout(() => {
        card1.classList.add('shake');
        card2.classList.add('shake');
    }, 200);

    setTimeout(() => {
        card1.classList.remove('flipped', 'shake');
        card2.classList.remove('flipped', 'shake');
        resetTurn();
    }, 1000);
}

function resetTurn() {
    flippedCards = [];
    isLockBoard = false;
}

function endGame() {
    winMessage.innerHTML = `Oyunu <strong>${moves}</strong> gedişlə və toplam <strong>${score}</strong> xalla bitirdiniz! Bu əla nəticədir.`;
    winModal.style.display = 'flex';
}

function resetGame() {
    moves = 0;
    score = 0;
    matchedCount = 0;
    flippedCards = [];
    isLockBoard = false;
    seenCards.clear();

    movesDisplay.innerText = moves;
    scoreDisplay.innerText = score;
    createBoard();
}

function closeModal() {
    winModal.style.display = 'none';
    resetGame();
}

resetButton.addEventListener('click', resetGame);
closeModalButton.addEventListener('click', closeModal);
createBoard();
