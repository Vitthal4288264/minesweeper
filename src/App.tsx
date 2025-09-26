import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import { GameState, GameConfig } from './types';
import {
  createEmptyBoard,
  placeMines,
  revealCell,
  toggleFlag,
  checkWinCondition,
  revealAllMines,
  countFlags,
  getDefaultConfig,
} from './gameUtils';
import './App.css';

const App: React.FC = () => {
  const [config] = useState<GameConfig>(getDefaultConfig());
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(config.width, config.height),
    gameStatus: 'playing',
    mineCount: config.mines,
    flagCount: 0,
    timeElapsed: 0,
    isFirstClick: true,
  }));

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.gameStatus === 'playing' && !gameState.isFirstClick) {
      interval = setInterval(() => {
        setGameState(prevState => ({
          ...prevState,
          timeElapsed: prevState.timeElapsed + 1,
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState.gameStatus, gameState.isFirstClick]);

  const restartGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(config.width, config.height),
      gameStatus: 'playing',
      mineCount: config.mines,
      flagCount: 0,
      timeElapsed: 0,
      isFirstClick: true,
    });
  }, [config]);

  const handleCellLeftClick = useCallback((x: number, y: number) => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') {
        return prevState;
      }

      let newBoard = prevState.board;
      
      // Handle first click - place mines
      if (prevState.isFirstClick) {
        newBoard = placeMines(newBoard, config.mines, x, y);
      }

      // Reveal the cell
      newBoard = revealCell(newBoard, x, y);
      
      const clickedCell = newBoard[y][x];
      let newGameStatus: 'playing' | 'won' | 'lost' = prevState.gameStatus;

      // Check if clicked on mine
      if (clickedCell.isMine) {
        newGameStatus = 'lost';
        newBoard = revealAllMines(newBoard);
      } else {
        // Check win condition
        if (checkWinCondition(newBoard)) {
          newGameStatus = 'won';
        }
      }

      return {
        ...prevState,
        board: newBoard,
        gameStatus: newGameStatus,
        isFirstClick: false,
        flagCount: countFlags(newBoard),
      };
    });
  }, [config.mines]);

  const handleCellRightClick = useCallback((x: number, y: number) => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'playing') {
        return prevState;
      }

      const newBoard = toggleFlag(prevState.board, x, y);
      
      return {
        ...prevState,
        board: newBoard,
        flagCount: countFlags(newBoard),
      };
    });
  }, []);

  return (
    <div className="app">
      <div className="game-container">
        <h1>Minesweeper</h1>
        
        <GameHeader
          mineCount={gameState.mineCount}
          flagCount={gameState.flagCount}
          timeElapsed={gameState.timeElapsed}
          gameStatus={gameState.gameStatus}
          onRestart={restartGame}
        />
        
        <GameBoard
          board={gameState.board}
          onCellLeftClick={handleCellLeftClick}
          onCellRightClick={handleCellRightClick}
        />
        
        <div className="instructions">
          <p>Left click to reveal • Right click to flag</p>
        </div>
      </div>
    </div>
  );
};

export default App;