'use client'

import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Clock, TrendingUp, Calendar, Target } from 'lucide-react'

export default function Statistics() {
  const { 
    setCurrentView,
    playerLevel,
    totalCompleted,
    totalTime,
    streak,
    lastPlayDate,
  } = useGameStore()

  const avgTime = totalCompleted > 0 ? Math.floor(totalTime / totalCompleted) : 0
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
        
        <h1 className="text-3xl font-bold">Statistics</h1>
        
        <div className="w-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-3xl p-6 mb-6 max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {playerLevel}</h2>
            <p className="text-gray-400">Keep solving to level up!</p>
          </div>
          <Trophy className="w-12 h-12 text-yellow-400" />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400">Puzzles Solved</span>
          </div>
          <p className="text-3xl font-bold">{totalCompleted}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gray-800/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-400" />
            <span className="text-gray-400">Avg Time</span>
          </div>
          <p className="text-3xl font-bold">{formatTime(avgTime)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400">Day Streak</span>
          </div>
          <p className="text-3xl font-bold">{streak}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gray-800/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400">Total Time</span>
          </div>
          <p className="text-3xl font-bold">{formatTime(totalTime)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-orange-400" />
            <span className="text-gray-400">Best Time</span>
          </div>
          <p className="text-3xl font-bold">-</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gray-800/50 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-pink-400" />
            <span className="text-gray-400">Last Played</span>
          </div>
          <p className="text-lg font-bold">
            {lastPlayDate ? new Date(lastPlayDate).toLocaleDateString() : 'Today'}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 rounded-2xl p-6 max-w-2xl mx-auto"
      >
        <h3 className="text-xl font-bold mb-4">Tips</h3>
        <ul className="space-y-2 text-gray-400">
          <li>• Start from 1 and plan your route to reach all numbers in order</li>
          <li>• Every cell must be filled exactly once</li>
          <li>• You can backtrack by moving to a cell already in your path</li>
          <li>• Complete daily challenges to maintain your streak</li>
          <li>• Larger grids require more strategic planning</li>
        </ul>
      </motion.div>
    </div>
  )
}