//05/02/22

/* eslint-disable */

//select elements

const rollDiceButton = document.getElementById("rollDice");
const diceDiv = document.querySelectorAll("div.dice");
console.log(diceDiv);
const scoreBoard = document.querySelector(".scoreBoard");

//event listeners
rollDiceButton.addEventListener("click", rollActiveDice);

diceDiv.forEach((dice) => dice.addEventListener("click", selectDice));

//roll dice function
function rollDice() {
  return Math.floor(Math.random() * 6 + 1);
}
//handle roll dice button click

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
//create 6 random numbers to an array
const die1 = new MakeNewDice("dice1");
const die2 = new MakeNewDice("dice2");
const die3 = new MakeNewDice("dice3");
const die4 = new MakeNewDice("dice4");
const die5 = new MakeNewDice("dice5");
const die6 = new MakeNewDice("dice6");
const diceArr = [die1, die2, die3, die4, die5, die6];
//console.log(diceArr);

function rollActiveDice() {
  diceArr.forEach(function (die) {
    //lock dice
    if (die.selected) {
      die.locked = true;
      die.selected = !die.selected;
    }
  });

  diceResetController();

  diceArr.forEach(function (die) {
    if (!die.locked) {
      die.value = rollDice();
      //console.log(die);
    }
    renderDiceValue(die);
  });
  selectScoringDice();
  const selectedDice = diceArr.filter((die) => die.selected);
  if (selectedDice.length === 0) {
    //end turn
    currentTurnScore = 0;
  } else {
    currentTurnScore += calculateRollScore(selectedDice);
  }
  renderCurrentScore();
}

//function to detect if dice can be reset on endTurn and when all dice have been locked.
function diceResetController() {
  console.log(97, diceArr);
  if (diceArr.every((die) => die.locked)) {
    resetAllDice();
  }
  //end turn here...
}

//reset dice helper function
function resetAllDice() {
  diceArr.forEach(function (die) {
    die.locked = false;
    die.selected = false;
    die.element.classList.remove("selected");
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
  //updateScoreTracker(targetDie)
  // updateRollScore(targetDie)
}
//auto track dice
function selectScoringDice() {
  const unlockedDice = diceArr.filter((die) => !die.locked);
  const scoreTracker = calculateDiceCount(unlockedDice);
  unlockedDice.forEach(function (die) {
    if (die.value === 1 || die.value === 5 || scoreTracker[die.value] >= 3) {
      selectDice(die);
    }
  });
}
//auto track dice scoreTracker helper
function calculateDiceCount(dice) {
  const scoreTracker = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };
  console.log(145, scoreTracker);

  for (const die of dice) {
    scoreTracker[die.value] += 1;
  }

  return scoreTracker;
}
//track score with dice value + test for possible score values

let currentTurnScore = 0;
function calculateRollScore(selectedDice) {
  // console.log(die)
  //if no points on first roll - 500 points
  let currentRollScore = 0;

  const scoreTracker = calculateDiceCount(selectedDice);
  //first turn special cases...

  if (Object.values(scoreTracker).every((val) => val === 0)) {
    currentRollScore -= 500;
    //run endTurn function here
    return currentRollScore;
  }

  if (Object.values(scoreTracker).every((val) => val === 1)) {
    currentRollScore += 5000;
    return currentRollScore;
  }

  for (const key of Object.keys(scoreTracker)) {
    const dieValue = Number(key);
    let dieBaseScore = dieValue === 1 ? 10 : dieValue * 100;

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

//turn order

//update UI
function renderDiceValue(die) {
  die.element.innerText = die.value;
}

function renderCurrentScore() {
  scoreBoard.innerText = currentTurnScore;
}
/* -----------------------------------------------------------------------------------------------------------------------------*/


//05/08/22

/* eslint-disable */

//SELECT HTML ELEMENTS

const rollDiceButton = document.getElementById("rollDice");
const endTurnButton = document.getElementById("endTurn");
const newPlayerButton = document.getElementById("addNewPlayer");
const diceDiv = document.querySelectorAll("div.dice");
//console.log(diceDiv);
const scoreBoard = document.querySelector(".scoreBoard");

//EVENT LISTENERS
rollDiceButton.addEventListener("click", rollActiveDice);
endTurnButton.addEventListener("click", endTurn);
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
    constructor(name) {
        this.name = name;
        this.totalScore = 0;
        this.isFirstRoll = true;
    }
}

//make new player function
// function addNewPlayer(){
//     const players = [];
//     const name = prompt('Enter your Name');
//     players.push(new NewPlayer(name));
// }

const player1 = new NewPlayer('player1');

//update currentPlayer with turn order later...
const currentPlayer = player1;

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

  diceResetController();
    //roll available dice
  diceArr.forEach(function (die) {
      
    if (!die.locked) {
        console.log(84, 'ROLLING');
      die.value = rollDice();
      //console.log(die);
    }
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

    //end turn function
function endTurn(){
    currentPlayer.totalScore += currentTurnScore;
    currentPlayer.isFirstRoll = true;  
    resetAllDice();
    return currentPlayer.totalScore;
}

//function to detect if dice can be reset on endTurn and when all dice have been locked.
function diceResetController() {
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
    // die.element.innerText = '';
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
  console.log(145, scoreTracker);

  for (const die of dice) {
    scoreTracker[die.value] += 1;
  }

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
    let dieBaseScore = dieValue === 1 ? 10 : dieValue * 100;

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

//turn order

//RENDER AND UPDATE UI
function renderDiceValue(die) {
  die.element.innerText = die.value;
}

function renderCurrentScore() {
  scoreBoard.innerText = currentTurnScore;
}


/*      -----------------------------------------------------------------------------------------------------------------    */