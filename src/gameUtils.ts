import { Cell, GameConfig } from './types';

export const createEmptyBoard = (width: number, height: number): Cell[][] => {
  const board: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        x,
        y,
      });
    }
    board.push(row);
  }
  return board;
};

export const placeMines = (
  board: Cell[][],
  mineCount: number,
  firstClickX: number,
  firstClickY: number
): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const { length: height } = newBoard;
  const { length: width } = newBoard[0];
  
  let minesPlaced = 0;
  const forbiddenPositions = new Set<string>();
  
  // Prevent mines around the first click (3x3 area)
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = firstClickX + dx;
      const ny = firstClickY + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        forbiddenPositions.add(`${nx},${ny}`);
      }
    }
  }
  
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const posKey = `${x},${y}`;
    
    if (!newBoard[y][x].isMine && !forbiddenPositions.has(posKey)) {
      newBoard[y][x].isMine = true;
      minesPlaced++;
    }
  }
  
  return calculateNeighborMines(newBoard);
};

export const calculateNeighborMines = (board: Cell[][]): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const { length: height } = newBoard;
  const { length: width } = newBoard[0];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!newBoard[y][x].isMine) {
        let mineCount = 0;
        
        // Check all 8 adjacent cells
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue; // Skip the cell itself
            
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (newBoard[ny][nx].isMine) {
                mineCount++;
              }
            }
          }
        }
        
        newBoard[y][x].neighborMines = mineCount;
      }
    }
  }
  
  return newBoard;
};

export const revealCell = (board: Cell[][], x: number, y: number): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const { length: height } = newBoard;
  const { length: width } = newBoard[0];
  
  if (x < 0 || x >= width || y < 0 || y >= height) return newBoard;
  
  const cell = newBoard[y][x];
  if (cell.isRevealed || cell.isFlagged) return newBoard;
  
  cell.isRevealed = true;
  
  // If it's an empty cell (no neighboring mines), reveal all adjacent cells
  if (!cell.isMine && cell.neighborMines === 0) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          revealCellRecursive(newBoard, nx, ny, width, height);
        }
      }
    }
  }
  
  return newBoard;
};

const revealCellRecursive = (
  board: Cell[][],
  x: number,
  y: number,
  width: number,
  height: number
): void => {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  
  const cell = board[y][x];
  if (cell.isRevealed || cell.isFlagged || cell.isMine) return;
  
  cell.isRevealed = true;
  
  // If it's an empty cell, continue revealing neighbors
  if (cell.neighborMines === 0) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = x + dx;
        const ny = y + dy;
        
        revealCellRecursive(board, nx, ny, width, height);
      }
    }
  }
};

export const toggleFlag = (board: Cell[][], x: number, y: number): Cell[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const cell = newBoard[y][x];
  
  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged;
  }
  
  return newBoard;
};

export const checkWinCondition = (board: Cell[][]): boolean => {
  for (const row of board) {
    for (const cell of row) {
      // If there's an unrevealed cell that's not a mine, game is not won
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
};

export const revealAllMines = (board: Cell[][]): Cell[][] => {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed,
    }))
  );
};

export const countFlags = (board: Cell[][]): number => {
  let flagCount = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) {
        flagCount++;
      }
    }
  }
  return flagCount;
};

export const getDefaultConfig = (): GameConfig => ({
  width: 9,
  height: 9,
  mines: 10,
});