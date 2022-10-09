/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const width = 7;
const height = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

// makeBoard where board = array of rows, each row is array of cells  (board[y][x])
function makeBoard() {
  for (let y = 0; y < height; y++) {
    board.push([]);
    for (let x = 0; x < width; x++) {
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");
  // Creates top row where a player clicks to insert piece into the board
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < width; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //Creates the game board using the height and width variables; Each cell is given a unique id set to it's (y,x coordinate) position on the board
  for (let y = 0; y < height; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < width; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = 5; y >= 0; y--) {
    let id = `${y}-${x}`;
    let position = document.getElementById(id);
    if (!position.classList.contains("selected")) {
      position.classList.add("selected");
      return y;
    } else {
    }
  }
  return null;
}

// Inserts a div into the appropriate table cell and adds a class
function placeInTable(y, x) {
  let id = `${y}-${x}`;
  const position = document.getElementById(id);
  const newDiv = document.createElement("div");
  position.append(newDiv);
  let player = `p${currPlayer}`;
  newDiv.classList.add("piece", player);
}

//Anounces the end of the game, whether a tie or a player has one.
function endGame(msg) {
  setTimeout(window.alert(msg), 5000);
  // TODO: pop up alert message
}

//handleClick: handle click of column top to play piece
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  //update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  let isTie = board.every((element) => element.every((val) => val !== null));
  if (isTie) {
    endGame("It's a Tie");
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

//checkForWin: check board cell-by-cell for "does a win start here?"
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < height &&
        x >= 0 &&
        x < width &&
        board[y][x] === currPlayer
    );
  }

  // checking subsections of the board to see if any of the criteria are met for four in a row based on the y,x coordinates.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
