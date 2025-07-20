/**
 * Represents a single tile in the game.
 */
export interface Tile {
  id: number
  letter: string
  value: string
  operator: string
  number: number
}

/**
 * Represents the full state of the game at any point in time.
 */
export interface GameState {
  isPlaying: boolean
  score: number
  timeRemaining: number
  targetNumber: number
  tiles: Tile[]
  currentInput: Array<{ letter: string; tile: Tile }>
  correctCombinations: Array<{ letters: string; calculation: string }>
  allSolutions: Array<{ combination: string; result: number }>
  gameStartTime: number | null
  lastBonusTime: number | null
}

/**
 * Configuration options for a game session.
 */
export interface GameConfig {
  timeLimit: number
  bonusInterval: number
  maxTiles: number
  tilesPerCombination: number
} 