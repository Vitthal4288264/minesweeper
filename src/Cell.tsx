import React from 'react';
import { Cell as CellType } from './types';

interface CellProps {
  cell: CellType;
  onLeftClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
}

const Cell: React.FC<CellProps> = ({ cell, onLeftClick, onRightClick }) => {
  const handleClick = () => {
    if (!cell.isFlagged && !cell.isRevealed) {
      onLeftClick(cell.x, cell.y);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!cell.isRevealed) {
      onRightClick(cell.x, cell.y);
    }
  };

  const getCellContent = () => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines > 0) return cell.neighborMines.toString();
    return '';
  };

  const getCellClassName = () => {
    let className = 'cell';
    
    if (cell.isRevealed) {
      className += ' revealed';
      if (cell.isMine) {
        className += ' mine';
      } else if (cell.neighborMines > 0) {
        className += ` number-${cell.neighborMines}`;
      }
    } else {
      className += ' hidden';
    }
    
    if (cell.isFlagged) {
      className += ' flagged';
    }
    
    return className;
  };

  return (
    <div
      className={getCellClassName()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {getCellContent()}
    </div>
  );
};

export default Cell;