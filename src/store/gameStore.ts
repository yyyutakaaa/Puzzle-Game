import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Cell {
  x: number
  y: number
  value: number | null
  isInPath: boolean
  pathIndex: number | null
}

export interface Level {
  id: number
  gridSize: number
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  numbers: { x: number; y: number; value: number }[]
  solution?: { x: number; y: number }[]
  completed: boolean
  bestTime: number
  dailyChallenge?: boolean
}

interface GameState {
  // Game State
  currentLevel: number
  currentView: 'menu' | 'game' | 'levels' | 'stats'
  grid: Cell[][]
  gridSize: number
  path: { x: number; y: number }[]
  isDrawing: boolean
  startTime: number | null
  currentTime: number
  
  // Player Progress
  playerLevel: number
  totalCompleted: number
  totalTime: number
  streak: number
  lastPlayDate: string | null
  
  // Levels
  levels: Level[]
  dailyChallenge: Level | null
  dailyChallengeDate: string | null
  
  // Actions
  initializeGame: () => void
  setCurrentView: (view: 'menu' | 'game' | 'levels' | 'stats') => void
  generatePuzzle: (level: number) => void
  generateDailyChallenge: () => void
  startDrawing: (x: number, y: number) => void
  continueDrawing: (x: number, y: number) => void
  endDrawing: () => void
  resetPuzzle: () => void
  checkWin: () => boolean
  clearPath: () => void
  undoLastMove: () => void
}

// Create a valid Hamiltonian path that covers all cells
const createHamiltonianPath = (gridSize: number): { x: number; y: number }[] => {
  const totalCells = gridSize * gridSize
  const visited = new Set<string>()
  const path: { x: number; y: number }[] = []
  
  // Start from random position
  const startX = Math.floor(Math.random() * gridSize)
  const startY = Math.floor(Math.random() * gridSize)
  
  const dfs = (x: number, y: number): boolean => {
    const key = `${x},${y}`
    if (visited.has(key)) return false
    
    visited.add(key)
    path.push({ x, y })
    
    if (path.length === totalCells) return true
    
    // Get all possible moves and shuffle them for randomization
    const moves = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ].sort(() => Math.random() - 0.5)
    
    for (const [dx, dy] of moves) {
      const nx = x + dx
      const ny = y + dy
      
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        if (dfs(nx, ny)) return true
      }
    }
    
    // Backtrack
    visited.delete(key)
    path.pop()
    return false
  }
  
  // Try to create a path, if it fails, use a simpler snake pattern
  if (!dfs(startX, startY)) {
    // Fallback to snake pattern
    path.length = 0
    for (let y = 0; y < gridSize; y++) {
      if (y % 2 === 0) {
        for (let x = 0; x < gridSize; x++) {
          path.push({ x, y })
        }
      } else {
        for (let x = gridSize - 1; x >= 0; x--) {
          path.push({ x, y })
        }
      }
    }
  }
  
  return path
}

