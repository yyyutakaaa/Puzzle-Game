'use client'

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Home, Clock, Grid3x3, Undo2 } from 'lucide-react'

export default function GameBoard() {
  const {
    grid,
    gridSize,
    path,
    isDrawing,
    currentLevel,
    currentTime,
    setCurrentView,
    generatePuzzle,
    startDrawing,
    continueDrawing,
    endDrawing,
    resetPuzzle,
    checkWin,
    clearPath,
    undoLastMove,
  } = useGameStore()

  const boardRef = useRef<HTMLDivElement>(null)
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    generatePuzzle(currentLevel)
  }, [currentLevel, generatePuzzle])

  useEffect(() => {
    if (isDrawing && !intervalRef.current) {
      const startTime = Date.now()
      intervalRef.current = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else if (!isDrawing && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isDrawing])

  const handleCellInteraction = (x: number, y: number) => {
    const cell = grid[y]?.[x]
    if (!cell) return

    if (!isDrawing && cell.value === 1) {
      startDrawing(x, y)
    } else if (isDrawing) {
      continueDrawing(x, y)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (element?.dataset.cell) {
      const [x, y] = element.dataset.cell.split(',').map(Number)
      handleCellInteraction(x, y)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isWon = checkWin()
  const progress = (path.length / (gridSize * gridSize)) * 100

  // Get connected numbers for visual feedback
  const connectedNumbers = new Set(
    path.map(p => grid[p.y][p.x].value).filter(v => v !== null)
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentView('levels')}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
            <p className="text-sm text-gray-400">{gridSize}x{gridSize} Grid</p>
          </div>

          <button
            onClick={() => setCurrentView('menu')}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-4 justify-center mb-4">
          <div className="bg-gray-800/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-xl">{formatTime(timer)}</span>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <Grid3x3 className="w-4 h-4 text-green-400" />
            <span className="text-xl">{path.length}/{gridSize * gridSize}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </motion.div>

      {/* Game Board */}
      <motion.div
        ref={boardRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4"
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchEnd={endDrawing}
        onTouchMove={handleTouchMove}
      >
        <div 
          className="grid gap-[2px] bg-gray-700 p-[2px] rounded-xl"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isNumberCell = cell.value !== null
              const isConnected = connectedNumbers.has(cell.value)
              const cellSize = Math.min(50, 400 / gridSize)
              
              return (
                <motion.div
                  key={`${x}-${y}`}
                  data-cell={`${x},${y}`}
                  whileHover={{ scale: isDrawing ? 1.02 : 1 }}
                  className={`
                    relative flex items-center justify-center cursor-pointer
                    transition-all duration-150
                    ${cell.isInPath 
                      ? 'bg-green-500' 
                      : 'bg-gray-900'
                    }
                  `}
                  style={{ 
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                  }}
                  onMouseDown={() => handleCellInteraction(x, y)}
                  onMouseEnter={() => isDrawing && handleCellInteraction(x, y)}
                  onTouchStart={() => handleCellInteraction(x, y)}
                >
                  {/* Number circle */}
                  {cell.value && (
                    <div className={`
                      absolute z-20 flex items-center justify-center
                      rounded-full font-bold
                      transition-all duration-200
                      ${isConnected 
                        ? 'bg-white text-green-600 w-7 h-7 text-sm' 
                        : 'bg-gray-800 text-white border-2 border-gray-600 w-8 h-8 text-base'
                      }
                    `}>
                      {cell.value}
                    </div>
                  )}
                  
                  {/* Path fill effect */}
                  {cell.isInPath && !cell.value && (
                    <div className="absolute inset-1 bg-green-400 rounded-sm" />
                  )}
                </motion.div>
              )
            })
          )}
        </div>

        {/* Smoother path line visualization */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {path.length > 1 && (
            <g>
              {path.map((pos, index) => {
                if (index === 0) return null
                const prevPos = path[index - 1]
                const cellSize = Math.min(50, 400 / gridSize) + 2
                const offset = 16
                
                const x1 = offset + prevPos.x * cellSize + cellSize / 2
                const y1 = offset + prevPos.y * cellSize + cellSize / 2
                const x2 = offset + pos.x * cellSize + cellSize / 2
                const y2 = offset + pos.y * cellSize + cellSize / 2
                
                return (
                  <line
                    key={`line-${index}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(34, 197, 94, 0.3)"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                )
              })}
            </g>
          )}
        </svg>
      </motion.div>

      {/* Win Message */}
      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 rounded-3xl p-8 text-center">
            <h2 className="text-4xl font-bold mb-4 text-green-400">
              Completed!
            </h2>
            <p className="text-xl mb-2">Time: {formatTime(currentTime || timer)}</p>
            <p className="text-gray-400 mb-6">Perfect! All cells connected!</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  generatePuzzle(currentLevel + 1)
                  setTimer(0)
                }}
                className="px-6 py-3 bg-green-600 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Next Level
              </button>
              <button
                onClick={() => setCurrentView('levels')}
                className="px-6 py-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Level Select
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 mt-6"
      >
        <button
          onClick={undoLastMove}
          disabled={path.length <= 1}
          className="px-5 py-3 bg-gray-800 rounded-xl font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Undo2 className="w-5 h-5" />
          Undo
        </button>
        
        <button
          onClick={clearPath}
          disabled={path.length === 0}
          className="px-5 py-3 bg-gray-800 rounded-xl font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
        
        <button
          onClick={resetPuzzle}
          className="px-5 py-3 bg-gray-800 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </motion.div>

      {/* Instructions */}
      <div className="mt-6 text-center text-gray-400 max-w-md">
        <p className="text-sm">
          Connect the dots in order • Fill every cell
        </p>
      </div>
    </div>
  )
}