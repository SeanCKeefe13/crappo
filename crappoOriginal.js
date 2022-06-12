/* eslint-disable */ 
//select elements

const rollDiceButton = document.getElementById('rollDice');
const diceDiv = document.querySelectorAll('div.dice');
console.log(diceDiv)
const scoreBoard = document.querySelector('.scoreBoard');

//event listeners
rollDiceButton.addEventListener('click', rollActiveDice);

diceDiv.forEach(dice => dice.addEventListener('click', selectDiceValue))

//roll dice function
function rollDice(){
    return Math.floor(Math.random()* 6 +1);
}
//handle roll dice button click
   //create 6 random numbers to an array
   //dice constructor class
   class MakeNewDice{
    constructor(id){
        this.id = id;
        this.element = document.getElementById(id);
        this.active = true;
        this.value = '';
    }
};


const die1 = new MakeNewDice('dice1');
const die2 = new MakeNewDice('dice2');
const die3 = new MakeNewDice('dice3');
const die4 = new MakeNewDice('dice4');
const die5 = new MakeNewDice('dice5');
const die6 = new MakeNewDice('dice6');
const diceArr = [die1, die2, die3, die4, die5, die6];
//console.log(diceArr);

//dice score tracking object
const scoreTracker = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
};
console.log(scoreTracker)
function rollActiveDice(){
    diceArr.forEach(function(die){
        if(die.active){
            die.value = rollDice();
            //console.log(die);
        }
        renderDiceValue(die);
        renderCurrentScore();
    });
};

//score data
//select dice div: deactivate dice div to stop rolls, collect value for score tracking
    //select and deactivate dice    
function selectDiceValue(e){
    const dieId = e.currentTarget.id;
    const targetDie = diceArr.find(die=> die.id === dieId);
    targetDie.active = !targetDie.active;

    if(!targetDie.active){
        targetDie.element.classList.add('selected');
    }else{
        targetDie.element.classList.remove('selected');
    }
    updateScoreTracker(targetDie)
    updateCurrentScore(targetDie)
}

    //track score with dice value + test for possible score values
function updateScoreTracker(die){
    scoreTracker[die.value] += 1;
};
let currentTurnScore = 0;
function updateCurrentScore(die){
    // console.log(die)
    //if no points on first roll - 500 points
    
    if(Object.values(scoreTracker).every(val=> val === 1)){
        currentTurnScore += 5000
    };
    if(scoreTracker[die.value] === 6){
         currentTurnScore += die.value * 400;
     };
    if(scoreTracker[die.value] === 5){
         currentTurnScore += die.value * 300;
     }; 
    
    if(scoreTracker[die.value] === 4){
         currentTurnScore += die.value * 200;
     }; 
    if(scoreTracker[die.value] === 3){
         currentTurnScore += die.value * 100;
     };
     if(die.value === 1 && scoreTracker[die.value] < 3){
         currentTurnScore += 100;
     };
     if(die.value === 5 && scoreTracker[die.value] < 3){
        currentTurnScore += 50;
    };
};
//turn order

//update UI
    function renderDiceValue(die){
        die.element.innerText = die.value;
    };

    function renderCurrentScore(){
        scoreBoard.innerText = currentTurnScore;
    }