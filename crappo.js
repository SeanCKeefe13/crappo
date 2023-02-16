/* eslint-disable */

//SELECT HTML ELEMENTS

const rollDiceButton = document.getElementById("rollDice");
const stealButton = document.getElementById('stealButton');
const endTurnButton = document.getElementById("endTurn");
const newPlayerButton = document.querySelector(".add-new-player");
const diceDiv = document.querySelectorAll("div .dice");
const gameLog = document.querySelector(".game-log")
//console.log(diceDiv);
const scoreBoard = document.querySelector(".score-board");

//EVENT LISTENERS
rollDiceButton.addEventListener("click", rollActiveDice);
endTurnButton.addEventListener("click", endTurn);
stealButton.addEventListener('click', stealCurrentRoll);
newPlayerButton.addEventListener('click', addNewPlayer)
//diceDiv.forEach((dice) => dice.addEventListener("click", selectDice));

//CLASS AND CREATING GAME OBJECTS

//dice constructor class
class MakeNewDice {
  constructor(id) {
    this.id = id;
    this.element = document.getElementById(id);
    this.selected = false;
    this.value = "";
    this.locked = false;
  }
}

//player character class
class NewPlayer {
    constructor(name, color) {
        this.name = name;
        this.totalScore = 0;
        this.isFirstRoll = true;
        this.avatarColor = color;
    }
}
const players = [];
let currentPlayer = null;
//make new player function
const avatarColors = ['#FF5722', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#FFC107', '#FF9800']
function addNewPlayer(){
  let randomIndex = Math.floor(Math.random() * (avatarColors.length));
  const color = avatarColors[randomIndex];

    const name = prompt('Enter your Name');
    players.push(new NewPlayer(name, color));
    currentPlayer = players[0]
    renderCurrentPlayer();
}

//turn order tracking function
function turnOrder(){
  let endingTurnPlayer;
  players.push(players.shift());
  currentPlayer = players[0];
  renderCurrentPlayer();
}


//create 6 random numbers to an array
const die1 = new MakeNewDice("dice1");
const die2 = new MakeNewDice("dice2");
const die3 = new MakeNewDice("dice3");
const die4 = new MakeNewDice("dice4");
const die5 = new MakeNewDice("dice5");
const die6 = new MakeNewDice("dice6");
const diceArr = [die1, die2, die3, die4, die5, die6];
//console.log(60, diceArr);

//GAME ACTIVITY FUNCTIONS

        //roll dice function
function rollDice() {
    currentPlayer.isFirstRoll = false;
    return Math.floor(Math.random() * 6 + 1);
  }
    //roll dice function
function rollActiveDice() {
  diceArr.forEach(function (die) {
    //lock dice
    if (die.selected) {
      die.locked = true;
      die.selected = !die.selected;
    }
  });

  reRollLockedDiceHandler();
    //roll available dice
  diceArr.forEach(function (die) {
      
    if (!die.locked) {
        // console.log(92, 'ROLLING');
      die.value = rollDice();
      //console.log(die);
    }
    //display on UI
    renderDiceValue(die);
  });

  selectScoringDice();
  const selectedDice = diceArr.filter((die) => die.selected);
  if (selectedDice.length === 0) {
    currentTurnScore = 0;
    endTurn();
  } else {
    currentTurnScore += calculateRollScore(selectedDice);
  }
  renderCurrentScore();
}

//let next player decide to steal current roll.
// const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));
function stealCurrentRoll(){
  rollActiveDice();
  stealButton.setAttribute('disabled');
  stealButton.classList.remove('steal-active')
  clearTimeout(wait);
}

    //end turn function
function endTurn(){
    currentPlayer.totalScore += currentTurnScore;
    currentPlayer.isFirstRoll = true;
    // if(players[1].totalScore >= 5000){
    //   stealButton.removeAttribute('disabled')
    //   stealButton.classList.add('steal-active');
    //   turnOrder();
    // }
      updateGameLog(currentPlayer, currentTurnScore)
      resetAllDice();
      turnOrder();
      currentTurnScore = 0;
      renderCurrentScore();
      return currentPlayer.totalScore;
    }
function updateGameLog(player, score){
  const diceText = diceArr.map(die => die.value).join(',');
  const logText = `${player.name} rolled ${diceText} and scored:${score}`;
  const logElement = document.createElement('li');
  logElement.innerText = logText;
  gameLog.prepend(logElement);
}

//reset all dice if all dice have been selected for scoring values
function reRollLockedDiceHandler() {
  console.log(97, diceArr);
  if (diceArr.every((die) => die.locked)) {
    resetAllDice();
  }
}

//reset dice helper function
function resetAllDice() {
  diceArr.forEach(function (die) {
    die.locked = false;
    die.selected = false;
    die.element.classList.remove("selected");
    die.element.innerText = '';
  });
}

//select dice div: deactivate dice div to stop rolls, collect value for score tracking
    //select and deactivate dice
function selectDice(targetDie) {
  targetDie.selected = !targetDie.selected;

  if (targetDie.selected) {
    targetDie.element.classList.add("selected");
  } else {
    targetDie.element.classList.remove("selected");
  }
}
    //auto select scoring dice
function selectScoringDice() {
  const unlockedDice = diceArr.filter((die) => !die.locked);
  const scoreTracker = calculateDiceCount(unlockedDice);
  unlockedDice.forEach(function (die) {
    if (die.value === 1 || die.value === 5 || scoreTracker[die.value] >= 3) {
      selectDice(die);
    }
  });
}
    //update selected dice to scoreTracker
function calculateDiceCount(dice) {
  const scoreTracker = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };
  

  for (const die of dice) {
    scoreTracker[die.value] += 1;
  }
// console.log(176, scoreTracker);
  return scoreTracker;
}
    
    //calculate score with dice value + test for possible score values
