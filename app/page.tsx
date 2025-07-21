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

  // Dynamic background images - manually update this array as needed
  const backgroundImages = useMemo(() => [
    '/background-images/flower-2.png',
    '/background-images/flower-6.png',
    '/background-images/flower-7.png',
  ], [])

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
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="game-container" style={{ outline: '3px solid red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="game-content"
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
        />
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