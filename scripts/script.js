const textBelowBoard = document.querySelector('.status');
const playerX = "X";// global constant, allows to make changes to the X variables throughout the code.
const playerO = "O";//
const delayMin = 100;//
const delayMax = 300;//

let scoreboardPlayerWins = 0;
let scoreboardComputerWins = 0;
let scoreboardDrawAmount = 0;

let isGameRunning = true;
let startingPlayerProb = Math.random()
let currentPlayer = playerX;

let slots = ["", "", "",
    "", "", "",
    "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `DRAW!`;
const whoseTurnIsItMessage = () => `It's ${currentPlayer}'s turn`;

textBelowBoard.innerHTML = whoseTurnIsItMessage();

const winningConditions = 
[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// This determines what player begins the game. `prob` is a variable containing
// a randomly-generated decimal between 0 and 1 (ex. 0.314). If the value is greater
// than 0.5, in other words, if it's greater than 50%, then the starting player will be X.
// Otherwise, the starting player will be O.
if (startingPlayerProb >= 0.5) 
{
    setCurrentPlayer(playerX)
}
else {
    setCurrentPlayer(playerO)
}

/**
 * This function sets the given player as the current player, and updates the
 * status display to reflect the change. If the provided player is the computer,
 * in other words, O, then the computer will make a move.
 */
function setCurrentPlayer(player) 
{
    currentPlayer = player;
    textBelowBoard.innerHTML = whoseTurnIsItMessage();

    // If the new turn owner is the computer, instruct it to make
    // a move.
    if (currentPlayer === playerO) 
    {
        handleComputerTurn()
    }
}

/**
 * Change the turn owner to the opposite player of whatever the current player is.
 * For example, if the current player is X, then this function will change the
 * current player to O, and vice versa.
 */
function cyclePlayerTurn() 
{
    setCurrentPlayer(currentPlayer === playerX ? playerO : playerX) //ternary operator, if currentplayer is X, then switch it to O, otherwise make it X
    console.log(currentPlayer);
}

/**
 * Check if the game has been won by a player, or if it's a draw.
 * If the game is won, the game will be paused, and the winning player will be
 * displayed in the status display.
 */
function checkWin() 
{
    let didSomeoneWin = false;// while game is still going do 
    for (let i = 0; i <= 7; i++) 
    {
        const winCondition = winningConditions[i];

        let a = slots[winCondition[0]];
        let b = slots[winCondition[1]];
        let c = slots[winCondition[2]];
        console.log(a);
        console.log(b);
        console.log(c);
        if (a === '' || b === '' || c === '') {
            continue;
        }
        //Color of cells when won
        if (a === b && b === c) {
            didSomeoneWin = true;
            document.getElementById(winCondition[0]).style.backgroundColor = "aqua"
            document.getElementById(winCondition[1]).style.backgroundColor = "aqua"
            document.getElementById(winCondition[2]).style.backgroundColor = "aqua"
            break
        }
    }

    if (didSomeoneWin) 
    {
        isGameRunning = false;// stop the game
        textBelowBoard.innerHTML = winningMessage();//show winning message

        if (currentPlayer === playerX) 
        {
            console.log(currentPlayer);
            scoreboardPlayerWins ++;
            document.getElementById("PlayerW").innerHTML = scoreboardPlayerWins;
        }
        else
        {
            scoreboardComputerWins ++;
            document.getElementById("ComputerW").innerHTML = scoreboardComputerWins;
        }
    }

    // If there are no empty slots, and nobody has won, the round is a draw.
    const isRoundDraw = !slots.includes("") && !didSomeoneWin; //the game is a draw if there are no empty spots and no one won

    if (isRoundDraw) 
    {
        textBelowBoard.innerHTML = drawMessage();
        scoreboardDrawAmount ++;
        document.getElementById("DrawsW").innerHTML = scoreboardDrawAmount;
        isGameRunning = false; //stop the game
        textBelowBoard.style.color = "rgb(251,100,204)";
    }
}

/**
 * This function is invoked once the PLAYER (not the computer) clicks on
 * a cell, with the intention to make a move. If it is the computer's turn,
 * nothing will happen; the player can only play if it's their turn.
 */
function handlePlayerMove(clickedCellEvent) 
{
    // Player cannot play if it's the computer's turn.
    if (currentPlayer === playerO) 
    {
        return;
    }

    const clickedCell = clickedCellEvent.target;
    textBelowBoard.innerHTML = whoseTurnIsItMessage();
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (slots[clickedCellIndex] !== "" || !isGameRunning) //if the cell is not empty OR the game is paused , do nothing/ignore the click.
    {
        return;
    }

    slots[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = playerX
    checkWin() //check if some1 won after every move.

    // If the game is still active, in other words, if nobody has won yet or
    // drawn, cycle the turn to the computer.
    if (isGameRunning) //needed , in case someone wins to stop the game.
    {
        cyclePlayerTurn()
    }
}

function handleComputerTurn() 
{
    // By using `setTimeout`, we create an artificial delay, making it
    // look like the computer is "thinking".
    setTimeout(() => 
    {
        computerPickRandomMove()
        checkWin()

        if (isGameRunning)
            cyclePlayerTurn()
    }, Math.random() * delayMax + delayMin) //delay
}

function computerPickRandomMove() 
{
    let moveIndex = null;

    // Randomly pick a next move. Loop until a valid, empty spot is found.
    while (true) 
    {
        moveIndex = Math.round(Math.random() * 8) //checks for empty slots

        if (slots[moveIndex] === "") //if we find an empty slot , finish the loop.
        {
            break;
        }
    }

    slots[moveIndex] = playerO;
    document.getElementById(moveIndex).innerHTML = playerO;
}

function handleRestartGame() 
{
    const startingPlayerProb = Math.random()// use const when you are declaring a variable that will not change in that function

    if (startingPlayerProb >= .5) {
        setCurrentPlayer(playerX);
    }
    else {
        setCurrentPlayer(playerO);
    }

    isGameRunning = true;
    slots = ["", "", "", "", "", "", "", "", ""];
    textBelowBoard.style.color = "rgb(65, 65, 65)";
    textBelowBoard.innerHTML = whoseTurnIsItMessage();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    document.querySelectorAll('.cell').forEach(cell => cell.style.backgroundColor = "transparent");

    checkWin()
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handlePlayerMove));
document.querySelector('.restart').addEventListener('click', handleRestartGame);
