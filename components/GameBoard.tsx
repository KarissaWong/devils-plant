'use client'

import { GameState, Tile } from '@/types/game'

interface GameBoardProps {
  gameState: GameState
  onStartGame: () => void
  onResetGame: () => void
}

// Helper to render a row of tiles
function TileRow({ tiles, gameState }: { tiles: Tile[]; gameState: GameState }) {
  return (
    <div className="tiles-row">
      {tiles.map((tile) => (
        <TileComponent key={tile.id} tile={tile} gameState={gameState} />
      ))}
    </div>
  )
}

export default function GameBoard({ gameState, onStartGame, onResetGame }: GameBoardProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatCalculation = (calculation: string): string => {
    return calculation.replace(/×/g, '*').replace(/÷/g, '/')
  }

  if (!gameState.isPlaying && gameState.score === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="text-white text-lg font-bold mb-4">START SCREEN</div>
        <h1 className="text-6xl font-bold text-white mb-8">Devil's Plant</h1>
        <p className="text-xl text-gray-300 text-center max-w-md mb-8">
          Select 3 tiles in sequence to reach the target number. 
          Use keyboard letters A-J to select tiles.
        </p>
        <button
          onClick={onStartGame}
          className="bg-white text-black px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Start Game
        </button>
      </div>
    )
  }

  if (!gameState.isPlaying && gameState.score > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="text-white text-lg font-bold mb-4">GAME OVER SCREEN</div>
        <h1 className="text-6xl font-bold text-white mb-8">Game Over!</h1>
        <div className="text-4xl font-bold text-orange-400 mb-8">
          Final Score: {gameState.score}
        </div>
        <button
          onClick={onResetGame}
          className="bg-white text-black px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors"
        >
          Play Again
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        {/* Target Number */}
        <div className="flex flex-col items-center mb-4 w-full">
          <div className="target-number">
            <span>{gameState.targetNumber}</span>
          </div>
        </div>

        {/* Tiles Container */}
        <div className="mb-4">
          <div className="tiles-container">
            <TileRow tiles={gameState.tiles.slice(0, 4)} gameState={gameState} />
            <TileRow tiles={gameState.tiles.slice(4, 7)} gameState={gameState} />
            <TileRow tiles={gameState.tiles.slice(7, 9)} gameState={gameState} />
            <TileRow tiles={gameState.tiles.slice(9, 10)} gameState={gameState} />
          </div>
        </div>

        {/* Bottom Controls */}
        <div>
          <div className="bottom-controls">
            {/* Debug Panel - All Solutions (fixed upper left) */}
            <div className="debug-panel">
              <h3>ALL SOLUTIONS (DEBUG)</h3>
              {gameState.allSolutions.map((solution, index) => (
                <div key={index} className="combination-item">
                  {solution.combination} = {solution.result}
                </div>
              ))}
              <div className="combination-item text-gray-500">
                Found: {gameState.correctCombinations.length}/{gameState.allSolutions.length}
              </div>
            </div>
          </div>
        </div>
        {/* Fixed correct answers row */}
        <div className="fixed-pill-row left">
          {gameState.correctCombinations.map((combo, idx) => (
            <span key={idx} className="pill">{combo.letters}</span>
          ))}
        </div>
        {/* Fixed game stats row */}
        <div className="fixed-pill-row right">
          <span className="pill">{formatTime(gameState.timeRemaining)}</span>
          <span className="pill">{gameState.score} pts</span>
          <button className="pill game-stats-restart" onClick={onResetGame} aria-label="Restart">
            <span style={{fontSize: '1.3em', marginRight: '0.3em', display: 'inline-block', verticalAlign: 'middle'}}>&#8634;</span>
            <span style={{fontSize: '0.95em', verticalAlign: 'middle'}}>(R)</span>
          </button>
        </div>
      </div>
      {/* Fixed input row (live input area) - moved outside main container */}
      <div className="fixed-input-row">
        <div className="input-area flex flex-col items-center gap-0">
          {/* Circular containers for tile values (now above) - only render if there are tiles */}
          {gameState.currentInput.length > 0 && (
            <div className="flex flex-row mb-2" style={{ display: 'flex', gap: '0.5em' }}>
              {gameState.currentInput.map((input, idx) => (
                <div key={idx} className="tile input-tile flex items-center justify-center text-xl" style={{width: '64px', height: '64px', minWidth: '64px', minHeight: '64px'}}>
                  {input.tile.value}
                </div>
              ))}
            </div>
          )}
          {/* Pill for letter inputs (responsive width, always visible) */}
          <div
            className="pill input-pill text-2xl py-2 mb-2"
            style={{
              paddingLeft: '1.5em',
              paddingRight: '1.5em',
              minWidth: '64px',
              textAlign: 'center',
            }}
          >
            {gameState.currentInput.length === 0
              ? 'Type or click A–J'
              : gameState.currentInput.map((input) => input.letter).join('')}
          </div>
        </div>
      </div>
    </>
  )
}

interface TileComponentProps {
  tile: Tile
  gameState: GameState
}

function TileComponent({ tile, gameState }: TileComponentProps) {
  const letterBgStyle = {
    '--letter-bg': `url('/tile-letter-${tile.letter.toLowerCase()}.png')`
  } as React.CSSProperties

  // Add handler for tile click (moved here for scope)
  const handleTileClick = () => {
    if (
      gameState.currentInput.length < 3 &&
      !gameState.currentInput.some(input => input.letter === tile.letter)
    ) {
      if (typeof window !== 'undefined') {
        const event = new KeyboardEvent('keydown', { key: tile.letter })
        window.dispatchEvent(event)
      }
    }
  }

  return (
    <button
      className="tile"
      style={letterBgStyle}
      onClick={handleTileClick}
      tabIndex={0}
      aria-label={`Select tile ${tile.letter}`}
      type="button"
    >
      <div className="tile-value">{tile.value}</div>
      <div className="tile-letter"></div>
    </button>
  )
} 