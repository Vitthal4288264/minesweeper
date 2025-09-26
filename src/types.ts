export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  x: number;
  y: number;
}

export interface GameState {
  board: Cell[][];
  gameStatus: 'playing' | 'won' | 'lost';
  mineCount: number;
  flagCount: number;
  timeElapsed: number;
  isFirstClick: boolean;
}

export interface GameConfig {
  width: number;
  height: number;
  mines: number;
}