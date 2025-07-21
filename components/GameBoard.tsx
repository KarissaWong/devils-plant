'use client'

import { GameState, Tile } from '@/types/game'

interface GameBoardProps {
  gameState: GameState
  onStartGame: () => void
  onResetGame: () => void
}

// Helper to render a row of tiles
function TileRow({ tiles, gameState, className }: { tiles: Tile[]; gameState: GameState; className?: string }) {
  return (
    <div className={`tiles-row ${className || ''}`}>
      {tiles.map((tile) => (
        <TileComponent key={`${tile.id}-${gameState.targetNumber}`} tile={tile} gameState={gameState} />
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

  return (
    <>
      <div className="w-full" style={{ padding: '2rem' }}>
        {/* Target Number */}
        <div className="flex flex-col items-center mb-4 w-full">
          <div className="target-number target-appear" key={`target-${gameState.targetNumber}`}>
            <span>{gameState.targetNumber}</span>
          </div>
        </div>

        {/* Tiles Container */}
        <div className="mb-4" style={{ padding: '5rem' }}>
          <div className="tiles-container" key={`tiles-${gameState.targetNumber}`}>
            <TileRow tiles={gameState.tiles.slice(0, 4)} gameState={gameState} className="tile-row-appear" />
            <TileRow tiles={gameState.tiles.slice(4, 7)} gameState={gameState} className="tile-row-appear" />
            <TileRow tiles={gameState.tiles.slice(7, 9)} gameState={gameState} className="tile-row-appear" />
            <TileRow tiles={gameState.tiles.slice(9, 10)} gameState={gameState} className="tile-row-appear" />
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
          {gameState.correctCombinations.length > 3 && (
            <span className="pill" style={{ opacity: 0.6, fontWeight: 400 }}>
              +{gameState.correctCombinations.length - 3} more
            </span>
          )}
          {gameState.correctCombinations.slice(-3).map((combo, idx) => (
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
                <div 
                  key={`${input.letter}-${idx}`} 
                  className="tile input-tile input-tile-appear flex items-center justify-center text-xl" 
                  style={{width: '64px', height: '64px', minWidth: '64px', minHeight: '64px'}}
                >
                  {input.tile.value}
                </div>
              ))}
            </div>
          )}
          {/* Pill for letter inputs (responsive width, always visible) */}
          {(gameState.currentInput.length > 0 || (gameState.correctCombinations.length === 0 && gameState.score === 0)) && (
            <div
              className={`pill input-pill text-2xl py-2 mb-2 ${gameState.currentInput.length === 0 ? 'placeholder-pill-appear' : ''}`}
              style={{
                paddingLeft: '1em',
                paddingRight: '1em',
                minWidth: '0px',
                width: gameState.currentInput.length === 0 
                  ? '150px' // Fixed width for placeholder text
                  : `${Math.max(24, 24 + (gameState.currentInput.length * 24))}px`, // Dynamic width for letters
                height: 'auto',
                textAlign: 'center',
              }}
            >
              {gameState.currentInput.length > 0 
                ? gameState.currentInput.map((input) => input.letter).join('')
                : 'Type or click A–J' // Show placeholder only at game start
              }
            </div>
          )}
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