import React from 'react';
import Cell from './Cell';
import { Cell as CellType } from './types';

interface GameBoardProps {
  board: CellType[][];
  onCellLeftClick: (x: number, y: number) => void;
  onCellRightClick: (x: number, y: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellLeftClick,
  onCellRightClick,
}) => {
  return (
    <div 
      className="game-board"
      style={{
        gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`,
        gridTemplateRows: `repeat(${board.length}, 1fr)`,
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            cell={cell}
            onLeftClick={onCellLeftClick}
            onRightClick={onCellRightClick}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;