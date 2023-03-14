// selecting the DOM
function select(name) {
  return document.querySelector(name);
}
function selectAll(name) {
  return document.querySelectorAll(name);
}

const rulesBtn = select('#rules');
const closeBtns = selectAll('.closeBtn');
const rock = select('#rock');
const paper = select('#paper');
const scissors = select('#scissors');
const scoreResult = select('#score');
const modal = select('#modal');

var score = lS(0);
scoreResult.innerHTML = lS(0);

// LocalStorage functionality
function lS(initialValue) {
  const localData = localStorage.key('score');
  return localData ? Number(localStorage.getItem('score')) : initialValue;
}

// Event Listeners
rock.addEventListener('click', playGame);
paper.addEventListener('click', playGame);
scissors.addEventListener('click', playGame);
rulesBtn.addEventListener('click', () => openCloseModal(modal));
closeBtns.forEach(closeBtn => {
  return closeBtn.addEventListener('click', () => openCloseModal(modal));
});

function openCloseModal(element) {
  return element.classList.toggle('show__modal');
}

function computerRandom(games) {
  return games[Math.floor(Math.random() * games.length)];
}

function playGame() {
  const userChoice = this.id;
  const computerChoice = computerRandom(['rock', 'paper', 'scissors']);
  const game = select('.game');

  const {userButton, computerButton} = gameTemplate(userChoice, computerChoice);
  const result = rules(userChoice, computerChoice);

  game.classList.add('max__width');

  setTimeout(() => {
    if (result === 'win') {
      scoreResult.innerHTML = add();
      userButton.classList.add('winner__boxShadow');
    }
    if (result === 'lose') {
      scoreResult.innerHTML = subtract();
      computerButton.classList.add('winner__boxShadow');
    }
  }, 400);

  return winLose(result);
}

function add() {
  score = score + 1;
  localStorage.setItem('score', String(score));
  return (scoreResult.innerHTML = score);
}

function subtract() {
  score = score === 0 ? 0 : score - 1;
  localStorage.setItem('score', String(score));
  return (scoreResult.innerHTML = score);
}

function rules(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return `draw`;
  }

  switch (userChoice) {
    case 'paper': {
      return computerChoice === 'rock' ? 'win' : 'lose';
      break;
    }
    case 'rock': {
      return computerChoice === 'scissors' ? 'win' : 'lose';
      break;
    }
    case 'scissors': {
      return computerChoice === 'paper' ? 'win' : 'lose';
      break;
    }
  }

  return null;
}

function winLose(result) {
  const playAgainBtn = select('#playAgain');
  const playAgain = select('.play__again');
  const game = select('.game');
  const winLoseDraw = select('#winLoseDraw');

  setTimeout(() => {
    playAgain.style.display = 'block';
    if (result === 'win') {
      winLoseDraw.innerHTML = 'You Win';
    }
    if (result === 'lose') {
      winLoseDraw.innerHTML = 'You Lose';
    }
    if (result === 'draw') {
      winLoseDraw.innerHTML = "It's a Draw";
    }
  }, 400);

  return playAgainBtn.addEventListener('click', () => {
    playAgainFn(game, playAgain);
  });
}

function playAgainFn(game, playAgain) {
  try {
    game.removeChild(select('.game__grade'));
  } catch (error) {}

  game.style.backgroundImage = 'url("../images/bg-triangle.svg")';
  game.children[0].style.display = 'flex';
  game.children[1].style.display = 'flex';
  game.classList.remove('max__width');

  playAgain.style.display = 'none';

  return;
}

function gameTemplate(userChoice, computerChoice) {
  if ('content' in document.createElement('template')) {
    const game = select('.game');
    const template = select('#gameTemplate');

    game.style.backgroundImage = 'none';
    game.children[0].style.display = 'none';
    game.children[1].style.display = 'none';

    const clone = template.content.cloneNode(true);
    const gameButton = clone.querySelectorAll('.game__button');
    gameButton[0].classList.add(`game__button--${userChoice}`);
    gameButton[0].children[0].children[0].src = `./images/icon-${userChoice}.svg`;

    gameButton[1].style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
    gameButton[1].children[0].style.display = 'none';

    setTimeout(() => {
      gameButton[1].children[0].style.display = 'flex';
      const img = document.createElement('img');
      img.setAttribute('src', `./images/icon-${computerChoice}.svg`);
      img.setAttribute('alt', `icon-${computerChoice}`);
      gameButton[1].classList.add(`game__button--${computerChoice}`);
      gameButton[1].children[0].appendChild(img);
    }, 400);

    game.appendChild(clone.firstElementChild);

    return {userButton: gameButton[0], computerButton: gameButton[1]};
  }
  return;
}
