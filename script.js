const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];

let playerHand = [];
let dealerHand = [];

let isGameOver = false;
let balance = 1000;
let currentBet = 100;

let isStand = false;

const dealerDiv = document.getElementById('dealer-hand');
const playerDiv = document.getElementById('player-hand');
const dealerScoreDiv = document.getElementById('dealer-score');
const playerScoreDiv = document.getElementById('player-score');
const resultDiv = document.getElementById('result');

document.getElementById('hit-btn').addEventListener('click', hit);
document.getElementById('stand-btn').addEventListener('click', stand);
document.getElementById('restart-btn').addEventListener('click', startGame);

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let val of values) {
      deck.push({ suit, val });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function cardValue(card) {
  if (['J', 'Q', 'K'].includes(card.val)) return 10;
  if (card.val === 'A') return 11;
  return parseInt(card.val);
}

function getHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (let card of hand) {
    value += cardValue(card);
    if (card.val === 'A') aces++;
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function renderHand(hand, div, hideSecondCard = false) {
  div.innerHTML = '';
  hand.forEach((card, i) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    if (i === 1 && hideSecondCard && !isStand) {
      cardDiv.textContent = '🂠';
    } else {
      cardDiv.textContent = card.val + card.suit;
    }
    div.appendChild(cardDiv);
  });
}

function hit() {
  if (isGameOver) return;
  playerHand.push(deck.pop());
  update();
  if (getHandValue(playerHand) > 21) endGame();
}

function stand() {
  if (isGameOver) return;
  isStand = true;
  while (getHandValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  endGame();
}

function endGame() {
  isGameOver = true;
  const playerScore = getHandValue(playerHand);
  const dealerScore = getHandValue(dealerHand);
  let result = '';
  let color = '';

  if (playerScore > 21) {
    result = 'You busted! Dealer wins.';
    color = 'red';
  } else if (dealerScore > 21) {
    result = 'Dealer busted! You win!';
    color = 'green';
  } else if (playerScore > dealerScore) {
    result = 'You win!';
    color = 'green';
  } else if (dealerScore > playerScore) {
    result = 'Dealer wins!';
    color = 'red';
  } else {
    result = 'It\'s a draw!';
    color = 'white';
  }

  update();
  resultDiv.textContent = result;
  resultDiv.style.color = color;
}

function update() {
  renderHand(playerHand, playerDiv);
  renderHand(dealerHand, dealerDiv, true);
  playerScoreDiv.textContent = 'Score: ' + getHandValue(playerHand);
  dealerScoreDiv.textContent = isStand ? 'Score: ' + getHandValue(dealerHand) : 'Score: ?';
}

function startGame() {
  isGameOver = false;
  isStand = false;
  resultDiv.textContent = '';
  resultDiv.style.color = 'white';
  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  update();
}

startGame();


document.getElementById('increase-bet').addEventListener('click', () => {
  if (currentBet + 10 <= balance) {
    currentBet += 10;
    updateBet();
  }
});

document.getElementById('decrease-bet').addEventListener('click', () => {
  if (currentBet - 10 >= 10) {
    currentBet -= 10;
    updateBet();
  }
});

function updateBet() {
  document.getElementById('bet-amount').textContent = '$' + currentBet;
  document.getElementById('balance').textContent = 'Balance: $' + balance;
}

function endGame() {
  isGameOver = true;
  const playerScore = getHandValue(playerHand);
  const dealerScore = getHandValue(dealerHand);
  let result = '';
  let color = '';

  if (playerScore > 21) {
    result = 'You busted! Dealer wins.';
    color = 'red';
    balance -= currentBet;
  } else if (dealerScore > 21) {
    result = 'Dealer busted! You win!';
    color = 'green';
    balance += currentBet;
  } else if (playerScore > dealerScore) {
    result = 'You win!';
    color = 'green';
    balance += currentBet;
  } else if (dealerScore > playerScore) {
    result = 'Dealer wins!';
    color = 'red';
    balance -= currentBet;
  } else {
    result = 'It\'s a draw!';
    color = 'white';
  }

  update();
  resultDiv.textContent = result;
  resultDiv.style.color = color;
  updateBet();
}

function startGame() {
  if (balance < currentBet) {
    alert("Not enough balance to play.");
    return;
  }
  isGameOver = false;
  isStand = false;
  resultDiv.textContent = '';
  resultDiv.style.color = 'white';
  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  update();
  updateBet();
}

updateBet();
