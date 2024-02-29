import React, { useContext, useEffect, useRef, useState } from "react";
import "./Game_Modal.css";
import toast from "react-hot-toast";
import { MyContext } from "../context/MyContext";

const Game_Modal = ({ socketRef, roomId }) => {
  const [sign, setSign] = useState(true);
  const signref = useRef("");
  const { SetOwner, SetOppountes, owner, oppountes } = useContext(MyContext);

  const reset=useRef(1);

  const [currentValue, SetCurrentValue] = useState(1);
  const [turn, setTurn] = useState(1);
  const [uservalue, SetUservalue] = useState(-1);
  const keyPairRef = useRef({
    row: 0,
    col: 0,
  });
  let board_size = useRef(0);
  const [winnerortiy, SetWinnerOrTiy] = useState(false);
  const [boardCard, setBoardCard] = useState([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);
  useEffect(() => {
    function init() {
      if (socketRef.current) {
        let value = uservalue == "O" || uservalue == -1 ? "X" : "O";
        let pairValue = keyPairRef.current;
        let Username = currentValue;
        console.log("Reset is working")
        // console.log(boardCard)
        // console.log("Current value is ",Username)
        const otherBoardCard=boardCard;
        socketRef.current.emit("textChange", {
          value,
          roomId,
          pairValue,
          Username,
          turn,
          otherBoardCard
        });
        // reset.current=1;
        // console.log("Value send sucessfully to the server")
      } else {
        console.log("No refernce");
      }
    }
    init();
  }, [signref.current]);
  useEffect(() => {
    // Add event listener for 'textChange' event from socket
    if (socketRef.current) {
      socketRef.current.on(
        "textChange",
        ({ value, pairValue, Username, turn,otherBoardCard }) => {
          if (value !== null) {
              SetCurrentValue(Username === 1 ? 2 : 1);
              setTurn(turn);
              // const updatedBoard = [...boardCard];
              console.log("Value of otherBoardCard",otherBoardCard)
              // updatedBoard[pairValue.row][pairValue.col] = value;
              setBoardCard(otherBoardCard);
              SetUservalue(value);
          } else {
            console.log("Received value is null");
          }
        }
      );

      socketRef.current.on("winner",({currentValue})=>{
        // console.log("winner no is ",currentValue)
        toast.success(`Player ${currentValue} is the winner`);
      })
     
    } else {
      console.log("Socket reference is null");
    }
   

    return () => {
      if (socketRef.current) {
        socketRef.current.off("textChange");
        socketRef.current.off("winner");
      }
    };
  }, [socketRef.current]);
  
  
  // Include socketRef.current in the dependency array

  function checkWinner(board) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2] &&
        board[i][0] !== 1
      ) {
        return board[i][0];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i] &&
        board[0][i] !== 1
      ) {
        return board[0][i];
      }
    }

    // Check diagonals
    if (
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[0][0] !== 1
    ) {
      return board[0][0];
    }
    if (
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0] &&
      board[0][2] !== 1
    ) {
      return board[0][2];
    }

    return null; // Return null if there's no winner
  }
  function resetGame() {
    // if (socketRef.current) {
    //   socketRef.current.emit('resetGame', roomId);
    // }
    setBoardCard([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
    setSign(true);
    setTurn(1);
    signref.current = "";
    SetWinnerOrTiy(false);
    board_size.current = 0;
  }
  function get_Value(row, col) {
    if (turn === currentValue) {
      // Toggle turn
      setTurn(turn === 1 ? 2 : 1);
  
      if (!winnerortiy) {
        // Create a new copy of the boardCard array
        const updatedBoard = [...boardCard];

        // console.log("Updated board is ",updatedBoard)
  
        // Check if the cell is already occupied
        if (updatedBoard[row][col] === "X" || updatedBoard[row][col] === "O") {
          console.log("You can't change");
          return;
        }
  
        // Update the cell value
        updatedBoard[row][col] = uservalue === "O" || uservalue === -1 ? "X" : "O";
  
        // Update state with the new boardCard
        setBoardCard(updatedBoard);
  
        keyPairRef.current.row = row;
        keyPairRef.current.col = col;
        setSign(!sign);
        signref.current = sign ? "X" : "O";
  
        // Check for winner
        let val = checkWinner(updatedBoard);
        if (val != null) {
          if(socketRef.current){
            socketRef.current.emit('winner',{currentValue});
          }
          // console.log(val);
          SetWinnerOrTiy(true);
          // toast.success(`Player ${val} is the winner`);
        } else {
          // Increment board size
          board_size.current = board_size.current + 1;
          if (board_size.current === 9) {
            console.log("Match tied");
            toast.success("Match tied");
            SetWinnerOrTiy(true);
          }
        }
      } else {
        console.log("Kuch ho nahi raha");
      }
    } else {
      toast.success("It's not your turn");
    }
  }
  

  return (
    <div className="container">
      <h4 className="title">Play Tic Tac Toe</h4>
      <h6 className="text-white">Current Player{sign ? " X" : " O"}</h6>
      <div className="board">
        {boardCard.map((row, rowIndex) => (
          <div className={`row${rowIndex + 1}`} key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div
                className="boxes"
                key={colIndex}
                onClick={() => get_Value(rowIndex, colIndex)}
              >
                {cell == 1 ? "" : cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="reset" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
};

export default Game_Modal;
