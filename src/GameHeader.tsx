import React from 'react';

interface GameHeaderProps {
  mineCount: number;
  flagCount: number;
  timeElapsed: number;
  gameStatus: 'playing' | 'won' | 'lost';
  onRestart: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  mineCount,
  flagCount,
  timeElapsed,
  gameStatus,
  onRestart,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusEmoji = () => {
    switch (gameStatus) {
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      default:
        return '🙂';
    }
  };

  const remainingMines = mineCount - flagCount;

  return (
    <div className="game-header">
      <div className="counter">
        <span className="label">Mines:</span>
        <span className="value">{remainingMines.toString().padStart(3, '0')}</span>
      </div>
      
      <div className="status-section">
        <button 
          className="restart-button" 
          onClick={onRestart}
          title="New Game"
        >
          {getStatusEmoji()}
        </button>
      </div>
      
      <div className="counter">
        <span className="label">Time:</span>
        <span className="value">{formatTime(timeElapsed)}</span>
      </div>
    </div>
  );
};

export default GameHeader;