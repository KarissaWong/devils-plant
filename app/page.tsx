'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import GameBoard from '@/components/GameBoard'
import { GameState, Tile, GameConfig } from '@/types/game'

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    timeRemaining: 180, // 3 minutes in seconds
    targetNumber: 0,
    tiles: [],
    currentInput: [],
    correctCombinations: [],
    allSolutions: [],
    gameStartTime: null,
    lastBonusTime: null,
  })

  const [gameConfig] = useState<GameConfig>({
    timeLimit: 180,
    bonusInterval: 20, // 20 seconds for bonus points
    maxTiles: 10,
    tilesPerCombination: 3,
  })

  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)

  // Format time helper function
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Dynamic background images - manually update this array as needed
  const backgroundImages = useMemo(() => [
    '/background-images/flower-2.png',
    '/background-images/flower-6.png',
    '/background-images/flower-7.png',
  ], [])

  // Preload all background images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = backgroundImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(src)
          img.onerror = () => reject(src)
          img.src = src
        })
      })

      try {
        await Promise.all(imagePromises)
        setImagesLoaded(true)
      } catch (error) {
        console.warn('Some background images failed to load:', error)
        setImagesLoaded(true) // Continue anyway
      }
    }

    preloadImages()
  }, [backgroundImages])

  // Simple background cycling function
  const cycleBackground = useCallback(() => {
    const nextIndex = (currentBackgroundIndex + 1) % backgroundImages.length
    setCurrentBackgroundIndex(nextIndex)
  }, [currentBackgroundIndex, backgroundImages])

  // Initialize game
  const startNewGame = useCallback(() => {
    const newTiles = generateTiles()
    const targetNumber = generateTargetNumber(newTiles)
    const allSolutions = findAllSolutions(newTiles, targetNumber)

    // Cycle to next background
    cycleBackground()

    // Hide game over screen
    setShowGameOver(false)

    setGameState({
      isPlaying: true,
      score: 0,
      timeRemaining: gameConfig.timeLimit,
      targetNumber,
      tiles: newTiles,
      currentInput: [],
      correctCombinations: [],
      allSolutions,
      gameStartTime: Date.now(),
      lastBonusTime: Date.now(),
    })
  }, [gameConfig.timeLimit, cycleBackground])

  // Automatically start a new game on mount
  useEffect(() => {
    if (imagesLoaded) {
      startNewGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesLoaded]);

  // Timer effect
  useEffect(() => {
    if (!gameState.isPlaying) return

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1
        
        // Check for bonus points
        let newScore = prev.score
        let newLastBonusTime = prev.lastBonusTime
        
        if (prev.correctCombinations.length >= prev.allSolutions.length && 
            Date.now() - prev.lastBonusTime! >= gameConfig.bonusInterval * 1000) {
          newScore += 1
          newLastBonusTime = Date.now()
        }

        if (newTimeRemaining <= 0) {
          setShowGameOver(true)
          return {
            ...prev,
            isPlaying: false,
            timeRemaining: 0,
            score: newScore,
          }
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          score: newScore,
          lastBonusTime: newLastBonusTime,
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState.isPlaying, gameConfig.bonusInterval])

  // Check if current input forms a valid combination
  const checkCombination = useCallback(() => {
    if (gameState.currentInput.length !== 3) return

    const combination = gameState.currentInput.map(input => input.letter).join('')
    const calculation = gameState.currentInput.map(input => input.tile.value).join(' ')
    
    // Check if this combination is already found
    if (gameState.correctCombinations.some(combo => combo.letters === combination)) {
      setGameState(prev => ({
        ...prev,
        currentInput: [],
        score: prev.score - 1
      }))
      return
    }

    // Check if this combination is correct
    const result = calculateResult(gameState.currentInput.map(input => input.tile))
    const isCorrect = result === gameState.targetNumber

    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        correctCombinations: [...prev.correctCombinations, { letters: combination, calculation }],
        currentInput: []
      }))
    } else {
      setGameState(prev => ({
        ...prev,
        score: prev.score - 1,
        currentInput: []
      }))
    }
  }, [gameState.currentInput, gameState.targetNumber, gameState.correctCombinations])

  // Handle keyboard input
  useEffect(() => {
    if (!gameState.isPlaying) return

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase()
      
      // Debug panel toggle
      if (event.shiftKey && key === 'H') {
        setShowDebugPanel(prev => !prev)
        return
      }
      
      // Only allow single-letter keys A-J for tile input
      if (key.length === 1 && key >= 'A' && key <= 'J') {
        const tileIndex = key.charCodeAt(0) - 65
        const tile = gameState.tiles[tileIndex]
        if (tile && !gameState.currentInput.some(input => input.letter === key)) {
          setGameState(prev => ({
            ...prev,
            currentInput: [...prev.currentInput, { letter: key, tile }]
          }))
        }
      } else if (event.key === 'Enter' && gameState.currentInput.length === 3) {
        checkCombination()
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        setGameState(prev => ({
          ...prev,
          currentInput: prev.currentInput.slice(0, -1)
        }))
      } else if (key === 'R') {
        startNewGame()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.isPlaying, gameState.currentInput, gameState.tiles, startNewGame, checkCombination])

  // Auto-check combination when 3 tiles are selected
  useEffect(() => {
    if (gameState.currentInput.length === 3) {
      setTimeout(checkCombination, 500) // Small delay for UX
    }
  }, [gameState.currentInput, checkCombination])

  return (
    <div className="page-fade-in" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Loading state */}
      {!imagesLoaded && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          color: '#44272C',
          fontSize: '18px',
          fontWeight: 300
        }}>
          Loading...
        </div>
      )}

      {/* Game Over Screen */}
      {showGameOver && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h2 style={{
              color: '#44272C',
              fontSize: '2rem',
              fontWeight: 300,
              marginBottom: '1rem',
            }}>
              Game Over!
            </h2>
            <p style={{
              color: '#44272C',
              fontSize: '1.2rem',
              marginBottom: '2rem',
            }}>
              Final Score: <strong>{gameState.score} points</strong>
            </p>
            <button
              onClick={startNewGame}
              style={{
                background: '#44272C',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 300,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5a3238'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#44272C'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Header - Upper Left Corner */}
      <div style={{ 
        position: 'fixed', 
        top: '16px', 
        left: '16px', 
        zIndex: 9999, 
        pointerEvents: 'none',
        color: '#44272C',
        fontSize: '14px',
        fontWeight: 300
      }}>
        <div>Devil's Plant</div>
        <div>By <a href="https://www.linkedin.com/in/karissa-wong/" target="_blank" rel="noopener noreferrer" style={{ color: '#44272C', textDecoration: 'underline', pointerEvents: 'auto' }}>Karissa Wong</a></div>
      </div>

      {/* Header - Upper Right Corner */}
      <div style={{ 
        position: 'fixed', 
        top: '16px', 
        right: '16px', 
        zIndex: 9999, 
        pointerEvents: 'none',
        color: '#44272C',
        fontSize: '14px',
        fontWeight: 300,
        textAlign: 'right'
      }}>
        <div>Have fun!</div>
        <div style={{ pointerEvents: 'auto' }}>
          <a href="https://github.com/KarissaWong/devils-plant" target="_blank" rel="noopener noreferrer" style={{ color: '#44272C', textDecoration: 'underline' }}>
            Github link
          </a>
        </div>
      </div>

      <div className="game-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          key={`background-${currentBackgroundIndex}`}
          className="background-fade-in game-content"
          style={{ 
            backgroundImage: `url(${backgroundImages[currentBackgroundIndex]})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '90vh',
          }}
        >
          <GameBoard 
            gameState={gameState}
            onStartGame={startNewGame}
            onResetGame={startNewGame}
            showDebugPanel={showDebugPanel}
          />
        </div>
      </div>

      {/* Fixed correct answers row - moved outside container */}
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

      {/* Fixed game stats row - moved outside container */}
      <div className="fixed-pill-row right">
        <span className="pill">{formatTime(gameState.timeRemaining)}</span>
        <span className="pill">{gameState.score} pts</span>
        <button className="pill game-stats-restart" onClick={startNewGame} aria-label="Restart">
          <span style={{fontSize: '1.3em', marginRight: '0.3em', display: 'inline-block', verticalAlign: 'middle'}}>&#8634;</span>
          <span style={{fontSize: '0.95em', verticalAlign: 'middle'}}>(R)</span>
        </button>
      </div>

      {/* Fixed input row - moved outside container */}
      <div className="fixed-input-row">
        <div className="input-area flex flex-col items-center gap-0">
          {/* Circular containers for tile values - only render if there are tiles */}
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
          {/* Pill for letter inputs */}
          {(gameState.currentInput.length > 0 || (gameState.correctCombinations.length === 0 && gameState.score === 0)) && (
            <div
              className={`pill input-pill text-2xl py-2 mb-2 ${gameState.currentInput.length === 0 ? 'placeholder-pill-appear' : ''}`}
              style={{
                paddingLeft: '1em',
                paddingRight: '1em',
                minWidth: '0px',
                width: gameState.currentInput.length === 0 
                  ? '150px'
                  : `${Math.max(24, 24 + (gameState.currentInput.length * 24))}px`,
                height: 'auto',
                textAlign: 'center',
              }}
            >
              {gameState.currentInput.length > 0 
                ? gameState.currentInput.map((input) => input.letter).join('')
                : 'Type or click A–J'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Utility functions
function generateTiles(): Tile[] {
  const operators = ['+', '-', '×', '÷']
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // All numbers 10 or less
  const tiles: Tile[] = []

  // Ensure we have a good mix of operators and numbers
  const usedNumbers = new Set<number>()
  
  for (let i = 0; i < 10; i++) {
    let operator: string
    let number: number
    
    // Ensure we don't have too many of the same operator
    const operatorCounts = tiles.reduce((counts, tile) => {
      counts[tile.operator] = (counts[tile.operator] || 0) + 1
      return counts
    }, {} as Record<string, number>)
    
    // Prefer operators that are under-represented
    const availableOperators = operators.filter(op => 
      (operatorCounts[op] || 0) < 3 // Max 3 of any operator
    )
    
    if (availableOperators.length > 0) {
      operator = availableOperators[Math.floor(Math.random() * availableOperators.length)]
    } else {
      operator = operators[Math.floor(Math.random() * operators.length)]
    }
    
    // Prefer numbers we haven't used yet
    const availableNumbers = numbers.filter(n => !usedNumbers.has(n))
    if (availableNumbers.length > 0) {
      number = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
      usedNumbers.add(number)
    } else {
      number = numbers[Math.floor(Math.random() * numbers.length)]
    }
    
    tiles.push({
      id: i,
      letter: String.fromCharCode(65 + i), // A-J
      value: `${operator}${number}`,
      operator,
      number
    })
  }

  return tiles
}

function generateTargetNumber(tiles: Tile[]): number {
  // Try different target numbers until we find one with at least 3 solutions
  const possibleTargets = []
  
  // Generate a range of reasonable target numbers (max 10)
  const numbers = tiles.map(tile => tile.number)
  const minTarget = Math.min(...numbers)
  const maxTarget = Math.min(10, Math.max(...numbers) * 3) // Cap at 10
  
  for (let target = minTarget; target <= maxTarget; target++) {
    const solutions = findAllSolutions(tiles, target)
    if (solutions.length >= 3) {
      possibleTargets.push({ target, solutionCount: solutions.length })
    }
  }
  
  // If we found targets with 3+ solutions, pick one randomly
  if (possibleTargets.length > 0) {
    const randomIndex = Math.floor(Math.random() * possibleTargets.length)
    return possibleTargets[randomIndex].target
  }
  
  // Fallback: generate a reasonable target (max 10)
  const avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
  return Math.min(10, Math.round(avg * 2))
}

function findAllSolutions(tiles: Tile[], target: number): Array<{combination: string, result: number}> {
  const solutions: Array<{combination: string, result: number}> = []
  
  // Generate all possible 3-tile combinations
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles.length; j++) {
      if (i === j) continue
      for (let k = 0; k < tiles.length; k++) {
        if (i === k || j === k) continue
        
        const combination = [tiles[i], tiles[j], tiles[k]]
        const result = calculateResult(combination)
        
        if (result === target) {
          const letters = [tiles[i].letter, tiles[j].letter, tiles[k].letter].join('')
          solutions.push({ combination: letters, result })
        }
      }
    }
  }
  
  return solutions
}

function calculateResult(tiles: Tile[]): number {
  if (tiles.length !== 3) return 0
  
  // First tile: ignore operator, use number as starting value
  let result = tiles[0].number
  
  // Apply operations in order of operations
  const operations: Array<{operator: string, number: number}> = []
  
  // Collect multiplication and division first
  for (let i = 1; i < tiles.length; i++) {
    if (tiles[i].operator === '×' || tiles[i].operator === '÷') {
      operations.push({ operator: tiles[i].operator, number: tiles[i].number })
    }
  }
  
  // Apply multiplication and division
  for (const op of operations) {
    if (op.operator === '×') {
      result *= op.number
    } else if (op.operator === '÷') {
      result /= op.number
    }
  }
  
  // Apply addition and subtraction
  for (let i = 1; i < tiles.length; i++) {
    if (tiles[i].operator === '+' || tiles[i].operator === '-') {
      if (tiles[i].operator === '+') {
        result += tiles[i].number
      } else {
        result -= tiles[i].number
      }
    }
  }
  
  return Math.round(result * 100) / 100 // Round to 2 decimal places
} 