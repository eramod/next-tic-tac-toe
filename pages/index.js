import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Game.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next Tic Tac Toe</title>
        <meta
          name="description"
          content="Tic tac toe app in Next.js using React with hooks"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Game />
    </div>
  );
}

function Game() {
  /**
   * history will look something like this:
   * history: [
   *  { squares :
   *     [ null, null, null,
   *       null, null, null,
   *       null, null, null
   *  },
   *  ...
   *  { squares:
   *    ["O", null, "X",
   *    "X", "X", "O",
   *    "O", null, null]
   *  },
   * ]
   */
  const [history, setHistory] = useState(() => [
    { squares: Array(9).fill(null) },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const current = history[stepNumber];

  /**
   * Updates the clicked on square's content with "X' or "O" based on the
   * current player and adds the current state to `history`.
   *
   * @param {*} i The index of the square that was clicked
   */
  function handleClick(i) {
    const squares = current.squares.slice(); // make a copy of the state. Good for immutability.

    // Ignore the click if there's already a winner or if the square clicked on is already filled.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Update the content of the square that was clicked
    squares[i] = xIsNext ? "X" : "O";

    // Update history to include the modified copy of the squares array
    setHistory(
      history.concat([
        {
          squares: squares,
        },
      ])
    );

    setStepNumber(history.length);

    // Flip the current player
    setXIsNext(!xIsNext);
  }

  /**
   * Sets the current state to the `squares` element corresponding to the move
   * number passed in and updates the current player.
   *
   * @param {} step The index of the move to jump to
   */
  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  let status;
  const winner = calculateWinner(current.squares);

  if (winner) {
    status = `Winner: ${winner}`;
  } else if (!current.squares.includes(null)) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  // Step variable refers to current history element value, and move refers to the current history element index.
  const moves = history.map((_step, move) => {
    const description = move ? `Go to move ${move}` : `Go to game start`;

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className={styles.game}>
      <div className={styles.gameBoard}>
        <Board
          squares={current.squares}
          onClick={(i) => {
            handleClick(i);
          }}
        />
      </div>

      <div className={styles.info}>
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// The parent component should track common state for its children to keep them in sync. Here, keeping the state of all squares in the Board component will allow it to determine the winner in the future.
function Board(props) {
  function renderSquare(i) {
    return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
  }

  return (
    <div>
      <div className={styles.boardRow}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={styles.boardRow}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={styles.boardRow}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

// NOTE: Squares are now 'controlled components' because they don't manage any state. They are fully controlled by the Board component. Their value is passed to them and they inform the Board component when they're clicked so the Board component can handle the event. When a component does not manage any state, it's best to make it a function component. Note that in a function component, event handling properties such as onClick must be passed as a variable instead of callback as you do in class components.
function Square(props) {
  return (
    <button className={styles.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * Given an array of 9 squares, this function will check for a winner and return
 * 'X', 'O', or null if there is currently no winner.
 * @param {*} squares
 * @returns
 */
function calculateWinner(squares) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningCombos.length; i++) {
    let [a, b, c] = winningCombos[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
