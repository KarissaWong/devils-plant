'use client'

import { GameState, Tile } from '@/types/game'

interface GameBoardProps {
  gameState: GameState
  onStartGame: () => void
  onResetGame: () => void
  showDebugPanel: boolean
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

export default function GameBoard({ gameState, onStartGame, onResetGame, showDebugPanel }: GameBoardProps) {
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
            {/* Debug Panel - All Solutions (toggleable) */}
            {showDebugPanel && (
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
            )}
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