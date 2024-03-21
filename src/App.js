import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [turnCount, setTurnCount] = useState(0);
    const [isTimeToMove, setTimeToMove] = useState(false);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [error, setError] = useState("");
    
    const chorusStarted = (turnCount === 6);
    let status;

    function handleClick(i) {
        if (chorusStarted) {
          chorusLapilli(i);
        } else {
          tictactoe(i)
        }
    }

    function chorusLapilli(i) {
      if (calculateWinner(squares)) {
        return;
      }

      if (isTimeToMove) {
          moveSquare(i);
      } else {
          selectSquare(i);
      }
    }

    // Select the square for each turn.
    function selectSquare(i) {
        if (xIsNext && squares[i] === 'X') {
            setSelectedSquare(i);
            setTimeToMove(true);
        } else if (!xIsNext && squares[i] === 'O') {
            setSelectedSquare(i);
            setTimeToMove(true);
        }
    }

    // Move the square for each turn.
    function moveSquare(i) {
        if (squares[i] || !acceptableSquaresToMove(selectedSquare).includes(i)) {
            setError("You can't move to this position.");
            setTimeToMove(false);
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[i] = squares[selectedSquare];
        nextSquares[selectedSquare] = null;

        // IF the center is occupied and the player attempts to move a non-center piece.
        if (selectedSquare !== 4 && isCenterOccupied()) {
            const isWinningMove = calculateWinner(nextSquares);
            if (isWinningMove) {
              setSquares(nextSquares);
              setXIsNext(!xIsNext);
              setError("");
            } else {
              setError("You must win in order to move this piece, or vacate the center square");
            }
        } else {
            setSquares(nextSquares);
            setXIsNext(!xIsNext);
            setError("");
        }
          
        setTimeToMove(false);
    }

    // Check if the center is occupied for each turn.
    function isCenterOccupied() {
        if (xIsNext && squares[4] === 'X') {
            return true;
        } 
        
        if (!xIsNext && squares[4] === 'O') {
            return true;
        }

        return false;
    }

    // Takes the index of the selected square and returns a list of valid adjacent squares indexes.
    function acceptableSquaresToMove(i) {
        if (i === 0) {
            return [1, 3, 4]
        }

        if (i === 1) {
            return [0, 2, 3, 4, 5]
        }

        if (i === 2) {
            return [1, 4, 5]
        }

        if (i === 3) {
            return [0, 1, 4, 6, 7]
        }

        if (i === 4) {
            return [0, 1, 2, 3, 5, 6, 7, 8]
        }

        if (i === 5){
            return [1, 2, 4, 7, 8]
        }

        if (i === 6) {
            return [3, 4, 7]
        }

        if (i === 7) {
            return [3, 4, 5, 6, 8]
        }

        if (i === 8) {
            return [4, 5, 7]
        }
    }

    // For user to fill out 3 pieces each.
    function tictactoe(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
        setTurnCount(prev=>prev + 1);
    }

    // Determine the winner
    const winner = calculateWinner(squares);
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (chorusStarted) {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O') + ', ' + (isTimeToMove? 'move the piece' : 'select the piece');
      } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O') + ', place the piece';
      }
    }

    return (
    <>
      <div className="status">{error}</div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
    );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

