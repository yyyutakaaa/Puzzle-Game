'use client'

import { useGameStore } from '@/store/gameStore'
import { Play, BarChart3, Calendar, Trophy, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function GameMenu() {
  const { 
    setCurrentView, 
    playerLevel, 
    totalCompleted, 
    streak,
    dailyChallenge,
    generatePuzzle,
    generateDailyChallenge 
  } = useGameStore()

  const handleDailyChallenge = () => {
    if (dailyChallenge) {
      generatePuzzle(1) // Use level 1 settings for daily
      setCurrentView('game')
    } else {
      generateDailyChallenge()
      generatePuzzle(1)
      setCurrentView('game')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
          Number Path
        </h1>
        <p className="text-gray-400">Connect Numbers • Fill Every Cell</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 mb-6 w-full max-w-md"
      >
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{playerLevel}</p>
            <p className="text-xs text-gray-400">Level</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">{totalCompleted}</p>
            <p className="text-xs text-gray-400">Solved</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">{streak}</p>
            <p className="text-xs text-gray-400">Streak</p>
          </div>
        </div>

        {/* Daily Challenge */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDailyChallenge}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-semibold mb-4 flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Daily Challenge
          {dailyChallenge?.completed && <span className="text-xs">✓</span>}
        </motion.button>

        {/* Main Menu Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('levels')}
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold flex flex-col items-center gap-2"
          >
            <Play className="w-6 h-6" />
            Play
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('levels')}
            className="bg-gradient-to-br from-purple-500 to-purple-700 text-white py-4 rounded-xl font-semibold flex flex-col items-center gap-2"
          >
            <Trophy className="w-6 h-6" />
            Levels
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('stats')}
            className="bg-gradient-to-br from-green-500 to-green-700 text-white py-4 rounded-xl font-semibold flex flex-col items-center gap-2"
          >
            <BarChart3 className="w-6 h-6" />
            Stats
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              generatePuzzle(Math.floor(Math.random() * 12) + 1)
              setCurrentView('game')
            }}
            className="bg-gradient-to-br from-pink-500 to-red-600 text-white py-4 rounded-xl font-semibold flex flex-col items-center gap-2"
          >
            <Zap className="w-6 h-6" />
            Random
          </motion.button>
        </div>
      </motion.div>

      {/* How to Play */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-gray-400 max-w-md"
      >
        <p className="text-sm mb-2">How to play:</p>
        <p className="text-xs">
          Start at 1 and draw a continuous path through every cell to reach the highest number. 
          Pass through numbers in order!
        </p>
      </motion.div>
    </div>
  )
}