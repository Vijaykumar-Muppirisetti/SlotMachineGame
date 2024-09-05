// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. repeat steps 2-6 until the user decides to stop playing

/**
 * Slot Machine
 *
 * This is a simple implementation of a slot machine game.
 *  The game allows users to deposit money, place bets,
 * spin the reels, and collect winnings.
 *
 * @author vijaykumar.muppirisetti
 */

const prompt = require("prompt-sync")();

const ROWS = 3;
/** @type {number} */
const COLS = 3;

/** @type {number} */

/**
 * Count of each symbols in the reels.
 * @type {Object<string, number>}
 */
const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

/**
 * Value of each symbol in the reels.
 *  @type {Object<string, number>}
 */
const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

/**
 * Deposits money into the user's account.
 *
 * @returns {number} The deposited amount.
 */
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount. Please enter a positive number.");
    } else {
      return numberDepositAmount;
    }
  }
};

/**
 * Gets the number of lines to bet on from the user.
 *
 * @returns {number} The number Lines to bet.
 */
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on(1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log(
        "Invalid number of lines. Please enter a number between 1 and 3."
      );
    } else {
      return numberOfLines;
    }
  }
};

/**
 * Gets the bet amount from the user.
 *
 * @param {number} balance - The user's current balance.
 * @param {number} lines - The number of lines to bet on.
 * @returns The bet amount.
 */
const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const betAmount = parseFloat(bet);

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / lines) {
      console.log("Invalid bet, try again.");
    } else {
      return betAmount;
    }
  }
};

/**
 * Spins the slot machine reels.
 *
 * @returns {Array<Array<string>>} The reels.
 */
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

/**
 * Transpose the reels to get the rows.
 * @param {Array<Array<string>>} reels - The reels.
 * @returns {Array<Array<string>>} The rows.
 */
const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

/**
 * Calculates the winnings based on the rows, bet, and lines.
 *
 * @param {Array<Array<string>>} rows - A 2D array of symbols, where each inner array represents a row.
 * @param {*} bet - The amount of lines played.
 * @param {*} lines - The number of lines played.
 * @returns {number} The total winnings.
 */
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

/**
 * The main game loop.
 *
 * This function will continue to run until the user chooses to stop playing or runs out of money.
 */
const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won, $ " + winnings.toString());

    if (balance <= 0) {
      console.log("You have run out of money! Game over.");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n)? ");

    if (playAgain != "y") break;
  }
};

game();