let currentTurnScore = 0;
function calculateRollScore(selectedDice) {
  // console.log(die)
  let currentRollScore = 0;

  const scoreTracker = calculateDiceCount(selectedDice);
  //first turn special cases...
  if (currentPlayer.isFirstRoll && Object.values(scoreTracker).every((val) => val === 0)) {
    currentRollScore -= 500;
    //run endTurn function here
    return currentRollScore;
  }
    
  //potential score conditions
  if (Object.values(scoreTracker).every((val) => val === 1)) {
    currentRollScore += 5000;
    return currentRollScore;
  }

  
  for (const key of Object.keys(scoreTracker)) {
    const dieValue = Number(key);
    let dieBaseScore = dieValue === 1 ? 10 : dieValue;

    if (scoreTracker[dieValue] === 6) {
      currentRollScore += dieBaseScore * 400;
    }

    if (scoreTracker[dieValue] === 5) {
      currentRollScore += dieBaseScore * 300;
    }

    if (scoreTracker[dieValue] === 4) {
      currentRollScore += dieBaseScore * 200;
    }

    if (scoreTracker[dieValue] === 3) {
      currentRollScore += dieValue * 100;
    }

    if (dieValue === 1 && scoreTracker[dieValue] < 3) {
      currentRollScore += 100 * scoreTracker[dieValue];
    }

    if (dieValue === 5 && scoreTracker[dieValue] < 3) {
      currentRollScore += 50 * scoreTracker[dieValue];
    }
  }
  return currentRollScore;
}
//STEAL BUTTON/FUNCTIONS

//RENDER AND UPDATE UI
function renderDiceValue(die) {
  die.element.innerText = die.value;
}

function renderCurrentScore() {
  scoreBoard.innerText = currentTurnScore;
}

function renderCurrentPlayer(){
  const playerAvatar = document.querySelector('.player-avatar');
  const playerName = document.querySelector('.player-name');
  const playerScore = document.querySelector('.player-total-score');
  playerName.innerText = currentPlayer.name;
  playerAvatar.style.backgroundColor = currentPlayer.avatarColor;
  playerAvatar.innerText = currentPlayer.name[0];
  playerScore.innerText = currentPlayer.totalScore;
}
