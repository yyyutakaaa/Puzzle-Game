'use client'

import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, Clock, Grid } from 'lucide-react'

export default function LevelSelector() {
  const { setCurrentView, generatePuzzle } = useGameStore()
  
  const levels = [
    { id: 1, size: 5, numbers: 4, difficulty: 'Easy', color: 'from-green-500 to-green-600' },
    { id: 2, size: 5, numbers: 5, difficulty: 'Easy', color: 'from-green-500 to-green-600' },
    { id: 3, size: 6, numbers: 5, difficulty: 'Medium', color: 'from-yellow-500 to-yellow-600' },
    { id: 4, size: 6, numbers: 6, difficulty: 'Medium', color: 'from-yellow-500 to-yellow-600' },
    { id: 5, size: 7, numbers: 6, difficulty: 'Medium', color: 'from-yellow-500 to-yellow-600' },
    { id: 6, size: 7, numbers: 7, difficulty: 'Hard', color: 'from-orange-500 to-red-500' },
    { id: 7, size: 8, numbers: 7, difficulty: 'Hard', color: 'from-orange-500 to-red-500' },
    { id: 8, size: 8, numbers: 8, difficulty: 'Hard', color: 'from-orange-500 to-red-500' },
    { id: 9, size: 9, numbers: 8, difficulty: 'Expert', color: 'from-purple-500 to-pink-500' },
    { id: 10, size: 9, numbers: 9, difficulty: 'Expert', color: 'from-purple-500 to-pink-500' },
    { id: 11, size: 10, numbers: 9, difficulty: 'Expert', color: 'from-purple-500 to-pink-500' },
    { id: 12, size: 10, numbers: 10, difficulty: 'Expert', color: 'from-purple-500 to-pink-500' },
  ]

  const handleLevelSelect = (levelId: number) => {
    generatePuzzle(levelId)
    setCurrentView('game')
  }

  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <button
          onClick={() => setCurrentView('menu')}
          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <h1 className="text-3xl font-bold">Select Level</h1>
        
        <div className="w-10" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {levels.map((level) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: level.id * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLevelSelect(level.id)}
            className={`
              relative p-6 rounded-2xl
              bg-gradient-to-br ${level.color}
              transition-all duration-200
            `}
          >
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">Level {level.id}</h3>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <Grid className="w-4 h-4" />
                  <span>{level.size}×{level.size}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg">#{level.numbers}</span>
                </div>
              </div>
              <p className="text-sm opacity-90">{level.difficulty}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}