const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];

let playerHand = [];
let dealerHand = [];
let isGameOver = false;

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

function renderHand(hand, div) {
  div.innerHTML = '';
  for (let card of hand) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.textContent = card.val + card.suit;
    div.appendChild(cardDiv);
  }
}

function hit() {
  if (isGameOver) return;
  playerHand.push(deck.pop());
  update();
  if (getHandValue(playerHand) > 21) endGame();
}

function stand() {
  if (isGameOver) return;
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

  if (playerScore > 21) result = 'You busted! Dealer wins.';
  else if (dealerScore > 21) result = 'Dealer busted! You win!';
  else if (playerScore > dealerScore) result = 'You win!';
  else if (dealerScore > playerScore) result = 'Dealer wins!';
  else result = 'It\'s a draw!';

  update();
  resultDiv.textContent = result;
}

function update() {
  renderHand(playerHand, playerDiv);
  renderHand(dealerHand, dealerDiv);
  playerScoreDiv.textContent = 'Score: ' + getHandValue(playerHand);
  dealerScoreDiv.textContent = 'Score: ' + getHandValue(dealerHand);
}

function startGame() {
  isGameOver = false;
  resultDiv.textContent = '';
  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  update();
}

startGame();