// Generate a solvable puzzle
const generateSolvablePuzzle = (gridSize: number, numCount: number): Level => {
  // Create a valid path that covers all cells
  const solution = createHamiltonianPath(gridSize)
  
  // Place numbers along the path
  const numbers: { x: number; y: number; value: number }[] = []
  const step = Math.floor(solution.length / (numCount - 1))
  
  // Always place 1 at the start
  numbers.push({ ...solution[0], value: 1 })
  
  // Place intermediate numbers
  for (let i = 2; i < numCount; i++) {
    const index = step * (i - 1)
    numbers.push({ ...solution[index], value: i })
  }
  
  // Always place last number at the end
  numbers.push({ ...solution[solution.length - 1], value: numCount })
  
  return {
    id: Date.now(),
    gridSize,
    difficulty: gridSize <= 5 ? 'easy' : gridSize <= 7 ? 'medium' : gridSize <= 9 ? 'hard' : 'expert',
    numbers,
    solution,
    completed: false,
    bestTime: 0,
  }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentLevel: 1,
      currentView: 'menu',
      grid: [],
      gridSize: 5,
      path: [],
      isDrawing: false,
      startTime: null,
      currentTime: 0,
      
      playerLevel: 1,
      totalCompleted: 0,
      totalTime: 0,
      streak: 0,
      lastPlayDate: null,
      
      levels: [],
      dailyChallenge: null,
      dailyChallengeDate: null,
      
      // Actions
      initializeGame: () => {
        const today = new Date().toDateString()
        const state = get()
        
        // Check daily challenge
        if (state.dailyChallengeDate !== today) {
          state.generateDailyChallenge()
        }
        
        // Check streak
        if (state.lastPlayDate) {
          const lastDate = new Date(state.lastPlayDate)
          const currentDate = new Date()
          const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays > 1) {
            set({ streak: 0 })
          }
        }
        
        set({ lastPlayDate: today })
      },
      
      setCurrentView: (view) => set({ currentView: view }),
      
      generatePuzzle: (level) => {
        const gridSizes = [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]
        const numberCounts = [4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10]
        
        const gridSize = gridSizes[Math.min(level - 1, gridSizes.length - 1)]
        const numCount = numberCounts[Math.min(level - 1, numberCounts.length - 1)]
        
        const puzzle = generateSolvablePuzzle(gridSize, numCount)
        const grid: Cell[][] = []
        
        // Initialize grid
        for (let y = 0; y < gridSize; y++) {
          grid[y] = []
          for (let x = 0; x < gridSize; x++) {
            const number = puzzle.numbers.find(n => n.x === x && n.y === y)
            grid[y][x] = {
              x,
              y,
              value: number?.value || null,
              isInPath: false,
              pathIndex: null,
            }
          }
        }
        
        set({
          grid,
          gridSize,
          currentLevel: level,
          path: [],
          startTime: null,
          currentTime: 0,
        })
      },
      
      generateDailyChallenge: () => {
        const today = new Date()
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
        
        // Use seed to generate consistent daily puzzle
        const gridSize = 7 + (seed % 3)
        const numCount = 6 + (seed % 4)
        
        const puzzle = generateSolvablePuzzle(gridSize, numCount)
        puzzle.dailyChallenge = true
        
        set({
          dailyChallenge: puzzle,
          dailyChallengeDate: today.toDateString(),
        })
      },
      
      startDrawing: (x, y) => {
        const state = get()
        const cell = state.grid[y]?.[x]
        
        if (!cell) return
        
        // Must start from number 1
        if (cell.value !== 1) return
        
        const newGrid = [...state.grid.map(row => [...row])]
        newGrid[y][x].isInPath = true
        newGrid[y][x].pathIndex = 0
        
        set({
          isDrawing: true,
          path: [{ x, y }],
          grid: newGrid,
          startTime: Date.now(),
        })
      },
      
      continueDrawing: (x, y) => {
        const state = get()
        if (!state.isDrawing) return
        
        const cell = state.grid[y]?.[x]
        if (!cell) return
        
        const lastPos = state.path[state.path.length - 1]
        if (!lastPos) return
        
        // Check if adjacent
        const isAdjacent = 
          (Math.abs(x - lastPos.x) === 1 && y === lastPos.y) ||
          (Math.abs(y - lastPos.y) === 1 && x === lastPos.x)
        
        if (!isAdjacent) return
        
        // Check if already in path (allow backtracking by removing from path)
        const existingIndex = state.path.findIndex(p => p.x === x && p.y === y)
        
        if (existingIndex !== -1) {
          // Backtracking: remove everything after this point
          const newPath = state.path.slice(0, existingIndex + 1)
          const newGrid = [...state.grid.map(row => [...row])]
          
          // Clear path indices
          for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[i].length; j++) {
              newGrid[i][j].isInPath = false
              newGrid[i][j].pathIndex = null
            }
          }
          
          // Rebuild path
          newPath.forEach((pos, idx) => {
            newGrid[pos.y][pos.x].isInPath = true
            newGrid[pos.y][pos.x].pathIndex = idx
          })
          
          set({ path: newPath, grid: newGrid })
          return
        }
        
        // Check number sequence
        const numbersInPath = state.path
          .map(p => state.grid[p.y][p.x].value)
          .filter(v => v !== null)
        
        const lastNumber = numbersInPath[numbersInPath.length - 1] || 0
        
        if (cell.value !== null) {
          // Must be the next number in sequence
          if (cell.value !== lastNumber + 1) return
        }
        
        // Add to path
        const newPath = [...state.path, { x, y }]
        const newGrid = [...state.grid.map(row => [...row])]
        newGrid[y][x].isInPath = true
        newGrid[y][x].pathIndex = newPath.length - 1
        
        set({
          path: newPath,
          grid: newGrid,
        })
        
        // Auto-check win
        if (state.checkWin()) {
          state.endDrawing()
        }
      },
      
      endDrawing: () => {
        const state = get()
        set({ isDrawing: false })
        
        if (state.checkWin()) {
          const time = Math.floor((Date.now() - (state.startTime || 0)) / 1000)
          
          set({
            totalCompleted: state.totalCompleted + 1,
            totalTime: state.totalTime + time,
            currentTime: time,
            playerLevel: Math.floor(state.totalCompleted / 5) + 1,
            streak: state.streak + 1,
          })
        }
      },
      
      resetPuzzle: () => {
        const state = get()
        const newGrid = state.grid.map(row => 
          row.map(cell => ({
            ...cell,
            isInPath: false,
            pathIndex: null,
          }))
        )
        
        set({
          grid: newGrid,
          path: [],
          startTime: null,
          currentTime: 0,
        })
      },
      
      checkWin: () => {
        const state = get()
        const totalCells = state.gridSize * state.gridSize
        
        // Check if all cells are covered
        if (state.path.length !== totalCells) return false
        
        // Get all numbers in the grid
        const numbers = []
        for (let y = 0; y < state.gridSize; y++) {
          for (let x = 0; x < state.gridSize; x++) {
            if (state.grid[y][x].value !== null) {
              numbers.push({
                value: state.grid[y][x].value,
                x,
                y
              })
            }
          }
        }
        
        // Sort numbers by value
        numbers.sort((a, b) => a.value - b.value)
        
        // Check if numbers appear in correct order in the path
        let lastIndex = -1
        for (const num of numbers) {
          const pathIndex = state.path.findIndex(p => p.x === num.x && p.y === num.y)
          if (pathIndex === -1 || pathIndex <= lastIndex) return false
          lastIndex = pathIndex
        }
        
        return true
      },
      
      clearPath: () => {
        const state = get()
        const newGrid = state.grid.map(row => 
          row.map(cell => ({
            ...cell,
            isInPath: false,
            pathIndex: null,
          }))
        )
        
        set({
          grid: newGrid,
          path: [],
        })
      },
      
      undoLastMove: () => {
        const state = get()
        if (state.path.length <= 1) return
        
        const newPath = state.path.slice(0, -1)
        const newGrid = [...state.grid.map(row => [...row])]
        
        // Clear all path indices
        for (let i = 0; i < newGrid.length; i++) {
          for (let j = 0; j < newGrid[i].length; j++) {
            newGrid[i][j].isInPath = false
            newGrid[i][j].pathIndex = null
          }
        }
        
        // Rebuild path
        newPath.forEach((pos, idx) => {
          newGrid[pos.y][pos.x].isInPath = true
          newGrid[pos.y][pos.x].pathIndex = idx
        })
        
        set({ path: newPath, grid: newGrid })
      },
    }),
    {
      name: 'line-puzzle-storage',
    }
  )
)